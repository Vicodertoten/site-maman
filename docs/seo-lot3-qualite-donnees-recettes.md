# Lot 3 — Qualité des données recettes (P0, Semaine 2-3)

## Objectif
- Rendre les fiches recettes complètes et robustes pour SEO + moteurs génératifs.
- Supprimer les trous de données (description, alt image, slug lisible).
- Afficher des dates éditoriales visibles (`Publié le`, `Mis à jour le`).

## Changements implémentés
- `studio/schemas/recipe.ts`
  - `title` obligatoire.
  - `slug` obligatoire, validé et normalisé ASCII (`a-z0-9` + `-`), longueur max `72`.
  - `description` obligatoire (`30-220` caractères).
  - `featuredImage` obligatoire.
  - `featuredImage.alt` obligatoire (min `5` caractères).
- `src/pages/recette/[slug].astro`
  - Affichage visible des dates:
    - `Publié le <date>`
    - `Mis à jour le <date>` (si réellement différent)
  - Fallback description visible pour éviter les fiches sans texte utile.
- `src/pages/recettes.astro`, `src/pages/recettes/page/[page].astro`,
  `src/pages/api/recipes/index.ts`, `src/pages/api/recipes/premium.ts`
  - Fallback de `description` et `imageAlt` si contenu manquant.

## Script QA + correction des données existantes
- Fichier: `scripts/qa-recipes-data.mjs`
- Audit (dry-run):
  - `npm run seo:qa:recipes-data`
- Correction auto (slug + description + alt):
  - `npm run seo:fix:recipes-data`

Pré-requis correction auto:
- `SANITY_AUTH_TOKEN` avec permission `update` sur le dataset.

Le script produit un rapport JSON:
- `./.reports/seo-recipes-data-qa.json`
- `./.reports/seo-recipes-data-fix.json`

## Validation demandée
- 100% des recettes avec description utile + alt renseigné:
  - exécuter `npm run seo:qa:recipes-data -- --strict` après correction.
- Hausse CTR sur pages recettes:
  - vérifier Search Console:
    - filtre `/recette/`
    - comparer CTR sur 28 jours glissants (avant/après déploiement).
