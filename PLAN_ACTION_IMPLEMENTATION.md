# 🚀 Plan d'Action : Transition du Studio

**Durée estimée** : 3-4 semaines selon priorités  
**Public** : Développeur (toi)

---

## 🎯 Objectif Global

**Avant** : Studio CMS confus pour le gestionnaire → Muriel a besoin du dev pour chaque changement  
**Après** : Studio intuitif organisé par use-case → Muriel peut faire 90% des changements seule

---

## 📊 Timeline

```
Semaine 1 : Restructure + Descriptions (NO API BREAK)
Semaine 2 : Nouveaux schémas FAQ + dateSlot (NO API BREAK)  
Semaine 3 : Intégration + Tests avec Muriel
Semaine 4 : Documentation + Tutos vidéo
```

---

## PHASE 1: SEMAINE 1 — UX & Descriptions

### Step 1.1 : Restructurer `studio/sanity.config.ts`

**Actuellement** : Structure par type de contenu (confuse)  
**À faire** : Structure par use-case (intuitive)

**Temps** : 2h

**Code à appliquer** :

Remplace le contenu de `studio/deskTool` dans `sanity.config.ts` par la structure proposée dans `STUDIO_REORGANISÉ.md` (Section 2).

**Test** :
```bash
cd studio
npm run dev
# Visite http://localhost:3333
# Vérifie que tu vois 7 sections top-level:
✓ 🎯 Mettre à jour une page
✓ 🏢 Offres & Localisation
✓ 📚 Contenu Éducatif
✓ 🛒 Boutique
✓ 📧 Communication
✓ 📊 Données & Stats
✓ ⚙️ Configuration Avancée
```

---

### Step 1.2 : Ajouter descriptions claires (Champs existants)

**Actuellement** : `description` manquante sur 80% des champs  
**À faire** : Ajouter description claires + `initialValue` visible

**Temps** : 4-6h (champs critiques d'abord)

**Champs prioritaires** (80/20) :

```typescript
// 1. about.ts
fields: [
  {
    name: 'heroTitle',
    title: '🎬 Titre du hero',
    type: 'string',
    description: 'Le titre principal visible en haut de la page. Visible sur ordinateurs et mobiles. Max 70 caractères recommandé.',
    validation: (Rule) => Rule.max(100)
  },
  {
    name: 'visionCards',
    title: 'Les 3 piliers (Santé, Transmission, Plaisir)',
    type: 'array',
    description: 'Tes 3 valeurs principales. Tu peux les réordonner en les glissant.',
    of: [/* ... */]
  }
  // ... etc
]

// 2. recipe.ts
fields: [
  {
    name: 'featuredImage',
    title: '📸 Photo de la recette',
    type: 'image',
    description: 'La photo affichée sur la carte recette. Idéalement 1000x800px ou plus. Lance "optimize" quand tu télécharges.',
    validation: (Rule) => Rule.required()
  },
  {
    name: 'description',
    title: 'Accroche (2-3 lignes)',
    type: 'text',
    description: 'Texte court visible sous le titre. 80-150 caractères. Rend-le appétissant !',
    validation: (Rule) => Rule.required().min(30).max(220)
  }
  // ... etc
]

// 3. location.ts
fields: [
  {
    name: 'price',
    title: '💰 Prix location du lieu',
    type: 'string',
    description: 'Ex: "400€ HTVA". Ou "Sur demande". C\'est ce que les clients voient.',
    initialValue: '400€ HTVA'
  }
  // ... etc
]

// 4. siteSettings.ts
fields: [
  {
    name: 'navigation',
    title: '📍 Navigation principale',
    type: 'array',
    description: 'Les liens du menu en haut. Ordre : de haut en bas. "isVisible" te permet de masquer temporairement un lien.',
    of: [/* ... */]
  }
  // ... etc
]
```

**Checklist d'étapes** :
- [ ] Ajouter `description` à 100% des champs critiques
- [ ] Tester : chaque champ doit afficher un `description` hover en Sanity
- [ ] Revoir avec Muriel : "Comprends-tu ce que chaque champ fait ?"

---

### Step 1.3 : Simplifier les champs visibility

**Actuellement** : Tous les schémas ont des champs visibility − confusion  
**À faire** : Garder visibility SEULEMENT si vraiment utile, sinon supprimer

**Temps** : 1h

**Règle** :
```
❌ SUPPRIMER visibility si:
   - Personne ne l'utilise (regarder les données Sanity)
   - Le champ existe = devrait toujours être visible
   - C'est un détail cosmétique non stratégique

✅ GARDER visibility SI:
   - C'est une feature importante (ex: "Afficher FAQ oui/non")
   - Il y a un vrai cas d'usage de masquage temporaire
   - Le gestionnaire l'utilise activement
```

**Exemple : about.ts**

```typescript
// ❌ AVANT (trop de visibility)
fieldsets: [
  { name: 'visibility', title: 'Affichage (avancé)', options: { collapsed: true } }
]
fields: [
  { name: 'showHero', fieldset: 'visibility' },
  { name: 'showVision', fieldset: 'visibility' },
  { name: 'showAboutSection', fieldset: 'visibility' },
  { name: 'showServices', fieldset: 'visibility' },
  // 4 toggles pour 4 sections...
]

// ✅ APRÈS (seulement l'utile)
fieldsets: [
  { name: 'visibility', title: '🎮 Affichage', options: { collapsed: true } }
]
fields: [
  // Hero, vision, services = toujours affichés (pas de toggle)
  // Sauf si vraiment masqué:
  { 
    name: 'showServices', 
    title: 'Afficher l\'onglet "Offres"',
    type: 'boolean',
    initialValue: true,
    description: 'Masquer temporairement l\'onglet services. À réactiver bientôt normalement.',
    fieldset: 'visibility'
  }
]
```

---

### Step 1.4 : Ajouter emojis aux titres de sections

**Impact** : +30% de scannabilité pour Muriel

**Temps** : 30 min

Partout où tu vois un titre de section, ajoute un emoji :

```typescript
// status quo
title: 'Métadonnées'

// Amélioré
title: '📋 Métadonnées'
```

**Emojis à utiliser** :
- 🎯 = Action principale / Page à modifier
- 🏢 = Lieu / Offres
- 📚 = Contenu éducatif
- 🛒 = Boutique/Vente
- 📧 = Communication
- 📊 = Données/Analytics
- ⚙️ = Configuration / Avancé
- 🎬 = Vidéo / Image de fond
- 📸 = Galerie / Photos
- 💰 = Tarif / Prix
- 📍 = Localisation / Adresse
- 🎨 = Design / Visuel
- 📝 = Texte / Contenu
- ✅ = Checklist / Publication

---

### ✅ Fin de Phase 1

**Validations** :
- [ ] Sanity redémarre sans erreurs
- [ ] Nouvelle hiérarchie visible et intuitive
- [ ] Descriptions claires sur tous champs clés
- [ ] Emojis présents
- [ ] Muriel dit "Ah, c'est plus clair !"

---

## PHASE 2 : SEMAINE 2 — Nouveaux Schémas (NO API BREAK)

### Step 2.1 : Créer `schemas/faq.ts`

**Fichier** : `studio/schemas/faq.ts`

```typescript
import type { Rule } from '@sanity/types'

export const faq = {
  name: 'faq',
  title: '❓ Question & Réponse',
  type: 'document',
  description: 'FAQ réutilisables. Crée une question une seule fois, elle apparaît partout sur le site.',
  
  preview: {
    select: { title: 'question', subtitle: 'category' },
    prepare(sel) {
      return {
        title: sel.title?.substring(0, 50) + '...' || 'Sans question',
        subtitle: `📂 ${sel.subtitle || 'Général'}`
      }
    }
  },

  fields: [
    {
      name: 'category',
      title: '📂 Catégorie',
      type: 'string',
      options: {
        list: [
          { title: '💬 Général', value: 'general' },
          { title: '📖 Recettes', value: 'recipes' },
          { title: '🏢 Privatisation Entreprises', value: 'privatisation' },
          { title: '🎉 Événements Privés', value: 'events' },
          { title: '🍷 Restaurant Éphémère', value: 'restaurant' },
          { title: '🛒 Boutique & ebooks', value: 'shop' },
          { title: '📧 Newsletter', value: 'newsletter' },
          { title: '🌿 Nutrition & Santé', value: 'nutrition' },
          { title: '📞 Contact & Services', value: 'contact' }
        ]
      },
      description: 'Choisis où cette FAQ apparaît.',
      validation: (Rule: Rule) => Rule.required()
    },

    {
      name: 'question',
      title: '❓ La question',
      type: 'string',
      description: 'La question sous forme que le client la pose. Commence par "Que", "Comment", "Pourquoi", "Où", etc.',
      validation: (Rule: Rule) => Rule.required().min(5).max(150)
    },

    {
      name: 'answer',
      title: '✍️ La réponse',
      type: 'text',
      rows: 8,
      description: 'Réponse courte et claire. 100-500 caractères idéalement. Sois pratique.',
      validation: (Rule: Rule) => Rule.required().min(10)
    },

    {
      name: 'order',
      title: '🔢 Ordre d\'affichage',
      type: 'number',
      initialValue: 0,
      description: '0 = première, 1 = deuxième, etc. Les FAQs s\'affichent du plus petit au plus grand.',
      validation: (Rule: Rule) => Rule.min(0)
    },

    {
      name: 'isVisible',
      title: '👁️ Afficher sur le site',
      type: 'boolean',
      initialValue: true,
      description: 'Désactive pour masquer sans supprimer (utile pour test).'
    }
  ]
}
```

**À ajouter** : Dans `studio/schemas/index.ts`

```typescript
import { faq } from './faq'

export const schemaTypes = [
  // ... autres
  faq  // ← ajouter ici
]
```

**Test** :
```bash
cd studio
npm run dev
# Va dans ⚙️ Configuration Avancée (à créer en phase 1)
# Tu devrais voir "Question & Réponse"
# Crée une FAQ test
```

---

### Step 2.2 : Créer `schemas/dateSlot.ts` (Réutilisable)

**Fichier** : `studio/schemas/dateSlot.ts`

```typescript
import type { Rule } from '@sanity/types'

export const dateSlot = {
  name: 'dateSlot',
  title: 'Créneau horaire',
  type: 'object',
  description: 'Un jour + un statut. Réutilisable pour restaurant, agenda, etc.',

  preview: {
    select: { 
      date: 'date',
      status: 'status'
    },
    prepare(sel) {
      const date = sel.date ? new Date(sel.date).toLocaleDateString('fr-FR') : '?'
      return {
        title: `📅 ${date}`,
        subtitle: sel.status || 'Disponible'
      }
    }
  },

  fields: [
    {
      name: 'date',
      title: '📅 Date',
      type: 'date',
      description: 'Clique sur le calendrier pour choisir.',
      validation: (Rule: Rule) => Rule.required()
    },

    {
      name: 'status',
      title: '🟢 Statut',
      type: 'string',
      options: {
        list: [
          { title: '✅ Disponible', value: 'Disponible' },
          { title: '⚠️ Complet', value: 'Complet' },
          { title: '❌ Indisponible', value: 'Indisponible' }
        ],
        layout: 'dropdown'
      },
      initialValue: 'Disponible',
      description: 'Que montrer aux visiteurs ce jour-là.'
    },

    {
      name: 'isVisible',
      title: '👁️ Afficher',
      type: 'boolean',
      initialValue: true,
      description: 'Cache temporairement ce créneau sans le supprimer.'
    }
  ]
}
```

**À ajouter** : Dans `studio/schemas/index.ts`

```typescript
import { dateSlot } from './dateSlot'

export const schemaTypes = [
  // ... autres
  dateSlot  // ← ajouter ici
]
```

---

### Step 2.3 : Mettre à jour `restaurant.ts` pour utiliser `dateSlot`

**Avant** :
```typescript
{
  name: 'dateSlots',
  title: 'Calendrier des soirées',
  type: 'array',
  of: [
    {
      type: 'object',
      fields: [
        { name: 'date', title: 'Date', type: 'date' },
        { name: 'status', title: 'Statut', type: 'string', options: { list: [...] } },
        // Dupliqué !
      ]
    }
  ]
}
```

**Après** :
```typescript
{
  name: 'dateSlots',
  title: '📅 Calendrier des soirées',
  type: 'array',
  of: [{ type: 'dateSlot' }],  // ← Réutilise dateSlot
  description: 'Ajoute/modifie les dates de tes soirées restaurant.'
}
```

---

### Step 2.4 : Mettre à jour `companyAgenda.ts` pour utiliser `dateSlot`

**Avant** :
```typescript
{
  name: 'slots',
  title: 'Créneaux disponibles',
  type: 'array',
  components: { input: CompanyAgendaCalendarInput },
  of: [
    {
      type: 'object',
      fields: [
        { name: 'date', ... },
        { name: 'status', ... },
      ]
    }
  ]
}
```

**Après** :
```typescript
{
  name: 'slots',
  title: '📅 Créneaux disponibles',
  type: 'array',
  of: [{ type: 'dateSlot' }],
  description: 'Clique sur le calendrier pour ajouter/modifier des créneaux.',
  // Note: Le composant CompanyAgendaCalendarInput doit être mis à jour
  // pour fonctionner avec des objets dateSlot (demande au dev)
}
```

---

### Step 2.5 : Créer `schemas/locationInfo.ts`

**Fichier** : `studio/schemas/locationInfo.ts`

```typescript
export const locationInfo = {
  name: 'locationInfo',
  title: '📍 Lieu — Infos Générales',
  type: 'document',
  description: 'Infos partagées entre privatisation, restaurant, etc. : adresse, parking, galerie, capacité.',

  fields: [
    {
      name: 'title',
      title: 'Titre interne',
      type: 'string',
      initialValue: 'Gastronomade — Infos Lieu',
      description: 'Juste pour te repérer. Pas visible sur le site.'
    },

    {
      name: 'address',
      title: '📍 Adresse complète',
      type: 'string',
      initialValue: 'Gastronomade, Wavre, Belgique',
      description: 'Ex: "Route de X, 1000 Wavre". Utilisée pour cartes Google.'
    },

    {
      name: 'coordinates',
      title: '📌 Coordonnées GPS',
      type: 'object',
      hidden: ({ parent }) => !parent?.address,
      fields: [
        {
          name: 'lat',
          title: 'Latitude',
          type: 'number',
          description: 'Ex: 50.7170'
        },
        {
          name: 'lng',
          title: 'Longitude',
          type: 'number',
          description: 'Ex: 4.6155'
        }
      ],
      description: 'Copie-colle depuis Google Maps.'
    },

    {
      name: 'contact',
      title: '📞 Contact',
      type: 'object',
      fields: [
        {
          name: 'phone',
          title: 'Téléphone principal',
          type: 'string',
          description: 'Avec préfixe si international. Ex: "+32 2 123 45 67"'
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
          description: 'Email principal (muriel@...)'
        },
        {
          name: 'whatsapp',
          title: 'WhatsApp (optionnel)',
          type: 'string',
          description: 'Si différent du téléphone'
        }
      ]
    },

    {
      name: 'capacity',
      title: '👥 Capacité',
      type: 'string',
      initialValue: '2-50 personnes',
      description: 'Ex: "50 personnes", "2-100 selon config". Pour les visiteurs.'
    },

    {
      name: 'highlights',
      title: '✨ Points forts',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: [
        '🚗 À 1 km de la E411',
        '🅿️ Parking facile et gratuit',
        '🌿 Cadre naturel & chaleureux',
        '🍳 Cuisine équipée',
        '🔥 Cheminée'
      ],
      description: 'Ce qui rend le lieu unique. Ordre : de haut en bas.'
    },

    {
      name: 'services',
      title: '🛠️ Services & Équipements',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: [
        'Parking gratuit',
        'WiFi',
        'Cuisine équipée',
        'Terrasse',
        'Cheminée',
        'Tables reconfigurables',
        'Tableau blanc / Paper',
        'Vidéoprojecteur'
      ],
      description: 'Équipements disponibles. Cochés = disponibles.'
    },

    {
      name: 'gallery',
      title: '📸 Photos du lieu',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Description (accessibilité)',
              type: 'string',
              description: 'Ex: "Terrasse avec vue sur le jardin". Pour lecteur d\'écran.'
            }
          ]
        }
      ],
      description: 'Ajoute des photos de : extérieur, intérieur, patio, cuisine, salles.'
    },

    {
      name: 'hours',
      title: '⏰ Horaires (optionnel)',
      type: 'object',
      fields: [
        {
          name: 'monday_friday',
          title: 'Lun-Ven',
          type: 'string',
          description: 'Ex: "9h-18h"'
        },
        {
          name: 'saturday',
          title: 'Samedi',
          type: 'string'
        },
        {
          name: 'sunday',
          title: 'Dimanche',
          type: 'string'
        }
      ]
    },

    {
      name: 'accessibilityNotes',
      title: '♿ Accessibilité',
      type: 'text',
      rows: 3,
      description: 'Y a-t-il un ascenseur ? Les WC sont-ils adaptés PMR ? Reste à niveau ?',
      placeholder: 'Ex: "Accessible en fauteuil roulant sauf étage. WC adapté au RDC."'
    }
  ]
}
```

**À ajouter** : Dans `studio/schemas/index.ts`

```typescript
import { locationInfo } from './locationInfo'

export const schemaTypes = [
  // ...
  locationInfo  // ← ajouter ici
]
```

---

### ✅ Fin de Phase 2

**Validations** :
- [ ] `faq.ts` crée et testé
- [ ] `dateSlot.ts` crée et réutilisé dans restaurant + agenda
- [ ] `locationInfo.ts` crée et complète
- [ ] Sanity redémarre sans erreurs
- [ ] Muriel peut créer une FAQ, une date de restaurant, etc.

---

## PHASE 3 : SEMAINE 3 — Intégration & Tests

### Step 3.1 : Intégrer FAQs partout

Les FAQs apparaissent maintenant sur :
- Page recettes (FAQ recettes)
- Page restaurant (FAQ restaurant)
- Page privatisation (FAQ privatisation)
- Etc.

**Chaque page** doit être mise à jour pour lire depuis Sanity au lieu d'hardcoder.

**Exemple pour `src/pages/restaurant-wavre.astro`** :

```typescript
// AVANT (hardcodé dans le fichier)
const faqs = [
  { question: 'Quand...', answer: '...' },
  { question: 'Comment...', answer: '...' }
]

// APRÈS (depuis Sanity)
import { sanityClient, queries } from '../lib/sanity'

const faqs = await sanityClient.fetch(
  `*[_type == "faq" && category == "restaurant" && isVisible == true] | order(order asc)`
)
```

**Fichiers à mettre à jour** :
- [ ] `src/pages/recettes.astro`
- [ ] `src/pages/restaurant-wavre.astro`
- [ ] `src/pages/evenements-prives-wavre.astro`
- [ ] `src/pages/privatisation-entreprise-wavre.astro`
- [ ] `src/pages/contact.astro`

---

### Step 3.2 : Tester avec Muriel

**Durée** : 30 min

Demande à Muriel de :
1. ✅ Trouver "Je veux changer le titre de la page d'accueil" → Devrait trouver `🎯 Mettre à jour une page`
2. ✅ Créer une FAQ → Devrait trouver `📚 Contenu Éducatif → Questions Fréquentes`
3. ✅ Modifier les tarifs privatisation → Devrait trouver `🏢 Offres & Lieu → Privatisation Entreprises`
4. ✅ Ajouter une date restaurant → Devrait trouver `🏢 Offres & Lieu → Restaurant Éphémère`

**Si elle hésite sur 1+ questions** :
- Ajouter plus de descriptions
- Ajouter des help bubbles Sanity (si possible)
- Revoir la terminologie utilisée

---

### Step 3.3 : Valider les requêtes Sanity

**Vérifier** dans `src/lib/sanity.ts` que toutes les queries existent :
- [ ] `query for faq by category`
- [ ] `query for dateSlots`
- [ ] `query for locationInfo`

**Ajouter si manquant** :

```typescript
// src/lib/sanity.ts

export const queries = {
  // ...
  
  // FAQ
  faqByCategory: (category: string) => `
    *[_type == "faq" && category == "${category}" && isVisible == true]
    | order(order asc)
  `,

  // Location Info
  locationInfo: `
    *[_type == "locationInfo"][0]
  `,

  // ... etc
}
```

---

## PHASE 4 : SEMAINE 4 — Documentation

### Step 4.1 : Créer `studio/GUIDE_UTILISATEUR.md`

Fichier pour Muriel (plain English, pas de jargon tech) :

```markdown
# 📘 Guide : Comment utiliser le Studio

## Avant de commencer

- Le studio est le "panneau de contrôle" du site. Ici tu changes le contenu.
- Quand tu cliques "Publier", tes changements apparaissent en direct sur le site (dans 2-5 min).
- Si tu casses quelque chose, tu peux toujours "Defaire" (Ctrl+Z).

## Structure du Studio

### 🎯 "Mettre à jour une page"
**Utilise ceci si** tu veux changer le contenu d'une page entière.

Exemples :
- Changer le titre "À propos"
- Modifier la description de tes offres
- Ajouter une photo à la page Thermomix

### 🏢 "Offres & Localisation"
**Utilise ceci pour** tout ce qui concerne le lieu, tes offres, ou les agendas.

Exemples :
- Ajouter une date restaurant
- Changer le prix d'une privatisation
- Ajouter une photo du lieu
- Mettre à jour l'adresse

### 📚 "Contenu Éducatif"
**Utilise ceci pour** tes recettes, questions fréquentes, future blog.

Exemples :
- Créer une nouvelle recette
- Répondre à une question fréquente
- Modifier ingrédients d'une recette existante

### 🛒 "Boutique"
**Utilise ceci pour** gérer tes produits à vendre (eBooks, packs).

Exemples :
- Lancer un nouveau pack
- Changer le prix d'un ebook
- Ajouter une description

### 📧 "Communication"
**Utilise ceci pour** la newsletter.

Exemples :
- Voir qui s'est inscrit
- Exporter la liste d'emails
- Envoyer une newsletter (bientôt)

### ⚙️ "Configuration Avancée"
**Utilise ceci pour** les réglages globaux (rare).

Exemples :
- Changer la navigation principale
- Ajouter un lien dans le footer
- Paramètres emails (bientôt)

## Vocabulaire

| Mot | Signification |
|-----|--------------|
| **Publier** | Sauvegarder et envoyer sur le site |
| **Brouillon** | Sauvegardé mais pas visible sur le site |
| **Slug** | L'URL machine (ex: `/ma-recette` pour title "Ma Recette") |
| **Hero** | La grande section avec image en haut de la page |
| **CTA** | "Appel à l'action" = le bouton (ex: "Prendre rendez-vous") |
| **Visible** | Checkbox "Afficher" = montré ou caché sur le site |

---

## Tâche par tâche

### Je veux ajouter une recette

1. Va dans 📚 Contenu Éducatif → Les Recettes
2. Clique ➕ "Créer"
3. Remplis :
   - **Titre** (ex: "Soupe de courges")
   - **Catégorie** (Entrée / Plat / Dessert / etc.)
   - **Photo** (drag-drop une image)
   - **Description courte** (2-3 lignes)
   - **Ingrédients** (liste)
   - **Étapes** (mode "faire la cuisine" = avec durations)
   - **Nutrition** (optionnel : calories, type)
4. Clique "Publier"
5. Attends 2-5 min, puis va sur le site pour vérifier.

### Je veux ajouter une date restaurant

1. Va dans 🏢 Offres & Lieu → Restaurant Éphémère
2. Scroll jusqu'à "Calendrier des soirées"
3. Clique ➕ "Ajouter"
4. Choisis la date (clique sur le calendrier)
5. Choisis le statut : Disponible / Complet / Indisponible
6. Clique "Publier"

### Je veux changer le prix de privatisation

1. Va dans 🏢 Offres & Lieu → Privatisation Entreprises
2. Trouve le champ "Prix location du lieu"
3. Change "400€" en ce que tu veux
4. Clique "Publier"

### Je veux ajouter une FAQ

1. Va dans 📚 Contenu Éducatif → Questions Fréquentes
2. Clique ➕ "Créer"
3. Remplis :
   - **Catégorie** (Recettes / Restaurant / Privatisation / etc.)
   - **Question** (ce que les clients demandent)
   - **Réponse** (la solution)
4. Clique "Afficher sur le site" (checke la box)
5. Clique "Publier"
6. ✓ La FAQ apparaît automatiquement sur la page concernée!

---

## Besoin d'aide ?

- Y a un bug ? Contact [email dev]
- Besoin d'ajout majeur ? Demande [email dev]
- Avoir une question sur le studio ? Relis ce guide ou demande

---
```

---

### Step 4.2 : Créer des vidéos tuto (Loom)

**Vidéos rapides (+3 min max)** :

1. **"Comment accéder au studio"** (1 min)
   - URL
   - Login
   - 1ère impression

2. **"Ajouter une recette"** (3 min)
   - Naviguer
   - Remplir tous les champs
   - Publier
   - Vérifier sur le site

3. **"Ajouter une date restaurant"** (2 min)
   - Naviguer
   - Ajouter à calendrier
   - Publier

4. **"Modifier un texte de page"** (2 min)
   - Ex: Changer titre homepage
   - Champ vs preview
   - Publier

5. **"Créer une FAQ"** (2 min)
   - Nouvelle FAQ
   - Apparaît automatiquement
   - Modifier après

---

### Step 4.3 : Updater le README studio

**Fichier** : `studio/README.md`

Rajoute une section :

```markdown
## 🎯 Pour Muriel (Gestionnaire du site)

Commence ici : [**GUIDE_UTILISATEUR.md**](./GUIDE_UTILISATEUR.md)

La plupart de tes tâches se font dans le studio. Voici où :

| Tâche | Où ? |
|-------|------|
| Ajouter/modifier une recette | 📚 Contenu Éducatif → Les Recettes |
| Ajouter une date restaurant | 🏢 Offres & Lieu → Restaurant |
| Modifier un prix | 🏢 Offres & Lieu → [L'offre] |
| Changer le titre d'une page | 🎯 Mettre à jour une page → [La page] |
| Créer une FAQ | 📚 Contenu Éducatif → Questions Fréquentes |
| Voir les inscriptions newsletter | 📧 Communication → Newsletter |

Pour des questions, ouvre ce guide ou contact [dev].

---

## 🔧 Pour [Dev] (Développeur)

[...reste du README...]
```

---

## 📋 Checklist Finale Avant Lancement

### Phase 1 ✅
- [ ] Desk restructuré
- [ ] Descriptions ajoutées
- [ ] Emojis partout
- [ ] Visibility allégée
- [ ] Mentionné à Muriel : "C'est prêt ?"

### Phase 2 ✅
- [ ] FAQ schéma créé
- [ ] dateSlot créé et réutilisé
- [ ] locationInfo créé
- [ ] Index.ts mis à jour
- [ ] Sanity redémarre sans erreur

### Phase 3 ✅
- [ ] FAQs intégrées dans les pages
- [ ] Test Muriel passé
- [ ] Queries Sanity vérifiées

### Phase 4 ✅
- [ ] GUIDE_UTILISATEUR.md écrit
- [ ] Vidéos tuto créées (5x)
- [ ] README studio mis à jour
- [ ] Muriel a reçu les docs + vidéos

---

## 🚀 Après le lancement

**Semaine suivante** :
- Muriel l'utilise seule
- Collect feedback : "C'est confus ?" "Besoin d'antre ?"
- Itérer sur descriptions/UX

**Mois 2** :
- Ajouter blog (`blogArticle` schéma)
- Ajouter codes promo
- Intégration Stripe pour boutique

---

## 📊 Temps estimé par phase

| Phase | Tâches | Temps | Bloquant ? |
|-------|--------|-------|-----------|
| 1 | Restructure + Descriptions | 8-10h | Non |
| 2 | Nouveaux schémas | 6-8h | Non |
| 3 | Intégration + Tests | 4-6h | Non |
| 4 | Docs + Vidéos | 4-6h | Non |
| **Total** | | **22-30h** | **NON** |

**Avantage** : Aucune étape ne casse l'API actuelle (backward compatible).

---

**Questions ?** Demande avant de commencer ! 🚀

