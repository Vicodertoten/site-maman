import type { APIRoute } from 'astro';
import { sanityClient } from '../lib/sanity';

export const prerender = false;

const staticPaths = [
  '/',
  '/about',
  '/auteur',
  '/contact',
  '/recettes',
  '/thermomix',
  '/cours-cuisine-wavre',
  '/privatisation-entreprise-wavre'
];

type RecipeSitemapEntry = {
  slug: string;
  _updatedAt?: string;
  publishedAt?: string;
};

const recipeSitemapQuery = `*[_type == "recipe" && defined(slug.current) && isPremium != true]{
  "slug": slug.current,
  _updatedAt,
  publishedAt
}`;

const toUrl = (base: URL, path: string) => new URL(path, base).toString();

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site ?? new URL(import.meta.env.PUBLIC_SITE_URL || 'https://gastronomade.netlify.app');

  let recipes: RecipeSitemapEntry[] = [];
  try {
    recipes = await sanityClient.fetch<RecipeSitemapEntry[]>(recipeSitemapQuery);
  } catch {
    recipes = [];
  }

  const staticUrls = staticPaths.map((path) => ({
    loc: toUrl(baseUrl, path),
  }));

  const recipeUrls = recipes
    .filter((recipe) => recipe.slug)
    .map((recipe) => {
      const lastmod = recipe._updatedAt || recipe.publishedAt;
      return {
        loc: toUrl(baseUrl, `/recette/${encodeURIComponent(recipe.slug)}`),
        lastmod: lastmod ? new Date(lastmod).toISOString() : undefined,
      };
    });

  const urls = [...staticUrls, ...recipeUrls];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((entry) => {
    const lastmodTag = entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : '';
    return `  <url><loc>${entry.loc}</loc>${lastmodTag}</url>`;
  })
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
