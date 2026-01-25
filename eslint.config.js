import js from '@eslint/js';
import astro from 'eslint-plugin-astro';

export default [
  js.configs.recommended,
  ...astro.configs.recommended,
  {
    rules: {
      'astro/no-unused-css-selector': 'off',
      'astro/prefer-class-list-directive': 'off',
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '.astro/', '.netlify/', 'studio/'],
  },
];
