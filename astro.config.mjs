// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

const CANONICAL_SITE_URL = 'https://murielcruysmans.com';

// https://astro.build/config
export default defineConfig({
  site: CANONICAL_SITE_URL,
  adapter: netlify(),
  integrations: [],
  image: {
    // Configuration d'optimisation d'images intégrée à Astro 5
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
