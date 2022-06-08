importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

const registerRoute = workbox.routing.registerRoute;
const StaleWhileRevalidate = workbox.strategies.StaleWhileRevalidate;
const CacheFirst = workbox.strategies.CacheFirst;

// Used for filtering matches based on status code, header, or both
const CacheableResponsePlugin = workbox.cacheableResponse.CacheableResponsePlugin;
// Used to limit entries in cache, remove entries after a certain period of time
const ExpirationPlugin = workbox.expiration.ExpirationPlugin;

const precacheAndRoute = workbox.precaching.precacheAndRoute;

// Register routes for scripts from the CDN.
const cdns = [
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/blockly/5.20210325.1/blockly_compressed.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/blockly/5.20210325.1/msg/en.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/blockly/5.20210325.1/blocks_compressed.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/blockly/5.20210325.1/javascript_compressed.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/svgxuse/1.2.6/svgxuse.min.js',
];
registerRoute(
    ({url}) => cdns.includes(url),
    new CacheFirst(),
);

precacheAndRoute([{"revision":"c818dccbf511504d84d0fefdb0dc2873","url":"src/blocks.js"},{"revision":"f2d5c4af38f20cb469155a2de32c857b","url":"src/generators.js"},{"revision":"4dfdc478b1e7d4c44ea32a4d4a13b85a","url":"src/index.js"},{"revision":"3e07a041289aa1782c5f26fe22a87dcc","url":"src/screenshot.js"},{"revision":"0424889436fddd350698ceb839ff3eef","url":"src/web.js"}]);

// Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
registerRoute(
    // Check to see if the request's destination is style for stylesheets,
    // script for JavaScript, or worker for web worker
    ({request}) =>
      request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
    // Use a Stale While Revalidate caching strategy
    new StaleWhileRevalidate({
    // Put all cached files in a cache named 'assets'
      cacheName: 'assets',
      plugins: [
      // Ensure that only requests that result in a 200 status are cached
        new CacheableResponsePlugin({
          statuses: [200],
        }),
      ],
    }),
);

// Cache images with a Cache First strategy
registerRoute(
    // Check to see if the request's destination is style for an image
    ({request}) => request.destination === 'image',
    // Use a Cache First caching strategy
    new CacheFirst({
    // Put all cached files in a cache named 'images'
      cacheName: 'images',
      plugins: [
      // Ensure that only requests that result in a 200 status are cached
        new CacheableResponsePlugin({
          statuses: [200],
        }),
        // Don't cache more than 50 items, and expire them after 30 days
        new ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
        }),
      ],
    }),
);
