// schemas/recipe.ts
import type { Rule } from '@sanity/types'
export const recipe = {
  name: 'recipe',
  title: 'Recettes',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Nom de la recette',
      type: 'string',
      description: 'Titre de la recette'
    },
    {
      name: 'slug',
      title: 'Slug URL',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      }
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
      description: 'Catégorie de la recette'
    },
    {
      name: 'description',
      title: 'Description courte',
      type: 'text',
      rows: 3,
      description: 'Courte description de la recette'
    },
    {
      name: 'featuredImage',
      title: 'Image principale',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'Photo de la recette terminée'
    },
    {
      name: 'prepTime',
      title: 'Temps de préparation',
      type: 'number',
      description: 'En minutes'
    },
    {
      name: 'cookTime',
      title: 'Temps de cuisson',
      type: 'number',
      description: 'En minutes'
    },
    {
      name: 'servings',
      title: 'Nombre de personnes',
      type: 'number',
      description: 'Nombre de portions'
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
      }
    },
    {
      name: 'ingredients',
      title: 'Ingrédients',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', title: 'Ingrédient', type: 'string' },
          { name: 'quantity', title: 'Quantité', type: 'string' },
          { name: 'unit', title: 'Unité', type: 'string' }
        ]
      }],
      description: 'Liste des ingrédients avec quantités'
    },
    {
      name: 'instructions',
      title: 'Instructions de préparation',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Étapes de préparation détaillées'
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      },
      description: 'Tags pour la recherche (végétarien, rapide, thermomix, etc.)'
    },
    {
      name: 'isPremium',
      title: 'Contenu Premium (Ebook) ?',
      type: 'boolean',
      initialValue: false,
      description: 'Réservé aux abonnés ou contenu payant'
    },
    {
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'rating',
      title: 'Note (optionnel)',
      type: 'number',
      description: 'Note sur 5 étoiles (ex: 4.5)',
      validation: (Rule: Rule) => Rule.min(0).max(5)
    },
    {
      name: 'isNew',
      title: 'Nouveau ?',
      type: 'boolean',
      initialValue: false,
      description: 'Marquer comme nouvelle recette'
    },
    {
      name: 'isPopular',
      title: 'Populaire ?',
      type: 'boolean',
      initialValue: false,
      description: 'Marquer comme recette populaire'
    }
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'featuredImage'
    },
    prepare(selection: any) {
      const { title, category, media } = selection
      return {
        title,
        subtitle: category ? `Catégorie: ${category}` : '',
        media
      }
    }
  }
}