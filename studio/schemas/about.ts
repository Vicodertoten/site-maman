// studio/schemas/about.ts
export const about = {
  name: 'about',
  title: 'À propos — Cours & coaching',
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
      name: 'title',
      title: 'Titre de la page',
      type: 'string',
      initialValue: 'Cours & Coaching - Muriel Cruysmans'
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
      initialValue: 'Cours & coaching personnalisés',
      description: 'Titre du hero.'
    },
    {
      name: 'heroSubtitle',
      title: 'Sous-titre principal',
      type: 'text',
      initialValue: 'Une cuisine saine, vivante et joyeuse, pour apprendre à cuisiner simplement et mieux manger au quotidien.',
      description: '2 phrases max.'
    },
    {
      name: 'heroCtaLabel',
      title: 'Bouton hero — Libellé',
      type: 'string',
      initialValue: 'Mes services'
    },
    {
      name: 'heroCtaLink',
      title: 'Bouton hero — Lien',
      type: 'string',
      initialValue: '/contact'
    },
    {
      name: 'visionKicker',
      title: 'Vision — Kicker',
      type: 'string',
      initialValue: 'Vision'
    },
    {
      name: 'visionTitle',
      title: 'Vision — Titre',
      type: 'string',
      initialValue: 'Ma vision de la cuisine'
    },
    {
      name: 'visionText',
      title: 'Vision — Texte',
      type: 'text',
      initialValue: 'Je crois à une cuisine simple, locale et profondément humaine — une cuisine qui nourrit le corps, apaise l’esprit et crée du lien.',
      description: 'Court paragraphe de vision.'
    },
    {
      name: 'visionCards',
      title: 'Vision — Cartes',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Libellé', type: 'string' },
          { name: 'title', title: 'Titre', type: 'string' },
          { name: 'text', title: 'Texte', type: 'text' },
          { name: 'isVisible', title: 'Afficher', type: 'boolean', initialValue: true }
        ]
      }],
      initialValue: [
        {
          label: 'Santé',
          title: 'Équilibre & vitalité',
          text: 'Des recettes accessibles, bonnes et saines, pour retrouver énergie et plaisir sans pression.',
          isVisible: true
        },
        {
          label: 'Transmission',
          title: 'Apprendre en faisant',
          text: 'Des gestes simples, des repères clairs, pour gagner en autonomie et en confiance.',
          isVisible: true
        },
        {
          label: 'Plaisir',
          title: 'Cuisine vivante',
          text: 'Végétal, saison, gourmandise : une cuisine qui fait du bien et qui rassemble.',
          isVisible: true
        }
      ]
    },
    {
      name: 'aboutTitle',
      title: 'Titre section Muriel',
      type: 'string',
      initialValue: 'Muriel, cuisine & transmission'
    },
    {
      name: 'aboutLead',
      title: 'Accroche personnelle',
      type: 'string',
      initialValue: 'Introduire du plaisir et du bon sens en respectant les principes d’une nutrition équilibrée.'
    },
    {
      name: 'bio',
      title: 'Texte bio',
      type: 'text',
      initialValue: 'Je suis passionnée par l’alimentation depuis une vingtaine d’années et convaincue que c’est un des piliers de notre bonne santé.',
      description: 'Paragraphe principal de la section Muriel.'
    },
    {
      name: 'aboutParagraphs',
      title: 'Paragraphes complémentaires',
      type: 'array',
      of: [{ type: 'text' }],
      initialValue: [
        'Bien s’alimenter oui, mais dans le respect du travail et de la planète. Je privilégie les produits locaux, de saison, de culture biologique. Ma cuisine se veut simple, savoureuse, fraîche, nourrissante et conviviale. Rien n’est interdit, c’est en prenant conscience de notre manière de nous alimenter et en découvrant de délicieuses nouvelles alternatives que petit à petit les aliments indésirables sortent de nos assiettes.'
      ]
    },
    {
      name: 'photo',
      title: 'Photo de Muriel',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'Photo principale de Muriel Cruysmans pour la section À propos'
    },
    {
      name: 'achievements',
      title: 'Réalisations',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: [
        'Diplômée restaurateur-traiteur (mai 2024)',
        'Auteur d\'un livre de recettes',
        'Spécialiste en cuisine santé et bien-être'
      ]
    },
    {
      name: 'aboutCtaLabel',
      title: 'Bouton section Muriel — Libellé',
      type: 'string',
      initialValue: 'Voir les services'
    },
    {
      name: 'aboutCtaLink',
      title: 'Bouton section Muriel — Lien',
      type: 'string',
      initialValue: '#services'
    },
    {
      name: 'journeyTitle',
      title: 'Parcours — Titre',
      type: 'string',
      initialValue: 'Mon parcours'
    },
    {
      name: 'journeyIntro',
      title: 'Parcours — Introduction',
      type: 'text',
      initialValue: 'Après une licence en Affaires Publiques et Internationales (UCL), c’est la passion pour l’alimentation qui m’a guidé pour la suite.'
    },
    {
      name: 'journeyItems',
      title: 'Parcours — Points clés',
      type: 'array',
      of: [{ type: 'text' }],
      initialValue: [
        'Ma curiosité, ma gourmandise et mon envie de comprendre m’ont mené à travers de nombreuses conférences, formations et cours de cuisine (CERDEN, Taty Lauwers, Pol Grégoire, Coaching, pleine conscience, Formation potager, Cuisine sauvage et l’accès à la profession de traiteur-restaurateur).',
        'J’ai mis en pratique tout ce savoir à travers des cours de cuisine (notamment à la Vie-Là à Ottignies), des animations au goût dans les écoles, des créations de recettes pour une nutritionniste, la publication de mon livre de recettes « Et si on mangeait vrai ? », la livraison de plats ressourçant et Gastronomade (notre restaurant et lieu mis en location).'
      ]
    },
    {
      name: 'signatureTitle',
      title: 'Fil rouge — Titre',
      type: 'string',
      initialValue: 'Fil rouge de mes recettes'
    },
    {
      name: 'signatureParagraphs',
      title: 'Fil rouge — Paragraphes',
      type: 'array',
      of: [{ type: 'text' }],
      initialValue: [
        'L’important est de trouver l’équilibre. Chacun a le sien et il est toujours à moduler.',
        'Je ne suis « anti » rien. C’est juste le bon sens qui a fait sortir de mon assiette tous les produits industriels, chémiqués, ....qui ne sont plus des aliments mais de la « bouffe ».',
        'Quel plaisir d’offrir un festival de goûts, de textures et de saveurs à nos papilles à partir de produits simples, frais et naturels.'
      ]
    },
    {
      name: 'servicesTitle',
      title: 'Services — Titre',
      type: 'string',
      initialValue: 'Mes Services'
    },
    {
      name: 'servicesSubtitle',
      title: 'Services — Sous-titre',
      type: 'text',
      initialValue: 'Cours de cuisine à la carte et coaching personnalisé pour votre bien-être alimentaire'
    },
    {
      name: 'servicesCtaText',
      title: 'Services — CTA (libellé)',
      type: 'string',
      initialValue: 'En savoir plus'
    },
    {
      name: 'servicesCtaLink',
      title: 'Services — CTA (lien)',
      type: 'string',
      initialValue: '/contact'
    },
    {
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'title',
            title: 'Titre du service',
            type: 'string'
          },
          {
            name: 'description',
            title: 'Description',
            type: 'text'
          },
          {
            name: 'price',
            title: 'Prix',
            type: 'string'
          },
          {
            name: 'features',
            title: 'Caractéristiques',
            type: 'array',
            of: [{ type: 'string' }]
          }
        ]
      }],
      initialValue: [
        {
          title: 'Cours de cuisine individuels',
          description: 'Apprenez les bases de la cuisine santé dans un cadre personnalisé',
          price: '80€/personne',
          features: [
            'Cours de 2h30 en petit groupe',
            'Ingrédients bio et locaux fournis',
            'Support de cours offert',
            'Diplôme de participation'
          ]
        },
        {
          title: 'Ateliers thématiques',
          description: 'Découvrez des thèmes spécifiques comme la cuisine végétarienne, les desserts healthy, etc.',
          price: '65€/personne',
          features: [
            'Ateliers de 2h en petit groupe',
            'Thèmes variés et saisonniers',
            'Recettes exclusives',
            'Goûter offert'
          ]
        },
        {
          title: 'Coaching personnalisé',
          description: 'Accompagnement sur mesure pour vos objectifs nutritionnels',
          price: 'Sur devis',
          features: [
            'Bilan nutritionnel initial',
            'Plan alimentaire personnalisé',
            'Suivi hebdomadaire',
            'Ajustements selon vos progrès'
          ]
        }
      ]
    },
    {
      name: 'showHero',
      title: 'Afficher le hero',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    },
    {
      name: 'showVision',
      title: 'Afficher la section Vision',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    },
    {
      name: 'showAboutSection',
      title: 'Afficher la section Muriel',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    },
    {
      name: 'showAchievements',
      title: 'Afficher les réalisations',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    },
    {
      name: 'showServices',
      title: 'Afficher la section Services',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    },
    {
      name: 'showJourney',
      title: 'Afficher la section Parcours',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    },
    {
      name: 'showSignature',
      title: 'Afficher la section Fil rouge',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    }
  ]
}
