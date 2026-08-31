import rootConfig from '../../eslint.config.js';
import globals from 'globals';

export default [
  ...rootConfig,
  {
    ignores: [
      'build/**',
      'public/assets/**',
      'eslint.config.js',
      'update-version.js',
      'vite.config.js',
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];
