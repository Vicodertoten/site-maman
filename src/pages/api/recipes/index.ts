import type { APIRoute } from 'astro'
import { getRecipesData } from '../../../lib/sanity'

export const prerender = false

function normalizeString(value?: string | null): string {
  return (value ?? '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function normalizeCategoryValue(category?: string | null): string {
  const normalized = normalizeString(category)
  const aliases: Record<string, string[]> = {
    entree: ['entree', 'entrees', 'entrée', 'entrées'],
    plat: ['plat', 'plats', 'plat principal', 'plats principaux'],
    dessert: ['dessert', 'desserts'],
    boisson: ['boisson', 'boissons'],
    accompagnement: ['accompagnement', 'accompagnements']
  }

  for (const [value, variants] of Object.entries(aliases)) {
    if (variants.some((variant) => normalizeString(variant) === normalized)) {
      return value
    }
  }

  return normalized
}

function getCategoryLabel(category?: string | null): string {
  const value = normalizeCategoryValue(category)
  const labels: Record<string, string> = {
    entree: 'Entrée',
    plat: 'Plat principal',
    dessert: 'Dessert',
    boisson: 'Boisson',
    accompagnement: 'Accompagnement'
  }
  return labels[value] || (category || '')
}

function getRecipeDescription(recipe: { description?: string; subtitle?: string; title?: string; category?: string }): string {
  const explicitDescription = (recipe.description || '').trim()
  if (explicitDescription) return explicitDescription

  const subtitle = (recipe.subtitle || '').trim()
  if (subtitle) return subtitle

  const category = getCategoryLabel(recipe.category).toLowerCase()
  return `Recette ${category}: ${recipe.title || 'sans titre'}.`
}

function getRecipeAlt(recipe: { featuredImageAlt?: string; title?: string }): string {
  const explicitAlt = (recipe.featuredImageAlt || '').trim()
  if (explicitAlt) return explicitAlt
  return `Photo de ${recipe.title || 'la recette'}`
}

export const GET: APIRoute = async () => {
  try {
    const recipes = await getRecipesData()
    const index = recipes
      .filter((recipe) => recipe?.isPremium !== true)
      .map((recipe) => ({
        id: recipe._id,
        slug: recipe.slug?.current || recipe._id,
        title: recipe.title,
        description: getRecipeDescription(recipe),
        image: recipe.featuredImageUrl
          ? `${recipe.featuredImageUrl}?w=400&h=300&fit=crop&auto=format`
          : '',
        imageAlt: getRecipeAlt(recipe),
        prepTime: recipe.prepTime || 0,
        cookTime: recipe.cookTime || 0,
        restTime: recipe.restTime || 0,
        servings: recipe.servings || null,
        difficulty: recipe.difficulty || '',
        category: getCategoryLabel(recipe.category),
        categoryValue: normalizeCategoryValue(recipe.category),
        rating: recipe.rating || 0,
        isNew: recipe.isNew || false,
        isPopular: recipe.isPopular || false,
        publishedAt: recipe.publishedAt,
        tags: recipe.tags || [],
        diet: recipe.diet || [],
        season: recipe.season || [],
        budget: recipe.budget || '',
        ingredientText: (recipe.ingredients || []).map((ing) => ing?.name || '').filter(Boolean).join(' ')
      }))

    return new Response(
      JSON.stringify({
        recipes: index
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=60, s-maxage=120'
        }
      }
    )
  } catch (error) {
    console.error('Erreur API recipes/index:', error)
    return new Response(JSON.stringify({ recipes: [] }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    })
  }
}
