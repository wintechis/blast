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

precacheAndRoute([{"revision":"7979ac15fe0a3c4fbda8574af6a01052","url":"index.html"},{"revision":"1e41ce1f72ab983e22c648377a587c6d","url":"style.css"},{"revision":"a1f96afbcb555d7b7b6832d54bded4e2","url":"js/lib/joy-con-webhid.js"},{"revision":"7763d1b09b84a580d5676960cd11e419","url":"js/lib/JSInterpreter/acorn.js"},{"revision":"76c740c5d6a1b754c3b6bd6af2dc0bc5","url":"js/lib/JSInterpreter/interpreter.js"},{"revision":"dba07fb7e274bf2c91d5549f9d55290d","url":"js/lib/stream-deck.js"},{"revision":"65514c4fcb08ec0c626510d186f82e04","url":"js/lib/urdf/urdf-browser.js"},{"revision":"4b252c2abb0553eeb61ed061862f7540","url":"media/1x1.gif"},{"revision":"c0272d2c3f2bf1bab53e1d0445f2970b","url":"media/android-icon-144x144.png"},{"revision":"ff2172cd31c139c1b99421d5291311d3","url":"media/android-icon-192x192.png"},{"revision":"7aec985d1d377566be502ae88ce573f6","url":"media/android-icon-36x36.png"},{"revision":"36ac1015f410bdc1f0bd70407f3cf91e","url":"media/android-icon-48x48.png"},{"revision":"a49638a9f2ccc2ca5515b2b2a5cfc26e","url":"media/android-icon-72x72.png"},{"revision":"5e208082d65b92dd7141a22c32f6af5a","url":"media/android-icon-96x96.png"},{"revision":"73733a652d724f207a6a87129cbac0d4","url":"media/apple-icon-114x114.png"},{"revision":"ed0cc1d90cdc0ab05b84436c1a981ea2","url":"media/apple-icon-120x120.png"},{"revision":"c0272d2c3f2bf1bab53e1d0445f2970b","url":"media/apple-icon-144x144.png"},{"revision":"12030018fe71c14f87199b9252767a15","url":"media/apple-icon-152x152.png"},{"revision":"512638bf2844661feeb16f58db560f27","url":"media/apple-icon-180x180.png"},{"revision":"f5269eb9026bd44feb9242e2088afaaa","url":"media/apple-icon-57x57.png"},{"revision":"108a2d2618ddc7ec286c0a1e628f24c1","url":"media/apple-icon-60x60.png"},{"revision":"a49638a9f2ccc2ca5515b2b2a5cfc26e","url":"media/apple-icon-72x72.png"},{"revision":"47c851d201147c5053c8b04be0de72a1","url":"media/apple-icon-76x76.png"},{"revision":"404e0851bf9c4974db7e333b27acb27b","url":"media/apple-icon-precomposed.png"},{"revision":"404e0851bf9c4974db7e333b27acb27b","url":"media/apple-icon.png"},{"revision":"217b91bbdfcb63874a5efa3a6f361380","url":"media/click.mp3"},{"revision":"d62ab7f0a6c29b69e90793dffa4ad828","url":"media/click.ogg"},{"revision":"2ca0992269564624ad5bc0d3c58a641f","url":"media/click.wav"},{"revision":"dfe58781f5681406e35890a575765345","url":"media/delete.mp3"},{"revision":"5c3387d5bcbebd49fd7c7837c65321b4","url":"media/delete.ogg"},{"revision":"ace3b1f0042c22fafa5ddc7d4bb4b050","url":"media/delete.wav"},{"revision":"a275b1ba174f21b5688e333266375718","url":"media/disconnect.mp3"},{"revision":"f43c7533d7d9e35d40f696015a297d40","url":"media/disconnect.ogg"},{"revision":"409e7fabb73e895a642b9d3899d6ee7f","url":"media/disconnect.wav"},{"revision":"be850da552699b8705b5902cb59c6d37","url":"media/dropdown-arrow.svg"},{"revision":"6b790d85bed8973160b050c498aadb9c","url":"media/favicon-16x16.png"},{"revision":"6e413a2623305dfae19c409c347f290c","url":"media/favicon-32x32.png"},{"revision":"5e208082d65b92dd7141a22c32f6af5a","url":"media/favicon-96x96.png"},{"revision":"d8d53623d6d493646eea8555bcac90ef","url":"media/favicon.ico"},{"revision":"6b45ea439228cba3afaa23022f1246a2","url":"media/handclosed.cur"},{"revision":"b0b4b0b44ed0136f7899c8b2957ca68f","url":"media/handdelete.cur"},{"revision":"505cbb975d6102c374ec64aa92397051","url":"media/handopen.cur"},{"revision":"c2546be515eddd7320ec42f3460a3eed","url":"media/logo-512x512.png"},{"revision":"e2f2383073eec9a56403808e17ab6650","url":"media/logo.png"},{"revision":"c0272d2c3f2bf1bab53e1d0445f2970b","url":"media/ms-icon-144x144.png"},{"revision":"40e6313d1344c66c75be5a713d354fd1","url":"media/ms-icon-150x150.png"},{"revision":"a408144a3d91d6ca8ca00acca8daa436","url":"media/ms-icon-310x310.png"},{"revision":"0d3a8be70e28c10cfec32a5396de5968","url":"media/ms-icon-70x70.png"},{"revision":"580e99d437cb1c9c78fc54baea8bb168","url":"media/pilcrow.png"},{"revision":"0b9354e0d3e28a11f5a6d931ebb5a3ef","url":"media/quote0.png"},{"revision":"390e15501d3d0a01993d1da1639f2181","url":"media/quote1.png"},{"revision":"e48f1139901723da3ecbd9dab1ba2e3d","url":"media/sprites.png"},{"revision":"911d25e52cb1d95f2d942ec5b7670d06","url":"media/sprites.svg"},{"revision":"e35b982f567d75a3e540ec467d0e339b","url":"mobile/app.js"},{"revision":"de88a22aa97c37443bd95d6053d515c3","url":"mobile/app.scss"},{"revision":"b5cc5ae5f6b45b324d6b401697999971","url":"mobile/components.js"},{"revision":"2f8ab5ad33e8cceaa3299c3e8fd05d03","url":"mobile/dist/bundle.css"},{"revision":"af8031636a21a202b879823a301da9f8","url":"mobile/dist/bundle.js"},{"revision":"5f5c2fd3f934f70d0831fa222fa8f7a5","url":"mobile/dist/index.html"},{"revision":"1755fcbc2561b2fdd39312c23af5ace5","url":"mobile/fast-sass-loader.js"},{"revision":"5f5c2fd3f934f70d0831fa222fa8f7a5","url":"mobile/index.html"},{"revision":"b8501852d29f6ed347a8e62adc4548a3","url":"mobile/package-lock.json"},{"revision":"a4e244ea5418a13608a3f8df68cbee2a","url":"mobile/package.json"},{"revision":"e3dfd91dd5c2dce5b456edbca4a465fc","url":"mobile/README.md"},{"revision":"e59d9569bda274429e511e92886fc4d0","url":"mobile/style.scss"},{"revision":"8515642227db7e4cd4becb6bb0857818","url":"mobile/webpack.config.js"}]);

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
