/**
 * BIOMASTER Pro V2 IA - Service Worker
 * Proporciona caché inteligente y funcionalidad offline
 */

const CACHE_NAME = 'biomaster-v2-cache-v1.0.0';
const STATIC_CACHE = 'biomaster-static-v1.0.0';
const DYNAMIC_CACHE = 'biomaster-dynamic-v1.0.0';

// Recursos críticos que siempre deben estar en caché
const CRITICAL_RESOURCES = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/performance.js',
    '/js/theme.js',
    '/js/state.js',
    '/js/initialization.js',
    '/js/websocket.js',
    '/icons/pyh.png',
    '/icons/menu.svg',
    '/icons/config-white.svg'
];

// Recursos que se pueden cachear bajo demanda
const CACHEABLE_RESOURCES = [
    '/js/chartLibrary.js',
    '/js/chart-plugin.min.js',
    '/js/buttonLogic.js',
    '/js/notification.js',
    '/js/calibration.js',
    '/js/eventListeners.js',
    '/js/chartsLogic.js',
    '/js/telegram.js',
    '/js/wifi.js',
    '/icons/dashboard.svg',
    '/icons/graph.svg',
    '/icons/users.svg',
    '/icons/wifi.svg',
    '/icons/help.svg',
    '/icons/config.svg'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('BIOMASTER Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('BIOMASTER Service Worker: Caching critical resources...');
                return cache.addAll(CRITICAL_RESOURCES);
            })
            .then(() => {
                console.log('BIOMASTER Service Worker: Critical resources cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('BIOMASTER Service Worker: Error caching critical resources:', error);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('BIOMASTER Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Eliminar cachés antiguas
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('BIOMASTER Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('BIOMASTER Service Worker: Claiming clients...');
                return self.clients.claim();
            })
    );
});

// Interceptar peticiones de red
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Solo manejar peticiones del mismo origen
    if (url.origin !== location.origin) {
        return;
    }

    // Estrategia Cache First para recursos estáticos
    if (isStaticResource(request.url)) {
        event.respondWith(cacheFirst(request));
    }
    // Estrategia Network First para contenido dinámico
    else if (isDynamicContent(request.url)) {
        event.respondWith(networkFirst(request));
    }
    // Estrategia Stale While Revalidate para otros recursos
    else {
        event.respondWith(staleWhileRevalidate(request));
    }
});

/**
 * Verifica si un recurso es estático
 */
function isStaticResource(url) {
    return url.includes('.css') || 
           url.includes('.js') || 
           url.includes('.svg') || 
           url.includes('.png') || 
           url.includes('.jpg') || 
           url.includes('.ico');
}

/**
 * Verifica si es contenido dinámico
 */
function isDynamicContent(url) {
    return url.includes('/api/') || 
           url.includes('websocket') ||
           url.includes('/data/');
}

/**
 * Estrategia Cache First
 */
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('BIOMASTER Service Worker: Cache First error:', error);
        return new Response('Offline content not available', { status: 503 });
    }
}

/**
 * Estrategia Network First
 */
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('BIOMASTER Service Worker: Network failed, trying cache...');
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response('Content not available offline', { status: 503 });
    }
}

/**
 * Estrategia Stale While Revalidate
 */
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request)
        .then((networkResponse) => {
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch(() => cachedResponse);

    return cachedResponse || fetchPromise;
}

// Limpiar caché periódicamente
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        clearOldCache();
    }
});

/**
 * Limpia cachés antiguas
 */
async function clearOldCache() {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
        !name.includes(STATIC_CACHE) && !name.includes(DYNAMIC_CACHE)
    );
    
    await Promise.all(oldCaches.map(name => caches.delete(name)));
    console.log('BIOMASTER Service Worker: Old caches cleared');
}
