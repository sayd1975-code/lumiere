/* Lumière — service worker (offline cache) */
const CACHE_NAME = "lumiere-v5";
const ASSETS = [
  "./",
  "./index.html",
  "./o-nas.html",
  "./oferta.html",
  "./galeria.html",
  "./kontakt.html",
  "./css/style.css",
  "./js/main.js",
  "./manifest.json",
  "./icon.svg",
  "./icon-mask.svg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(
      (cached) =>
        cached ||
        fetch(e.request)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(e.request, copy));
            return res;
          })
          .catch(() => caches.match("./"))
    )
  );
});
