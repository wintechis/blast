import rootConfig from '../../eslint.config.js';
import globals from 'globals';

export default [
  ...rootConfig,
  {
    ignores: ['dist/**', 'test/**', 'webpack.config.cjs', 'esbuild.js', 'eslint.config.js'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];
