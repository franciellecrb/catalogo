self.addEventListener('install', event =>{
    event.waitUntil(
        caches.open(nomeDoApp-cache).then(cache =>{
            return cache.addAll([
                "index.html",
                "manifest.json",
                "css/style.css",
                "js/main.js",
                "js/global.js",
                "js/detalhe.js",
                "pages/detalhe.html",
                "assets/icones/lupa.svg",
                "assets/icones/icone-192.png",
                "assets/icones/icone-512.png"
            ]);
        })
    )
});
self.addEventListener('fetch', event =>{
    event.respondWith(
        caches.match(event.request)
        .then(response => response || fetch(event.request))
    )
})