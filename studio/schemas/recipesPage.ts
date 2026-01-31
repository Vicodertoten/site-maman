export const recipesPage = {
  name: 'recipesPage',
  title: 'Page Recettes',
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
      name: 'pageTitle',
      title: 'Titre SEO',
      type: 'string',
      initialValue: 'Recettes - Gastronomade'
    },
    {
      name: 'heroKicker',
      title: 'Hero — Kicker',
      type: 'string',
      initialValue: 'Recettes'
    },
    {
      name: 'heroTitle',
      title: 'Hero — Titre',
      type: 'string',
      initialValue: 'Une cuisine simple, saine et généreuse.'
    },
    {
      name: 'heroDescription',
      title: 'Hero — Texte',
      type: 'text',
      description: 'Utilisez {{shop}} pour insérer le bouton boutique.',
      initialValue: 'Retrouvez ici plein de recettes gratuites. Des {{shop}} sont aussi disponibles à la vente : ils débloquent l’ebook et les recettes premium directement sur le site.'
    },
    {
      name: 'heroShopLabel',
      title: 'Hero — Bouton boutique (label)',
      type: 'string',
      initialValue: 'ebooks'
    },
    {
      name: 'filtersEmptyTitle',
      title: 'Filtres — Aucun résultat (titre)',
      type: 'string',
      initialValue: 'Aucune recette ne correspond à ces filtres.'
    },
    {
      name: 'filtersEmptyText',
      title: 'Filtres — Aucun résultat (texte)',
      type: 'string',
      initialValue: 'Essayez d\'élargir votre recherche ou de réinitialiser les filtres.'
    },
    {
      name: 'comingSoonTitle',
      title: 'Aucune recette — Titre',
      type: 'string',
      initialValue: 'Recettes à venir'
    },
    {
      name: 'comingSoonText',
      title: 'Aucune recette — Texte',
      type: 'text',
      initialValue: 'Je prépare une collection de recettes saines et délicieuses pour vous accompagner dans votre voyage culinaire.'
    },
    {
      name: 'comingSoonHighlight',
      title: 'Aucune recette — Highlight',
      type: 'text',
      initialValue: 'Prochainement : Recettes connectées au CMS pour une expérience interactive'
    },
    {
      name: 'previewCards',
      title: 'Aucune recette — Cartes de preview',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Titre', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
          { name: 'time', title: 'Temps', type: 'string' },
          { name: 'servings', title: 'Portions', type: 'string' },
          { name: 'difficulty', title: 'Difficulté', type: 'string' },
          { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] },
          { name: 'isVisible', title: 'Afficher', type: 'boolean', initialValue: true }
        ]
      }],
      initialValue: [
        {
          title: 'Salade d\'été aux herbes',
          description: 'Une salade fraîche et légère, parfaite pour les journées ensoleillées.',
          time: '15 min',
          servings: '4 pers.',
          difficulty: 'Facile',
          tags: ['Végétarien', 'Rapide'],
          isVisible: true
        },
        {
          title: 'Soupe de légumes d\'automne',
          description: 'Un velouté réconfortant aux saveurs douces et épicées.',
          time: '35 min',
          servings: '6 pers.',
          difficulty: 'Facile',
          tags: ['Vegan', 'Saison'],
          isVisible: true
        },
        {
          title: 'Bowl protéiné gourmand',
          description: 'Un repas complet et équilibré pour les journées actives.',
          time: '25 min',
          servings: '2 pers.',
          difficulty: 'Moyen',
          tags: ['Sans gluten', 'Équilibré'],
          isVisible: true
        }
      ]
    },
    {
      name: 'previewImageLabel',
      title: 'Aucune recette — Texte image',
      type: 'string',
      initialValue: 'Photo recette'
    },
    {
      name: 'shopBadgeLabel',
      title: 'Boutique — Badge',
      type: 'string',
      initialValue: 'Packs'
    },
    {
      name: 'shopButtonAriaLabel',
      title: 'Boutique — Aria label bouton',
      type: 'string',
      initialValue: 'Ouvrir la boutique'
    },
    {
      name: 'shopKicker',
      title: 'Boutique — Kicker',
      type: 'string',
      initialValue: 'Boutique'
    },
    {
      name: 'shopTitle',
      title: 'Boutique — Titre',
      type: 'string',
      initialValue: 'Packs & ebooks'
    },
    {
      name: 'shopDescription',
      title: 'Boutique — Texte',
      type: 'text',
      initialValue: 'Les recettes restent au cœur du site. Les packs ajoutent l\'ebook et débloquent les recettes premium ici.'
    },
    {
      name: 'shopCloseLabel',
      title: 'Boutique — Bouton fermer',
      type: 'string',
      initialValue: 'Fermer'
    },
    {
      name: 'shopEmptyText',
      title: 'Boutique — Aucun pack',
      type: 'text',
      initialValue: 'Les packs arrivent bientôt. Revenez très vite pour découvrir les collections premium.'
    },
    {
      name: 'shopCardPlaceholder',
      title: 'Boutique — Carte sans image',
      type: 'string',
      initialValue: 'Pack premium'
    },
    {
      name: 'shopActiveLabel',
      title: 'Boutique — Badge accès actif',
      type: 'string',
      initialValue: 'Accès actif'
    },
    {
      name: 'shopBuyLabel',
      title: 'Boutique — Bouton acheter',
      type: 'string',
      initialValue: 'Acheter'
    },
    {
      name: 'shopDownloadLabel',
      title: 'Boutique — Bouton télécharger',
      type: 'string',
      initialValue: 'Télécharger l\'ebook'
    },
    {
      name: 'accessTitle',
      title: 'Accès — Titre',
      type: 'string',
      initialValue: 'Déjà acheté un pack ?'
    },
    {
      name: 'accessText',
      title: 'Accès — Texte',
      type: 'string',
      initialValue: 'Recevez votre lien d\'accès permanent par email.'
    },
    {
      name: 'accessPlaceholder',
      title: 'Accès — Placeholder email',
      type: 'string',
      initialValue: 'Votre email d\'achat'
    },
    {
      name: 'accessButtonLabel',
      title: 'Accès — Bouton',
      type: 'string',
      initialValue: 'Envoyer le lien'
    },
    {
      name: 'showHero',
      title: 'Afficher le hero',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    },
    {
      name: 'showShop',
      title: 'Afficher la boutique',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    },
    {
      name: 'showPreviewCards',
      title: 'Afficher les cartes de preview',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    }
  ]
}
