// Crystal Ballers — Edge Function: create-subscription
// Wywoływana z pricing.html gdy user klika "Aktywuj subskrypcję"
// Tworzy Stripe Customer + Subscription (z payment_behavior='default_incomplete')
// Zwraca clientSecret do Stripe Elements

import Stripe from 'npm:stripe@14.21.0'
import { createClient } from 'npm:@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Brak autoryzacji')

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Weryfikacja użytkownika
    const supabaseAuth = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } }
    })
    const { data: { user }, error: userErr } = await supabaseAuth.auth.getUser()
    if (userErr || !user) throw new Error('Nieprawidłowa sesja')

    // Admin client do zapisu
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    const { data: profile, error: profErr } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profErr || !profile) throw new Error('Profil nie istnieje')
    if (profile.subscription_status === 'active') {
      throw new Error('Masz już aktywną subskrypcję')
    }

    const { billing } = await req.json()
    if (!['monthly','yearly'].includes(billing)) throw new Error('Nieprawidłowy plan')

    const priceId = billing === 'yearly'
      ? Deno.env.get('STRIPE_PRICE_YEARLY')!
      : Deno.env.get('STRIPE_PRICE_MONTHLY')!

    // Stwórz lub odzyskaj Stripe Customer
    let stripeCustomerId = profile.stripe_customer_id
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: profile.email,
        name: profile.name || profile.email,
        metadata: { user_id: user.id }
      })
      stripeCustomerId = customer.id
      await supabaseAdmin
        .from('profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', user.id)
    }

    // Stwórz Subscription (incomplete dopóki nie potwierdzimy płatności)
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
        // Bez BLIK (nie obsługuje subskrypcji w PL) — karta, Apple Pay, Google Pay, Klarna, Link
        payment_method_types: ['card', 'link', 'klarna'],
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: { user_id: user.id, billing }
    })

    const invoice = subscription.latest_invoice as Stripe.Invoice
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent

    return new Response(
      JSON.stringify({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
        customerId: stripeCustomerId,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('create-subscription error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Nieznany błąd' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
