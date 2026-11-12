// sw.js
const CACHE_NAME = 'mathhelper-v2'; // Версия изменилась на v2
const urlsToCache = [
  'index.html',
  'manifest.json',
  'logo.png'
];

self.addEventListener('install', function(event) {
  self.skipWaiting(); // Активируем новый воркер сразу, не ожидая закрытия вкладок
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Кеширование начато');
        return cache.addAll(urlsToCache);
      })
  );
});

// Очистка старых кэшей (например, mathhelper-v1)
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      return self.clients.claim(); // Берем под контроль открытые страницы
    })
  );
});

self.addEventListener('fetch', function(event) {
  // Игнорируем запросы, которые не являются GET (например, POST)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        // Если сеть ответила, клонируем ответ, обновляем кэш и возвращаем пользователю
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(function() {
        // Если сети нет (офлайн), берем из кэша
        return caches.match(event.request);
      })
  );
});