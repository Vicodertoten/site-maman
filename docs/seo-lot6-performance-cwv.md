# Lot 6 — Performance & Core Web Vitals (P1, Semaine 5–7)

## Objectif

Sécuriser le ranking mobile et l'expérience utilisateur en pilotant les métriques terrain:

- `LCP < 2.5s`
- `INP < 200ms`
- `CLS < 0.1`

## Ce qui est implémenté

### 1) Baseline CWV réelle (RUM + CrUX)

- RUM client (terrain réel) injecté globalement via `MainLayout`:
  - `src/scripts/cwv-rum.js`
  - `src/layouts/MainLayout.astro`
- Endpoint de collecte:
  - `src/pages/api/rum/web-vitals.ts`
- Baseline CrUX automatisable:
  - `scripts/cwv-baseline.mjs`
  - `npm run perf:cwv:baseline`

### 2) Réduction du poids HTML de `/recettes`

- Externalisation du gros script inline de page:
  - `src/scripts/recipes-page.js`
  - `src/pages/recettes.astro`
- Externalisation du gros script inline de filtres:
  - `src/scripts/recipe-filters.js`
  - `src/components/RecipeFilters.astro`
- Réduction du JSON inline initial (`/recettes`):
  - suppression du champ `ingredientText` du payload initial SSR

### 3) Limitation scripts inline / code splitting

- Les scripts métier lourds sont déplacés en modules ES (bundlés + cachables):
  - `recipes-page.js`
  - `recipe-filters.js`

### 4) Optimisation LCP image

- Préload image LCP possible au niveau layout:
  - prop `preloadImage` dans `MainLayout`
- Première carte recette chargée en priorité:
  - `imageLoading="eager"`
  - `imageFetchPriority="high"`
  - appliqué sur:
    - `src/pages/recettes.astro`
    - `src/pages/recettes/page/[page].astro`

## Configuration

### Variables d'environnement (optionnel)

- `PUBLIC_CWV_SAMPLE_RATE` (0..1): taux d'échantillonnage RUM (par défaut `1`)
- `CRUX_API_KEY`: clé API CrUX pour `perf:cwv:baseline`

## Vérification opérationnelle

### A. Build

```bash
npm run build
```

### B. Baseline CrUX mobile

```bash
CRUX_API_KEY=... npm run perf:cwv:baseline
```

Rapport généré: `./.reports/cwv-baseline.json`

### C. Vérification RUM

- Ouvrir le site sur mobile réel.
- Vérifier dans les logs Netlify (ou table Supabase `web_vitals_events`) l'arrivée des événements `LCP`, `INP`, `CLS`.

### D. GSC / CrUX / terrain

- GSC > Signaux Web essentiels: surveiller les URLs "Bonnes" mobile.
- CrUX: comparer `p75` hebdo sur `/`, `/recettes/`, pages business.
- RUM: suivre distribution des métriques par page et type de navigation.

## Schéma table Supabase (optionnel)

```sql
create table if not exists web_vitals_events (
  id bigserial primary key,
  metric_id text,
  metric_name text not null,
  metric_value double precision not null,
  rating text,
  path text,
  navigation_type text,
  measured_at timestamptz,
  user_agent text,
  ip text,
  meta jsonb,
  created_at timestamptz default now()
);

create index if not exists web_vitals_events_metric_name_idx on web_vitals_events(metric_name);
create index if not exists web_vitals_events_path_idx on web_vitals_events(path);
create index if not exists web_vitals_events_measured_at_idx on web_vitals_events(measured_at);
```
