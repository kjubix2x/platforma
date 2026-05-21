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

// ── Sidebar user block ───────────────────────────────────
function renderSidebarUser(user) {
  const el = document.getElementById('sidebarUser');
  if (!el || !user) return;
  el.innerHTML = `
    <div class="sidebar-avatar">${user.avatarInitials}</div>
    <div>
      <div class="sidebar-user-name">${user.firstName}</div>
      <div class="sidebar-user-role">${user.role === 'admin' ? 'Administrator' : 'Zawodnik'}</div>
    </div>
    <div class="sidebar-user-caret"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></div>
  `;
  el.addEventListener('click', () => {
    if (confirm('Wylogować się?')) Auth.logout();
  });
}

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

// ── Init on DOM ready ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initModalCloses();
  setActiveNav();
});
