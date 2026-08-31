/**
 * Bundles @blast/browser to dist/blast.browser.js using Bun's built-in bundler.
 *
 * Replaces a webpack 5 setup (webpack, webpack-cli, ts-loader, node-polyfill-webpack-plugin)
 * that existed only to do what `target: 'browser'` gives us for free here: transpile the
 * TypeScript sources and substitute browser polyfills for the `node:` builtins @blast/core
 * pulls in (node:stream in particular, via the bluetooth/HID bindings).
 *
 * Unlike packages/core/build.js and packages/node/build.js, this bundle deliberately does
 * NOT externalise its dependencies and carries no `externalizeDependencies` plugin. It is
 * loaded standalone in the browser - the demo copies it to public/assets/blast/ and the
 * code its Blockly blocks generate reaches it through a bare `await import(...)` of that
 * file - so there is no module resolver on the other side to satisfy a bare specifier.
 * Everything it needs has to be inside the file.
 */
const result = await Bun.build({
  // Anchored on import.meta.dir rather than the cwd, so the script is correct however it
  // is invoked (`bun run --filter`, `bun packages/browser/build.js`, an editor task, ...).
  entrypoints: [`${import.meta.dir}/src/index.ts`],
  outdir: `${import.meta.dir}/dist`,
  // The entry is src/index.ts, but consumers import assets/blast/blast.browser.js by that
  // exact name, so pin the output filename instead of deriving it from the entry.
  naming: 'blast.browser.js',
  // Browser target both restricts the runtime API surface and supplies the Node builtin
  // polyfills the webpack config used node-polyfill-webpack-plugin for. It resolves the
  // `node:` protocol directly, so the NormalModuleReplacementPlugin that used to strip
  // that prefix for webpack's web target is no longer needed either.
  target: 'browser',
  // ESM, matching webpack's output.module / experiments.outputModule. The demo loads this
  // with a dynamic import(), which requires a real module.
  format: 'esm',
  // Left unminified, as the webpack build was (mode 'development', minimize false).
  // Dropping webpack already shrinks this file roughly fourfold - the old output was
  // mostly an inline-cheap-module-source-map - and this is a tracked artifact that gets
  // copied into the demo, so size is not the constraint it would be for a served asset.
  // Staying unminified keeps stack traces out of generated block code readable without a
  // source map, and avoids betting that nothing in node-wot or rxjs depends on a
  // function or class name surviving.
  minify: false,
});

if (!result.success) {
  for (const message of result.logs) console.error(message);
  process.exit(1);
}

for (const output of result.outputs) {
  console.log(`${output.path} (${(output.size / 1024).toFixed(1)} kB)`);
}
