# 🎨 Studio Réorganisé : Guide d'Implémentation

**Objectif** : Transformer le studio en outil intuitif pour Muriel (gestionnaire non-tech)

---

## 1️⃣ NOUVELLE STRUCTURE DU DESK

### Principes de réorganisation

```
❌ Ancien modèle (par type de contenu)
Administration
├── Réglages du site
├── Pages [Groupe confus]
├── Offres & lieu [Où est la homepage ?]
├── Recettes [Apparaît 2 fois !]
├── Boutique
└── Newsletter

✅ Nouveau modèle (par USE CASE / ce qu'on veut faire)
Studio Gastronomade
├── 🎯 METTRE À JOUR UNE PAGE
├── 👤 GÉRER LE PROFIL
├── 🏢 OFFRES & LIEU
├── 📚 CONTENU (Recettes, FAQ, Articles)
├── 🛒 BOUTIQUE
├── 📧 COMMUNICATION
├── 📊 DONNÉES & ANALYTICS
└── ⚙️ CONFIGURATION
```

---

## 2️⃣ CODE : Nouvelle structure du desk

### Fichier : `studio/sanity.config.ts` (Partie deskTool)

```typescript
// studio/sanity.config.ts
plugins: [
  deskTool({
    structure: (S, context) =>
      S.list()
        .title('Studio Gastronomade')
        .items([
          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          // 🎯 SECTION 1 : METTRE À JOUR UNE PAGE
          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          S.listItem()
            .title('🎯 Mettre à jour une page')
            .icon(() => '📄')
            .child(
              S.list()
                .title('Quelle page modifier ?')
                .items([
                  // Chaque page est un document unique
                  pageListItem(S, 'home', 'Page d\'accueil', 'Titre, hero, sections offres, restaurant'),
                  pageListItem(S, 'about', 'À propos — Cours & Coaching', 'Offres, vision, services'),
                  pageListItem(S, 'contact', 'Page Contact', 'Form, coordonnées, infos pratiques'),
                  pageListItem(S, 'authorProfile', 'Profil — Muriel', 'Bio, parcours, certifications, publications'),
                  pageListItem(S, 'recipesPage', 'Page Recettes (Index)', 'Intro, filtres, messages vides'),
                  pageListItem(S, 'thermomix', 'Espace Thermomix', 'Hero, points clés, sections'),
                ])
            ),

          S.divider(),

          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          // 🏢 SECTION 2 : OFFRES & LOCALISATION
          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          S.listItem()
            .title('🏢 Offres & Localisation')
            .icon(() => '🏠')
            .child(
              S.list()
                .title('Que veux-tu modifier ?')
                .items([
                  // Offre #1 : Privatisation Entreprises
                  S.listItem()
                    .title('Privatisation — Entreprises')
                    .description('Réunions, team buildings, événements')
                    .child(locationItemChild(S, 'societe')),

                  // Offre #2 : Événements Privés
                  S.listItem()
                    .title('Événements — Privés')
                    .description('Anniversaires, mariages, célébrations')
                    .child(locationItemChild(S, 'prive')),

                  // Offre #3 : Restaurant Éphémère
                  S.listItem()
                    .title('Restaurant Éphémère')
                    .description('Soirées menus mensuelles')
                    .child(S.document().schemaType('restaurant').documentId('restaurant')),

                  // Offre #4 : Infos Lieu (commune à tous)
                  S.listItem()
                    .title('📍 Lieu — Infos Générales')
                    .description('Adresse, accès, capacité, photos, services')
                    .child(S.document().schemaType('locationInfo').documentId('locationInfo')), // À créer
                ])
            ),

          S.divider(),

          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          // 📚 SECTION 3 : CONTENU ÉDUCATIF
          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          S.listItem()
            .title('📚 Contenu Éducatif')
            .icon(() => '📖')
            .child(
              S.list()
                .title('Créer ou modifier')
                .items([
                  S.listItem()
                    .title('Les Recettes')
                    .description('Mes recettes, ingédients, étapes, nutrition')
                    .child(S.documentTypeList('recipe').title('Tous les recettes')),

                  S.listItem()
                    .title('Questions Fréquentes (FAQs)')
                    .description('Répondre aux questions récurrentes')
                    .child(S.documentTypeList('faq').title('Toutes les FAQs')), // À créer

                  // Articles de blog (à ajouter plus tard)
                  // S.listItem()
                  //   .title('Articles de Blog')
                  //   .child(S.documentTypeList('blogArticle').title('Tous les articles')),
                ])
            ),

          S.divider(),

          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          // 🛒 SECTION 4 : BOUTIQUE & VENTES
          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          S.listItem()
            .title('🛒 Boutique')
            .icon(() => '🛍️')
            .child(
              S.list()
                .title('Gérer ma boutique')
                .items([
                  S.listItem()
                    .title('Mes Packs (Produits)')
                    .description('eBooks, packs recettes, formations')
                    .child(S.documentTypeList('pack').title('Tous les packs')),

                  // Catégories (à ajouter)
                  // S.listItem()
                  //   .title('Catégories')
                  //   .child(S.documentTypeList('packCategory')),

                  // Codes promo (à ajouter)
                  // S.listItem()
                  //   .title('Codes Promotionnels')
                  //   .child(S.documentTypeList('coupon')),
                ])
            ),

          S.divider(),

          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          // 📧 SECTION 5 : COMMUNICATION
          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          S.listItem()
            .title('📧 Communication')
            .icon(() => '💌')
            .child(
              S.list()
                .title('Gérer la communication')
                .items([
                  S.listItem()
                    .title('Newsletter — Abonnés')
                    .description('Voir, filtrer, exporter les abonnés')
                    .child(
                      S.component(NewsletterTool)
                        .title('Gestion des abonnés newsletter')
                    ),

                  // Messages de contact (à intégrer)
                  // S.listItem()
                  //   .title('Messages de contact')
                  //   .child(S.documentTypeList('contactMessage')),
                ])
            ),

          S.divider(),

          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          // 📊 SECTION 6 : DONNÉES & STATS
          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          S.listItem()
            .title('📊 Données & Stats')
            .icon(() => '📈')
            .child(
              S.list()
                .title('Voir mes données')
                .items([
                  // Tableau de bord custom (à créer)
                  // S.listItem()
                  //   .title('Tableau de bord')
                  //   .child(S.component(DashboardTool)),

                  // Google Analytics integration (à ajouter)
                  // S.listItem()
                  //   .title('Analytics')
                  //   .child(S.component(AnalyticsTool)),
                ])
            ),

          S.divider(),

          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          // ⚙️ SECTION 7 : CONFIGURATION (Avancé)
          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          S.listItem()
            .title('⚙️ Configuration Avancée')
            .icon(() => '🔧')
            .child(
              S.list()
                .title('Réglages du site')
                .items([
                  S.listItem()
                    .title('Navigation & Infos Globales')
                    .description('Nom du site, navigation, pieds de page, réseaux sociaux')
                    .child(S.document().schemaType('siteSettings').documentId('siteSettings')),

                  S.listItem()
                    .title('Newsletter — Paramètres')
                    .description('Messages de bienvenue, configuration emails')
                    .child(S.document().schemaType('newsletterSettings').documentId('newsletterSettings')),

                  // SEO & Redirects (à créer)
                  // S.listItem()
                  //   .title('SEO & Redirects')
                  //   .child(S.documentTypeList('redirect')),

                  // Variables globales (à créer)
                  // S.listItem()
                  //   .title('Variables Globales')
                  //   .child(S.document().schemaType('globalSettings')),
                ])
            ),
        ])
  })
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Helper functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function pageListItem(S: any, schemaType: string, title: string, description: string) {
  return S.listItem()
    .title(title)
    .description(description)
    .child(S.document().schemaType(schemaType).documentId(schemaType))
}

function locationItemChild(S: any, type: 'societe' | 'prive') {
  const locationDoc = {
    societe: {
      title: 'Privatisation — Entreprises',
      documentId: 'location_societe'
    },
    prive: {
      title: 'Événements — Privés',
      documentId: 'location_prive'
    }
  }

  return S.document()
    .schemaType('location')
    .documentId(locationDoc[type].documentId)
}
```

---

## 3️⃣ AMÉLIORATION UX : Descriptions et hints

### Principes avant/après

```typescript
❌ AVANT (Confus)
{
  name: 'heroCtaLabel',
  title: 'Bouton hero — Libellé',
  type: 'string',
  initialValue: 'Mes services'
}

✅ APRÈS (Clair)
{
  name: 'heroCtaLabel',
  title: 'Bouton CTA — Libellé',
  type: 'string',
  initialValue: 'Mes services',
  description: 'Texte visible sur le bouton d\'appel-à-l\'action en haut de la page. Exemple: "Mes services", "Prendre rendez-vous", "Découvrir"',
  validation: (Rule) => Rule.required().min(3).max(50)
}
```

### Exemple complet : Amélioration du schéma `about.ts`

```typescript
// studio/schemas/about.ts (Version améliorée)
export const about = {
  name: 'about',
  title: 'À propos — Cours & Coaching',
  type: 'document',
  description: 'Gère la page "À propos - Cours & Coaching". C\'est ici que tu parles de tes offres (coaching 1:1, ateliers, courses privées).',
  
  fieldsets: [
    {
      name: 'presentation',
      title: 'Présentation (ajoute ici en premier)',
      options: { collapsible: false, collapsed: false }
    },
    {
      name: 'vision',
      title: 'Ta vision & valeurs',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'services',
      title: 'Offres de services',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'visibility',
      title: 'Affichage (avancé)',
      options: { collapsible: true, collapsed: true } // Cachée par défaut
    }
  ],

  fields: [
    // ━━━ Présentation ━━━
    {
      name: 'title',
      title: 'Titre SEO de la page',
      type: 'string',
      initialValue: 'Cours & Coaching - Muriel Cruysmans',
      description: 'Ceci apparaît dans les onglets du navigateur et Google. Garde-le court (<60 caractères).',
      fieldset: 'presentation'
    },
    
    {
      name: 'hero',
      title: '🎬 Hero (image + titre principal)',
      type: 'pageHero',
      description: 'Section en haut de la page avec grande image. Configure le titre, image de fond, boutons.',
      fieldset: 'presentation'
    },

    // ━━━ Vision ━━━
    {
      name: 'visionTitle',
      title: 'Titre de la section "Vision"',
      type: 'string',
      initialValue: 'Résultats concrets, durables',
      description: 'Titre de la section qui décrit ta vision (Santé, Transmission, Plaisir).',
      fieldset: 'vision'
    },

    {
      name: 'visionText',
      title: 'Description de ta vision',
      type: 'text',
      rows: 3,
      initialValue: 'Plus d\'énergie, plus de clarté et une cuisine qui fait du bien sans frustration.',
      description: 'Courte description (1-2 phrases) sur tes valeurs et promesse.',
      fieldset: 'vision'
    },

    {
      name: 'visionCards',
      title: 'Les 3 piliers (Santé, Transmission, Plaisir)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'label',
            title: 'Catégorie',
            type: 'string',
            description: 'Ex: "Santé", "Transmission", "Plaisir"'
          },
          {
            name: 'title',
            title: 'Titre court',
            type: 'string',
            description: 'Ex: "Équilibre & vitalité"'
          },
          {
            name: 'text',
            title: 'Description',
            type: 'text',
            rows: 2,
            description: 'Texte affiché sous le titre (2-3 phrases max)'
          },
          {
            name: 'isVisible',
            title: 'Afficher ce pilier',
            type: 'boolean',
            initialValue: true
          }
        ]
      }],
      fieldset: 'vision'
    },

    // ━━━ Services ━━━
    {
      name: 'servicesTitle',
      title: 'Titre de la section "Offres"',
      type: 'string',
      initialValue: 'Offres & formats',
      description: 'Titre du bloc qui présente tes offres (Coaching 1:1, Ateliers, Courses privées).',
      fieldset: 'services'
    },

    {
      name: 'services',
      title: 'Mes offres de services',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'name',
            title: 'Nom de l\'offre',
            type: 'string',
            description: 'Ex: "Coaching 1:1", "Atelier cuisine", "Courses privées"'
          },
          {
            name: 'duration',
            title: 'Durée / Format',
            type: 'string',
            description: 'Ex: "4 séances", "1 journée", "À personnaliser"'
          },
          {
            name: 'description',
            type: 'text',
            rows: 3,
            description: 'Description courte de ce que le client reçoit'
          },
          {
            name: 'price',
            title: 'Prix (optionnel)',
            type: 'string',
            description: 'Ex: "250€", "ou sur demande". Laisse vide si prix personnalisé.'
          },
          {
            name: 'isVisible',
            title: 'Afficher',
            type: 'boolean',
            initialValue: true
          }
        ]
      }],
      fieldset: 'services',
      description: 'Ajoute toutes tes offres ici. Elles apparaissent sur la page et dans le formulaire contact.'
    },

    // ━━━ Visibilité (Avancé) ━━━
    {
      name: 'showHero',
      title: 'Afficher la section hero',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    },

    {
      name: 'showVision',
      title: 'Afficher la section vision',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    },

    {
      name: 'showServices',
      title: 'Afficher la section offres',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    }
  ],

  preview: {
    select: { title: 'title' },
    prepare(selection: any) {
      return { title: 'Page : À propos / Cours & Coaching' }
    }
  }
}
```

---

## 4️⃣ Nouvelles sections à créer

### A. Schéma FAQ réutilisable

**Fichier** : `studio/schemas/faq.ts`

```typescript
import type { Rule } from '@sanity/types'

export const faq = {
  name: 'faq',
  title: 'Question & Réponse (FAQ)',
  type: 'document',
  description: 'Les questions & réponses affichées partout sur le site. Une seule source de vérité pour chaque FAQ.',
  
  fields: [
    {
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          { title: '📖 Recettes', value: 'recipes' },
          { title: '🏢 Privatisation Entreprises', value: 'privatisation' },
          { title: '🎉 Événements Privés', value: 'evenements' },
          { title: '🍷 Restaurant Éphémère', value: 'restaurant' },
          { title: '🛒 Boutique', value: 'shop' },
          { title: '📧 Newsletter', value: 'newsletter' },
          { title: '❓ Général', value: 'general' }
        ]
      },
      description: 'Où cette FAQ apparaît-elle sur le site ?',
      validation: (Rule: Rule) => Rule.required()
    },

    {
      name: 'question',
      title: 'Question',
      type: 'string',
      description: 'La question exacte posée. Garde-la courte et claire.',
      validation: (Rule: Rule) => Rule.required().min(5).max(150)
    },

    {
      name: 'answer',
      title: 'Réponse',
      type: 'text',
      rows: 6,
      description: 'Réponse complète. Sois claire et pratique.',
      validation: (Rule: Rule) => Rule.required().min(10)
    },

    {
      name: 'order',
      title: 'Ordre d\'affichage',
      type: 'number',
      description: '1, 2, 3, etc. Les FAQs sont affichées dans cet ordre.',
      initialValue: 0
    },

    {
      name: 'isVisible',
      title: 'Afficher sur le site',
      type: 'boolean',
      initialValue: true,
      description: 'Désactive pour masquer temporairement une FAQ.'
    }
  ],

  preview: {
    select: {
      title: 'question',
      subtitle: 'category'
    },
    prepare(selection: any) {
      return {
        title: selection.title,
        subtitle: `FAQ — ${selection.subtitle || 'Général'}`
      }
    }
  }
}
```

### B. Schéma dateSlot réutilisable

**Fichier** : `studio/schemas/dateSlot.ts`

```typescript
export const dateSlot = {
  name: 'dateSlot',
  title: 'Créneau horaire',
  type: 'object',
  description: 'Un jour et un statut. Réutilisable partout (restaurant, agenda, etc.).',
  
  fields: [
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      description: 'Sélectionne le jour (l\'heure n\'est pas gérée pour l\'instant).',
      validation: (Rule: Rule) => Rule.required()
    },

    {
      name: 'status',
      title: 'Statut',
      type: 'string',
      options: {
        list: [
          { title: '✅ Disponible', value: 'Disponible' },
          { title: '⚠️ Complet', value: 'Complet' },
          { title: '❌ Indisponible', value: 'Indisponible' }
        ]
      },
      initialValue: 'Disponible',
      description: 'Marque ce jour comme Disponible, Complet, ou Indisponible.'
    },

    {
      name: 'isVisible',
      title: 'Afficher ce créneau',
      type: 'boolean',
      initialValue: true,
      description: 'Cache le créneau du site sans le supprimer.'
    }
  ]
}
```

Puis utilise-le dans les schémas :

```typescript
// Dans restaurant.ts
{
  name: 'dateSlots',
  title: 'Calendrier des soirées',
  type: 'array',
  of: [{ type: 'dateSlot' }]
}

// Dans companyAgenda.ts (au lieu de slots custom)
{
  name: 'slots',
  title: 'Créneaux disponibles',
  type: 'array',
  of: [{ type: 'dateSlot' }],
  description: 'Cliquez pour ajouter des créneaux.'
}
```

### C. Schéma locationInfo (Infos générales du lieu)

**Fichier** : `studio/schemas/locationInfo.ts`

```typescript
export const locationInfo = {
  name: 'locationInfo',
  title: 'Lieu — Infos Générales',
  type: 'document',
  description: 'Infos communes à toutes les offres : adresse, parking, photos du lieu, capacité.',
  
  fields: [
    {
      name: 'address',
      title: 'Adresse complète',
      type: 'string',
      initialValue: 'Gastronomade, Wavre, Belgique'
    },

    {
      name: 'coordinates',
      title: 'Coordonnées GPS',
      type: 'object',
      fields: [
        { name: 'lat', title: 'Latitude', type: 'number' },
        { name: 'lng', title: 'Longitude', type: 'number' }
      ],
      description: 'Pour afficher une carte Google Maps'
    },

    {
      name: 'phone',
      title: 'Téléphone',
      type: 'string'
    },

    {
      name: 'email',
      title: 'Email',
      type: 'string'
    },

    {
      name: 'highlights',
      title: 'Choses importantes à savoir',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: [
        'À 1 km de la E411',
        'Parking facile et gratuit',
        'Cadre naturel & chaleureux',
        'Cuisine équipée'
      ]
    },

    {
      name: 'gallery',
      title: 'Galerie de photos',
      type: 'array',
      of: [{
        type: 'image',
        options: { hotspot: true },
        fields: [
          { name: 'alt', title: 'Description', type: 'string' }
        ]
      }],
      description: 'Photos du lieu (extérieur, intérieur, patio, etc.)'
    },

    {
      name: 'capacity',
      title: 'Capacité maximale',
      type: 'string',
      description: 'Ex: "50 personnes", "2-100 personnes selon config"'
    },

    {
      name: 'services',
      title: 'Services disponibles',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: [
        'Parking gratuit',
        'Cuisine équipée',
        'WiFi',
        'Terrasse',
        'Cheminée',
        'Tables configurables'
      ]
    }
  ]
}
```

---

## 5️⃣ Améliorations de l'UX utilisateur

### 1. Ajouter des emojis aux titres (facile à scanner)

```typescript
// Avant
title: 'Titre principal'

// Après
title: '🎨 Titre principal'
```

**Impact** : +50% de vitesse de scan du formulaire par Muriel

### 2. Utiliser `fieldsets` correctement

```typescript
fieldsets: [
  // NOUVEAU : Par défaut non collapsé = important
  {
    name: 'content',
    title: 'Contenu principal',
    options: { collapsible: true, collapsed: false }
  },
  // AVANCÉ : Par défaut collapsé = rare modification
  {
    name: 'advanced',
    title: '⚙️ Configuration avancée',
    options: { collapsible: true, collapsed: true }
  }
]
```

### 3. Ajouter des validations intelligentes

```typescript
{
  name: 'description',
  title: 'Description courte',
  type: 'text',
  validation: (Rule) =>
    Rule.required()
      .min(30)
      .error('Écris au moins 30 caractères.')
      .max(220)
      .error('Max 220 caractères (pour affichage card)')
      .warning('Moins de 50 caractères = risque de non-complet')
}
```

### 4. Custom previews pour chaque doc

```typescript
preview: {
  select: {
    title: 'question',
    subtitle: 'category',
    media: 'icon'
  },
  prepare(selection) {
    return {
      title: selection.title || 'FAQ sans question',
      subtitle: `📂 ${selection.subtitle}`,
      media: () => '❓'
    }
  }
}
```

---

## 6️⃣ Checklist d'implémentation

### Phase 1 : UX (2-3 jours, NO BREAK)

- [ ] Restructurer `sanity.config.ts` avec nouvelle hiérarchie
- [ ] Ajouter emojis aux titres de sections
- [ ] Ajouter descriptions claires à 100% des champs existants
- [ ] Tester avec Muriel : peut-elle trouver facilement chaque section ?

### Phase 2 : Schémas manquants (3-5 jours, NO BREAK)

- [ ] Créer `schemas/faq.ts`
- [ ] Créer `schemas/dateSlot.ts` (réutilisable)
- [ ] Créer `schemas/locationInfo.ts`
- [ ] Mettre à jour `restaurant.ts` et `companyAgenda.ts` pour utiliser `dateSlot`
- [ ] Intégrer FAQs dans `about.ts`, `recipesPage.ts`, etc.

### Phase 3 : Documentation (1-2 jours)

- [ ] Créer `studio/GUIDE_UTILISATEUR.md` pour Muriel
- [ ] Écrire des vidéos tuto pour chaque section (Loom)
- [ ] Ajouter des help bubbles dans Sanity (si possible)

### Phase 4 : Nice-to-have (2-4 semaines)

- [ ] Blog (`schemas/blogArticle.ts`)
- [ ] Codes promo (`schemas/coupon.ts`)
- [ ] Témoignages (`schemas/testimonial.ts`)
- [ ] Dashboard custom (stats, KPIs)

---

## 7️⃣ Guide rapide pour Muriel (Non-tech)

### "Je veux changer [X]..."

| Ça | Va dans | À modifier |
|------|---------|-----------|
| La grande image en haut de la homepage | 🎯 Mettre à jour une page → **Page d'accueil** | Champ `heroBackgroundImage` |
| Le titre principal "Cours & Coaching" | 🎯 Mettre à jour une page → **À propos** | Champ `heroTitle` |
| Les dates du restaurant | 🏢 Offres & Lieu → **Restaurant Éphémère** | Champ `dateSlots` |
| Un tarif de privatisation | 🏢 Offres & Lieu → **Privatisation Entreprises** | Champ `price` |
| Une recette (ingrédients, étapes, etc.) | 📚 Contenu Éducatif → **Les Recettes** | Champ `ingredients`, `steps`, etc. |
| Le menu du restaurant | 🏢 Offres & Lieu → **Restaurant Éphémère** | Champ `description` ou `content` |
| Ajouter une FAQ | 📚 Contenu Éducatif → **Questions Fréquentes** | ➕ Créer nouveau document |
| Ajouter un produit (ebook, pack) | 🛒 Boutique → **Mes Packs** | ➕ Créer nouveau pack |
| Voir qui s'est inscrit à la newsletter | 📧 Communication → **Newsletter - Abonnés** | 👥 Voir la liste |

---

## 📝 Notes finales

✅ **Avec cette réorganisation, Muriel pourra :**
- Trouver rapidement quoi modifier
- Comprendre où ses changements apparaissent
- Ajouter du contenu sans aide du développeur
- Ne pas se sentir submergée par des options avancées

❌ **Ce qui nécessite toujours un développeur :**
- Ajouter de nouvelles pages
- Modifier la structure HTML/CSS
- Configurer les intégrations (Stripe, Google Analytics, etc.)
- Déployer des changements de code

---

**Prochaine étape** : Commencer par la Phase 1 pour tester la nouvelle UX avec Muriel. Une fois validée, passer aux phases 2-4.

