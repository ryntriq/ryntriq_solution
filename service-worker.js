const CACHE_NAME = 'ryntriq-shell-v1';
const APP_SHELL = [
  './', './index.html', './app.html', './mobile-app.css', './mobile-app.js', './services.html', './apps.html', './service-web.html', './service-data.html',
  './service-automation.html', './work.html', './about.html', './contact.html',
  './message-sent.html', './styles.css', './script.js', './manifest.webmanifest',
  './assets/ryntriq-mark.svg', './assets/ryntriq-logo.svg',
  './assets/ryntriq-app-icon-192.png', './assets/ryntriq-app-icon-512.png',
  './assets/ryntriq-app-icon-maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('ryntriq-shell-') && key !== CACHE_NAME).map(key => caches.delete(key))
  )));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match('./index.html'))));
    return;
  }

  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
    }
    return response;
  })));
});
