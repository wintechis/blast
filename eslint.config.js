import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  prettier,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
        'block-scoped-var': 'error',
        camelcase: ['error', {
          properties: 'never',
          allow: ['^opt_', '^_opt_', '^testOnly_'],
        }],
        'comma-dangle': ['error', {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'ignore',
        }],
        curly: ['error'],
        'eol-last': 'error',
        eqeqeq: 'error',
        'keyword-spacing': ['error'],
        'linebreak-style': ['error', 'unix'],
        'max-len': [
          'error',
          {
              code: 120,
              tabWidth: 4,
              ignoreStrings: true,
              ignoreRegExpLiterals: true,
              ignoreUrls: true,
          },
        ],
        'no-restricted-properties': [
          'error',
          {
            object: 'describe',
            property: 'only',
          },
          {
            object: 'it',
            property: 'only',
          }],
        'no-trailing-spaces': 'error',
        'no-unused-vars': [
          'warn',
          {
              args: 'after-used',
              // Ignore vars starting with an underscore.
              varsIgnorePattern: '^_',
              // Ignore arguments starting with an underscore.
              argsIgnorePattern: '^_',
          },
        ],
        'no-var': 'error',
        'prefer-const': 'error',
        'prefer-arrow-callback': 'error',
        quotes: ['warn', 'single', { 'avoidEscape': true }],
        semi: ['error', 'always'],
        'space-infix-ops': ['error'],
        strict: ['error'],
      },
  },
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './packages/*/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      "@typescript-eslint/no-unsafe-function-type": "warn",
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-warning-comments': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
            args: 'after-used',
            // Ignore vars starting with an underscore.
            varsIgnorePattern: '^_',
            // Ignore arguments starting with an underscore.
            argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-types': 'off',
      'node/no-missing-import': 'off',
      'node/no-empty-function': 'off',
      'node/no-unsupported-features/es-syntax': 'off',
      'node/no-missing-require': 'off',
      'node/shebang': 'off',
      'no-dupe-class-members': 'off',
      'require-atomic-updates': 'off',
    },
  },
];
