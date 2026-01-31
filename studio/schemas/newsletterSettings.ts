export const newsletterSettings = {
  name: 'newsletterSettings',
  title: 'Newsletter — Inscription',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre',
      type: 'string',
      initialValue: 'Restez informé(e)'
    },
    {
      name: 'description',
      title: 'Texte',
      type: 'text',
      initialValue: 'Abbonnez-vous à ma newsletter et recevez une recette par mois et les dernères nouvelles de mes activités.'
    },
    {
      name: 'inputPlaceholder',
      title: 'Placeholder champ email',
      type: 'string',
      initialValue: 'Votre adresse email'
    },
    {
      name: 'buttonLabel',
      title: 'Bouton — Libellé',
      type: 'string',
      initialValue: 'S\'inscrire'
    },
    {
      name: 'successTitle',
      title: 'Modal — Titre',
      type: 'string',
      initialValue: 'Merci pour votre inscription !'
    },
    {
      name: 'successText',
      title: 'Modal — Texte',
      type: 'text',
      initialValue: 'Votre inscription à la newsletter a bien été enregistrée. Vous recevrez bientôt mes dernières recettes et conseils nutritionnels.'
    },
    {
      name: 'successButtonLabel',
      title: 'Modal — Bouton',
      type: 'string',
      initialValue: 'Parfait !'
    },
    {
      name: 'errorMessage',
      title: 'Message d\'erreur par défaut',
      type: 'string',
      initialValue: 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
    }
  ]
}
