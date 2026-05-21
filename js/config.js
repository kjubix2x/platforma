// Crystal Ballers — Supabase config
'use strict';

const SUPABASE_URL = 'https://ovrelfonskjsdavgseut.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92cmVsZm9uc2tqc2RhdmdzZXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNzkyMjAsImV4cCI6MjA5NDk1NTIyMH0.6c3701ae-aNlC7pDuAXADquPtQMTmxHZEkdcBMSlncA';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, storage: window.localStorage }
});
