/**
 * Bundles @blast/core to dist/index.cjs using Bun's built-in bundler.
 *
 * Replaces the former esbuild + @esbuild-plugins/node-resolve setup, which externalised
 * dependencies while bundling first-party code. Kept identical to packages/node/build.js so
 * the two behave the same; @blast/* is bundled rather than required, because those packages
 * are private and would not resolve for a consumer installing straight from git.
 */
const externalizeDependencies = {
  name: 'externalize-dependencies',
  setup(build) {
    // Bare specifiers only - relative and absolute paths are always bundled.
    build.onResolve({filter: /^[^./]/}, args => {
      // Entry points have no importer and must never be externalised.
      if (!args.importer) return undefined;
      if (args.path.startsWith('@blast/')) return undefined;
      return {path: args.path, external: true};
    });
  },
};

const result = await Bun.build({
  // Anchored on import.meta.dir rather than the cwd, so the script is correct however it
  // is invoked (`bun run --filter`, `bun packages/core/build.js`, an editor task, ...).
  entrypoints: [`${import.meta.dir}/src/index.ts`],
  outdir: `${import.meta.dir}/dist`,
  naming: '[name].cjs',
  // Deliberately not 'node': this bundle is consumed both by @blast/node and, through
  // webpack, by @blast/browser. Bun's node target prepends a require("node:module") interop
  // shim that webpack's web target cannot resolve. Every dependency is externalised by the
  // plugin above, so the target only affects that prelude - and the output stays neutral.
  target: 'browser',
  format: 'cjs',
  minify: true,
  plugins: [externalizeDependencies],
});

if (!result.success) {
  for (const message of result.logs) console.error(message);
  process.exit(1);
}

for (const output of result.outputs) {
  console.log(`${output.path} (${(output.size / 1024).toFixed(1)} kB)`);
}
