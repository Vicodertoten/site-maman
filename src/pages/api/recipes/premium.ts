import { getRecipesByPackIds, type RecipeData } from '../../../lib/sanity'
import { getEntitledPackIds, getSessionEmail, getSessionTokenFromRequest } from '../../../lib/server/access'

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

  return category || ''
}

function getCategoryName(category: string): string {
  const categories: { [key: string]: string } = {
    entree: 'Entrée',
    plat: 'Plat principal',
    dessert: 'Dessert',
    boisson: 'Boisson',
    accompagnement: 'Accompagnement'
  }
  return categories[category] || category
}

function mapCardData(recipe: RecipeData) {
  const categoryValue = normalizeCategoryValue(recipe.category)
  return {
    id: recipe._id,
    slug: recipe.slug?.current || recipe._id,
    title: recipe.title,
    description: recipe.description,
    image: recipe.featuredImageUrl
      ? `${recipe.featuredImageUrl}?w=400&h=300&fit=crop&auto=format`
      : undefined,
    imageAlt: recipe.featuredImageAlt,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    restTime: recipe.restTime,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    category: getCategoryName(categoryValue),
    categoryValue,
    rating: recipe.rating,
    isNew: recipe.isNew || false,
    isPopular: recipe.isPopular || false,
    tags: recipe.tags || [],
    ingredients: recipe.ingredients ? recipe.ingredients.map((ing) => ing.name) : []
  }
}

function mapIndexData(recipe: RecipeData) {
  return {
    id: recipe._id,
    slug: recipe.slug?.current || recipe._id,
    title: recipe.title,
    description: recipe.description,
    category: normalizeCategoryValue(recipe.category),
    difficulty: recipe.difficulty,
    prepTime: recipe.prepTime || 0,
    cookTime: recipe.cookTime || 0,
    restTime: recipe.restTime || 0,
    servings: recipe.servings,
    rating: recipe.rating || 0,
    isNew: recipe.isNew || false,
    isPopular: recipe.isPopular || false,
    publishedAt: recipe.publishedAt,
    tags: recipe.tags || [],
    diet: recipe.diet || [],
    season: recipe.season || [],
    budget: recipe.budget || '',
    ingredients: recipe.ingredients || []
  }
}

export async function GET({ request }: { request: Request }) {
  const sessionToken = getSessionTokenFromRequest(request)
  if (!sessionToken) {
    return new Response(JSON.stringify({ recipes: [], index: [], packIds: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const email = await getSessionEmail(sessionToken)
  if (!email) {
    return new Response(JSON.stringify({ recipes: [], index: [], packIds: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const packIds = await getEntitledPackIds(email)
  if (!packIds.length) {
    return new Response(JSON.stringify({ recipes: [], index: [], packIds: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const recipes = await getRecipesByPackIds(packIds)
  const uniqueRecipes = new Map<string, RecipeData>()
  recipes.forEach((recipe) => uniqueRecipes.set(recipe._id, recipe))

  const cards = Array.from(uniqueRecipes.values()).map(mapCardData)
  const index = Array.from(uniqueRecipes.values()).map(mapIndexData)

  return new Response(JSON.stringify({ recipes: cards, index, packIds }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
