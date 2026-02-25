// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

const CANONICAL_SITE_URL = 'https://murielcruysmans.com';

// https://astro.build/config
export default defineConfig({
  site: CANONICAL_SITE_URL,
  adapter: netlify(),
  integrations: [sitemap()],
  redirects: {
    '/easy-blog': '/recettes/',
    '/copie-de-accueil': '/thermomix/',
    '/gastronomade': '/',
    '/charte': '/auteur/',
  },
  image: {
    // Configuration d'optimisation d'images intégrée à Astro 5
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
