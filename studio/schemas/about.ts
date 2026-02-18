// studio/schemas/about.ts (Version améliorée Phase 1)
export const about = {
  name: 'about',
  title: '📚 À propos — Cours & Coaching',
  type: 'document',
  description: 'Gère la page "À propos - Cours & Coaching". C\'est ici que tu parles de tes offres, ta vision et tes services.',

  fieldsets: [
    {
      name: 'seo',
      title: '🔍 SEO & Technique',
      options: { collapsible: true, collapsed: true }
    },
    {
      name: 'hero_section',
      title: '🎬 Hero (Section haute)',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'vision_section',
      title: '💡 Ta Vision & Valeurs',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'about_section',
      title: '👤 Section À propos (Muriel)',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'journey_section',
      title: '🛤️ Ton Parcours',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'signature_section',
      title: '✍️ Ton Fil Rouge',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'services_section',
      title: '💼 Tes Services & Offres',
      options: { collapsible: true, collapsed: false }
    }
  ],

  fields: [
    // ━━━━━━━━━━━━━━━━━━━ SEO ━━━━━━━━━━━━━━━━━━━
    {
      name: 'title',
      title: '📄 Titre SEO (onglet navigateur)',
      type: 'string',
      initialValue: 'Cours & Coaching - Muriel Cruysmans',
      description: 'Ceci apparaît dans l\'onglet du navigateur et dans Google. Garde-le court (<60 caractères).',
      fieldset: 'seo',
      validation: (Rule) => Rule.required().max(60).warning('Max 60 caractères')
    },

    // ━━━━━━━━━━━━━━━━━━━ HERO ━━━━━━━━━━━━━━━━━━━
    {
      name: 'hero',
      title: '🎬 Hero (Image + titre principal)',
      type: 'pageHero',
      description: 'La grande section en haut avec image de fond. Configure ici le titre, image, et boutons.',
      fieldset: 'hero_section'
    },

    {
      name: 'heroTitle',
      title: 'Titre principal',
      type: 'string',
      initialValue: 'Cours & coaching personnalisés',
      description: 'Le titre visible au-dessus de l\'image du hero. Sois court et impactant.',
      fieldset: 'hero_section',
      validation: (Rule) => Rule.required().max(80)
    },

    {
      name: 'heroSubtitle',
      title: 'Sous-titre / Accroche',
      type: 'text',
      rows: 3,
      initialValue: 'Une cuisine saine, vivante et joyeuse, pour apprendre à cuisiner simplement et mieux manger au quotidien.',
      description: 'Texte court sous le titre (2-3 phrases max). Décrit ton approche.',
      fieldset: 'hero_section'
    },

    {
      name: 'heroCtaLabel',
      title: 'CTA — Libellé du bouton',
      type: 'string',
      initialValue: 'Mes services',
      description: 'Texte du bouton d\'appel-à-l\'action. Ex: "Mes services", "Prendre rendez-vous"',
      fieldset: 'hero_section'
    },

    {
      name: 'heroCtaLink',
      title: 'CTA — Lien cible',
      type: 'string',
      initialValue: '/contact',
      description: 'Où le bouton mène. Ex: "/contact", "#services", "https://..."',
      fieldset: 'hero_section'
    },

    // ━━━━━━━━━━━━━━━━━━━ VISION ━━━━━━━━━━━━━━━━━━━
    {
      name: 'visionKicker',
      title: 'Kicker (petit label)',
      type: 'string',
      initialValue: 'Vision',
      description: 'Petit texte au-dessus du titre (ex: "Vision", "Nos valeurs"). Court !',
      fieldset: 'vision_section'
    },

    {
      name: 'visionTitle',
      title: 'Titre de ta vision',
      type: 'string',
      initialValue: 'Ma vision de la cuisine',
      description: 'Titre principal de la section vision (Santé, Transmission, Plaisir).',
      fieldset: 'vision_section'
    },

    {
      name: 'visionText',
      title: 'Description courte',
      type: 'text',
      rows: 3,
      initialValue: 'Je crois à une cuisine simple, locale et profondément humaine — une cuisine qui nourrit le corps, apaise l\'esprit et crée du lien.',
      description: 'Court paragraphe (3-5 phrases) qui résume ta vision globale.',
      fieldset: 'vision_section'
    },

    {
      name: 'visionCards',
      title: '3 piliers (Santé, Transmission, Plaisir)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'label',
            title: 'Catégorie (ex: "Santé")',
            type: 'string'
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
            title: '👁️ Afficher ce pilier',
            type: 'boolean',
            initialValue: true
          }
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
      ],
      fieldset: 'vision_section',
      description: 'Les 3 piliers de ta philosophie. Reordonne-les si tu veux. Coche "Afficher" pour les inclure.'
    },

    // ━━━━━━━━━━━━━━━━━━━ À PROPOS (MURIEL) ━━━━━━━━━━━━━━━━━━━
    {
      name: 'aboutTitle',
      title: 'Titre de la section',
      type: 'string',
      initialValue: 'Muriel, cuisine & transmission',
      description: 'Titre visible sur la page. Ex: "Muriel, cuisine & transmission"',
      fieldset: 'about_section'
    },

    {
      name: 'aboutLead',
      title: 'Accroche personnelle (phrase clé)',
      type: 'string',
      initialValue: 'Introduire du plaisir et du bon sens en respectant les principes d\'une nutrition équilibrée.',
      description: 'Une phrase courte qui te définit. Très visible sur la page.',
      fieldset: 'about_section'
    },

    {
      name: 'bio',
      title: 'Paragraphe principal (ta bio)',
      type: 'text',
      rows: 4,
      initialValue: 'Je suis passionnée par l\'alimentation depuis une vingtaine d\'années et convaincue que c\'est un des piliers de notre bonne santé.',
      description: 'Courte bio (100-200 mots). Parle-moi de toi, ta passion, ta démarche.',
      fieldset: 'about_section'
    },

    {
      name: 'aboutParagraphs',
      title: 'Paragraphes complémentaires',
      type: 'array',
      of: [{ type: 'text' }],
      initialValue: [
        "Bien s'alimenter oui, mais dans le respect du travail et de la planète. Je privilégie les produits locaux, de saison, de culture biologique."
      ],
      description: 'Ajoute des paragraphes supplémentaires (philosophie, approche, etc.). Un par ligne.',
      fieldset: 'about_section'
    },

    {
      name: 'photo',
      title: '📸 Photo de Muriel',
      type: 'image',
      options: { hotspot: true },
      description: 'Photo principale visible dans la section. Portrait recommandé (500x600px min).',
      fieldset: 'about_section'
    },

    {
      name: 'achievements',
      title: '✨ Tes réalisations / certifications',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: [
        'Diplômée restaurateur-traiteur (mai 2024)',
        'Auteur d\'un livre de recettes',
        'Spécialiste en cuisine santé et bien-être'
      ],
      description: 'Liste tes diplômes, certifications, publications. Un par ligne.',
      fieldset: 'about_section'
    },

    {
      name: 'aboutCtaLabel',
      title: 'CTA — Libellé du bouton',
      type: 'string',
      initialValue: 'Voir les services',
      description: 'Texte du bouton (ex: "Voir les services", "Prendre rendez-vous")',
      fieldset: 'about_section'
    },

    {
      name: 'aboutCtaLink',
      title: 'CTA — Lien cible',
      type: 'string',
      initialValue: '#services',
      description: 'Où le bouton mène. Ex: "#services", "/contact"',
      fieldset: 'about_section'
    },

    // ━━━━━━━━━━━━━━━━━━━ PARCOURS ━━━━━━━━━━━━━━━━━━━
    {
      name: 'journeyTitle',
      title: 'Titre de la section',
      type: 'string',
      initialValue: 'Mon parcours',
      description: 'Titre du bloc qui raconte ton parcours.',
      fieldset: 'journey_section'
    },

    {
      name: 'journeyIntro',
      title: 'Phrase d\'introduction',
      type: 'text',
      rows: 2,
      initialValue: 'Après une licence en Affaires Publiques et Internationales (UCL), c\'est la passion pour l\'alimentation qui m\'a guidé pour la suite.',
      description: 'Phrase qui ouvre la section parcours.',
      fieldset: 'journey_section'
    },

    {
      name: 'journeyItems',
      title: 'Points clés du parcours',
      type: 'array',
      of: [{ type: 'text' }],
      initialValue: [
        'Ma curiosité, ma gourmandise et mon envie de comprendre m\'ont mené à travers de nombreuses conférences, formations et cours de cuisine (CERDEN, Taty Lauwers, Pol Grégoire, Coaching, pleine conscience, Formation potager, Cuisine sauvage et l\'accès à la profession de traiteur-restaurateur).',
        'J\'ai mis en pratique tout ce savoir à travers des cours de cuisine (notamment à la Vie-Là à Ottignies), des animations au goût dans les écoles, des créations de recettes pour une nutritionniste, la publication de mon livre de recettes « Et si on mangeait vrai ? », la livraison de plats ressourçant et Gastronomade (notre restaurant et lieu mis en location).'
      ],
      description: 'Ajoute les étapes importantes de ton parcours. Un paragraphe par étape.',
      fieldset: 'journey_section'
    },

    // ━━━━━━━━━━━━━━━━━━━ FIL ROUGE ━━━━━━━━━━━━━━━━━━━
    {
      name: 'signatureTitle',
      title: 'Titre de la section',
      type: 'string',
      initialValue: 'Fil rouge de mes recettes',
      description: 'Titre du bloc qui décrit ta philosophie culinaire.',
      fieldset: 'signature_section'
    },

    {
      name: 'signatureParagraphs',
      title: 'Paragraphes de philosophie',
      type: 'array',
      of: [{ type: 'text' }],
      initialValue: [
        'L\'important est de trouver l\'équilibre. Chacun a le sien et il est toujours à moduler.',
        'Je ne suis « anti » rien. C\'est juste le bon sens qui a fait sortir de mon assiette tous les produits industriels, chémiqués, ....qui ne sont plus des aliments mais de la « bouffe ».',
        'Quel plaisir d\'offrir un festival de goûts, de textures et de saveurs à nos papilles à partir de produits simples, frais et naturels.'
      ],
      description: 'Ajoute les principes qui guident ta cuisine. Un par ligne.',
      fieldset: 'signature_section'
    },

    // ━━━━━━━━━━━━━━━━━━━ SERVICES (OFFRES) ━━━━━━━━━━━━━━━━━━━
    {
      name: 'servicesTitle',
      title: 'Titre de la section',
      type: 'string',
      initialValue: 'Mes Services',
      description: 'Titre visible sur la page. Ex: "Mes Services", "Offres"',
      fieldset: 'services_section'
    },

    {
      name: 'servicesSubtitle',
      title: 'Sous-titre / Accroche',
      type: 'text',
      rows: 2,
      initialValue: 'Cours de cuisine à la carte et coaching personnalisé pour votre bien-être alimentaire',
      description: 'Description courte de tes services (2-3 phrases).',
      fieldset: 'services_section'
    },

    {
      name: 'services',
      title: 'Tes offres / Services',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'title',
            title: '📌 Titre du service',
            type: 'string',
            description: 'Ex: "Cours individuels", "Ateliers thématiques"'
          },
          {
            name: 'description',
            title: '📝 Description courte',
            type: 'text',
            rows: 2,
            description: 'Ce que propose cette offre (2-3 phrases)'
          },
          {
            name: 'price',
            title: '💰 Prix',
            type: 'string',
            description: 'Ex: "80€/personne", "Sur devis"'
          },
          {
            name: 'features',
            title: '✨ Ce qui est inclus',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Les points forts de cette offre. Un par ligne.'
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
      ],
      fieldset: 'services_section',
      description: 'Ajoute toutes tes offres. Trieble par drag-drop pour changer l\'ordre.'
    },

    {
      name: 'servicesCtaLabel',
      title: 'CTA — Libellé du bouton',
      type: 'string',
      initialValue: 'En savoir plus',
      description: 'Texte du bouton pour chaque service.',
      fieldset: 'services_section'
    },

    {
      name: 'servicesCtaLink',
      title: 'CTA — Lien cible',
      type: 'string',
      initialValue: '/contact',
      description: 'Où le bouton mène.',
      fieldset: 'services_section'
    }
  ],

  preview: {
    select: { title: 'title' },
    prepare() {
      return { title: '📚 Page : À propos / Cours & Coaching' }
    }
  }
}
