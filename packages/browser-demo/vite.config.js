import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// Replaces react-scripts 5, whose code has been frozen since 2022 and which was the last
// thing in this repo pinning webpack and the old babel toolchain.
export default defineConfig({
  // React Fast Refresh in dev, and the automatic JSX runtime matching the "jsx": "react-jsx"
  // already set in tsconfig.json.
  plugins: [react()],

  // Formerly `"homepage": "."` in package.json. The demo is deployed under a subpath
  // (public_html/testing/blast/), so every emitted asset URL has to be relative to the
  // document rather than to the server root.
  base: './',

  // webpack 5 injects a `global` shim into browser bundles; Vite does not, and without
  // this jsonld.js - reached through urdf - dies on `global.JsonLdProcessor === undefined`
  // while it is being initialised, which happens during module evaluation and so takes the
  // whole app down before React mounts. Rolldown's define replaces the bare identifier
  // only, leaving property accesses and strings that happen to spell "global" alone.
  define: {
    global: 'globalThis',
  },

  server: {
    // Both READMEs tell the reader to open https://localhost:3000; Vite would otherwise
    // pick 5173. strictPort makes a busy port an error rather than a silent renumber,
    // which would send the reader to a page that is not there.
    port: 3000,
    strictPort: true,
  },

  build: {
    // Not Vite's default "dist": .github/workflows/main.yml uploads
    // packages/browser-demo/build/ and the root `deploy` script runs
    // `gh-pages -d packages/browser-demo/build`.
    outDir: 'build',
    // create-react-app emitted production source maps and nothing here needs them gone.
    sourcemap: true,
  },
});
