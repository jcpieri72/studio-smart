// Studio Smart: funziona anche senza internet, si aggiorna da sola e riceve le notifiche
const CACHE = "studiosmart-v2";
const FILES = ["./", "index.html", "config.js", "manifest.json", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(l => { for (const c of l) if ("focus" in c) return c.focus(); return clients.openWindow("./"); }));
});
// notifiche push (Firebase Cloud Messaging)
try {
  importScripts("config.js");
  const cfg = self.STUDIO_CONFIG || {};
  if (cfg.firebase && cfg.firebase.apiKey && !String(cfg.firebase.apiKey).startsWith("INSERISCI")) {
    importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js", "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");
    firebase.initializeApp(cfg.firebase);
    firebase.messaging();
  }
} catch (e) {}
