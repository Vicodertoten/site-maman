// schemas/recipe.ts
import type { Rule } from '@sanity/types'
export const recipe = {
  name: 'recipe',
  title: 'Recettes',
  type: 'document',
  fieldsets: [
    {
      name: 'presentation',
      title: 'Présentation',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'timing',
      title: 'Temps & portions',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'content',
      title: 'Contenu recette',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'practical',
      title: 'Infos pratiques',
      options: { collapsible: true, collapsed: true }
    },
    {
      name: 'nutrition',
      title: 'Nutrition',
      options: { collapsible: true, collapsed: true }
    },
    {
      name: 'visibility',
      title: 'Visibilité & mise en avant',
      options: { collapsible: true, collapsed: true }
    }
  ],
  fields: [
    {
      name: 'title',
      title: 'Nom de la recette',
      type: 'string',
      description: 'Titre de la recette',
      fieldset: 'presentation'
    },
    {
      name: 'slug',
      title: 'Slug URL',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      fieldset: 'presentation'
    },
    {
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          { title: 'Entrée', value: 'entree' },
          { title: 'Plat principal', value: 'plat' },
          { title: 'Dessert', value: 'dessert' },
          { title: 'Boisson', value: 'boisson' },
          { title: 'Accompagnement', value: 'accompagnement' }
        ]
      },
      description: 'Catégorie de la recette',
      fieldset: 'presentation'
    },
    {
      name: 'subtitle',
      title: 'Sous-titre (optionnel)',
      type: 'string',
      description: 'Accroche courte visible sur la fiche',
      fieldset: 'presentation'
    },
    {
      name: 'description',
      title: 'Description courte',
      type: 'text',
      rows: 3,
      description: 'Courte description de la recette',
      fieldset: 'presentation'
    },
    {
      name: 'featuredImage',
      title: 'Image principale',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        { name: 'alt', title: 'Texte alternatif', type: 'string' }
      ],
      description: 'Photo de la recette terminée',
      fieldset: 'presentation'
    },
    {
      name: 'gallery',
      title: 'Galerie (optionnel)',
      type: 'array',
      of: [{
        type: 'image',
        options: { hotspot: true },
        fields: [
          { name: 'alt', title: 'Texte alternatif', type: 'string' }
        ]
      }],
      description: 'Photos complémentaires pour la fiche recette',
      fieldset: 'presentation'
    },
    {
      name: 'prepTime',
      title: 'Temps de préparation',
      type: 'number',
      description: 'En minutes',
      fieldset: 'timing'
    },
    {
      name: 'cookTime',
      title: 'Temps de cuisson',
      type: 'number',
      description: 'En minutes',
      fieldset: 'timing'
    },
    {
      name: 'restTime',
      title: 'Temps de repos',
      type: 'number',
      description: 'En minutes (optionnel)',
      fieldset: 'timing'
    },
    {
      name: 'servings',
      title: 'Nombre de personnes',
      type: 'number',
      description: 'Nombre de portions',
      fieldset: 'timing'
    },
    {
      name: 'difficulty',
      title: 'Difficulté',
      type: 'string',
      options: {
        list: [
          { title: 'Facile', value: 'facile' },
          { title: 'Moyen', value: 'moyen' },
          { title: 'Difficile', value: 'difficile' }
        ]
      },
      fieldset: 'timing'
    },
    {
      name: 'budget',
      title: 'Budget',
      type: 'string',
      options: {
        list: [
          { title: 'Économique', value: 'economique' },
          { title: 'Intermédiaire', value: 'intermediaire' },
          { title: 'Généreux', value: 'genereux' }
        ]
      },
      description: 'Niveau de budget indicatif',
      fieldset: 'practical'
    },
    {
      name: 'ingredients',
      title: 'Ingrédients',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'group', title: 'Groupe (optionnel)', type: 'string', description: 'Ex: Pâte, Garniture, Sauce' },
          { name: 'name', title: 'Ingrédient', type: 'string' },
          { name: 'quantity', title: 'Quantité', type: 'string' },
          { name: 'unit', title: 'Unité', type: 'string' },
          { name: 'notes', title: 'Notes', type: 'string' }
        ]
      }],
      description: 'Liste des ingrédients avec quantités',
      fieldset: 'content'
    },
    {
      name: 'instructions',
      title: 'Instructions de préparation',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Étapes de préparation détaillées',
      fieldset: 'content'
    },
    {
      name: 'highlights',
      title: 'Petites affiches',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Titre', type: 'string' },
          { name: 'text', title: 'Texte', type: 'text', rows: 3 },
          { name: 'icon', title: 'Icône (emoji ou mot-clé)', type: 'string' }
        ]
      }],
      description: 'Mini-cartes pour mettre en avant des points clés',
      fieldset: 'content'
    },
    {
      name: 'tips',
      title: 'Astuces & conseils',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Petites astuces pour réussir la recette',
      fieldset: 'content'
    },
    {
      name: 'variations',
      title: 'Variantes',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Variantes possibles de la recette',
      fieldset: 'content'
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      },
      description: 'Tags pour la recherche (végétarien, rapide, thermomix, etc.)',
      fieldset: 'practical'
    },
    {
      name: 'diet',
      title: 'Régimes alimentaires',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Végétarien', value: 'vegetarien' },
          { title: 'Vegan', value: 'vegan' },
          { title: 'Pescétarien', value: 'pescetarien' },
          { title: 'Sans gluten', value: 'sans-gluten' },
          { title: 'Sans lactose', value: 'sans-lactose' },
          { title: 'Sans sucre raffiné', value: 'sans-sucre' },
          { title: 'IG bas', value: 'ig-bas' }
        ],
        layout: 'tags'
      },
      description: 'Filtres de régime alimentaire',
      fieldset: 'practical'
    },
    {
      name: 'season',
      title: 'Saisons',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Printemps', value: 'printemps' },
          { title: 'Été', value: 'ete' },
          { title: 'Automne', value: 'automne' },
          { title: 'Hiver', value: 'hiver' }
        ],
        layout: 'tags'
      },
      description: 'Saisons recommandées',
      fieldset: 'practical'
    },
    {
      name: 'equipment',
      title: 'Matériel',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Matériel utile pour la recette',
      fieldset: 'practical'
    },
    {
      name: 'allergens',
      title: 'Allergènes',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Gluten', value: 'gluten' },
          { title: 'Lait', value: 'lait' },
          { title: 'Œufs', value: 'oeufs' },
          { title: 'Fruits à coque', value: 'fruits-a-coque' },
          { title: 'Arachides', value: 'arachides' },
          { title: 'Poisson', value: 'poisson' },
          { title: 'Crustacés', value: 'crustaces' },
          { title: 'Soja', value: 'soja' },
          { title: 'Sésame', value: 'sesame' }
        ],
        layout: 'tags'
      },
      description: 'Allergènes éventuels',
      fieldset: 'practical'
    },
    {
      name: 'storage',
      title: 'Conservation',
      type: 'text',
      rows: 3,
      description: 'Conseils de conservation et réchauffage',
      fieldset: 'practical'
    },
    {
      name: 'nutrition',
      title: 'Valeurs nutritionnelles',
      type: 'object',
      fields: [
        { name: 'calories', title: 'Calories (kcal)', type: 'number' },
        { name: 'protein', title: 'Protéines (g)', type: 'number' },
        { name: 'carbs', title: 'Glucides (g)', type: 'number' },
        { name: 'fat', title: 'Lipides (g)', type: 'number' },
        { name: 'fiber', title: 'Fibres (g)', type: 'number' }
      ],
      fieldset: 'nutrition'
    },
    {
      name: 'isPremium',
      title: 'Contenu Premium (Ebook) ?',
      type: 'boolean',
      initialValue: false,
      description: 'Réservé aux abonnés ou contenu payant',
      fieldset: 'visibility'
    },
    {
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      fieldset: 'visibility'
    },
    {
      name: 'rating',
      title: 'Note (optionnel)',
      type: 'number',
      description: 'Note sur 5 étoiles (ex: 4.5)',
      validation: (Rule: Rule) => Rule.min(0).max(5),
      fieldset: 'visibility'
    },
    {
      name: 'isNew',
      title: 'Nouveau ?',
      type: 'boolean',
      initialValue: false,
      description: 'Marquer comme nouvelle recette',
      fieldset: 'visibility'
    },
    {
      name: 'isPopular',
      title: 'Populaire ?',
      type: 'boolean',
      initialValue: false,
      description: 'Marquer comme recette populaire',
      fieldset: 'visibility'
    }
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'featuredImage',
      difficulty: 'difficulty',
      prepTime: 'prepTime',
      cookTime: 'cookTime'
    },
    prepare(selection: any) {
      const { title, category, media, difficulty, prepTime, cookTime } = selection
      const totalTime = (prepTime || 0) + (cookTime || 0)
      return {
        title,
        subtitle: [
          category ? `Catégorie: ${category}` : null,
          difficulty ? `Difficulté: ${difficulty}` : null,
          totalTime ? `Temps: ${totalTime} min` : null
        ].filter(Boolean).join(' • '),
        media
      }
    }
  }
}
