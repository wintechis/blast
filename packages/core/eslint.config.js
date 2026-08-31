import rootConfig from '../../eslint.config.js';

export default [
  ...rootConfig,
  {
    ignores: [
      'dist/**',
      'test/**',
      'eslint.config.js',
      'build.js',
      // Vendored from @node-wot/core; kept in upstream formatting so it stays diffable
      // against upstream when re-syncing. See the header of the file itself.
      'src/codecs/OctetstreamCodec.ts',
    ],
  },
];
