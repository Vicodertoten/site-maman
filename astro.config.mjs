// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://gastronomade.netlify.app',
  adapter: netlify(),
  integrations: [sitemap()],
  image: {
    // Configuration d'optimisation d'images intégrée à Astro 5
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
