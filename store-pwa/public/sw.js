const CACHE_NAME = 'store-pwa-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';
const API_CACHE = 'api-v2';

// URLs que se cachean inmediatamente
const urlsToCache = [
  '/',
  '/home',
  '/products',
  '/customers', 
  '/orders',
  '/cart',
  '/login',
  '/admin',
  '/manifest.webmanifest'
];

// Archivos estáticos para cachear
const staticAssets = [
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/favicon.png',
  '/assets/icon/favicon.png',
  '/assets/icon/icon.png'
];

// Evento de instalación - Cachea recursos estáticos
self.addEventListener('install', (event) => {
  console.log('Instalando Service Worker...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Cacheando recursos estáticos');
        return cache.addAll(staticAssets);
      }),
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Cacheando shell de la app');
        return cache.addAll(urlsToCache);
      })
    ])
  );
  self.skipWaiting();
});

// Evento de activación - Elimina caches antiguos
self.addEventListener('activate', (event) => {
  console.log('Activando Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (![CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE, API_CACHE].includes(cacheName)) {
            console.log('Eliminando cache antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Evento de fetch - Estrategia de caché inteligente
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Omitir solicitudes que no sean GET
  if (request.method !== 'GET') {
    return;
  }

  // Manejar solicitudes a la API (Red primero, con fallback a caché)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Manejar archivos estáticos (Cache primero)
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // Manejar páginas HTML (Red primero con fallback a caché)
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(handleHtmlRequest(request));
    return;
  }

  // Por defecto: Red primero con fallback a caché
  event.respondWith(handleDefaultRequest(request));
});

// Solicitudes a la API: Red primero, con fallback a caché
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Fallo la solicitud a la API, intentando con cache:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Respuesta offline para solicitudes a la API
    return new Response(JSON.stringify({ 
      error: 'Sin conexión a internet',
      offline: true 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Archivos estáticos: Cache primero
async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Recurso estático no encontrado:', request.url);
    return new Response('Recurso no encontrado', { status: 404 });
  }
}

// Páginas HTML: Red primero con fallback a caché
async function handleHtmlRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Fallo la solicitud HTML, intentando con cache:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Página offline
    return caches.match('/');
  }
}

// Por defecto: Red primero con fallback a caché
async function handleDefaultRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Fallo la solicitud, intentando con cache:', request.url);
    return await caches.match(request) || new Response('No encontrado', { status: 404 });
  }
}

// Función para identificar recursos estáticos
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/);
}

// Sync en segundo plano para acciones offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Sincronización en segundo plano activada');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Esto manejaría la sincronización de datos cuando vuelva la conexión
  console.log('Sincronizando datos offline...');
  // TODO: Implementar sincronización
}

// Notificaciones push (para uso futuro)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/assets/icon/icon.png',
      badge: '/assets/icon/favicon.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});
