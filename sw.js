// Crystal Ballers — Service Worker
const CACHE = 'cb-shell-v10-user-menu';
const PRECACHE = [
  './',
  './index.html',
  './signup.html',
  './pricing.html',
  './css/main.css',
  './js/config.js',
  './js/data.js',
  './js/auth.js',
  './js/app.js',
  './js/icons.js',
  './js/plans-data.js',
  './manifest.json',
  './icon.svg',
  './icon-192.svg',
  './icon-512.svg',
  './IMG_5744.webp',
  './player/dashboard.html',
  './player/plan.html',
  './player/workout.html',
  './player/journal.html',
  './player/chat.html',
  './player/performance.html',
  './admin/dashboard.html',
  './admin/players.html',
  './admin/plans.html',
  './admin/messages.html',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll(PRECACHE).catch(err => console.warn('Precache partial:', err))
    )
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Skip cross-origin except fonts
  if (url.origin !== location.origin && !url.host.includes('fonts.g')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) {
        // Stale-while-revalidate
        fetch(e.request).then(fresh => {
          if (fresh && fresh.status === 200) {
            caches.open(CACHE).then(c => c.put(e.request, fresh.clone()));
          }
        }).catch(()=>{});
        return cached;
      }
      return fetch(e.request).then(res => {
        if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
