import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.astro/**',
      '**/.netlify/**',
      '**/.sanity/**',
      'archive/**',
      'images/**',
      'recettes/**',
      'tmp/**',
      '.reports/**',
      'public/lib/**',
    ],
  },
  js.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,tsx,astro}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    files: ['src/**/*.{astro,js,mjs,cjs}', 'src/scripts/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    files: [
      'scripts/**/*.{js,mjs,cjs,ts,mts,cts}',
      'netlify/functions/**/*.{js,ts}',
      'studio/**/*.{js,mjs,cjs,ts,mts,cts,tsx}',
      '*.config.{js,mjs,cjs,ts}',
      'eslint.config.js',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    rules: {
      'astro/no-unused-css-selector': 'off',
      'astro/prefer-class-list-directive': 'off',
      'no-empty': 'warn',
      'no-useless-escape': 'warn',
    },
  },
  {
    files: ['**/*.astro'],
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
];
