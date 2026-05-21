// Crystal Ballers — Auth Layer (Supabase Auth)
'use strict';

const Auth = (() => {
  function rootPath() {
    const p = window.location.pathname;
    if (/\/player\//.test(p) || /\/admin\//.test(p)) return '../';
    return '';
  }

  async function login(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      const lower = (error.message || '').toLowerCase();
      const msg = lower.includes('invalid login') ? 'Nieprawidłowy email lub hasło.' :
                  lower.includes('email not confirmed') ? 'Konto nie zostało jeszcze aktywowane.' :
                  error.message;
      return { ok: false, error: msg };
    }
    CB.reset();
    await CB.bootstrap();
    const user = CB.getCurrentUser();
    if (!user) {
      await sb.auth.signOut();
      return { ok: false, error: 'Profil nie został utworzony. Skontaktuj się z trenerem.' };
    }
    if (user.status === 'inactive') {
      await sb.auth.signOut();
      return { ok: false, error: 'Konto jest nieaktywne. Skontaktuj się z trenerem.' };
    }
    // Update lastLogin (fire-and-forget)
    CB.updateUser(user.id, { lastLogin: new Date().toISOString() }).catch(()=>{});
    return { ok: true, user };
  }

  async function logout() {
    try { await sb.auth.signOut(); } catch(e){}
    CB.reset();
    window.location.href = rootPath() + 'index.html';
  }

  function getUser() { return CB.getCurrentUser(); }
  function isAdmin() { const u = CB.getCurrentUser(); return u && u.role === 'admin'; }
  function isPlayer() { const u = CB.getCurrentUser(); return u && u.role === 'player'; }

  async function getSession() {
    const { data: { session } } = await sb.auth.getSession();
    return session;
  }

  async function requirePlayer() {
    const session = await getSession();
    if (!session) { window.location.href = rootPath() + 'index.html'; return false; }
    await CB.bootstrap();
    const user = CB.getCurrentUser();
    if (!user) { await sb.auth.signOut(); window.location.href = rootPath() + 'index.html'; return false; }
    if (user.role !== 'player') { window.location.href = rootPath() + 'admin/dashboard.html'; return false; }
    return true;
  }

  async function requireAdmin() {
    const session = await getSession();
    if (!session) { window.location.href = rootPath() + 'index.html'; return false; }
    await CB.bootstrap();
    const user = CB.getCurrentUser();
    if (!user) { await sb.auth.signOut(); window.location.href = rootPath() + 'index.html'; return false; }
    if (user.role !== 'admin') { window.location.href = rootPath() + 'player/dashboard.html'; return false; }
    return true;
  }

  return { login, logout, getSession, getUser, isAdmin, isPlayer, requirePlayer, requireAdmin, rootPath };
})();
