export const pageHero = {
  name: 'pageHero',
  title: 'Hero (commun)',
  type: 'object',
  fields: [
    {
      name: 'variant',
      title: 'Type de hero',
      type: 'string',
      options: {
        list: [
          { title: 'Simple', value: 'simple' },
          { title: 'Split', value: 'split' },
          { title: 'Utilitaire', value: 'utilitaire' }
        ],
        layout: 'radio'
      },
      initialValue: 'simple'
    },
    {
      name: 'kicker',
      title: 'Kicker',
      type: 'string'
    },
    {
      name: 'title',
      title: 'Titre',
      type: 'string'
    },
    {
      name: 'subtitle',
      title: 'Sous-titre',
      type: 'text',
      rows: 3
    },
    {
      name: 'showUpdatedDate',
      title: 'Afficher la date de mise à jour',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'ctaCount',
      title: 'Nombre de boutons CTA',
      type: 'number',
      options: {
        list: [
          { title: '1 bouton', value: 1 },
          { title: '2 boutons', value: 2 }
        ],
        layout: 'radio'
      },
      initialValue: 1
    },
    {
      name: 'primaryCtaLabel',
      title: 'CTA principal — Libellé',
      type: 'string'
    },
    {
      name: 'primaryCtaUrl',
      title: 'CTA principal — Lien',
      type: 'string'
    },
    {
      name: 'secondaryCtaLabel',
      title: 'CTA secondaire — Libellé',
      type: 'string',
      hidden: ({ parent }) => (parent?.ctaCount ?? 1) < 2
    },
    {
      name: 'secondaryCtaUrl',
      title: 'CTA secondaire — Lien',
      type: 'string',
      hidden: ({ parent }) => (parent?.ctaCount ?? 1) < 2
    },
    {
      name: 'splitImage',
      title: 'Image (mode split)',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.variant !== 'split'
    },
    {
      name: 'splitImageAlt',
      title: 'Image (mode split) — texte alternatif',
      type: 'string',
      hidden: ({ parent }) => parent?.variant !== 'split'
    }
  ]
}
