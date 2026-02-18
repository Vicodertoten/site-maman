// schemas/restaurant.ts
export const restaurant = {
  name: 'restaurant',
  title: 'Restaurant éphémère',
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
      name: 'title',
      title: 'Titre (optionnel)',
      type: 'string',
      description: 'Ex: "Soirée d’hiver" ou laissez vide.'
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
      initialValue: 'Un jeudi par mois',
      description: 'Texte court sous le titre.'
    },
    {
      name: 'image',
      title: 'Image de la carte',
      type: 'image',
      options: { hotspot: true },
      description: 'Image affichée sur la carte Restaurant de la homepage.'
    },
    {
      name: 'imageAlt',
      title: 'Texte alternatif (image)',
      type: 'string',
      description: 'Décrivez l’image pour l’accessibilité.'
    },
    {
      name: 'menuTitle',
      title: 'Titre de la section menu',
      type: 'string',
      initialValue: 'Menu végétal & sauvage',
      description: 'Titre de la section menu'
    },
    {
      name: 'reservationTitle',
      title: 'Titre de la section réservation',
      type: 'string',
      initialValue: 'Prochaines soirées',
      description: 'Titre au-dessus des dates.'
    },
    {
      name: 'price',
      title: 'Prix par personne',
      type: 'number',
      initialValue: 50,
      description: 'Prix en euros par personne'
    },
    {
      name: 'menuDescription',
      title: 'Description du menu',
      type: 'text',
      description: 'Décrivez le menu unique de la soirée',
      initialValue: 'Un menu unique, créatif et très végétal, cuisiné au rythme des saisons.'
    },
    {
      name: 'highlights',
      title: 'Points forts (liste)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Détails à afficher sur la carte (ex: menu 3 services, produits locaux, etc.).'
    },
    {
      name: 'dateSlots',
      title: 'Prochaines dates (avec statut)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'dateSlot',
        fields: [
          { name: 'date', title: 'Date', type: 'date' },
          {
            name: 'status',
            title: 'Statut',
            type: 'string',
            options: {
              list: [
                { title: 'Disponible', value: 'Disponible' },
                { title: 'Complet', value: 'Complet' }
              ]
            },
            initialValue: 'Disponible'
          },
          {
            name: 'isVisible',
            title: 'Afficher',
            type: 'boolean',
            initialValue: true
          }
        ]
      }],
      description: 'Ajoutez les dates et indiquez si elles sont complètes.'
    },
    {
      name: 'minGuests',
      title: 'Nombre minimum de personnes',
      type: 'number',
      initialValue: 4,
      description: 'Minimum de convives requis'
    },
    {
      name: 'depositAmount',
      title: 'Montant de l\'acompte',
      type: 'number',
      initialValue: 25,
      description: 'Acompte par personne en euros'
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
      description: 'Les questions les plus posées sur les réservations.'
    }
  ]
}
