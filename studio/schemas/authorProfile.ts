export const authorProfile = {
  name: 'authorProfile',
  title: 'Auteur',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nom',
      type: 'string',
      initialValue: 'Muriel Cruysmans'
    },
    {
      name: 'hero',
      title: 'Hero (commun)',
      type: 'pageHero'
    },
    {
      name: 'title',
      title: 'Titre',
      type: 'string',
      description: 'Ex: Coach en cuisine santé'
    },
    {
      name: 'tagline',
      title: 'Accroche',
      type: 'string',
      description: 'Phrase courte sous le nom.'
    },
    {
      name: 'shortBio',
      title: 'Bio courte',
      type: 'text',
      rows: 4,
      description: '120–180 mots pour la page Cours & Coaching.'
    },
    {
      name: 'longBio',
      title: 'Bio longue',
      type: 'text',
      rows: 8,
      description: 'Version complète pour la page Auteur.'
    },
    {
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'journeyIntro',
      title: 'Parcours — introduction',
      type: 'text',
      rows: 3
    },
    {
      name: 'journeyItems',
      title: 'Parcours — éléments',
      type: 'array',
      of: [{ type: 'text' }]
    },
    {
      name: 'visionTitle',
      title: 'Vision — titre',
      type: 'string'
    },
    {
      name: 'visionParagraphs',
      title: 'Vision — paragraphes',
      type: 'array',
      of: [{ type: 'text' }]
    },
    {
      name: 'signatureTitle',
      title: 'Fil rouge — titre',
      type: 'string'
    },
    {
      name: 'signatureParagraphs',
      title: 'Fil rouge — paragraphes',
      type: 'array',
      of: [{ type: 'text' }]
    },
    {
      name: 'publications',
      title: 'Publications & médias',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Titre', type: 'string' },
            { name: 'type', title: 'Type', type: 'string', description: 'Livre, interview, collaboration…' },
            { name: 'year', title: 'Année', type: 'string' },
            { name: 'publisher', title: 'Éditeur / média', type: 'string' },
            { name: 'url', title: 'Lien', type: 'url' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
            { name: 'coverImage', title: 'Couverture', type: 'image', options: { hotspot: true } },
            { name: 'logo', title: 'Logo média', type: 'image', options: { hotspot: true } }
          ]
        }
      ]
    },
    {
      name: 'proofs',
      title: 'Preuves sociales',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'value', title: 'Valeur', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 }
          ]
        }
      ]
    },
    {
      name: 'testimonials',
      title: 'Témoignages',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Nom', type: 'string' },
            { name: 'role', title: 'Rôle', type: 'string' },
            { name: 'quote', title: 'Citation', type: 'text', rows: 3 }
          ]
        }
      ]
    },
    {
      name: 'faqs',
      title: 'FAQ',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Question', type: 'string' },
            { name: 'answer', title: 'Réponse', type: 'text', rows: 3 }
          ]
        }
      ]
    },
    {
      name: 'ctaLabel',
      title: 'CTA — libellé',
      type: 'string'
    },
    {
      name: 'ctaLink',
      title: 'CTA — lien',
      type: 'string'
    }
  ]
}
