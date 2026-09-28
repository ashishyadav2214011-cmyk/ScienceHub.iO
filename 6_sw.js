const CACHE='sciencehub-phase4-v1';
const ASSETS=['./','index.html','4_styles.css','5_app.js','3_manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('./')))));
