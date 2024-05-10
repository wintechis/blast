import rootConfig from '../../eslint.config.js';

export default [
  ...rootConfig,
  {
    ignores: ['dist/**', 'test/**', 'eslint.config.js', 'esbuild.js', 'jest.config.js'],
  },
];
