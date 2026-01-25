# Guide de Développement - Gastronomade

## Vue d'ensemble

Ce guide décrit les conventions et bonnes pratiques pour développer le site web Gastronomade, un site Astro + Tailwind CSS pour Muriel Cruysmans.

## 🏗️ Architecture

### Technologies

- **Framework**: Astro 5.x
- **Styling**: Tailwind CSS 4.x
- **CMS**: Sanity
- **Déploiement**: Netlify

### Structure des dossiers

```
src/
├── components/     # Composants réutilisables (.astro)
├── layouts/        # Layouts principaux
├── lib/           # Utilitaires et configurations
├── pages/         # Pages routées
└── styles/        # Styles globaux

studio/            # Interface d'administration Sanity
public/            # Assets statiques
```

## 🎨 Design System

### Palette de couleurs (MV - Manger Vrai)

```css
--mv-cream: #fbf8f1; /* Fond doux et organique */
--mv-forest: #2a3d34; /* Texte principal, autorité */
--mv-leaf: #4a7c59; /* Actions positives, santé */
--mv-coral: #e85d3a; /* Alertes, prix */
--mv-plum: #5a2a3d; /* Sections intimes */
```

### Typographie

- **Titres**: Lora (serif) - 600 weight
- **Corps**: Inter (sans-serif) - 400/500/600 weights
- **Tailles**: Mobile-first avec breakpoints sm/md/lg

### Composants de base

- `.mv-card`: Cartes avec ombre et bordure
- `.mv-pill`: Boutons arrondis
- `.mv-btn-primary/.mv-btn-secondary`: Styles de boutons
- Animations: `fade-in-up` pour les entrées

## 📝 Conventions de code

### Nommage des fichiers

- **Composants**: PascalCase (`NewsletterSignup.astro`)
- **Pages**: kebab-case (`recette/[slug].astro`)
- **Utilitaires**: camelCase (`getEmbedUrl.ts`)

### Imports

```typescript
// Bon
import MainLayout from '../layouts/MainLayout.astro';
import { getEmbedUrl } from '../lib/utils';

// Éviter
import { getEmbedUrl } from '../../lib/utils';
```

### Structure des composants Astro

```astro
---
// Frontmatter: imports, logique, données
import { sanityClient } from '../lib/sanity';
const data = await sanityClient.fetch(query);
---

<!-- Template: HTML + directives Astro -->
<div class="component">
  <h2>{data.title}</h2>
</div>

<!-- Scripts: interactions côté client -->
<script>
  // Logique JavaScript
</script>
```

## 🔧 Bonnes pratiques

### Performance

- **Lazy loading**: Utiliser `loading="lazy"` pour les images
- **Optimisation images**: Laisser Astro gérer automatiquement
- **Bundle splitting**: Astro gère automatiquement
- **CSS**: Utiliser Tailwind pour éviter le CSS custom

### Accessibilité

- **ARIA labels**: Ajouter `aria-label` aux boutons icones
- **Focus**: Styles de focus visibles (`focus:ring-2`)
- **Navigation**: Menu mobile avec `aria-expanded`
- **Images**: Attributs `alt` descriptifs

### Responsive Design

```html
<!-- Mobile-first approach -->
<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Titre responsive</h1>

<!-- Espacement adaptatif -->
<div class="p-4 sm:p-6 lg:p-8">Contenu</div>
```

### SEO

- **Titres uniques**: Chaque page a un `title` distinct
- **Meta descriptions**: Dans MainLayout ou page spécifique
- **Structure sémantique**: Utiliser `h1-h6`, `section`, `article`

## 🚀 Développement

### Installation

```bash
npm install
npm run dev          # Développement
npm run build        # Production
npm run studio       # Interface Sanity
```

### Variables d'environnement

Créer un fichier `.env`:

```env
SANITY_PROJECT_ID=votre_project_id
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01
```

### Sanity CMS

- **Schemas**: Définis dans `studio/schemas/`
- **Queries**: Centralisées dans `src/lib/sanity.ts`
- **Types**: Générés automatiquement via TypeScript

### Newsletter Subscriptions

Les inscriptions à la newsletter utilisent **Netlify Forms** avec un **modal de confirmation** :

- **Netlify Dashboard** : Données accessibles dans Forms > Active forms
- **Modal de succès** : Popup élégant s'affichant sur la même page
- **Export CSV** : Téléchargeable directement depuis Netlify
- **Protection anti-spam** : Filtrage automatique inclus

#### Outil Newsletter dans Sanity Studio

Un outil dédié permet de gérer les abonnés directement dans le Studio :

- **Visualisation** : Liste complète des abonnés avec dates d'inscription
- **Export CSV** : Téléchargement direct depuis l'interface
- **Statistiques** : Nombre total d'abonnés
- **Actualisation** : Bouton pour rafraîchir les données

**Accès** : Menu latéral > Newsletter > Gestion des abonnés

Le système enregistre automatiquement : email, date, et métadonnées Netlify.

### Déploiement

- **Branche main**: Déploie automatiquement sur Netlify
- **Preview**: Chaque PR génère un aperçu
- **Build**: `npm run build` optimise automatiquement

## 🧪 Testing

### Validation manuelle

- [ ] Responsive sur mobile/tablette/desktop
- [ ] Navigation fonctionne correctement
- [ ] Formulaires soumis correctement
- [ ] Images se chargent
- [ ] Liens externes ouvrent dans un nouvel onglet

### Performance

- [ ] Lighthouse score > 90
- [ ] Images optimisées (< 100kb)
- [ ] Bundle size raisonnable

## 📋 Checklist pré-déploiement

### Fonctionnel

- [ ] Toutes les pages se chargent sans erreur
- [ ] Navigation interne fonctionne
- [ ] Formulaires fonctionnels (newsletter, contact)
- [ ] Liens externes sécurisés (`rel="noopener"`)

### Contenu

- [ ] Textes sans faute
- [ ] Images avec alt texts
- [ ] Données Sanity à jour
- [ ] Contact information correcte

### Technique

- [ ] Build passe sans erreur
- [ ] Console sans erreur JavaScript
- [ ] SEO optimisé (meta, titles)
- [ ] Performance acceptable

### Accessibilité

- [ ] Navigation au clavier possible
- [ ] Contraste des couleurs suffisant
- [ ] Lecteurs d'écran compatibles

## 🐛 Debugging

### Outils recommandés

- **Browser DevTools**: Inspecter le DOM
- **Astro Dev Toolbar**: Debug des composants
- **Lighthouse**: Audit performance/accessibilité
- **Sanity Vision**: Tester les queries

### Logs courants

```bash
# Erreurs de build
npm run build 2>&1 | tee build.log

# Sanity queries
console.log('Data:', data);
```

## 📚 Ressources

### Documentation

- [Astro Docs](https://docs.astro.build/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Sanity Docs](https://www.sanity.io/docs)

### Outils

- [Figma](https://figma.com) - Design
- [VS Code](https://code.visualstudio.com) - Éditeur
- [GitHub](https://github.com) - Versionning

---

**Dernière mise à jour**: Janvier 2026
**Auteur**: Équipe Gastronomade
