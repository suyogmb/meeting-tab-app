import globals from 'globals';
import tseslint from 'typescript-eslint';
// import pluginReact from 'eslint-plugin-react';
import pluginImport from 'eslint-plugin-import';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}']},
  {languageOptions: {globals: globals.browser}},
  {plugins: {'@typescript-eslint': tseslint, import: pluginImport}},
  {
    env: {
      node: true, // Enable Node.js global variables and scoping
    },
  },
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
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
