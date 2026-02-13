# Lot 1 - Fondations indexation/crawl (Semaine 1)

Objectif: site proprement crawlable, indexable, et monitoré en continu.

## 1) QA sitemap avant chaque déploiement

Commande stricte (production):

```bash
npm run seo:qa:sitemap
```

Ce contrôle vérifie:
- statuts HTTP des URLs du sitemap (3xx bloquant en strict, 4xx/5xx bloquant)
- doublons exacts et doublons normalisés (slash final, etc.)
- mismatch host/protocole (doit être `https://murielcruysmans.com`)
- pages indexables avec `noindex` (interdit)
- noindex requis sur `/404` et `/acces` (obligatoire)
- audit source: seules les routes autorisées peuvent contenir `noindex`

Rapport JSON:
- `./.reports/seo-sitemap-qa.json`

Mode local (sans HTTP, si besoin):

```bash
npm run seo:qa:sitemap:local
```

## 2) Propriété canonique Google Search Console

1. Ouvrir: `https://search.google.com/search-console`
2. Ajouter la propriété **URL prefix**: `https://murielcruysmans.com/`
3. Vérifier la propriété via DNS (recommandé) ou fichier HTML.
4. Ne pas travailler la propriété `www` comme principale.
5. Dans Paramètres > Utilisateurs, vérifier les accès admin.

## 3) Propriété canonique Bing Webmaster Tools

1. Ouvrir: `https://www.bing.com/webmasters`
2. Ajouter le site: `https://murielcruysmans.com/`
3. Vérifier via DNS/Meta/File.
4. Soumettre le sitemap canonique: `https://murielcruysmans.com/sitemap.xml`

## 4) Soumission sitemap + réindexation pages stratégiques

### Sitemap
- GSC > Sitemaps > Ajouter `https://murielcruysmans.com/sitemap.xml`
- Bing > Sitemaps > Ajouter le même sitemap

### Réindexation prioritaire (URL Inspection)
- `https://murielcruysmans.com/`
- `https://murielcruysmans.com/about/`
- `https://murielcruysmans.com/recettes/`
- `https://murielcruysmans.com/cours-cuisine-wavre/`
- `https://murielcruysmans.com/privatisation-entreprise-wavre/`
- `https://murielcruysmans.com/contact/`
- 5-10 recettes prioritaires (trafic/conversion)

## 5) Vérification noindex: uniquement `/404` et `/acces`

La vérification est automatisée par `seo:qa:sitemap`.

Règle cible:
- `/404` => `noindex, nofollow`
- `/acces` => `noindex, nofollow`
- aucune URL du sitemap en `noindex`

## 6) Suivi hebdomadaire des erreurs d'exploration

Cadence:
- tous les lundis matin (workflow `SEO Health Weekly`)
- revue manuelle GSC/Bing après exécution

Checklist hebdo:
1. GSC > Indexation > Pages:
   - erreurs critiques = 0
   - tendance "Pages valides" en hausse
   - tendance "Exclues parasites" en baisse
2. GSC > Sitemaps:
   - sitemap traité sans erreurs
   - nombre d'URLs découvertes cohérent
3. Bing > Index:
   - erreurs de crawl en baisse
   - pages valides en hausse
4. Corriger dans la semaine:
   - 404 inattendues
   - redirections dans sitemap
   - noindex accidentel

## Critères de validation Lot 1

- Couverture GSC sans anomalies critiques.
- Ratio pages valides en hausse.
- Pages exclues parasites en baisse.
- QA sitemap stricte qui passe avant déploiement.
