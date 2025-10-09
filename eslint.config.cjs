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
  // Base configuration
  {
    ignores: ['**/node_modules/**', '**/build/**', '**/dist/**', '**/*.d.ts', 'eslint.config.cjs'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser, // ✅ Add TypeScript parser
      parserOptions: {
        ecmaFeatures: { jsx: true }, // ✅ Enables JSX support
        project: './tsconfig.json', // ✅ Ensures TypeScript rules are applied
      },
      globals: {
        ...cleanGlobalKeys(globals.browser),
        ...cleanGlobalKeys(globals.node),
        jest: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: pluginImport,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.recommended.rules, // ✅ Apply recommended TypeScript rules
      'no-unused-vars': 'off', // ⛔ turn off base rule to avoid conflict
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-undef': 'off', // ✅ Avoids unnecessary no-undef errors
      'jest/no-disabled-tests': 0,
      'global-require': 0,
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
];
