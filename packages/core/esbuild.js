import {NodeResolvePlugin} from '@esbuild-plugins/node-resolve'
import { build } from 'esbuild'

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  format: 'cjs',
  platform: "node",
  outfile: 'dist/index.cjs',
  plugins: [
    NodeResolvePlugin({
        extensions: ['.ts', '.js'],
        onResolved: (resolved) => {
            if (resolved.includes('node_modules')) {
                return {
                    external: true,
                }
            }
            return resolved
        },
    }),
],
})
