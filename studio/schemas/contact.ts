// studio/schemas/contact.ts
export const contact = {
  name: 'contact',
  title: 'Contact',
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
      initialValue: 'Contact - Muriel Cruysmans'
    },
    {
      name: 'heroTitle',
      title: 'Titre principal',
      type: 'string',
      initialValue: 'Contactez Muriel'
    },
    {
      name: 'heroSubtitle',
      title: 'Sous-titre',
      type: 'text',
      initialValue: 'Une question, une envie de cours ou d’atelier ? Écrivez-moi, je vous réponds rapidement.'
    },
    {
      name: 'phoneLabel',
      title: 'Carte téléphone — Titre',
      type: 'string',
      initialValue: 'Téléphone'
    },
    {
      name: 'phoneButtonLabel',
      title: 'Carte téléphone — Bouton',
      type: 'string',
      initialValue: 'Appeler maintenant'
    },
    {
      name: 'emailLabel',
      title: 'Carte email — Titre',
      type: 'string',
      initialValue: 'Email'
    },
    {
      name: 'emailButtonLabel',
      title: 'Carte email — Bouton',
      type: 'string',
      initialValue: 'Envoyer un email'
    },
    {
      name: 'instagramLabel',
      title: 'Carte Instagram — Titre',
      type: 'string',
      initialValue: 'Instagram'
    },
    {
      name: 'instagramHandle',
      title: 'Carte Instagram — Texte',
      type: 'string',
      initialValue: '@manger_vrai'
    },
    {
      name: 'instagramButtonLabel',
      title: 'Carte Instagram — Bouton',
      type: 'string',
      initialValue: 'Suivez-moi'
    },
    {
      name: 'instagramUrl',
      title: 'Carte Instagram — URL',
      type: 'url',
      initialValue: 'https://www.instagram.com/manger_vrai'
    },
    {
      name: 'mapTitle',
      title: 'Carte — Titre',
      type: 'string',
      initialValue: 'Localisation'
    },
    {
      name: 'mapCtaLabel',
      title: 'Carte — Bouton',
      type: 'string',
      initialValue: 'Obtenir l\'itinéraire'
    },
    {
      name: 'mapCtaUrl',
      title: 'Carte — Lien bouton',
      type: 'url',
      initialValue: 'https://www.google.com/maps/dir/?api=1&destination=190+chemin+de+Vieusart+1300+Wavre'
    },
    {
      name: 'mapEmbedUrl',
      title: 'Carte — URL embed',
      type: 'url',
      initialValue: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2538.123456789012!2d4.6075!3d50.7172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c17d1b1b1b1b1b%3A0x1234567890abcdef!2s190%20chemin%20de%20Vieusart%2C%201300%20Wavre!5e0!3m2!1sfr!2sbe!4v1703123456789!5m2!1sfr!2sbe'
    },
    {
      name: 'contactInfo',
      title: 'Informations de contact',
      type: 'object',
      fields: [
        {
          name: 'phone',
          title: 'Téléphone',
          type: 'string',
          initialValue: '+32 478 44 40 65'
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
          initialValue: 'muriel.cruysmans@gmail.com'
        },
        {
          name: 'address',
          title: 'Adresse',
          type: 'text',
          initialValue: 'Wavre\nBelgique'
        }
      ]
    },
    {
      name: 'socialLinks',
      title: 'Liens réseaux sociaux',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'platform',
            title: 'Plateforme',
            type: 'string',
            options: {
              list: ['Facebook', 'Instagram', 'LinkedIn', 'YouTube']
            }
          },
          {
            name: 'url',
            title: 'URL',
            type: 'url'
          },
          {
            name: 'label',
            title: 'Libellé',
            type: 'string'
          }
        ]
      }],
      initialValue: [
        {
          platform: 'Instagram',
          url: 'https://www.instagram.com/manger_vrai',
          label: 'Suivez Muriel sur Instagram'
        },
        {
          platform: 'YouTube',
          url: 'https://www.youtube.com/@murielcruysmans5423/shorts',
          label: 'Voir les vidéos YouTube'
        }
      ]
    },
    {
      name: 'bookingInfo',
      title: 'Informations de réservation',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Titre section réservation',
          type: 'string',
          initialValue: 'Réservation'
        },
        {
          name: 'text',
          title: 'Texte explicatif',
          type: 'text',
          initialValue: 'Pour réserver un cours, un atelier ou un coaching, contactez Muriel par téléphone ou email. Je reviens vers vous rapidement pour fixer une date.'
        },
        {
          name: 'depositInfo',
          title: 'Informations acompte',
          type: 'text',
          initialValue: 'Un acompte peut être demandé selon la formule choisie.'
        }
      ]
    },
    {
      name: 'showContactCards',
      title: 'Afficher les cartes de contact',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    },
    {
      name: 'showPhoneCard',
      title: 'Afficher carte téléphone',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    },
    {
      name: 'showEmailCard',
      title: 'Afficher carte email',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    },
    {
      name: 'showInstagramCard',
      title: 'Afficher carte Instagram',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    },
    {
      name: 'showBookingInfo',
      title: 'Afficher la section réservation',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    },
    {
      name: 'showMap',
      title: 'Afficher la carte',
      type: 'boolean',
      initialValue: true,
      fieldset: 'visibility'
    }
  ]
}
