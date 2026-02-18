// schemas/location.ts
export const location = {
  name: 'location',
  title: 'Privatisation du lieu',
  type: 'document',
  fieldsets: [
    {
      name: 'visibility',
      title: 'Affichage (avancé)',
      options: { collapsible: true, collapsed: true }
    },
    {
      name: 'faqs_section',
      title: '❓ Questions Fréquentes',
      options: { collapsible: true, collapsed: false }
    }
  ],
  fields: [
    {
      name: 'type',
      title: 'Type d’offre',
      type: 'string',
      options: {
        list: [
          { title: 'Sociétés', value: 'societe' },
          { title: 'Privé', value: 'prive' }
        ]
      },
      description: 'Choisissez la catégorie de l’offre.'
    },
    {
      name: 'title',
      title: 'Titre de l’offre',
      type: 'string',
      description: 'Ex: "Réunions d’équipe" ou "Événements privés".'
    },
    {
      name: 'hero',
      title: 'Hero (commun)',
      type: 'pageHero'
    },
    {
      name: 'subtitle',
      title: 'Sous-titre',
      type: 'string',
      description: 'Texte court sous le titre.'
    },
    {
      name: 'price',
      title: 'Prix HTVA',
      type: 'string',
      initialValue: '400€',
      description: 'Prix de location en euros HTVA'
    },
    {
      name: 'features',
      title: 'Points forts (optionnel)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Liste des avantages et équipements. Peut rester vide.',
      initialValue: [
        'Cadre inspirant et chaleureux',
        'Cuisine entièrement équipée',
        'Parking privé',
        'Accès facile via E411'
      ]
    },
    {
      name: 'description',
      title: 'Description détaillée',
      type: 'text',
      description: 'Texte plus long pour la page de détails.'
    },
    {
      name: 'details',
      title: 'Détails (liste)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Points supplémentaires à afficher (conditions, options, etc.).'
    },
    {
      name: 'ctaLabel',
      title: 'Bouton — Libellé',
      type: 'string',
      initialValue: 'Demander un devis'
    },
    {
      name: 'ctaLink',
      title: 'Bouton — Lien',
      type: 'string',
      initialValue: '/contact'
    },
    {
      name: 'maxCapacity',
      title: 'Capacité maximale',
      type: 'number',
      description: 'Nombre maximum de personnes'
    },
    {
      name: 'image',
      title: 'Image représentative',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'Photo de l\'espace',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'isVisible',
      title: 'Afficher cette offre',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    },

    {
      name: 'faqs',
      title: 'Questions Fréquentes',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'question',
            title: '❓ Question',
            type: 'string',
            validation: (Rule: any) => Rule.required().min(10).max(200)
          },
          {
            name: 'answer',
            title: '✅ Réponse',
            type: 'text',
            rows: 3,
            validation: (Rule: any) => Rule.required().min(20).max(1000)
          },
          {
            name: 'isVisible',
            title: '👁️ Afficher cette FAQ',
            type: 'boolean',
            initialValue: true
          },
          {
            name: 'order',
            title: '🔢 Ordre',
            type: 'number',
            initialValue: 0
          }
        ]
      }],
      fieldset: 'faqs_section',
      description: 'Les questions les plus posées sur la privatisation.'
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'type',
      media: 'image'
    }
  }
}
