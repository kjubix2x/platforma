// Crystal Ballers — Data Layer (Supabase-backed)
// Strategy: bootstrap loads everything to cache, sync getters read cache, writes hit Supabase + update cache.
'use strict';

const CB = (() => {
  let _cache = {
    currentUser: null,
    profiles: [],
    plans: [],
    journal: [],
    performances: [],
    completedSessions: [],
    messages: []
  };
  let _bootstrapped = false;
  let _msgChannel = null;

  // ── Mappers (DB snake_case ⇄ frontend camelCase) ──────
  function profileToUser(p) {
    if (!p) return null;
    return {
      id: p.id,
      email: p.email,
      role: p.role,
      firstName: p.first_name || '',
      lastName: p.last_name || '',
      name: p.name || p.email,
      avatarInitials: p.avatar_initials || 'XX',
      planId: p.plan_id,
      planStartDate: p.plan_start_date,
      planEndDate: p.plan_end_date,
      individualPdfPath: p.individual_pdf_path,
      individualPdfName: p.individual_pdf_name,
      individualPdfData: null,
      status: p.status || 'active',
      streak: p.streak || 0,
      weekProgress: p.week_progress || 0,
      lastLogin: p.last_login,
      createdAt: p.created_at,
      active: p.status !== 'inactive'
    };
  }
  function planFromDb(p) {
    return {
      id: p.id, name: p.name, slug: p.slug, description: p.description,
      emoji: p.emoji, color: p.color, version: p.version,
      isIndividual: p.is_individual, builtIn: p.built_in,
      updatedAt: p.updated_at
    };
  }
  function journalFromDb(j) {
    return {
      id: j.id, userId: j.user_id, date: j.date,
      exercises: j.exercises || [],
      sprint5m: j.sprint_5m, sprint10m: j.sprint_10m, sprint30m: j.sprint_30m,
      jump: j.jump, bodyweight: j.bodyweight,
      rpe: j.rpe, feeling: j.feeling, notes: j.notes
    };
  }
  function journalToDb(j) {
    return {
      user_id: j.userId, date: j.date,
      exercises: j.exercises || [],
      sprint_5m: j.sprint5m || null, sprint_10m: j.sprint10m || null, sprint_30m: j.sprint30m || null,
      jump: j.jump || null, bodyweight: j.bodyweight || null,
      rpe: j.rpe || null, feeling: j.feeling || null, notes: j.notes || null
    };
  }
  function perfFromDb(p) {
    return {
      id: p.id, userId: p.user_id, date: p.date,
      sprint5m: p.sprint_5m != null ? +p.sprint_5m : null,
      sprint10m: p.sprint_10m != null ? +p.sprint_10m : null,
      sprint30m: p.sprint_30m != null ? +p.sprint_30m : null,
      cod: p.cod != null ? +p.cod : null,
      jump: p.jump != null ? +p.jump : null,
      bodyweight: p.bodyweight != null ? +p.bodyweight : null
    };
  }
  function perfToDb(p) {
    return {
      user_id: p.userId, date: p.date,
      sprint_5m: p.sprint5m, sprint_10m: p.sprint10m, sprint_30m: p.sprint30m,
      cod: p.cod, jump: p.jump, bodyweight: p.bodyweight
    };
  }
  function sessionFromDb(s) {
    return {
      id: s.id, userId: s.user_id, planId: s.plan_id,
      phaseNum: s.phase_num, workoutLetter: s.workout_letter, weekNum: s.week_num,
      date: s.date, durationMin: s.duration_min, rpe: s.rpe,
      exercisesDone: s.exercises_done, exercisesTotal: s.exercises_total,
      notes: s.notes
    };
  }
  function sessionToDb(s) {
    return {
      user_id: s.userId, plan_id: s.planId,
      phase_num: s.phaseNum, workout_letter: s.workoutLetter, week_num: s.weekNum,
      date: s.date, duration_min: s.durationMin, rpe: s.rpe,
      exercises_done: s.exercisesDone, exercises_total: s.exercisesTotal,
      notes: s.notes
    };
  }
  function msgFromDb(m) {
    return {
      id: m.id, fromId: m.from_id, toId: m.to_id,
      text: m.text, read: m.read, timestamp: m.created_at
    };
  }

  // ── Bootstrap ─────────────────────────────────────────
  async function bootstrap() {
    if (_bootstrapped) return;

    const { data: { session } } = await sb.auth.getSession();
    if (!session) { _bootstrapped = true; return; }

    const uid = session.user.id;

    // Load own profile
    const { data: profile, error: profileErr } = await sb.from('profiles').select('*').eq('id', uid).maybeSingle();
    if (profileErr) { console.error('profile', profileErr); return; }
    if (!profile) { console.warn('No profile for user', uid); return; }

    _cache.currentUser = profileToUser(profile);

    // Plans (everyone needs)
    const { data: plans } = await sb.from('plans').select('*').order('id');
    _cache.plans = (plans || []).map(planFromDb);

    // Profiles (admin: all; player: self + admin)
    if (profile.role === 'admin') {
      const { data: all } = await sb.from('profiles').select('*').order('created_at');
      _cache.profiles = (all || []).map(profileToUser);
    } else {
      _cache.profiles = [profileToUser(profile)];
      const { data: adminP } = await sb.from('profiles').select('*').eq('role','admin').limit(1).maybeSingle();
      if (adminP) _cache.profiles.push(profileToUser(adminP));
    }

    // Journal, perf, sessions, messages
    if (profile.role === 'admin') {
      const [j,p,s,m] = await Promise.all([
        sb.from('journal').select('*').order('date',{ascending:false}),
        sb.from('performances').select('*').order('date'),
        sb.from('completed_sessions').select('*').order('date',{ascending:false}),
        sb.from('messages').select('*').order('created_at')
      ]);
      _cache.journal = (j.data||[]).map(journalFromDb);
      _cache.performances = (p.data||[]).map(perfFromDb);
      _cache.completedSessions = (s.data||[]).map(sessionFromDb);
      _cache.messages = (m.data||[]).map(msgFromDb);
    } else {
      const [j,p,s,m] = await Promise.all([
        sb.from('journal').select('*').eq('user_id',uid).order('date',{ascending:false}),
        sb.from('performances').select('*').eq('user_id',uid).order('date'),
        sb.from('completed_sessions').select('*').eq('user_id',uid).order('date',{ascending:false}),
        sb.from('messages').select('*').or(`from_id.eq.${uid},to_id.eq.${uid}`).order('created_at')
      ]);
      _cache.journal = (j.data||[]).map(journalFromDb);
      _cache.performances = (p.data||[]).map(perfFromDb);
      _cache.completedSessions = (s.data||[]).map(sessionFromDb);
      _cache.messages = (m.data||[]).map(msgFromDb);
    }

    // Signed URL for own individual PDF (if player + has path)
    if (profile.role === 'player' && _cache.currentUser.individualPdfPath) {
      try {
        const { data: signed } = await sb.storage.from('individual-plans')
          .createSignedUrl(_cache.currentUser.individualPdfPath, 3600);
        if (signed) _cache.currentUser.individualPdfData = signed.signedUrl;
      } catch(e) { console.warn('signed url', e); }
    }

    _bootstrapped = true;
  }

  function reset() { _bootstrapped = false; _cache = { currentUser:null, profiles:[], plans:[], journal:[], performances:[], completedSessions:[], messages:[] }; }

  // ── Realtime messages ─────────────────────────────────
  function subscribeMessages(onChange) {
    if (_msgChannel) { try { sb.removeChannel(_msgChannel); } catch(e){} }
    _msgChannel = sb.channel('msg-rt')
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

  // ── Sync getters ──────────────────────────────────────
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
  function getMessages(uid1, uid2) {
    return _cache.messages.filter(m => (m.fromId===uid1&&m.toId===uid2)||(m.fromId===uid2&&m.toId===uid1))
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

  // ── Async writes ──────────────────────────────────────
  async function createUser(data) {
    // Save admin session
    const { data: { session: adminSess } } = await sb.auth.getSession();

    // Sign up new user (triggers auto-create profile via DB trigger)
    const { data: signUp, error } = await sb.auth.signUp({
      email: data.email, password: data.password,
      options: { data: {
        role: 'player',
        first_name: data.firstName, last_name: data.lastName,
        name: data.name || (data.firstName + ' ' + data.lastName)
      }}
    });
    if (error) throw error;

    // Restore admin session
    if (adminSess) {
      await sb.auth.setSession({
        access_token: adminSess.access_token,
        refresh_token: adminSess.refresh_token
      });
    }
    const newId = signUp.user.id;

    // Wait briefly for trigger then update profile
    await new Promise(r => setTimeout(r, 600));
    const initials = ((data.firstName||'')[0]||'X')+((data.lastName||'')[0]||'X');
    await sb.from('profiles').update({
      plan_id: data.planId,
      plan_start_date: data.planStartDate,
      plan_end_date: data.planEndDate,
      status: data.status || 'active',
      avatar_initials: initials.toUpperCase()
    }).eq('id', newId);

    // Reload profiles cache
    const { data: all } = await sb.from('profiles').select('*').order('created_at');
    _cache.profiles = (all || []).map(profileToUser);

    return _cache.profiles.find(u => u.id === newId);
  }

  async function updateUser(id, data) {
    const m = {};
    if (data.firstName !== undefined) m.first_name = data.firstName;
    if (data.lastName !== undefined) m.last_name = data.lastName;
    if (data.name !== undefined) m.name = data.name;
    if (data.email !== undefined) m.email = data.email;
    if (data.avatarInitials !== undefined) m.avatar_initials = data.avatarInitials;
    if (data.planId !== undefined) m.plan_id = data.planId;
    if (data.planStartDate !== undefined) m.plan_start_date = data.planStartDate;
    if (data.planEndDate !== undefined) m.plan_end_date = data.planEndDate;
    if (data.status !== undefined) m.status = data.status;
    if (data.streak !== undefined) m.streak = data.streak;
    if (data.weekProgress !== undefined) m.week_progress = data.weekProgress;
    if (data.individualPdfPath !== undefined) m.individual_pdf_path = data.individualPdfPath;
    if (data.individualPdfName !== undefined) m.individual_pdf_name = data.individualPdfName;
    if (data.lastLogin !== undefined) m.last_login = data.lastLogin;
    if (!Object.keys(m).length) return null;

    const { data: row, error } = await sb.from('profiles').update(m).eq('id', id).select().maybeSingle();
    if (error) { console.error(error); return null; }
    if (!row) return null;
    const user = profileToUser(row);
    const idx = _cache.profiles.findIndex(u=>u.id===id);
    if (idx !== -1) _cache.profiles[idx] = user;
    if (_cache.currentUser?.id === id) _cache.currentUser = user;
    return user;
  }

  async function deleteUser(id) {
    await sb.from('profiles').delete().eq('id', id);
    _cache.profiles = _cache.profiles.filter(u=>u.id!==id);
  }

  async function updatePlan(id, data) {
    const m = {};
    if (data.name !== undefined) m.name = data.name;
    if (data.description !== undefined) m.description = data.description;
    if (data.emoji !== undefined) m.emoji = data.emoji;
    if (data.color !== undefined) m.color = data.color;
    if (data.version !== undefined) m.version = data.version;
    if (data.updatedAt !== undefined) m.updated_at = data.updatedAt;
    const { data: row, error } = await sb.from('plans').update(m).eq('id', id).select().single();
    if (error) { console.error(error); return null; }
    const p = planFromDb(row);
    const idx = _cache.plans.findIndex(x=>x.id===id);
    if (idx !== -1) _cache.plans[idx] = p;
    return p;
  }

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
    await sb.from('journal').delete().eq('id', id);
    _cache.journal = _cache.journal.filter(j=>j.id!==id);
  }

  async function addPerf(data) {
    const { data: row, error } = await sb.from('performances').insert(perfToDb(data)).select().single();
    if (error) throw error;
    const p = perfFromDb(row);
    _cache.performances.push(p);
    return p;
  }

  async function addCompletedSession(data) {
    const { data: row, error } = await sb.from('completed_sessions').insert(sessionToDb(data)).select().single();
    if (error) throw error;
    const s = sessionFromDb(row);
    _cache.completedSessions.unshift(s);
    return s;
  }

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
    await sb.from('messages').update({ read: true })
      .eq('from_id', fromId).eq('to_id', toId).eq('read', false);
    _cache.messages.forEach(m => { if (m.fromId===fromId && m.toId===toId) m.read = true; });
  }

  // ── Storage (individual PDFs) ─────────────────────────
  async function uploadIndividualPdf(userId, file) {
    const ext = (file.name.split('.').pop() || 'pdf');
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error } = await sb.storage.from('individual-plans').upload(path, file, { upsert: true, contentType: 'application/pdf' });
    if (error) throw error;
    await updateUser(userId, { individualPdfPath: path, individualPdfName: file.name });
    return path;
  }
  async function getIndividualPdfUrl(path) {
    if (!path) return null;
    const { data } = await sb.storage.from('individual-plans').createSignedUrl(path, 3600);
    return data?.signedUrl || null;
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
    return new Date(d).toLocaleDateString('pl-PL',{day:'2-digit',month:'2-digit',year:'numeric'});
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
    let pass = '';
    for (let i = 0; i < 10; i++) pass += chars[Math.floor(Math.random()*chars.length)];
    return pass;
  }

  return {
    bootstrap, reset, subscribeMessages,
    getCurrentUser, getUsers, getPlayers, getUserById, getUserByEmail,
    createUser, updateUser, deleteUser,
    getPlans, getPlanById, updatePlan, getPlanPlayerCount,
    getJournalByUser, getAllJournal, addJournalEntry, updateJournalEntry, deleteJournalEntry,
    getPerfByUser, addPerf,
    getSessionsByUser, addCompletedSession, hasCompletedSession, countSessionsInPhase,
    getMessages, getAllMessagesForAdmin, sendMessage, markRead, getUnreadCount,
    uploadIndividualPdf, getIndividualPdfUrl, sendPasswordResetEmail,
    formatDate, timeAgo, generatePassword
  };
})();
