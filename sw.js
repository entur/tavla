const cacheName = 'v1::static'

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches
            .open(cacheName)
            .then((cache) =>
                cache.addAll(['/']).then(() => self.skipWaiting()),
            ),
    )
})

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches
            .open(cacheName)
            .then((cache) =>
                cache
                    .match(event.request)
                    .then((res) => res || fetch(event.request)),
            ),
    )
})
