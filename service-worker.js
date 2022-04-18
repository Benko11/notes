const cacheName = 'v1';
const cacheAssets = [
    './',
    'index.html',
    'style.css',
    'script.js',
    'manifest.webmanifest',
];

self.addEventListener('install', (e) => {
    // cache the assets
    e.waitUntil(
        (async () => {
            const cache = await caches.open(cacheName);
            await cache.addAll(cacheAssets);
        })()
    );
});

self.addEventListener('activate', (e) => {
    console.log('SW activation successful');

    // remove unwanted cache assets
    e.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cache) => {
                        if (cache !== cacheName) {
                            return caches.delete(cache);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches
            .open(cacheName)
            .then((cache) => cache.match(e.request, { ignoreSearch: true }))
            .then((response) => {
                return response || fetch(e.request);
            })
    );
});
