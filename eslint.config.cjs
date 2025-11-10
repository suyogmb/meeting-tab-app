const eslint = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const pluginImport = require('eslint-plugin-import');
const globals = require('globals');

/**
 * Clean global keys to remove leading/trailing whitespaces
 * e.g., fixes "AudioWorkletGlobalScope " to "AudioWorkletGlobalScope"
 */
const cleanGlobalKeys = (globalsObj) =>
  Object.entries(globalsObj).reduce((acc, [key, value]) => {
    acc[key.trim()] = value;
    return acc;
  }, {});

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  // Base configuration for all files
  {
    ignores: ['**/node_modules/**', '**/build/**', '**/dist/**', '**/*.d.ts', 'eslint.config.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...cleanGlobalKeys(globals.browser),
        ...cleanGlobalKeys(globals.node),
        jest: 'readonly',
      },
    },
    plugins: {
      import: pluginImport,
    },
    rules: {
      'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }],
      'import/order': [
        'error',
        {
          groups: [['external', 'builtin'], 'internal', ['sibling', 'parent'], 'index'],
          pathGroups: [
            {
              pattern: '@(react|react-native)',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'src/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['internal', 'react'],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'no-control-regex': 0,
    },
  },

  // Configuration for JavaScript files
  {
    files: ['**/*.{js,mjs,cjs}'],
    rules: {
      ...eslint.configs.recommended.rules,
    },
  },

  // Configuration for TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'no-unused-vars': 'off', // turn off base rule to avoid conflict
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-undef': 'off',
    },
  },
];
