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

precacheAndRoute([{"revision":"e6292c2e536c342940a5d5c61dfaa93e","url":"index.html"},{"revision":"ec4133e356070b7f5320130eee5c3966","url":"style.css"},{"revision":"8c6339c0bb04a2c896085e6d5662118e","url":"js/blast.min.js"},{"revision":"52020777ef53752290919c7d268583b4","url":"js/lib/joy-con-webhid.js"},{"revision":"0d08499080bea392086e84a4a6241905","url":"js/lib/JSInterpreter/acorn.js"},{"revision":"43823aa057376aa87648e90beafcf99b","url":"js/lib/JSInterpreter/interpreter.js"},{"revision":"a358c1660bfbe1ee70aa7cc7be0e1812","url":"js/lib/urdf/urdf-browser.js"},{"revision":"4b252c2abb0553eeb61ed061862f7540","url":"media/1x1.gif"},{"revision":"c0272d2c3f2bf1bab53e1d0445f2970b","url":"media/android-icon-144x144.png"},{"revision":"ff2172cd31c139c1b99421d5291311d3","url":"media/android-icon-192x192.png"},{"revision":"7aec985d1d377566be502ae88ce573f6","url":"media/android-icon-36x36.png"},{"revision":"36ac1015f410bdc1f0bd70407f3cf91e","url":"media/android-icon-48x48.png"},{"revision":"a49638a9f2ccc2ca5515b2b2a5cfc26e","url":"media/android-icon-72x72.png"},{"revision":"5e208082d65b92dd7141a22c32f6af5a","url":"media/android-icon-96x96.png"},{"revision":"73733a652d724f207a6a87129cbac0d4","url":"media/apple-icon-114x114.png"},{"revision":"ed0cc1d90cdc0ab05b84436c1a981ea2","url":"media/apple-icon-120x120.png"},{"revision":"c0272d2c3f2bf1bab53e1d0445f2970b","url":"media/apple-icon-144x144.png"},{"revision":"12030018fe71c14f87199b9252767a15","url":"media/apple-icon-152x152.png"},{"revision":"512638bf2844661feeb16f58db560f27","url":"media/apple-icon-180x180.png"},{"revision":"f5269eb9026bd44feb9242e2088afaaa","url":"media/apple-icon-57x57.png"},{"revision":"108a2d2618ddc7ec286c0a1e628f24c1","url":"media/apple-icon-60x60.png"},{"revision":"a49638a9f2ccc2ca5515b2b2a5cfc26e","url":"media/apple-icon-72x72.png"},{"revision":"47c851d201147c5053c8b04be0de72a1","url":"media/apple-icon-76x76.png"},{"revision":"404e0851bf9c4974db7e333b27acb27b","url":"media/apple-icon-precomposed.png"},{"revision":"404e0851bf9c4974db7e333b27acb27b","url":"media/apple-icon.png"},{"revision":"217b91bbdfcb63874a5efa3a6f361380","url":"media/click.mp3"},{"revision":"d62ab7f0a6c29b69e90793dffa4ad828","url":"media/click.ogg"},{"revision":"2ca0992269564624ad5bc0d3c58a641f","url":"media/click.wav"},{"revision":"dfe58781f5681406e35890a575765345","url":"media/delete.mp3"},{"revision":"5c3387d5bcbebd49fd7c7837c65321b4","url":"media/delete.ogg"},{"revision":"ace3b1f0042c22fafa5ddc7d4bb4b050","url":"media/delete.wav"},{"revision":"a275b1ba174f21b5688e333266375718","url":"media/disconnect.mp3"},{"revision":"f43c7533d7d9e35d40f696015a297d40","url":"media/disconnect.ogg"},{"revision":"409e7fabb73e895a642b9d3899d6ee7f","url":"media/disconnect.wav"},{"revision":"be850da552699b8705b5902cb59c6d37","url":"media/dropdown-arrow.svg"},{"revision":"6b790d85bed8973160b050c498aadb9c","url":"media/favicon-16x16.png"},{"revision":"6e413a2623305dfae19c409c347f290c","url":"media/favicon-32x32.png"},{"revision":"5e208082d65b92dd7141a22c32f6af5a","url":"media/favicon-96x96.png"},{"revision":"d8d53623d6d493646eea8555bcac90ef","url":"media/favicon.ico"},{"revision":"6b45ea439228cba3afaa23022f1246a2","url":"media/handclosed.cur"},{"revision":"b0b4b0b44ed0136f7899c8b2957ca68f","url":"media/handdelete.cur"},{"revision":"505cbb975d6102c374ec64aa92397051","url":"media/handopen.cur"},{"revision":"c2546be515eddd7320ec42f3460a3eed","url":"media/logo-512x512.png"},{"revision":"e2f2383073eec9a56403808e17ab6650","url":"media/logo.png"},{"revision":"c0272d2c3f2bf1bab53e1d0445f2970b","url":"media/ms-icon-144x144.png"},{"revision":"40e6313d1344c66c75be5a713d354fd1","url":"media/ms-icon-150x150.png"},{"revision":"a408144a3d91d6ca8ca00acca8daa436","url":"media/ms-icon-310x310.png"},{"revision":"0d3a8be70e28c10cfec32a5396de5968","url":"media/ms-icon-70x70.png"},{"revision":"580e99d437cb1c9c78fc54baea8bb168","url":"media/pilcrow.png"},{"revision":"0b9354e0d3e28a11f5a6d931ebb5a3ef","url":"media/quote0.png"},{"revision":"390e15501d3d0a01993d1da1639f2181","url":"media/quote1.png"},{"revision":"e48f1139901723da3ecbd9dab1ba2e3d","url":"media/sprites.png"},{"revision":"902985e8ce483e88a9b06a9bfa1fcce5","url":"media/sprites.svg"},{"revision":"3cce69865410d509b1fc97108924f19f","url":"mobile/app.js"},{"revision":"06bbd0797494ffdfb8adfb4db64cb098","url":"mobile/app.scss"},{"revision":"55a72750d5c9dab0e7b01fb8013ec134","url":"mobile/components.js"},{"revision":"e8571c2b5e14e209bd400663e72455f0","url":"mobile/dist/bundle.css"},{"revision":"8d6184f8aaad87754901649cf3ba6a40","url":"mobile/dist/bundle.js"},{"revision":"8e2f3dd9378ad935d894acd1f28e103b","url":"mobile/dist/index.html"},{"revision":"f746a6ac60ea3b47acf7d8f7b54a2704","url":"mobile/fast-sass-loader.js"},{"revision":"8e2f3dd9378ad935d894acd1f28e103b","url":"mobile/index.html"},{"revision":"cc8dbadda7209cb4b664c06aed58e0ac","url":"mobile/package-lock.json"},{"revision":"e5460e4efd701275c8cc92efdfb06366","url":"mobile/package.json"},{"revision":"b10a53d2a016bb30a0421380df1bf1ef","url":"mobile/README.md"},{"revision":"aebddb0d429ac286c31a1177701b2ddf","url":"mobile/style.scss"},{"revision":"0f45d38d13aad9b981782f18056f503e","url":"mobile/webpack.config.js"}]);

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
