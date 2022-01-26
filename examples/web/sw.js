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

precacheAndRoute([{"revision":"d3993ba535e26a2744965fa909c5a8c7","url":"examples/web/blast-web-d3993ba535.min.js"},{"revision":"f4bf15c72fe7894eb6209448ae8a7822","url":"examples/web/index.html"},{"revision":"7763d1b09b84a580d5676960cd11e419","url":"examples/web/js/lib/JSInterpreter/acorn.js"},{"revision":"76c740c5d6a1b754c3b6bd6af2dc0bc5","url":"examples/web/js/lib/JSInterpreter/interpreter.js"},{"revision":"dba07fb7e274bf2c91d5549f9d55290d","url":"examples/web/js/lib/stream-deck.js"},{"revision":"65514c4fcb08ec0c626510d186f82e04","url":"examples/web/js/lib/urdf/urdf-browser.js"},{"revision":"4b252c2abb0553eeb61ed061862f7540","url":"examples/web/media/1x1.gif"},{"revision":"c0272d2c3f2bf1bab53e1d0445f2970b","url":"examples/web/media/android-icon-144x144.png"},{"revision":"ff2172cd31c139c1b99421d5291311d3","url":"examples/web/media/android-icon-192x192.png"},{"revision":"7aec985d1d377566be502ae88ce573f6","url":"examples/web/media/android-icon-36x36.png"},{"revision":"36ac1015f410bdc1f0bd70407f3cf91e","url":"examples/web/media/android-icon-48x48.png"},{"revision":"a49638a9f2ccc2ca5515b2b2a5cfc26e","url":"examples/web/media/android-icon-72x72.png"},{"revision":"5e208082d65b92dd7141a22c32f6af5a","url":"examples/web/media/android-icon-96x96.png"},{"revision":"73733a652d724f207a6a87129cbac0d4","url":"examples/web/media/apple-icon-114x114.png"},{"revision":"ed0cc1d90cdc0ab05b84436c1a981ea2","url":"examples/web/media/apple-icon-120x120.png"},{"revision":"c0272d2c3f2bf1bab53e1d0445f2970b","url":"examples/web/media/apple-icon-144x144.png"},{"revision":"12030018fe71c14f87199b9252767a15","url":"examples/web/media/apple-icon-152x152.png"},{"revision":"512638bf2844661feeb16f58db560f27","url":"examples/web/media/apple-icon-180x180.png"},{"revision":"f5269eb9026bd44feb9242e2088afaaa","url":"examples/web/media/apple-icon-57x57.png"},{"revision":"108a2d2618ddc7ec286c0a1e628f24c1","url":"examples/web/media/apple-icon-60x60.png"},{"revision":"a49638a9f2ccc2ca5515b2b2a5cfc26e","url":"examples/web/media/apple-icon-72x72.png"},{"revision":"47c851d201147c5053c8b04be0de72a1","url":"examples/web/media/apple-icon-76x76.png"},{"revision":"404e0851bf9c4974db7e333b27acb27b","url":"examples/web/media/apple-icon-precomposed.png"},{"revision":"404e0851bf9c4974db7e333b27acb27b","url":"examples/web/media/apple-icon.png"},{"revision":"217b91bbdfcb63874a5efa3a6f361380","url":"examples/web/media/click.mp3"},{"revision":"d62ab7f0a6c29b69e90793dffa4ad828","url":"examples/web/media/click.ogg"},{"revision":"2ca0992269564624ad5bc0d3c58a641f","url":"examples/web/media/click.wav"},{"revision":"dfe58781f5681406e35890a575765345","url":"examples/web/media/delete.mp3"},{"revision":"5c3387d5bcbebd49fd7c7837c65321b4","url":"examples/web/media/delete.ogg"},{"revision":"ace3b1f0042c22fafa5ddc7d4bb4b050","url":"examples/web/media/delete.wav"},{"revision":"a275b1ba174f21b5688e333266375718","url":"examples/web/media/disconnect.mp3"},{"revision":"f43c7533d7d9e35d40f696015a297d40","url":"examples/web/media/disconnect.ogg"},{"revision":"409e7fabb73e895a642b9d3899d6ee7f","url":"examples/web/media/disconnect.wav"},{"revision":"be850da552699b8705b5902cb59c6d37","url":"examples/web/media/dropdown-arrow.svg"},{"revision":"6b790d85bed8973160b050c498aadb9c","url":"examples/web/media/favicon-16x16.png"},{"revision":"6e413a2623305dfae19c409c347f290c","url":"examples/web/media/favicon-32x32.png"},{"revision":"5e208082d65b92dd7141a22c32f6af5a","url":"examples/web/media/favicon-96x96.png"},{"revision":"d8d53623d6d493646eea8555bcac90ef","url":"examples/web/media/favicon.ico"},{"revision":"6b45ea439228cba3afaa23022f1246a2","url":"examples/web/media/handclosed.cur"},{"revision":"b0b4b0b44ed0136f7899c8b2957ca68f","url":"examples/web/media/handdelete.cur"},{"revision":"505cbb975d6102c374ec64aa92397051","url":"examples/web/media/handopen.cur"},{"revision":"c2546be515eddd7320ec42f3460a3eed","url":"examples/web/media/logo-512x512.png"},{"revision":"e2f2383073eec9a56403808e17ab6650","url":"examples/web/media/logo.png"},{"revision":"c0272d2c3f2bf1bab53e1d0445f2970b","url":"examples/web/media/ms-icon-144x144.png"},{"revision":"40e6313d1344c66c75be5a713d354fd1","url":"examples/web/media/ms-icon-150x150.png"},{"revision":"a408144a3d91d6ca8ca00acca8daa436","url":"examples/web/media/ms-icon-310x310.png"},{"revision":"0d3a8be70e28c10cfec32a5396de5968","url":"examples/web/media/ms-icon-70x70.png"},{"revision":"580e99d437cb1c9c78fc54baea8bb168","url":"examples/web/media/pilcrow.png"},{"revision":"0b9354e0d3e28a11f5a6d931ebb5a3ef","url":"examples/web/media/quote0.png"},{"revision":"390e15501d3d0a01993d1da1639f2181","url":"examples/web/media/quote1.png"},{"revision":"e48f1139901723da3ecbd9dab1ba2e3d","url":"examples/web/media/sprites.png"},{"revision":"911d25e52cb1d95f2d942ec5b7670d06","url":"examples/web/media/sprites.svg"},{"revision":"e35b982f567d75a3e540ec467d0e339b","url":"examples/web/mobile/app.js"},{"revision":"de88a22aa97c37443bd95d6053d515c3","url":"examples/web/mobile/app.scss"},{"revision":"d3993ba535e26a2744965fa909c5a8c7","url":"examples/web/mobile/blast-web-d3993ba535.min.js"},{"revision":"b5cc5ae5f6b45b324d6b401697999971","url":"examples/web/mobile/components.js"},{"revision":"2f8ab5ad33e8cceaa3299c3e8fd05d03","url":"examples/web/mobile/dist/bundle.css"},{"revision":"af8031636a21a202b879823a301da9f8","url":"examples/web/mobile/dist/bundle.js"},{"revision":"5f5c2fd3f934f70d0831fa222fa8f7a5","url":"examples/web/mobile/dist/index.html"},{"revision":"1755fcbc2561b2fdd39312c23af5ace5","url":"examples/web/mobile/fast-sass-loader.js"},{"revision":"5f305c44ae8fdfbe266ad149b559cdd4","url":"examples/web/mobile/index.html"},{"revision":"b8501852d29f6ed347a8e62adc4548a3","url":"examples/web/mobile/package-lock.json"},{"revision":"a4e244ea5418a13608a3f8df68cbee2a","url":"examples/web/mobile/package.json"},{"revision":"e3dfd91dd5c2dce5b456edbca4a465fc","url":"examples/web/mobile/README.md"},{"revision":"edbf8bb59a65b86204722debcb29f57c","url":"examples/web/mobile/src/index.html"},{"revision":"e59d9569bda274429e511e92886fc4d0","url":"examples/web/mobile/style.scss"},{"revision":"8515642227db7e4cd4becb6bb0857818","url":"examples/web/mobile/webpack.config.js"},{"revision":"41def91923c9bee4287f60e8e00a7022","url":"examples/web/prerequisites.html"},{"revision":"7066d551f1cf0f25d6ddb3baad23b904","url":"examples/web/samples/eval.xml"},{"revision":"630023eaf84f4edbd95aabad843167f0","url":"examples/web/samples/events.xml"},{"revision":"7fc6158ac43495d383e1aa2125d38c09","url":"examples/web/samples/everyMinutes.xml"},{"revision":"c0838688da0bf4d20a48b2280543ad3e","url":"examples/web/samples/gamble.xml"},{"revision":"214eae3d397a93ac7ad718784fb585d0","url":"examples/web/samples/helloWorld.xml"},{"revision":"72fdd446f6885185b976524f9e64bd93","url":"examples/web/samples/playAudio.xml"},{"revision":"9a58168db26af12c7137e571202a201e","url":"examples/web/samples/README.md"},{"revision":"68148240e478978c90ad82e4b09af284","url":"examples/web/samples/requests.xml"},{"revision":"0f1cc6b4bfc8760d307ff6208b73e2a9","url":"examples/web/samples/rgbLights.xml"},{"revision":"523e85871b53b8a67cdecbd4fdaa7d68","url":"examples/web/samples/ruuviProperties.xml"},{"revision":"09920e317b163f06353cfa0fae693954","url":"examples/web/samples/signalStrength.xml"},{"revision":"5a3d7f88742a1db383b475cf9234d5fc","url":"examples/web/samples/sounds.xml"},{"revision":"5c2ea3cb0f99db86c617c5fc78fd1681","url":"examples/web/samples/streamdeck.xml"},{"revision":"0c6b4ad586e0c11e8a7cdb9ed2b0298d","url":"examples/web/samples/toggle.xml"},{"revision":"57296a74b78ecbbf5fdb22de0140c028","url":"examples/web/samples/useCases/anti-theft-alarm.xml"},{"revision":"ce2f22989cf3ea3e5fc779b3b1454189","url":"examples/web/samples/useCases/timer.xml"},{"revision":"2cbc829505809996227b48c77e8afbfa","url":"examples/web/samples/webSpeech.xml"},{"revision":"6b2a3b27daa1018ab7c43a816c275ac4","url":"examples/web/site.webmanifest"},{"revision":"4891cfaa67a01f4ff545e3cfefa46923","url":"examples/web/src/index.html"},{"revision":"5ac6d58b97b484240ff57841b1bc674f","url":"examples/web/src/index.js"},{"revision":"447c272d0d8b4d5e7f40a50fc4a4abc2","url":"examples/web/src/web.js"},{"revision":"1e41ce1f72ab983e22c648377a587c6d","url":"examples/web/style.css"}]);

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
