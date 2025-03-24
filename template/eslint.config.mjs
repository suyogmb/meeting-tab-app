import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import pluginImport from 'eslint-plugin-import';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser, // ✅ Add TypeScript parser
      parserOptions: {
        ecmaFeatures: {jsx: true}, // ✅ Enables JSX support
        project: './tsconfig.json', // ✅ Ensures TypeScript rules are applied
      },
      globals: {
        ...globals.browser,
        ...globals.node, // ✅ Fixes 'require', 'module', 'process', '__dirname' issues
        jest: 'readonly', // ✅ Fixes 'jest' is not defined
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: pluginImport,
    },
    rules: {
      ...tseslint.configs.recommended.rules, // ✅ Apply recommended TypeScript rules
      'no-unused-vars': 'error',
      'no-undef': 'off', // ✅ Avoids unnecessary no-undef errors
      'jest/no-disabled-tests': 0,
      'global-require': 0,
      'sort-imports': ['error', {ignoreCase: true, ignoreDeclarationSort: true}],
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
