// Maaş Günü v5.4.1 — Service Worker
// Strateji: uygulama sayfası için ÖNCE AĞ (güncellemeler tek açılışta gelir),
// internet yoksa önbellek (çevrimdışı çalışma korunur). Diğer dosyalar önbellek öncelikli.
const CACHE = 'maas-gunu-v6.4.0';
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
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.all(SHELL.map((u) =>
        fetch(u, { cache: 'no-cache', credentials: 'same-origin' })
          .then((r) => { if (r && r.ok) return c.put(u, r); })
          .catch(() => {})
      ))
    ).then(() => self.skipWaiting())
  );
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

  // Uygulama sayfası: önce ağ (HTTP önbelleğini atlayarak) → yoksa önbellek
  if (e.request.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    e.respondWith(
      fetch(url.pathname + url.search, { cache: 'no-cache', credentials: 'same-origin' })
        .then((res) => {
          if (res && res.ok) {
            const c1 = res.clone(), c2 = res.clone();
            caches.open(CACHE).then((c) => { c.put('./', c1); c.put('index.html', c2); });
          }
          return res;
        })
        .catch(() =>
          caches.match('index.html').then((h) => h || caches.match('./'))
        )
    );
    return;
  }

  // Google Fonts: önbellekte varsa oradan, yoksa ağdan al ve sakla
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

  // Diğer aynı-kaynak dosyalar (ikonlar, manifest): önce önbellek, arka planda tazele
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
