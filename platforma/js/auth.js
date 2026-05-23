// Crystal Ballers — Auth Layer (Supabase Auth + self-signup)
'use strict';

const Auth = (() => {
  function rootPath() {
    const p = window.location.pathname;
    if (/\/player\//.test(p) || /\/admin\//.test(p)) return '../';
    return '';
  }

  // ── Sign up (self-registration) ──────────────────────
  async function signup({ email, password, firstName, lastName }) {
    if (!email || !email.includes('@')) return { ok: false, error: 'Podaj prawidłowy adres email.' };
    if (!password || password.length < 6) return { ok: false, error: 'Hasło musi mieć minimum 6 znaków.' };
    if (!firstName || !lastName) return { ok: false, error: 'Podaj imię i nazwisko.' };

    const { data, error } = await sb.auth.signUp({
      email, password,
      options: {
        data: {
          role: 'player',
          first_name: firstName,
          last_name: lastName,
          name: firstName + ' ' + lastName
        }
      }
    });
    if (error) {
      const m = (error.message||'').toLowerCase();
      if (m.includes('already registered') || m.includes('user already')) return { ok: false, error: 'Konto z tym emailem już istnieje. Zaloguj się.' };
      return { ok: false, error: error.message };
    }
    if (!data.session) {
      return { ok: false, error: 'Konto utworzone, ale wymagana weryfikacja email. Sprawdź skrzynkę.' };
    }
    CB.reset();
    await CB.bootstrap();
    return { ok: true, user: CB.getCurrentUser() };
  }

  // ── Login ────────────────────────────────────────────
  async function login(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      const m = (error.message||'').toLowerCase();
      const msg = m.includes('invalid login') ? 'Nieprawidłowy email lub hasło.'
                : m.includes('email not confirmed') ? 'Konto nie zostało jeszcze aktywowane.'
                : error.message;
      return { ok: false, error: msg };
    }
    CB.reset();
    await CB.bootstrap();
    const user = CB.getCurrentUser();
    if (!user) {
      await sb.auth.signOut();
      return { ok: false, error: 'Profil nie istnieje. Skontaktuj się z trenerem.' };
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

  async function getSession() {
    if (!sb) return null;
    const { data: { session } } = await sb.auth.getSession();
    return session;
  }

  function getUser() { return CB.getCurrentUser(); }
  function isAdmin() { const u = CB.getCurrentUser(); return u && u.role === 'admin'; }
  function isPlayer() { const u = CB.getCurrentUser(); return u && u.role === 'player'; }
  function hasSubscription() { const u = getUser(); return CB.hasActiveSubscription(u); }

  // ── Route guards ─────────────────────────────────────
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
  async function requireSubscription() {
    if (!(await requirePlayer())) return false;
    const user = getUser();
    if (!CB.hasActiveSubscription(user)) {
      window.location.href = rootPath() + 'pricing.html';
      return false;
    }
    return true;
  }

  return { signup, login, logout, getSession, getUser, isAdmin, isPlayer, hasSubscription,
           requirePlayer, requireAdmin, requireSubscription, rootPath };
})();
