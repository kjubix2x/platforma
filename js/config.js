// Crystal Ballers — Supabase config + brand constants
'use strict';

const APP_VERSION = '0.3.0-prod';

const SUBSCRIPTION_PRICES = {
  monthly: { amount: 59.99,  currency: 'zł', label: '59,99 zł / mies' },
  yearly:  { amount: 599.90, currency: 'zł', label: '599,90 zł / rok', monthlyEquivalent: 49.99, savings: '2 miesiące gratis' }
};

const SUPABASE_URL = 'https://ovrelfonskjsdavgseut.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92cmVsZm9uc2tqc2RhdmdzZXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNzkyMjAsImV4cCI6MjA5NDk1NTIyMH0.6c3701ae-aNlC7pDuAXADquPtQMTmxHZEkdcBMSlncA';

// Stripe — publishable key (safe to be in frontend) — LIVE MODE
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51TUOzuQNQTYiLAMjL4wF8fHnRaKTt0yhXXw4q6NJSpOraXygDaU82vvYQhS2T4fYhgQ5GHK3h17h4sBrtL8fOpNz00MRUvrWeL';

// Supabase JS klient — wymaga załadowanego skryptu @supabase/supabase-js@2 wcześniej
const sb = (typeof window !== 'undefined' && window.supabase)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, storage: window.localStorage }
    })
  : null;
