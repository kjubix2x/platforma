// Crystal Ballers — Data Layer (Supabase-backed, cached for sync access)
'use strict';

const CB = (() => {
  let _cache = {
    currentUser: null, profiles: [], plans: [], journal: [],
    performances: [], completedSessions: [], messages: [], payments: []
  };
  let _bootstrapped = false;
  let _msgChannel = null;

  // ── Mappers (snake_case DB ⇄ camelCase frontend) ─────
  function profileToUser(p) {
    if (!p) return null;
    return {
      id: p.id, email: p.email, role: p.role,
      firstName: p.first_name || '', lastName: p.last_name || '',
      name: p.name || p.email,
      avatarInitials: p.avatar_initials || (p.email[0]||'X').toUpperCase(),
      planId: p.plan_id,
      subscriptionStatus: p.subscription_status || 'none',
      subscriptionPlan: p.subscription_plan,
      stripeCustomerId: p.stripe_customer_id,
      stripeSubscriptionId: p.stripe_subscription_id,
      subscriptionStartDate: p.subscription_started_at,
      subscriptionEndDate: p.subscription_end_date,
      subscriptionCancelAt: p.subscription_cancel_at,
      streak: p.streak || 0,
      weekProgress: p.week_progress || 0,
      lastLogin: p.last_login,
      createdAt: p.created_at,
      active: true
    };
  }
  function planFromDb(p) {
    return {
      id: p.id, name: p.name, slug: p.slug, description: p.description,
      iconKey: p.icon_key, color: p.color, version: p.version,
      builtIn: p.built_in,
      benefitsTitle: p.benefits_title,
      benefits: Array.isArray(p.benefits) ? p.benefits : [],
      totalWeeks: p.total_weeks || 12,
      updatedAt: p.updated_at
    };
  }
  function journalFromDb(j) {
    return { id: j.id, userId: j.user_id, date: j.date, exercises: j.exercises || [],
      sprint5m: j.sprint_5m, sprint10m: j.sprint_10m, sprint30m: j.sprint_30m,
      jump: j.jump, bodyweight: j.bodyweight, rpe: j.rpe, feeling: j.feeling, notes: j.notes };
  }
  function journalToDb(j) {
    return { user_id: j.userId, date: j.date, exercises: j.exercises || [],
      sprint_5m: j.sprint5m||null, sprint_10m: j.sprint10m||null, sprint_30m: j.sprint30m||null,
      jump: j.jump||null, bodyweight: j.bodyweight||null,
      rpe: j.rpe||null, feeling: j.feeling||null, notes: j.notes||null };
  }
  function perfFromDb(p) {
    return { id: p.id, userId: p.user_id, date: p.date,
      sprint5m: p.sprint_5m!=null?+p.sprint_5m:null,
      sprint10m: p.sprint_10m!=null?+p.sprint_10m:null,
      sprint30m: p.sprint_30m!=null?+p.sprint_30m:null,
      cod: p.cod!=null?+p.cod:null,
      jump: p.jump!=null?+p.jump:null,
      bodyweight: p.bodyweight!=null?+p.bodyweight:null };
  }
  function perfToDb(p) {
    return { user_id: p.userId, date: p.date,
      sprint_5m: p.sprint5m, sprint_10m: p.sprint10m, sprint_30m: p.sprint30m,
      cod: p.cod, jump: p.jump, bodyweight: p.bodyweight };
  }
  function sessionFromDb(s) {
    return { id: s.id, userId: s.user_id, planId: s.plan_id,
      phaseNum: s.phase_num, workoutLetter: s.workout_letter, weekNum: s.week_num,
      date: s.date, durationMin: s.duration_min, rpe: s.rpe,
      exercisesDone: s.exercises_done, exercisesTotal: s.exercises_total, notes: s.notes };
  }
  function sessionToDb(s) {
    return { user_id: s.userId, plan_id: s.planId,
      phase_num: s.phaseNum, workout_letter: s.workoutLetter, week_num: s.weekNum,
      date: s.date, duration_min: s.durationMin, rpe: s.rpe,
      exercises_done: s.exercisesDone, exercises_total: s.exercisesTotal, notes: s.notes };
  }
  function msgFromDb(m) {
    return { id: m.id, fromId: m.from_id, toId: m.to_id,
      text: m.text, read: m.read, timestamp: m.created_at };
  }
  function paymentFromDb(p) {
    return { id: p.id, userId: p.user_id, amountPln: +p.amount_pln,
      status: p.status, description: p.description, paidAt: p.paid_at };
  }

  // ── Bootstrap (loads cache on page entry) ────────────
  async function bootstrap() {
    if (_bootstrapped) return;
    if (!sb) { console.error('Supabase client not initialized'); return; }

    const { data: { session } } = await sb.auth.getSession();
    if (!session) { _bootstrapped = true; return; }

    const uid = session.user.id;

    const [{ data: profile }, { data: plans }] = await Promise.all([
      sb.from('profiles').select('*').eq('id', uid).maybeSingle(),
      sb.from('plans').select('*').order('id')
    ]);

    if (profile) _cache.currentUser = profileToUser(profile);
    _cache.plans = (plans || []).map(planFromDb);

    if (!profile) { _bootstrapped = true; return; }

    if (profile.role === 'admin') {
      const [all, j, p, s, m, pay] = await Promise.all([
        sb.from('profiles').select('*').order('created_at'),
        sb.from('journal').select('*').order('date',{ascending:false}),
        sb.from('performances').select('*').order('date'),
        sb.from('completed_sessions').select('*').order('date',{ascending:false}),
        sb.from('messages').select('*').order('created_at'),
        sb.from('payments').select('*').order('paid_at',{ascending:false})
      ]);
      _cache.profiles = (all.data||[]).map(profileToUser);
      _cache.journal = (j.data||[]).map(journalFromDb);
      _cache.performances = (p.data||[]).map(perfFromDb);
      _cache.completedSessions = (s.data||[]).map(sessionFromDb);
      _cache.messages = (m.data||[]).map(msgFromDb);
      _cache.payments = (pay.data||[]).map(paymentFromDb);
    } else {
      _cache.profiles = [profileToUser(profile)];
      const { data: adminP } = await sb.from('profiles').select('*').eq('role','admin').limit(1).maybeSingle();
      if (adminP) _cache.profiles.push(profileToUser(adminP));

      const [j, p, s, m, pay] = await Promise.all([
        sb.from('journal').select('*').eq('user_id',uid).order('date',{ascending:false}),
        sb.from('performances').select('*').eq('user_id',uid).order('date'),
        sb.from('completed_sessions').select('*').eq('user_id',uid).order('date',{ascending:false}),
        sb.from('messages').select('*').or(`from_id.eq.${uid},to_id.eq.${uid}`).order('created_at'),
        sb.from('payments').select('*').eq('user_id',uid).order('paid_at',{ascending:false})
      ]);
      _cache.journal = (j.data||[]).map(journalFromDb);
      _cache.performances = (p.data||[]).map(perfFromDb);
      _cache.completedSessions = (s.data||[]).map(sessionFromDb);
      _cache.messages = (m.data||[]).map(msgFromDb);
      _cache.payments = (pay.data||[]).map(paymentFromDb);
    }

    _bootstrapped = true;
  }

  function reset() {
    _bootstrapped = false;
    _cache = { currentUser:null, profiles:[], plans:[], journal:[],
      performances:[], completedSessions:[], messages:[], payments:[] };
    if (_msgChannel) { try { sb.removeChannel(_msgChannel); } catch(e){} _msgChannel = null; }
  }

  // Load only plans (used on public pages without auth)
  async function bootstrapPublic() {
    if (_cache.plans.length) return;
    if (!sb) return;
    const { data } = await sb.from('plans').select('*').order('id');
    _cache.plans = (data || []).map(planFromDb);
  }

  // ── Realtime subscribe ───────────────────────────────
  function subscribeMessages(onChange) {
    if (_msgChannel || !sb) return;
    _msgChannel = sb.channel('cb-msg-rt')
      .on('postgres_changes', { event:'*', schema:'public', table:'messages' }, payload => {
        if (payload.eventType === 'INSERT') {
          const m = msgFromDb(payload.new);
          if (!_cache.messages.some(x=>x.id===m.id)) _cache.messages.push(m);
        } else if (payload.eventType === 'UPDATE') {
          const i = _cache.messages.findIndex(x=>x.id===payload.new.id);
          if (i!==-1) _cache.messages[i] = msgFromDb(payload.new);
        } else if (payload.eventType === 'DELETE') {
          _cache.messages = _cache.messages.filter(x=>x.id!==payload.old.id);
        }
        if (onChange) onChange();
      })
      .subscribe();
  }

  // ── Sync getters (from cache) ────────────────────────
  function getCurrentUser() { return _cache.currentUser; }
  function getUsers() { return _cache.profiles; }
  function getPlayers() { return _cache.profiles.filter(u=>u.role==='player'); }
  function getUserById(id) { return _cache.profiles.find(u=>u.id===id) || null; }
  function getUserByEmail(email) { return _cache.profiles.find(u=>u.email.toLowerCase()===email.toLowerCase()) || null; }
  function getPlans() { return _cache.plans; }
  function getPlanById(id) { return _cache.plans.find(p=>p.id===id) || null; }
  function getPlanPlayerCount(planId) { return _cache.profiles.filter(u=>u.role==='player' && u.planId===planId).length; }
  function getJournalByUser(uid) { return _cache.journal.filter(j=>j.userId===uid).sort((a,b)=>b.date.localeCompare(a.date)); }
  function getAllJournal() { return [..._cache.journal].sort((a,b)=>b.date.localeCompare(a.date)); }
  function getPerfByUser(uid) { return _cache.performances.filter(p=>p.userId===uid).sort((a,b)=>a.date.localeCompare(b.date)); }
  function getSessionsByUser(uid) { return _cache.completedSessions.filter(s=>s.userId===uid).sort((a,b)=>b.date.localeCompare(a.date)); }
  function hasCompletedSession(uid,pid,ph,letter,wk) {
    return _cache.completedSessions.some(s => s.userId===uid && s.planId===pid && s.phaseNum===ph && s.workoutLetter===letter && s.weekNum===wk);
  }
  function countSessionsInPhase(uid,pid,ph) {
    return _cache.completedSessions.filter(s => s.userId===uid && s.planId===pid && s.phaseNum===ph).length;
  }
  function getMessages(u1,u2) {
    return _cache.messages.filter(m => (m.fromId===u1&&m.toId===u2)||(m.fromId===u2&&m.toId===u1))
      .sort((a,b)=>a.timestamp.localeCompare(b.timestamp));
  }
  function getUnreadCount(toId) { return _cache.messages.filter(m=>m.toId===toId && !m.read).length; }
  function getAllMessagesForAdmin() {
    const admin = _cache.profiles.find(p=>p.role==='admin');
    if (!admin) return [];
    return _cache.profiles.filter(p=>p.role==='player').map(p => {
      const conv = _cache.messages.filter(m => (m.fromId===admin.id&&m.toId===p.id)||(m.fromId===p.id&&m.toId===admin.id))
        .sort((a,b)=>b.timestamp.localeCompare(a.timestamp));
      return { player: p, lastMessage: conv[0] || null, unread: conv.filter(m=>m.fromId===p.id && !m.read).length };
    });
  }
  function getPaymentsByUser(uid) { return _cache.payments.filter(p=>p.userId===uid).sort((a,b)=>b.paidAt.localeCompare(a.paidAt)); }

  function hasActiveSubscription(user) {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.subscriptionStatus !== 'active') return false;
    if (user.subscriptionEndDate && new Date(user.subscriptionEndDate) < new Date()) return false;
    return true;
  }

  // ── Async writes ──────────────────────────────────────
  async function updateUser(id, data) {
    const m = {};
    if (data.firstName!==undefined) m.first_name = data.firstName;
    if (data.lastName!==undefined)  m.last_name = data.lastName;
    if (data.name!==undefined)      m.name = data.name;
    if (data.avatarInitials!==undefined) m.avatar_initials = data.avatarInitials;
    if (data.planId!==undefined)    m.plan_id = data.planId;
    if (data.streak!==undefined)    m.streak = data.streak;
    if (data.weekProgress!==undefined) m.week_progress = data.weekProgress;
    if (data.lastLogin!==undefined) m.last_login = data.lastLogin;
    if (data.subscriptionStatus!==undefined) m.subscription_status = data.subscriptionStatus;
    if (data.subscriptionPlan!==undefined)   m.subscription_plan = data.subscriptionPlan;
    if (data.subscriptionStartDate!==undefined) m.subscription_started_at = data.subscriptionStartDate;
    if (data.subscriptionEndDate!==undefined)   m.subscription_end_date = data.subscriptionEndDate;
    if (data.subscriptionCancelAt!==undefined)  m.subscription_cancel_at = data.subscriptionCancelAt;
    if (!Object.keys(m).length) return null;

    const { data: row, error } = await sb.from('profiles').update(m).eq('id', id).select().maybeSingle();
    if (error) { console.error('updateUser', error); throw error; }
    if (!row) return null;
    const user = profileToUser(row);
    const idx = _cache.profiles.findIndex(u=>u.id===id);
    if (idx !== -1) _cache.profiles[idx] = user; else _cache.profiles.push(user);
    if (_cache.currentUser?.id === id) _cache.currentUser = user;
    return user;
  }

  // ── Subscription (MOCK — replace with Stripe later) ─
  async function activateSubscription(userId, plan /* 'monthly'|'yearly' */) {
    const now = new Date();
    const end = new Date(now);
    if (plan === 'yearly') end.setFullYear(end.getFullYear()+1);
    else end.setMonth(end.getMonth()+1);
    const amount = plan === 'yearly' ? 599.90 : 59.99;

    const updated = await updateUser(userId, {
      subscriptionStatus: 'active',
      subscriptionPlan: plan,
      subscriptionStartDate: now.toISOString(),
      subscriptionEndDate: end.toISOString(),
      subscriptionCancelAt: null
    });

    // Optional: record payment (mock)
    try {
      const { data: payRow } = await sb.from('payments').insert({
        user_id: userId, amount_pln: amount, currency: 'pln', status: 'succeeded',
        description: `Subskrypcja Crystal Ballers (${plan==='yearly'?'roczna':'miesięczna'})`
      }).select().maybeSingle();
      if (payRow) _cache.payments.unshift(paymentFromDb(payRow));
    } catch(e) { console.warn('payment record failed', e); }

    return updated;
  }

  async function cancelSubscription(userId) {
    return updateUser(userId, {
      subscriptionStatus: 'canceled',
      subscriptionCancelAt: new Date().toISOString()
    });
  }

  // ── Plans ─────────────────────────────────────────────
  async function updatePlan(id, data) {
    const m = {};
    if (data.name!==undefined) m.name = data.name;
    if (data.description!==undefined) m.description = data.description;
    if (data.iconKey!==undefined) m.icon_key = data.iconKey;
    if (data.color!==undefined) m.color = data.color;
    if (data.version!==undefined) m.version = data.version;
    if (data.updatedAt!==undefined) m.updated_at = data.updatedAt;
    if (!Object.keys(m).length) return null;
    const { data: row, error } = await sb.from('plans').update(m).eq('id', id).select().single();
    if (error) throw error;
    const p = planFromDb(row);
    const idx = _cache.plans.findIndex(x=>x.id===id);
    if (idx !== -1) _cache.plans[idx] = p;
    return p;
  }

  // ── Journal ───────────────────────────────────────────
  async function addJournalEntry(data) {
    const { data: row, error } = await sb.from('journal').insert(journalToDb(data)).select().single();
    if (error) throw error;
    const entry = journalFromDb(row);
    _cache.journal.unshift(entry);
    return entry;
  }
  async function updateJournalEntry(id, data) {
    const { data: row, error } = await sb.from('journal').update(journalToDb(data)).eq('id', id).select().single();
    if (error) throw error;
    const entry = journalFromDb(row);
    const i = _cache.journal.findIndex(j=>j.id===id);
    if (i!==-1) _cache.journal[i] = entry;
    return entry;
  }
  async function deleteJournalEntry(id) {
    const { error } = await sb.from('journal').delete().eq('id', id);
    if (error) throw error;
    _cache.journal = _cache.journal.filter(j=>j.id!==id);
  }

  // ── Performance ───────────────────────────────────────
  async function addPerf(data) {
    const { data: row, error } = await sb.from('performances').insert(perfToDb(data)).select().single();
    if (error) throw error;
    const p = perfFromDb(row);
    _cache.performances.push(p);
    return p;
  }

  // ── Completed sessions ────────────────────────────────
  async function addCompletedSession(data) {
    const { data: row, error } = await sb.from('completed_sessions').insert(sessionToDb(data)).select().single();
    if (error) throw error;
    const s = sessionFromDb(row);
    _cache.completedSessions.unshift(s);
    return s;
  }

  // ── Messages ──────────────────────────────────────────
  async function sendMessage(fromId, toId, text) {
    const { data: row, error } = await sb.from('messages').insert({
      from_id: fromId, to_id: toId, text, read: false
    }).select().single();
    if (error) throw error;
    const m = msgFromDb(row);
    if (!_cache.messages.some(x=>x.id===m.id)) _cache.messages.push(m);
    return m;
  }
  async function markRead(fromId, toId) {
    const { error } = await sb.from('messages').update({ read: true })
      .eq('from_id', fromId).eq('to_id', toId).eq('read', false);
    if (error) console.warn('markRead', error);
    _cache.messages.forEach(m => { if (m.fromId===fromId && m.toId===toId) m.read = true; });
  }

  // ── Password reset ────────────────────────────────────
  async function sendPasswordResetEmail(email) {
    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/index.html'
    });
    return { ok: !error, error: error?.message };
  }

  // ── Helpers ───────────────────────────────────────────
  function formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('pl-PL', {day:'2-digit', month:'2-digit', year:'numeric'});
  }
  function formatDateTime(d) {
    if (!d) return '—';
    return new Date(d).toLocaleString('pl-PL', {day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'});
  }
  function timeAgo(iso) {
    if (!iso) return '';
    const diff = (Date.now() - new Date(iso)) / 1000;
    if (diff < 60) return 'przed chwilą';
    if (diff < 3600) return Math.floor(diff/60) + ' min temu';
    if (diff < 86400) return Math.floor(diff/3600) + ' godz. temu';
    return Math.floor(diff/86400) + ' dni temu';
  }
  function generatePassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let p = '';
    for (let i = 0; i < 10; i++) p += chars[Math.floor(Math.random()*chars.length)];
    return p;
  }

  return {
    bootstrap, bootstrapPublic, reset, subscribeMessages,
    getCurrentUser, getUsers, getPlayers, getUserById, getUserByEmail,
    updateUser,
    hasActiveSubscription, activateSubscription, cancelSubscription, getPaymentsByUser,
    getPlans, getPlanById, updatePlan, getPlanPlayerCount,
    getJournalByUser, getAllJournal, addJournalEntry, updateJournalEntry, deleteJournalEntry,
    getPerfByUser, addPerf,
    getSessionsByUser, addCompletedSession, hasCompletedSession, countSessionsInPhase,
    getMessages, getAllMessagesForAdmin, sendMessage, markRead, getUnreadCount,
    sendPasswordResetEmail,
    formatDate, formatDateTime, timeAgo, generatePassword
  };
})();

// Brak CB.init() — bootstrap wywoływany przez Auth.requirePlayer/Admin albo ręcznie
