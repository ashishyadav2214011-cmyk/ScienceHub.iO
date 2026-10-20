/* ScienceHub.io service worker — safe cache and offline fixes. */
const CACHE = 'sciencehub-phase5-v3-20261020';
const ASSETS = [
  './', './index.html', './3_index.html', './4_styles.css', './5_app.js',
  './3_manifest.webmanifest',
  './11_VISUAL-INTEGRATION__SCIENCEHUB-FRONTEND-APP-ICON.png',
  './11_VISUAL-INTEGRATION__SCIENCEHUB-INTERNAL-APP-ICON.png',
  './12_SUKOON-BRAIN-REALTIME-ICON.png',
  './academic/academic-data.js', './academic/academic-store.js',
  './academic/academic-engine.js'
];
const scopeUrl = (path) => new URL(path, self.registration.scope).href;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Cache assets independently: one missing optional asset must not fail install.
    await Promise.allSettled(ASSETS.map(async (path) => {
      const url = scopeUrl(path);
      try {
        const response = await fetch(url, { cache: 'reload' });
        if (response.ok && response.type !== 'opaque') await cache.put(url, response.clone());
      } catch (_) { /* Offline or optional asset unavailable; continue install. */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('sciencehub-') && key !== CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) return;

  // Network-first avoids indefinitely serving stale deployed JS/CSS after updates.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(request);
      if (response.ok && response.type !== 'opaque') {
        try { await cache.put(request, response.clone()); } catch (_) { /* Don't block network response. */ }
      }
      return response;
    } catch (_) {
      const cached = await cache.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        const shell = await cache.match(scopeUrl('./index.html'));
        if (shell) return shell;
        return new Response('ScienceHub.io is offline and this page has not been cached yet.', {
          status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      }
      return Response.error();
    }
  })());
});
