// Crystal Ballers — Edge Function: stripe-webhook
// Odbiera eventy ze Stripe i aktualizuje subscription_status w bazie
// URL endpointu: https://ovrelfonskjsdavgseut.supabase.co/functions/v1/stripe-webhook

import Stripe from 'npm:stripe@14.21.0'
import { createClient } from 'npm:@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

// Helper: zmapuj Stripe subscription status na nasz enum
function mapStatus(stripeStatus: string): string {
  const map: Record<string, string> = {
    active: 'active',
    past_due: 'past_due',
    canceled: 'canceled',
    incomplete: 'incomplete',
    incomplete_expired: 'canceled',
    trialing: 'trialing',
    unpaid: 'past_due',
    paused: 'canceled',
  }
  return map[stripeStatus] || 'none'
}

Deno.serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')
  if (!signature) return new Response('Brak Stripe-Signature', { status: 400 })

  const body = await req.text()

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
  } catch (err) {
    console.error('Signature verify failed:', err)
    return new Response(`Webhook signature error: ${err instanceof Error ? err.message : 'unknown'}`, { status: 400 })
  }

  console.log(`Webhook event: ${event.type}`)

  try {
    switch (event.type) {
      // ───────────────────────────────────────────────
      // Subskrypcja: utworzenie / aktualizacja / kasowanie
      // ───────────────────────────────────────────────
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.user_id
        if (!userId) {
          console.warn('Brak user_id w metadata subscription', sub.id)
          break
        }

        const status = event.type === 'customer.subscription.deleted'
          ? 'canceled'
          : mapStatus(sub.status)

        const billing = sub.items.data[0]?.plan?.interval === 'year' ? 'yearly' : 'monthly'

        const updates: Record<string, unknown> = {
          subscription_status: status,
          stripe_subscription_id: sub.id,
          subscription_plan: billing,
          subscription_end_date: sub.current_period_end
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null,
        }
        if (sub.start_date) {
          updates.subscription_started_at = new Date(sub.start_date * 1000).toISOString()
        }
        if (sub.canceled_at) {
          updates.subscription_cancel_at = new Date(sub.canceled_at * 1000).toISOString()
        }
        // Anulowanie NATYCHMIASTOWE (zgodnie z preferencją trenera) — gdy delete:
        if (event.type === 'customer.subscription.deleted') {
          updates.subscription_end_date = new Date().toISOString()
        }

        const { error } = await supabase.from('profiles').update(updates).eq('id', userId)
        if (error) console.error('Update profiles failed:', error)
        break
      }

      // ───────────────────────────────────────────────
      // Płatność udana (pierwsza lub odnowienie)
      // ───────────────────────────────────────────────
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        let userId = invoice.subscription_details?.metadata?.user_id || invoice.metadata?.user_id

        // Jeśli brak — pobierz z subscription
        if (!userId && invoice.subscription) {
          const sub = await stripe.subscriptions.retrieve(invoice.subscription as string)
          userId = sub.metadata?.user_id
        }
        if (!userId) {
          console.warn('Brak user_id w invoice', invoice.id)
          break
        }

        // Zapisz w historii płatności
        await supabase.from('payments').insert({
          user_id: userId,
          stripe_invoice_id: invoice.id,
          stripe_payment_intent_id: invoice.payment_intent as string,
          amount_pln: (invoice.amount_paid || 0) / 100,
          currency: invoice.currency || 'pln',
          status: 'succeeded',
          description: invoice.lines.data[0]?.description || 'Subskrypcja Crystal Ballers',
        })

        // Upewnij się że profile ma status active (gdyby webhook subscription.created jeszcze nie doszedł)
        if (invoice.subscription) {
          const sub = await stripe.subscriptions.retrieve(invoice.subscription as string)
          const billing = sub.items.data[0]?.plan?.interval === 'year' ? 'yearly' : 'monthly'
          await supabase.from('profiles').update({
            subscription_status: 'active',
            subscription_plan: billing,
            subscription_end_date: new Date(sub.current_period_end * 1000).toISOString(),
            subscription_started_at: sub.start_date
              ? new Date(sub.start_date * 1000).toISOString()
              : new Date().toISOString(),
            stripe_subscription_id: sub.id,
          }).eq('id', userId)
        }
        break
      }

      // ───────────────────────────────────────────────
      // Płatność nieudana (np. brak środków, expired card)
      // ───────────────────────────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        let userId = invoice.subscription_details?.metadata?.user_id || invoice.metadata?.user_id

        if (!userId && invoice.subscription) {
          const sub = await stripe.subscriptions.retrieve(invoice.subscription as string)
          userId = sub.metadata?.user_id
        }
        if (!userId) break

        await supabase.from('profiles').update({
          subscription_status: 'past_due',
        }).eq('id', userId)

        await supabase.from('payments').insert({
          user_id: userId,
          stripe_invoice_id: invoice.id,
          amount_pln: (invoice.amount_due || 0) / 100,
          currency: invoice.currency || 'pln',
          status: 'failed',
          description: 'Płatność nieudana — Crystal Ballers',
        })
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Webhook handler error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'unknown' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
