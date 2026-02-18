# 📋 Audit Complet du Studio Sanity - Gastronomade

**Date de l'audit** : 18 février 2026  
**Objectif** : Évaluer la couverture du site par le CMS et proposer des améliorations UX pour le gestionnaire  

---

## 1️⃣ ÉTAT ACTUEL DU STUDIO

### Schémas existants (16 schémas)

| Schéma | Type | Statut | Lié à | Notes |
|--------|------|--------|-------|-------|
| **siteSettings** | Document | ✅ | Global | Navigation, infos générales |
| **home** | Document | ✅ | Page d'accueil | Hero + sections | 
| **about** | Document | ✅ | /about | Cours & Coaching |
| **contact** | Document | ✅ | /contact | Coordonnées + formulaire |
| **authorProfile** | Document | ✅ | /auteur | Profil Muriel |
| **recipe** | Document | ✅ | /recette/[slug] | Recettes individuelles |
| **recipesPage** | Document | ✅ | /recettes | Page index recettes |
| **restaurant** | Document | ✅ | /restaurant-wavre | Restaurant éphémère |
| **location** | Document | ✅ | /privatisation-* | Privatisations (2 offres) |
| **companyAgenda** | Document | ✅ | /privatisation-entreprise | Calendrier entreprises |
| **thermomix** | Document | ✅ | /thermomix | Espace Thermomix |
| **pack** | Document | ✅ | /boutique | Produits à vendre |
| **newsletter** | Document | ✅ | DB abonnés | Gestion des emails |
| **newsletterSettings** | Document | ⚠️ | Newsletter | Param newsletters (incomplet) |
| **pageHero** | Objet réutilisable | ✅ | Multiples | Template pour heroes |
| **newsLetter** | Outil spécialisé | ✅ | Dashboard | Gestion abonnés |

### Pages du site et couverture CMS

```
Site Astro                      Studio Sanity              Statut
────────────────────────────────────────────────────────
✅ / (accueil)                  → home                     ✓ Complet
✅ /about                       → about                    ✓ Complet
✅ /auteur                      → authorProfile            ✓ Complet
✅ /contact                     → contact                  ✓ Complet
✅ /recettes                    → recipesPage + recipe     ✓ Complet
✅ /recette/[slug]              → recipe                   ✓ Complet
✅ /restaurant-wavre            → restaurant               ✓ Complet
✅ /privatisation-entreprise    → location (type:societe)  ✓ Complet
✅ /evenements-prives-wavre     → location (type:prive)    ✓ Complet
✅ /thermomix                   → thermomix                ✓ Complet
🔸 /cours-cuisine-wavre         → REDIRECTION 301          ⚠️ Technique
❌ /acces                       → Aucun                    ❌ Technique
├─ Navigation                   → siteSettings.navigation  ✓ Complet
├─ Footer                       → siteSettings             ⚠️ Partiel
└─ Newsletter                   → newsletter + newsletter  ✓ Complet
           Settings
```

---

## 2️⃣ ANALYSE DÉTAILLÉE PAR DOMAINE

### 📱 Pages & Contenus

#### ✅ Bien couvert
- **Pages principales** : Toutes les pages clés ont un schéma correspondant
- **Héros réutilisable** : Standardisé via `pageHero` (Simple, Split, Utilitaire)
- **Métadonnées de base** : SEO title, images, descriptions
- **Offres de services** : Privatisation, Restaurant, Thermomix

#### ⚠️ Partiellement couvert
- **Services/Tarifs** : Sur `about`, c'est plus structuré, mais sur d'autres pages c'est moins clair
- **FAQs** : Hardcodées dans les pages, pas gérées via CMS (recettes.astro, restaurant-wavre.astro)
- **Appels à l'action (CTA)** : Dispersés dans plusieurs schémas sans logique cohérente
- **Bloc de contenu réutilisable** : Pas de système générique pour ajouter des sections flexibles

#### ❌ Manquant
- **SEO avancé** : Pas de schéma pour Open Graph, Twitter Cards, Schema.org globaux
- **Redirects/Alias** : Pas de gestion des 301 redirects (*cours-cuisine-wavre* fait redirect manuel)
- **Blog/Articles** : Aucun schéma pour un blog de contenu
- **Galeries réutilisables** : Les images sont partout mais pas de composant galerie CMS
- **Témoignages/Avis clients** : Pas de schéma pour afficher des témoignages

---

### 🛒 Boutique

#### ✅ Bien couvert
- **Packs** : Schéma `pack` existe avec prix, description, slug

#### ❌ Manquant
- **Gestion des paiements** : Aucun champ pour URLs Stripe, SKU, intégration paiement
- **Catégories de produits** : Les packs ne sont pas organisés par catégories
- **Inventaire** : Pas de gestion stock, quantités, disponibilité
- **Promotions/Codes** : Pas de schéma pour des offres spéciales, remises

---

### 📅 Agenda & Disponibilités

#### ✅ Bien couvert
- **Restaurant éphémère** : Dates des soirées gérées via `restaurant.dateSlots`
- **Agenda entreprises** : Calendrier avec statuts (Disponible/Indisponible) dans `companyAgenda`
- **Composant spécialisé** : `CompanyAgendaCalendarInput` offre une vraie interface calendrier

#### ⚠️ Partiellement couvert
- **Slots restaurant vs slots agenda** : 2 systèmes différents, logique pas unifiée
- **Statuts** : Normalisés partiellement (texte brut vs énumération)
- **Flexibilité** : Difficile d'ajouter d'autres agendas (ex: ateliers à venir)

#### ❌ Manquant
- **Événements futurs** : Pas de schéma pour lister des "événements à venir" au-delà du restaurant/agenda
- **Horaires** : Seulement des dates, pas de gestion des heures (ex: "14h30–17h")
- **Capacités** : Pas de gestion du nombre de places ou statut de remplissage

---

### 📧 Newsletter

#### ✅ Bien couvert
- **Gestion des abonnés** : Schéma `newsletter` + outil dédié
- **Statut** : Actif/Désabonné bien structuré
- **Double optin** : Semble géré côté app

#### ⚠️ Partiellement couvert
- **newsletterSettings** : Semble incomplet, pas vraiment exploité
- **Templates d'emails** : Pas de gestion des templates de emails

#### ❌ Manquant
- **Segments d'audience** : Pas de tags ou catégories pour segmenter les abonnés
- **Historique campagnes** : Pas de schéma pour tracker les campagnes envoyées
- **Automations** : Pas d'automation (bienvenue auto, relance, etc.)

---

### 💡 Global

#### ⚠️ Points de confusion
- **Organisation du studio** : Le menu desk principal (sidebar) n'est pas pensé pour un non-développeur
- **Visibilité des champs** : Trop de champs "Affichage (avancé)" partout cachent la complexité
- **Descriptions** : Peu de descriptions claires sur ce que chaque champ affiche réellement sur le site
- **Hiérarchie logique** : On voit "Recettes", "Boutique", "Newsletter" mais pas "Quoi sur la homepage ?" ou "Quoi dans la navigation ?"

---

## 3️⃣ CE QUI MANQUE PAR RAPPORT AU SITE

### 🚨 Critiques
| Élément | Impact | Urgence | Raison |
|---------|--------|---------|--------|
| **Gestion des FAQs** | Contenus figés dans le code | 🔴 Haute | Impossibilité de mettre à jour sans dev |
| **Système de blocs flexibles** | Limitant pour ajouter contenu | 🔴 Haute | Pas d'adaptabilité |
| **Redirects 301** | Mauvaise maintenabilité | 🟠 Moyenne | Durées courtes dans le code |
| **SEO avancé (Schema.org)** | Pas d'optimisation technique | 🟠 Moyenne | Affecte le classement Search |

### 📊 Complétude globale
- **Couverture du contenu** : **85%** ✓ (les pages principales sont couvertes)
- **Flexibilité** : **45%** ⚠️ (difficile d'ajouter du contenu ad-hoc)
- **Maintenabilité** : **60%** ⚠️ (beaucoup d'hardcoding reste côté Astro)

---

## 4️⃣ CE QUI EST EN TROP OU REDONDANT

| Élément | Problème | Impact |
|---------|----------|--------|
| **Champs "visibility"** | Partout dans les schémas (10+ occurrences) | Surcharge du formulaire, confusion |
| **pageHero dupliqué** | Variantes (simple, split, utilitaire) mais pas utilisé partout | Incohérence visuelle possible |
| **2 systèmes d'agendas** | `restaurant.dateSlots` vs `companyAgenda.slots` | Logique différente, confusion |
| **locationData + location type** | Filtrée par type côté front | Pas de clarté sur l'intent |
| **newsletterSettings** inactif | Schéma exporte mais jamais utilisé | Debt technique |
| **Page Courses-cuisine-wavre** | Simple redirection, pas de contenu | Confusion (est-ce une vraie page ?) |
| **Champs initialisés avec valeurs** | 30+ `initialValue` qui sont des défauts | Difficile savoir ce qui est flexible |
| **Textes multi-lignes vs textarea** | Mélange de `text` et `string` pour du contenu long | Inconsistance, UX confuse |

---

## 5️⃣ STRUCTURE ACTUELLE vs IDÉALE

### Structure Actuelle (Confuse pour un non-dev)
```
Administration (Sanity Desk)
├── Réglages du site
├── Pages
│   ├── Accueil — Gastronomade
│   ├── À propos — Cours & Coaching
│   ├── Auteur — Profil
│   ├── Thermomix
│   ├── Recettes
│   ├── Contact
│   └── Newsletter — Inscription
├── Offres & lieu
│   ├── Privatisation du lieu
│   ├── Restaurant éphémère
│   └── Agenda entreprises
├── Recettes
├── Boutique
└── Newsletter [Outil spécialisé]
```

**Problèmes** :
- Pas clair quoi modifier pour "changer le slogan de la homepage"
- "Offres & lieu" en groupe alors que ce sont des pages différentes
- "Recettes" apparaît 2 fois (une page, une collection)
- Newsletter est un outil spécialisé mais aussi un schéma (confusion)

---

## 6️⃣ STUDIO PARFAIT POUR UN GESTIONNAIRE

### Principes UX

```
🎯 Objectif: Le gestionnaire peut faire tous les changements sans 
   se sentir perdu, en 2-3 clics maximum.
```

### Proposition : Organisation par **USE CASE** et **PAGE**

```
Studio Réorganisé
├── 📍 PRÉSENCE EN LIGNE
│   ├── Identité & Navigation
│   │   ├── Infos générales (nom, tagline, couleurs?)
│   │   ├── Navigation principale
│   │   └── Pieds de page & liens utiles
│   ├── Profil Auteur
│   │   ├── Muriel (Photo, bio courte, bio longue, parcours, certifications, publications)
│   │   └── FAQ: "Je change l'info" → 1 document, pas de confusion
│   └── Mentions légales & Politique
│       └── [À ajouter si besoin]
│
├── 🏠 CONTENU DES PAGES
│   ├── Page d'Accueil
│   │   ├── Hero (titre, sous-titre, image, CTA)
│   │   ├── Section Expériences (offres privatisation + restaurant)
│   │   └── [Autres sections]
│   ├── À propos — Cours & Coaching
│   │   ├── Hero
│   │   ├── Offres de services (Coaching 1:1, Ateliers, Courses privées)
│   │   ├── Vision & Valeurs (Santé, Transmission, Plaisir)
│   │   └── CTA Contact
│   ├── Espace Thermomix
│   │   ├── Hero & Points clés
│   │   └── Sections contenu
│   ├── Contact
│   │   ├── Hero
│   │   ├── Infos (Téléphone, Email, Formulaire)
│   │   └── FAQ Contact
│   └── Recettes
│       ├── Page index (Titre, description, filtres actifs)
│       └── Fiches recettes (Titre, ingrédients, étapes, nutrition, etc.)
│
├── 🏢 OFFRES & LIEU
│   ├── Privatisation Entreprises
│   │   ├── Infos lieu (description, capacité, prix)
│   │   ├── Services disponibles (location, catering, ateliers)
│   │   ├── Galerie photos
│   │   ├── Agenda dispo (calendrier)
│   │   └── FAQ
│   ├── Événements Privés
│   │   ├── [Idem structure]
│   ├── Restaurant Éphémère
│   │   ├── Description & Hero
│   │   ├── Calendrier des soirées
│   │   ├── Menus (dates + description menu)
│   │   └── FAQ
│   └── Lieu — Informations générales
│       ├── Adresse, parking, accès
│       ├── Photos
│       └── Services disponibles
│
├── 📚 CONTENU ÉDUCATIF
│   ├── Recettes
│   │   ├── Créer une nouvelle
│   │   ├── Gérer les catégories & tags
│   │   └── Voir les stats (vues, favoris)
│   ├── FAQ (entités réutilisables)
│   │   ├── Questions récurrentes
│   │   ├── Organiser par catégorie
│   │   └── Afficher sur les pages pertinentes
│   └── Articles/Blog [À ajouter]
│       └── Format long-form pour contenu éducatif
│
├── 🛒 BOUTIQUE
│   ├── Packs
│   │   ├── Créer un pack
│   │   ├── Gérer prix & promo
│   │   ├── Voir les ventes
│   │   └── Gérer l'inventaire
│   ├── Codes promotionnels [À ajouter]
│   └── Intégration paiement (Stripe, etc.)
│
├── 📧 COMMUNICATION
│   ├── Newsletter
│   │   ├── Voir les abonnés (liste, filtrer)
│   │   ├── Envoyer une campagne
│   │   └── Statistiques inscriptions
│   └── Formulaires
│       ├── Gestion des emails reçus via contact
│       └── Automations [À ajouter]
│
├── 📊 ANALYTICS & DONNÉES
│   ├── Tableau de bord (KPIs)
│   │   ├── Trafic site
│   │   ├── Inscriptions newsletter (+taux)
│   │   ├── Favoris recettes
│   │   └── Bookings (privatisations, restaurant)
│   ├── Rapports mensuels [À ajouter]
│   └── Exports données
│
└── ⚙️ CONFIGURATION (Avancé)
    ├── Variables globales (URLs, tracking, intégrations)
    ├── Redirects 301
    ├── Blocs flexibles (Contenu custom ad-hoc)
    └── Migration / Imports
```

---

## 7️⃣ AMÉLIORATIONS PRIORITAIRES

### Tier 1 : CRITIQUE (Fait en immédiat)

#### 1. **Réorganiser le Desk principal**
- **Raison** : Actuellement pas pensé pour le gestionnaire
- **Action** :
  ```typescript
  // Remplacer la structure "Réglages / Pages / Offres / Recettes / Boutique"
  // Par une organisation par use-case:
  // - Présence en ligne
  // - Contenu des pages
  // - Offres & localisation
  // - Contenu éducatif (recettes, blog)
  // - Boutique
  // - Communication (newsletter, forms)
  // - Configuration (avancé)
  ```

#### 2. **Améliorer les descriptions des champs**
- **Raison** : Le gestionnaire ne sait pas ce que chaque champ affiche
- **Action** :
  - Ajouter des `description` claires et exemples concrets
  - Exemple : `"Cette image apparaît en fond de la section hero. Min. 1920x800px."`
  - Remplacer les descriptions vagues par des instructions

#### 3. **Simplifier : Réduire les champs visibility**
- **Raison** : Trop de "Affichage (avancé)" déroutent
- **Action** :
  - Pas besoin de cacher 80% des champs
  - Créer 2 profils : "Édition simple" (champs clés) et "Avancé" (tout)
  - Utiliser groups/fieldsets mieux, avec default collapsed=true

#### 4. **Unifier les systèmes d'agenda**
- **Raison** : `restaurant.dateSlots` vs `companyAgenda.slots` = confusion
- **Action** :
  - Créer un schéma générique `dateSlot` réutilisable
  - Utiliser le même composant `CompanyAgendaCalendarInput` partout
  - Harmoniser les statuts (énumération, pas texte brut)

### Tier 2 : IMPORTANT (À faire sous 2-3 semaines)

#### 5. **Ajouter un schéma FAQ générique**
```typescript
{
  name: 'faq',
  title: 'Question & Réponse',
  type: 'document',
  fields: [
    { name: 'category', type: 'string', options: { list: ['général', 'recettes', 'privatisation', 'restaurant'] } },
    { name: 'question', type: 'string' },
    { name: 'answer', type: 'text' },
    { name: 'isVisible', type: 'boolean' },
    { name: 'order', type: 'number' }
  ]
}
```
- **Bénéfice** : Les FAQs ne sont plus hardcodées

#### 6. **Ajouter SEO avancé**
- Champs Open Graph, Twitter Cards
- Schema.org (LocalBusiness, Recipe, etc.)
- Robots, canonical URLs

#### 7. **Créer un bloc flexible pour sections**
```typescript
{
  name: 'section',
  title: 'Section flexible',
  type: 'object',
  fields: [
    { name: 'type', type: 'string', options: { list: ['texte', 'galerie', 'testimonials', 'cta', 'custom'] } },
    { name: 'content', type: 'dynamic' } // Contenu selon type
  ]
}
```

#### 8. **Organiser les packs en catégories**
```typescript
// Ajouter à pack.ts
{
  name: 'category',
  title: 'Catégorie',
  type: 'reference',
  to: [{ type: 'productCategory' }]
}
```

### Tier 3 : NICE-TO-HAVE (À faire dans 1-2 mois)

#### 9. **Blog / Articles**
```typescript
{
  name: 'article',
  title: 'Article de blog',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug' },
    { name: 'publishedAt', type: 'datetime' },
    { name: 'body', type: 'blockContent' },
    { name: 'author', type: 'reference', to: [{ type: 'authorProfile' }] }
  ]
}
```

#### 10. **Codes promotionnels**
```typescript
{
  name: 'coupon',
  title: 'Code promotionnel',
  type: 'document',
  fields: [
    { name: 'code', type: 'string' },
    { name: 'discount', type: 'number' },
    { name: 'validFrom', type: 'date' },
    { name: 'validUntil', type: 'date' },
    { name: 'appliesTo', type: 'array', of: [{ type: 'reference', to: [{ type: 'pack' }] }] }
  ]
}
```

#### 11. **Témoignages clients**
```typescript
{
  name: 'testimonial',
  title: 'Témoignage',
  type: 'document',
  fields: [
    { name: 'authorName', type: 'string' },
    { name: 'authorRole', type: 'string' },
    { name: 'text', type: 'text' },
    { name: 'rating', type: 'number', min: 1, max: 5 }
  ]
}
```

#### 12. **Intégration paiement**
- Champs Stripe (SKU, Product ID)
- Webhooks pour sync avec l'app
- Historique transactions

---

## 8️⃣ IMPLÉMENTATIONS À PRÉVOIR

### Phase 1 : UX & Hiérarchie (1-2 semaines, NO break)

1. **Restructurer `sanity.config.ts`** pour refléter la nouvelle organisation
   - Grouper par use-case, pas par type de doc
   - Ajouter folders/groupes clairs

2. **Enrichir les descriptions** dans tous les schémas
   - 1-2 phrases claires par champ
   - Exemples concrets

3. **Nettoyer les champs visibility**
   - Supprimer où inutile
   - Utiliser fieldsets collapsed au lieu de visibility

4. **Harmoniser les agendas**
   - Créer `dateSlot` réutilisable
   - Utiliser partout

### Phase 2 : Contenus manquants (2-3 semaines, NO break)

5. **FAQ réutilisable**
6. **SEO avancé**
7. **Blocs flexibles**
8. **Organisation des packs**

### Phase 3 : Fonctionnalités (1 mois+)

9. Blog, coupons, testimonials, intégrations Stripe

---

## 9️⃣ RECOMMANDATIONS FINALES

### Pour le gestionnaire du site (Persona: Non-Tech)

✅ **Le studio idéal sera :**
- ✅ **Intuitif** : Pas besoin de connaître Sanity pour modifier le contenu
- ✅ **Visuel** : Aperçus en direct (preview/WYSIWYG)
- ✅ **Protégé** : Les champs critiques sont "cachés" par défaut
- ✅ **Organi** : Structuré par "Quoi faire" (changer la homepage, ajouter une recette, etc.)
- ✅ **Flexible** : Adaptable sans l'aide du dev

### Checklist de Migration

- [ ] Réorganiser le desk principal
- [ ] Ajouter descriptions claires à 100% des champs
- [ ] Unifier agendas (dateSlot générique)
- [ ] Ajouter FAQ réutilisable
- [ ] Ajouter SEO avancé (OG, Schema)
- [ ] Tester avec Muriel (le vrai gestionnaire)
- [ ] Documenter chaque section du studio
- [ ] Créer des vidéos tuto par page/fonction

---

## 🔟 CONCLUSIONS

| Aspect | Score | Verdict |
|--------|-------|---------|
| **Couverture pages** | 90/100 | ✅ Excellent |
| **Couverture contenus** | 80/100 | ✅ Bon |
| **UX gestionnaire** | 45/100 | 🔴 À améliorer |
| **Flexibilité** | 50/100 | 🟠 Limitée |
| **Maintenabilité** | 60/100 | 🟠 À rationaliser |

### TL;DR
- ✅ Le studio **couvre bien les pages principales**
- ❌ L'**UX pour le gestionnaire est confuse** → priorité #1
- ❌ Beaucoup de contenu reste **hardcodé dans Astro** (FAQs, CTA, services)
- ⚠️ Certains systèmes sont **redondants ou peu clairs** (agendas, visibility, newsletter)
- 💡 **Restructurer le Desk + enrichir descriptions = 80% de l'impact**

---

## 📎 Annexe : Fichiers à modifier en priorité

1. `studio/sanity.config.ts` → Restructurer le deskTool
2. `studio/schemas/*.ts` → Enrichir descriptions partout
3. `studio/schemas/index.ts` → Réorganiser exports
4. Créer `studio/schemas/faq.ts` → Nouveau schéma
5. Créer `studio/schemas/dateSlot.ts` → Réutilisable
6. Mettre à jour `studio/README.md` → Documentation pour le gestionnaire

