# Gastronomade - Manger Vrai

Site web pour Muriel Cruysmans - Gastronomade / Manger Vrai à Wavre

## 🚀 Démarrage rapide

```bash
# Installation
npm install

# Développement
npm run dev

# Build pour production
npm run build

# Aperçu production
npm run preview

# Interface Sanity (administration)
npm run studio
```

## 🏗️ Architecture

### Technologies

- **Framework**: Astro 5.x
- **Styling**: Tailwind CSS 3.x (project uses Tailwind v3.4.x)
- **CMS**: Sanity
- **Déploiement**: Netlify

### Structure du projet

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

### Composants

- `.mv-card`: Cartes avec ombre et bordure
- `.mv-pill`: Boutons arrondis
- `.mv-btn-primary/.mv-btn-secondary`: Styles de boutons

## 📄 Pages principales

### 🏠 Accueil (`index.astro`)

- Hero section avec présentation
- Section Gastronomade (location "La Zboum")
- Section Restaurant (dîners thématiques)

### 🤖 Thermomix (`thermomix.astro`)

- Présentation avec vidéos intégrées
- Démonstrations et recettes

### 📚 Cours & Coaching (`about.astro`)

- Biographie Muriel Cruysmans
- Services: cours de cuisine, coaching, ateliers

### 🍽️ Recettes (`recettes.astro`)

- Catalogue de recettes saines
- Filtrage par catégories et difficulté

### 📞 Contact (`contact.astro`)

- Formulaire de contact
- Informations et carte de localisation

## 🔧 Développement

Voir le guide complet dans [`DEVELOPMENT.md`](./DEVELOPMENT.md) pour:

- Conventions de code
- Bonnes pratiques
- Déploiement
- Debugging

## 📊 Newsletter

Les inscriptions utilisent **Netlify Forms** :

- **Dashboard Netlify** : Gestion et export CSV automatique
- **Modal de confirmation** : Popup élégant sur la même page
- **Protection anti-spam** : Incluse par défaut

### Gestion des abonnés (Sanity Studio)

```bash
# Accéder au studio d'administration
npm run studio

# Dans le menu latéral : Newsletter > Gestion des abonnés
# Voir la liste, exporter en CSV, statistiques
```

## 📊 CMS Sanity

### Configuration

- **Project ID**: Configuré via variables d'environnement
- **Dataset**: `production`
- **API Version**: `2024-01-01`

### Schemas disponibles

- `recipe` - Recettes avec ingrédients et instructions
- `home` - Contenu de la page d'accueil
- `about` - Informations biographiques et services
- `contact` - Coordonnées et informations
- `thermomix` - Contenu Thermomix
- `location` - Lieux de prestation
- `restaurant` - Informations restaurant

## 🚀 Déploiement

Le site se déploie automatiquement sur Netlify lors des pushes sur la branche `main`.

### Variables d'environnement requises

```env
SANITY_PROJECT_ID=votre_project_id
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01
```

---

**Site**: [gastronomade.be](https://gastronomade.be)
**Contact**: muriel.cruysmans@gmail.com

### Cours & Coaching (about.astro)

- Bio de Muriel Cruysmans
- Services: Balade (125€), Conférence (250€), Ateliers (65€)

### Recettes (recettes.astro)

- Interface Recipe TypeScript préparée
- Grille de recettes (CMS-ready)

### Contact (contact.astro)

- Coordonnées complètes
- Formulaire prêt pour intégration

## Démarrage

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Déploiement

Prêt pour déploiement statique (Vercel, Netlify, etc.)

## Prochaines étapes

1. Connexion à Sanity CMS
2. Intégration des images
3. Formulaire de contact fonctionnel
4. Newsletter
5. Blog/Recettes dynamiques
