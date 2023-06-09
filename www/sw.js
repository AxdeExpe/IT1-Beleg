
const urlsToCache = ["./index.html", "./JS/main.js", "./CSS/Main.css", "./Image/PWA_Image.png"];

self.addEventListener('install', event => event.waitUntil(
    caches.open('PWA').then(cache => cache.addAll(urlsToCache))
));

self.addEventListener('fetch', event => event.respondWith(
    caches.open('PWA')
        .then(cache => cache.match(event.request))
        .then(response => response || fetch(event.request))
));

self.addEventListener("activate", event => {
    console.log("Service worker activated");
});
