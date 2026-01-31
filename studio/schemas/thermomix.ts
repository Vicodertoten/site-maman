// schemas/thermomix.ts
export const thermomix = {
  name: 'thermomix',
  title: 'Espace Thermomix',
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
      name: 'heroKicker',
      title: 'Hero — Kicker',
      type: 'string',
      initialValue: 'Thermomix'
    },
    {
      name: 'heroTitle',
      title: 'Hero — Titre',
      type: 'string',
      initialValue: 'Le robot qui cuisine avec vous, pas à votre place.'
    },
    {
      name: 'heroLead',
      title: 'Hero — Texte',
      type: 'text',
      initialValue: 'Le Thermomix pèse, hache, mixe, cuit et mijote dans un seul bol. Il guide chaque étape grâce à ses recettes intégrées : vous gardez la main, il vous simplifie la vie.'
    },
    {
      name: 'heroHighlights',
      title: 'Hero — Points clés',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Numéro / label', type: 'string' },
          { name: 'title', title: 'Titre', type: 'string' },
          { name: 'text', title: 'Texte', type: 'text' },
          { name: 'isVisible', title: 'Afficher', type: 'boolean', initialValue: true }
        ]
      }],
      initialValue: [
        { label: '1', title: 'Guidage clair', text: 'Écran pas à pas pour gagner du temps.', isVisible: true },
        { label: '2', title: 'Cuisson précise', text: 'Température maîtrisée sans surveillance.', isVisible: true },
        { label: '3', title: 'Vaisselle réduite', text: 'Un seul appareil pour tout faire.', isVisible: true }
      ]
    },
    {
      name: 'heroPrimaryCtaLabel',
      title: 'Hero — CTA principal',
      type: 'string',
      initialValue: 'Voir les vidéos YouTube'
    },
    {
      name: 'heroPrimaryCtaUrl',
      title: 'Hero — CTA principal (URL)',
      type: 'url',
      initialValue: 'https://www.youtube.com/@murielcruysmans5423/shorts'
    },
    {
      name: 'heroSecondaryCtaLabel',
      title: 'Hero — CTA secondaire',
      type: 'string',
      initialValue: 'Suivre @manger_vrai'
    },
    {
      name: 'heroSecondaryCtaUrl',
      title: 'Hero — CTA secondaire (URL)',
      type: 'url',
      initialValue: 'https://www.instagram.com/manger_vrai/'
    },
    {
      name: 'heroVideoCaption',
      title: 'Hero — Légende vidéo',
      type: 'string',
      initialValue: 'Une présentation rapide pour comprendre l’essentiel avant une démo.'
    },
    {
      name: 'monthlyText',
      title: 'Texte du mois',
      type: 'text',
      description: 'Contenu mis à jour mensuellement pour la page Thermomix'
    },
    {
      name: 'promoKicker',
      title: 'Promo — Kicker',
      type: 'string',
      initialValue: 'Promo du mois'
    },
    {
      name: 'promoTitle',
      title: 'Promo — Titre',
      type: 'string',
      initialValue: 'Offres & avantages en cours'
    },
    {
      name: 'videoUrl',
      title: 'Lien Vidéo (YouTube/Vimeo)',
      type: 'url',
      description: 'URL de la vidéo de démonstration'
    },
    {
      name: 'featuredImage',
      title: 'Image de couverture',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'Image principale pour la section Thermomix'
    },
    {
      name: 'benefitsTitle',
      title: 'Bénéfices — Titre',
      type: 'string',
      initialValue: 'Pourquoi en profiter maintenant'
    },
    {
      name: 'benefits',
      title: 'Bénéfices — Cartes',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Titre', type: 'string' },
          { name: 'text', title: 'Texte', type: 'text' },
          { name: 'isVisible', title: 'Afficher', type: 'boolean', initialValue: true }
        ]
      }],
      initialValue: [
        { title: 'Accompagnement personnalisé', text: 'Installation, prise en main et premiers menus.', isVisible: true },
        { title: 'Recettes adaptées', text: 'Des idées simples pour votre rythme.', isVisible: true },
        { title: 'Suivi continu', text: 'On reste en contact après l’achat.', isVisible: true },
        { title: 'Premiers pas réussis', text: 'Astuces pour gagner du temps au quotidien.', isVisible: true }
      ]
    },
    {
      name: 'benefitsCtaLabel',
      title: 'Bénéfices — CTA (libellé)',
      type: 'string',
      initialValue: 'Recevoir le détail de la promo →'
    },
    {
      name: 'benefitsCtaLink',
      title: 'Bénéfices — CTA (lien)',
      type: 'string',
      initialValue: '/contact'
    },
    {
      name: 'demoTitle',
      title: 'Démo — Titre',
      type: 'string',
      initialValue: 'Démo en direct chaque mardi soir'
    },
    {
      name: 'demoText',
      title: 'Démo — Texte',
      type: 'text',
      initialValue: 'Venez découvrir le Thermomix en action, poser vos questions et goûter le résultat. Démo prévue tous les mardis soir — et si ce créneau ne vous convient pas, contactez-moi pour trouver un autre moment.'
    },
    {
      name: 'demoPrimaryCtaLabel',
      title: 'Démo — CTA principal',
      type: 'string',
      initialValue: 'Réserver une démo'
    },
    {
      name: 'demoPrimaryCtaLink',
      title: 'Démo — CTA principal (lien)',
      type: 'string',
      initialValue: '/contact'
    },
    {
      name: 'demoSecondaryCtaLabel',
      title: 'Démo — CTA secondaire',
      type: 'string',
      initialValue: 'Demander un autre créneau'
    },
    {
      name: 'demoSecondaryCtaLink',
      title: 'Démo — CTA secondaire (lien)',
      type: 'string',
      initialValue: '/contact'
    },
    {
      name: 'demoDetails',
      title: 'Démo — Détails',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Libellé', type: 'string' },
          { name: 'text', title: 'Texte', type: 'string' },
          { name: 'isVisible', title: 'Afficher', type: 'boolean', initialValue: true }
        ]
      }],
      initialValue: [
        { label: 'À prévoir', text: 'Durée : 60 à 90 min • Groupe réduit', isVisible: true },
        { label: 'Où', text: 'Chez moi ou à convenir selon disponibilité.', isVisible: true }
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
      name: 'showPromo',
      title: 'Afficher la promo',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    },
    {
      name: 'showBenefits',
      title: 'Afficher les bénéfices',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    },
    {
      name: 'showDemo',
      title: 'Afficher la section démo',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    }
  ]
}
