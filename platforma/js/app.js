// Crystal Ballers – Shared UI Utilities
'use strict';

// ── Toast ────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  let wrap = document.getElementById('toastWrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'toastWrap';
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const icon = type === 'success'
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${icon}</span><span>${msg}</span>`;
  wrap.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(120%)'; t.style.transition='all 0.3s'; setTimeout(()=>t.remove(), 300); }, 3500);
}

// ── Modal ────────────────────────────────────────────────
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('open');
  document.body.style.overflow = '';
}

function initModalCloses() {
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.closest('.modal-overlay').id));
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(overlay.id); });
  });
}

// ── Sidebar ──────────────────────────────────────────────
function initSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  const hamburger = document.getElementById('hamburger');
  if (!sidebar) return;

  function open()  { sidebar.classList.add('open'); if(overlay) overlay.classList.add('open'); }
  function close() { sidebar.classList.remove('open'); if(overlay) overlay.classList.remove('open'); }

  if (hamburger) hamburger.addEventListener('click', () => sidebar.classList.contains('open') ? close() : open());
  if (overlay)   overlay.addEventListener('click', close);
}

// ── Sidebar user block (z menu) ──────────────────────────
function renderSidebarUser(user) {
  const el = document.getElementById('sidebarUser');
  if (!el || !user) return;

  const root = (window.location.pathname.includes('/player/') || window.location.pathname.includes('/admin/')) ? '../' : '';
  const hasSub = typeof CB !== 'undefined' && CB.hasActiveSubscription && CB.hasActiveSubscription(user);
  const isAdmin = user.role === 'admin';

  el.innerHTML = `
    <div class="sidebar-avatar">${user.avatarInitials}</div>
    <div>
      <div class="sidebar-user-name">${user.firstName}</div>
      <div class="sidebar-user-role">${isAdmin ? 'Administrator' : 'Zawodnik'}</div>
    </div>
    <div class="sidebar-user-caret"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg></div>
  `;

  // Popup menu (montowane do body)
  const menuId = 'cb-user-menu-popup';
  let menu = document.getElementById(menuId);
  if (!menu) {
    menu = document.createElement('div');
    menu.id = menuId;
    menu.style.cssText = `
      position: fixed; display: none; z-index: 9999;
      background: var(--bg3, #16161c); border: 1px solid var(--border2, rgba(255,255,255,0.12));
      border-radius: 12px; padding: 6px; min-width: 240px;
      box-shadow: 0 16px 60px rgba(0,0,0,0.6);
      animation: cbMenuFade 0.15s ease-out;
    `;
    document.body.appendChild(menu);

    // Animation keyframes
    if (!document.getElementById('cb-menu-keyframes')) {
      const s = document.createElement('style');
      s.id = 'cb-menu-keyframes';
      s.textContent = `
        @keyframes cbMenuFade { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
        .cb-menu-item {
          display:flex; align-items:center; gap:11px;
          padding: 10px 12px; cursor:pointer; border-radius: 8px;
          font-size: 0.875rem; color: var(--txt, #f0f0f4);
          transition: background 0.15s;
        }
        .cb-menu-item:hover { background: var(--card2, rgba(255,255,255,0.045)); }
        .cb-menu-item svg { width: 16px; height: 16px; opacity: 0.7; flex-shrink: 0; }
        .cb-menu-item.danger { color: var(--red, #ef4444); }
        .cb-menu-sep { height:1px; background: var(--border, rgba(255,255,255,0.07)); margin: 4px 0; }
        .cb-menu-info { padding: 10px 12px 6px; font-size: 0.72rem; color: var(--txt3, rgba(255,255,255,0.3)); letter-spacing: 0.06em; text-transform: uppercase; font-weight: 600; }
      `;
      document.head.appendChild(s);
    }

    // Click outside zamyka
    document.addEventListener('click', e => {
      if (menu.style.display === 'block' && !el.contains(e.target) && !menu.contains(e.target)) {
        menu.style.display = 'none';
      }
    });
  }

  // Build menu
  const subBlock = isAdmin
    ? `<div class="cb-menu-info">Konto administratora</div>`
    : hasSub
      ? `<div class="cb-menu-item" data-action="portal">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
           Zarządzaj subskrypcją
         </div>
         <div class="cb-menu-info" style="padding-top:2px;color:var(--green,#22c55e)">
           ● Subskrypcja aktywna
         </div>`
      : `<a class="cb-menu-item" href="${root}pricing.html" style="text-decoration:none">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
           Aktywuj subskrypcję
         </a>`;

  menu.innerHTML = `
    <div style="padding: 12px 14px 10px; border-bottom: 1px solid var(--border, rgba(255,255,255,0.07))">
      <div style="font-weight: 600; font-size: 0.9rem">${user.name || user.firstName}</div>
      <div style="font-size: 0.75rem; color: var(--txt3, rgba(255,255,255,0.3))">${user.email || ''}</div>
    </div>
    ${subBlock}
    <div class="cb-menu-sep"></div>
    <div class="cb-menu-item danger" data-action="logout">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      Wyloguj się
    </div>
  `;

  // Akcje
  menu.querySelectorAll('[data-action]').forEach(item => {
    item.addEventListener('click', async () => {
      menu.style.display = 'none';
      const action = item.dataset.action;
      if (action === 'logout') {
        if (confirm('Wylogować się?')) Auth.logout();
      } else if (action === 'portal') {
        await openCustomerPortal();
      }
    });
  });

  // Otwórz menu — pozycjonuj nad widgetem
  el.onclick = e => {
    e.stopPropagation();
    if (menu.style.display === 'block') {
      menu.style.display = 'none';
      return;
    }
    const rect = el.getBoundingClientRect();
    menu.style.left = rect.left + 'px';
    menu.style.bottom = (window.innerHeight - rect.top + 8) + 'px';
    menu.style.display = 'block';
  };
}

// ── Customer Portal (zarządzanie sub w Stripe) ──────────
async function openCustomerPortal() {
  const sess = await Auth.getSession();
  if (!sess) return;
  if (typeof showToast === 'function') showToast('Przekierowywanie do Stripe...');
  try {
    const resp = await fetch(`${SUPABASE_URL}/functions/v1/customer-portal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sess.access_token}`,
        'apikey': SUPABASE_KEY,
      },
      body: JSON.stringify({ returnUrl: window.location.href })
    });
    const data = await resp.json();
    if (!resp.ok || !data.url) throw new Error(data.error || 'Nie udało się otworzyć portalu');
    window.location.href = data.url;
  } catch(e) {
    if (typeof showToast === 'function') showToast('Błąd: ' + e.message, 'error');
    else alert('Błąd: ' + e.message);
  }
}
window.openCustomerPortal = openCustomerPortal;

// ── Unread badge ─────────────────────────────────────────
function updateMsgBadge(userId) {
  const badge = document.getElementById('msgBadge');
  if (!badge) return;
  const count = CB.getUnreadCount(userId);
  if (count > 0) { badge.textContent = count; badge.style.display = 'inline'; }
  else badge.style.display = 'none';
}

// ── Active nav link ──────────────────────────────────────
function setActiveNav() {
  const page = window.location.pathname.split('/').pop().replace('.html','');
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href') || '';
    const name = href.split('/').pop().replace('.html','');
    a.classList.toggle('active', name === page);
  });
}

// ── Progress ring ────────────────────────────────────────
function setProgressRing(svgId, pct, radius = 54) {
  const circ = 2 * Math.PI * radius;
  const fill = document.querySelector(`#${svgId} .progress-ring-fill`);
  if (!fill) return;
  fill.setAttribute('stroke-dasharray', circ);
  fill.setAttribute('stroke-dashoffset', circ - (pct / 100) * circ);
}

// ── Format seconds for sprint times ─────────────────────
function fmtTime(val) {
  if (!val && val !== 0) return '—';
  return parseFloat(val).toFixed(2) + 's';
}

// ── Confirm dialog ───────────────────────────────────────
function confirmAction(msg, onConfirm) {
  if (confirm(msg)) onConfirm();
}

// ── RPE label ────────────────────────────────────────────
const RPE_LABELS = ['','Bardzo lekko','Lekko','Umiarkowanie','Ciężko','Ciężko','Bardzo ciężko','Bardzo ciężko','Maksymalnie','Maksymalnie','Do granicy'];
function rpeLabel(rpe) { return RPE_LABELS[rpe] || ''; }

// ── Feeling label ─────────────────────────────────────────
const FEELING_LABELS = ['','Fatalnie','Źle','Przeciętnie','Dobrze','Wyśmienicie'];
function feelingLabel(f) { return FEELING_LABELS[f] || ''; }

// ── Date helpers ─────────────────────────────────────────
function todayStr() { return new Date().toISOString().slice(0,10); }
function weekDayPL(date) {
  const days = ['Ndz','Pon','Wt','Śr','Czw','Pt','Sob'];
  return days[new Date(date).getDay()];
}
function monthDayShort(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const months = ['sty','lut','mar','kwi','maj','cze','lip','sie','wrz','paź','lis','gru'];
  return { day: d.getDate(), month: months[d.getMonth()] };
}

// ── PWA: register SW + install prompt ────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swPath = (window.location.pathname.includes('/player/') || window.location.pathname.includes('/admin/'))
      ? '../sw.js' : 'sw.js';
    navigator.serviceWorker.register(swPath).catch(err => console.warn('SW register fail:', err));
  });
}

let _deferredInstall = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  _deferredInstall = e;
  const btn = document.getElementById('installBtn');
  if (btn) btn.style.display = 'inline-flex';
});
function promptInstall() {
  if (!_deferredInstall) {
    showToast('Aplikacja już zainstalowana lub niedostępna w tej przeglądarce.', 'error');
    return;
  }
  _deferredInstall.prompt();
  _deferredInstall.userChoice.then(c => {
    if (c.outcome === 'accepted') showToast('Aplikacja zainstalowana ✓');
    _deferredInstall = null;
    const btn = document.getElementById('installBtn');
    if (btn) btn.style.display = 'none';
  });
}

// ── Subscription banner ──────────────────────────────────
function injectSubscriptionBanner() {
  if (typeof Auth === 'undefined') return;
  const user = Auth.getUser && Auth.getUser();
  if (!user || user.role !== 'player') return;
  if (CB.hasActiveSubscription(user)) return;

  const content = document.querySelector('.content');
  if (!content || document.getElementById('subBanner')) return;

  const root = (window.location.pathname.includes('/player/')) ? '../' : '';
  const banner = document.createElement('div');
  banner.id = 'subBanner';
  banner.style.cssText = 'background:linear-gradient(135deg,rgba(200,164,90,0.18) 0%, rgba(200,164,90,0.05) 100%);border:1px solid rgba(200,164,90,0.4);border-radius:16px;padding:16px 20px;margin-bottom:20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;animation:fadeUp 0.4s var(--ease-out) both;';
  banner.innerHTML = `
    <div style="width:42px;height:42px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;flex-shrink:0">
      <svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.2" width="20" height="20"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    </div>
    <div style="flex:1;min-width:200px">
      <div style="font-weight:700;font-size:0.95rem">Brak aktywnej subskrypcji</div>
      <div style="font-size:0.8rem;color:var(--txt2);margin-top:2px">Aktywuj dostęp do wszystkich 3 planów — od 59,99 zł / mies.</div>
    </div>
    <a href="${root}pricing.html" class="btn btn-primary btn-sm">Aktywuj dostęp</a>
  `;
  content.insertBefore(banner, content.firstChild);
}

// ── Init on DOM ready ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initModalCloses();
  setActiveNav();
});
