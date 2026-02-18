// studio/schemas/home.ts
export const home = {
  name: 'home',
  title: 'Page d\'accueil',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre de la page',
      type: 'string',
      initialValue: 'Gastronomade - Manger Vrai | Muriel Cruysmans'
    },
    {
      name: 'hero',
      title: 'Hero (commun)',
      type: 'pageHero'
    },
    {
      name: 'heroTitle',
      title: 'Titre principal',
      type: 'string',
      initialValue: 'Un lieu d’exception pour vos rencontres.',
      description: 'Phrase principale affichée en haut de la page.'
    },
    {
      name: 'heroSubtitle',
      title: 'Surtitre / kicker',
      type: 'text',
      initialValue: 'Gastronomade',
      description: 'Petit texte au-dessus du titre (court).'
    },
    {
      name: 'heroDescription',
      title: 'Description principale',
      type: 'text',
      initialValue: 'À Wavre, à 1 km de la E411, Gastronomade accueille réunions, événements privés et dîners. Un cadre naturel, chaleureux et simple d’accès.',
      description: 'Texte sous le titre (2 phrases max).'
    },
    {
      name: 'heroBackgroundImage',
      title: 'Image de fond du hero',
      type: 'image',
      options: { hotspot: true },
      description: 'Image large. Le texte reste lisible grâce au dégradé.'
    },
    {
      name: 'locationSectionTitle',
      title: 'Titre section expériences',
      type: 'string',
      initialValue: 'Privatisation & restaurant éphémère',
      description: 'Titre du bloc qui présente les deux offres.'
    },
    {
      name: 'locationSectionDescription',
      title: 'Description section expériences',
      type: 'text',
      initialValue: 'Deux offres complémentaires, un même esprit : chaleur, nature et cuisine sincère.',
      description: 'Court paragraphe d’introduction.'
    },
    {
      name: 'locationGallery',
      title: 'Photos du lieu',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Texte alternatif',
              type: 'string'
            }
          ]
        }
      ],
      description: 'Photos pour contextualiser le lieu sur la page d’accueil'
    },
    {
      name: 'restaurantSectionTitle',
      title: 'Titre section restaurant',
      type: 'string',
      initialValue: 'Le jeudi de Gastronomade'
    },
    {
      name: 'restaurantSectionDescription',
      title: 'Description section restaurant',
      type: 'text',
      initialValue: 'Un menu végétal, créatif et de saison. La nature s’invite dans vos assiettes.'
    },
    {
      name: 'ctaTitle',
      title: 'Titre section À propos',
      type: 'string',
      initialValue: 'L’histoire de Gastronomade',
      description: 'Petit bloc en bas de page avec lien vers About.'
    },
    {
      name: 'ctaExcerpt',
      title: 'Extrait court section À propos',
      type: 'text',
      initialValue: 'Introduire du plaisir et du bon sens en respectant les principes d’une nutrition équilibrée.',
      description: 'Court extrait personnel (1 phrase).'
    },
    {
      name: 'ctaDescription',
      title: 'Texte section À propos',
      type: 'text',
      initialValue: 'Gastronomade est né d’un rêve de famille. Muriel y partage sa cuisine végétale et son goût du vivant, dans un lieu chaleureux en pleine nature.'
    },
    {
      name: 'ctaPrimaryButton',
      title: 'Texte bouton principal (lien About)',
      type: 'string',
      initialValue: 'Découvrir notre histoire',
      description: 'Bouton qui mène vers la page À propos.'
    }
  ]
}
