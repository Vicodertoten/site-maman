export const siteSettings = {
  name: 'siteSettings',
  title: 'Réglages du site',
  type: 'document',
  fieldsets: [
    {
      name: 'visibility',
      title: 'Affichage (avancé)',
      options: { collapsible: true, collapsed: true }
    }
  ],
  fields: [
    {
      name: 'siteName',
      title: 'Nom du site',
      type: 'string',
      initialValue: 'Gastronomade'
    },
    {
      name: 'siteTagline',
      title: 'Accroche / sous-titre',
      type: 'string',
      initialValue: 'Manger Vrai avec Muriel Cruysmans · Wavre'
    },
    {
      name: 'navigation',
      title: 'Navigation principale',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'href', title: 'Lien', type: 'string' },
            {
              name: 'isVisible',
              title: 'Afficher',
              type: 'boolean',
              initialValue: true
            }
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'href'
            }
          }
        }
      ],
      initialValue: [
        { label: 'Gastronomade', href: '/', isVisible: true },
        { label: 'Thermomix', href: '/thermomix', isVisible: true },
        { label: 'Cours & Coaching', href: '/about', isVisible: true },
        { label: 'Recettes', href: '/recettes', isVisible: true },
        { label: 'Contact', href: '/contact', isVisible: true }
      ]
    },
    {
      name: 'footer',
      title: 'Footer',
      type: 'object',
      fields: [
        {
          name: 'brandTitle',
          title: 'Nom (footer)',
          type: 'string',
          initialValue: 'Gastronomade'
        },
        {
          name: 'brandSubtitle',
          title: 'Sous-titre (footer)',
          type: 'string',
          initialValue: 'Manger Vrai avec Muriel Cruysmans · Wavre'
        },
        {
          name: 'contact',
          title: 'Contact',
          type: 'object',
          fields: [
            { name: 'phone', title: 'Téléphone', type: 'string' },
            { name: 'email', title: 'Email', type: 'string' }
          ]
        },
        {
          name: 'socialLinks',
          title: 'Réseaux sociaux',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'platform', title: 'Plateforme', type: 'string' },
                { name: 'url', title: 'URL', type: 'url' },
                { name: 'label', title: 'Libellé', type: 'string' },
                { name: 'isVisible', title: 'Afficher', type: 'boolean', initialValue: true }
              ],
              preview: {
                select: {
                  title: 'platform',
                  subtitle: 'url'
                }
              }
            }
          ],
          initialValue: [
            {
              platform: 'Instagram',
              url: 'https://www.instagram.com/manger_vrai',
              label: '@manger_vrai',
              isVisible: true
            },
            {
              platform: 'YouTube',
              url: 'https://www.youtube.com/@murielcruysmans5423/shorts',
              label: 'YouTube',
              isVisible: true
            }
          ]
        },
        {
          name: 'copyrightText',
          title: 'Copyright',
          type: 'string',
          description: 'Utilisez {year} pour l’année en cours.',
          initialValue: '© {year} Gastronomade - Manger Vrai. Tous droits réservés.'
        }
      ]
    },
    {
      name: 'address',
      title: 'Adresse',
      type: 'object',
      fields: [
        { name: 'street', title: 'Rue', type: 'string' },
        { name: 'city', title: 'Ville', type: 'string' },
        { name: 'region', title: 'Région', type: 'string' },
        { name: 'postalCode', title: 'Code postal', type: 'string' },
        { name: 'country', title: 'Pays', type: 'string', initialValue: 'BE' },
        { name: 'isVisible', title: 'Afficher', type: 'boolean', initialValue: true }
      ],
      description: 'Utilisée pour le footer et les données structurées.'
    },
    {
      name: 'seo',
      title: 'SEO par défaut',
      type: 'object',
      fields: [
        {
          name: 'defaultTitle',
          title: 'Titre par défaut',
          type: 'string',
          initialValue: 'Gastronomade - Manger Vrai'
        },
        {
          name: 'defaultDescription',
          title: 'Description par défaut',
          type: 'text',
          rows: 3
        },
        {
          name: 'shareImage',
          title: 'Image de partage (OpenGraph)',
          type: 'image',
          options: { hotspot: true }
        },
        {
          name: 'siteUrl',
          title: 'URL du site',
          type: 'url',
          description: 'Optionnel si défini dans les variables d’environnement.'
        }
      ]
    },
    {
      name: 'showNavigation',
      title: 'Afficher la navigation',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    },
    {
      name: 'showFooter',
      title: 'Afficher le footer',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    },
    {
      name: 'showNewsletter',
      title: 'Afficher la newsletter',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    }
  ]
}
