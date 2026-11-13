// 딸깍공방 서비스 워커: 시작 페이지와 점검표를 인터넷 없이도 열리게 한다.
const CACHE = 'ddalkkak-gongbang-v1';
const FILES = ['./', 'index.html', 'checklist.html', 'checklist.js', 'style.css', 'manifest.webmanifest',
  'icons/icon.svg', 'icons/baduk-192.png', 'icons/guitar-192.png', 'icons/art-192.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k.startsWith('ddalkkak-gongbang-') && k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin || !url.pathname.includes('/ddalkkak-gongbang/')) return;
  // 새 내용을 먼저 받고, 안 되면 저장해 둔 것을 쓴다.
  e.respondWith(fetch(e.request).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
