// Minimal PWA service worker - just enough for installability, no aggressive caching.
// Chrome requires a SW with a fetch handler before it fires install prompt.
// This one passes requests straight through (no stale-cache risk).

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // Passthrough - enables install prompt without caching behavior changes.
});
