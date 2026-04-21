const CACHE_NAME = "raptor-ai-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  // A basic fetch handler to satisfy PWA requirements.
  // It simply fetches from the network without complex caching,
  // ensuring the app always gets fresh data when online.
  event.respondWith(fetch(event.request));
});
