import rootConfig from '../../eslint.config.js';
import globals from 'globals';

export default [
  ...rootConfig,
  {
    ignores: ['build/**', 'public/assets/**', 'craco.config.cjs', 'esbuild.js', 'eslint.config.js', 'gulpfile.js'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];
