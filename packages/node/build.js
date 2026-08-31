/**
 * Bundles @blast/node to dist/index.cjs using Bun's built-in bundler.
 *
 * Replaces the former esbuild + @esbuild-plugins/node-resolve setup. That plugin externalised
 * anything whose *resolved* path lived under node_modules, which meant real dependencies were
 * left as require() calls while the @blast/core workspace package - whose resolved path is
 * packages/core, not node_modules - got inlined into the bundle.
 *
 * That distinction matters: @blast/core is private and never published, so an external
 * require('@blast/core') would break consumers who install @blast/node straight from git.
 * Bun's `packages: 'external'` would externalise it, so this plugin reproduces the old rule:
 * externalise bare specifiers, but let @blast/* fall through to be bundled.
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
  // is invoked (`bun run --filter`, `bun packages/node/build.js`, an editor task, ...).
  entrypoints: [`${import.meta.dir}/src/index.ts`],
  outdir: `${import.meta.dir}/dist`,
  naming: '[name].cjs',
  target: 'node',
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
