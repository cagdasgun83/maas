// Maaş Günü v5.0 — Service Worker
// Sürüm değiştiğinde CACHE adını artırın (v5.0.1, v5.0.2 ...) — eski önbellek otomatik temizlenir.
const CACHE = 'maas-gunu-v5.0.0';
const SHELL = [
  './',
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'icon-512-maskable.png',
  'apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  // Google Fonts: önbellekte varsa oradan, yoksa ağdan al ve sakla (çevrimdışı yazı tipi desteği)
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    e.respondWith(
      caches.open(CACHE).then((c) =>
        c.match(e.request).then((hit) =>
          hit || fetch(e.request).then((res) => { c.put(e.request, res.clone()); return res; }).catch(() => hit)
        )
      )
    );
    return;
  }

  // Uygulama kabuğu: önce önbellek, sonra ağ; ağdan gelirse önbelleği tazele
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then((hit) => {
        const fresh = fetch(e.request)
          .then((res) => {
            if (res && res.ok) caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
            return res;
          })
          .catch(() => hit);
        return hit || fresh;
      })
    );
  }
});
