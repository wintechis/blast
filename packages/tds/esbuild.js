import { build } from 'esbuild'

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  format: 'cjs',
  platform: "node",
  outfile: 'dist/index.cjs',
})
