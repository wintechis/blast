import rootConfig from '../../eslint.config.js';
import globals from 'globals';

export default [
  ...rootConfig,
  {
    ignores: ['dist/**', 'test/**', 'webpack.config.cjs'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];
