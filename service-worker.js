const cacheName = 'v1';
const cacheAssets = [
    'index.html',
    'style.css',
    'script.js',
    'manifest.webmanifest',
];

self.addEventListener('install', async (e) => {
    // cache the assets
    const cache = await caches.open(cacheName);
    await cache.addAll(cacheAssets);
    return self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    console.log('SW activation successful');

    self.clients.claim();

    // remove unwanted cache assets
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cacheName) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', async (e) => {
    e.respondWith(
        fetch(e.request).catch(() => {
            return caches.match(e.request);
        })
    );
});

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);
    return cached || fetch(req);
}

async function networkAndCache(req) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone());
        return fresh;
    } catch {
        const cached = await cache.match(req);
        return cached;
    }
}
