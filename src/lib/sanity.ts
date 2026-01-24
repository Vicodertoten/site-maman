// src/lib/sanity.ts
import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  useCdn: false, // Changez à false pour bypass le cache
  apiVersion: '2024-01-01',
})

// Types pour les données Sanity
export interface RestaurantData {
  _id: string
  title: string
  subtitle: string
  menuTitle: string
  datesTitle: string
  reservationTitle: string
  dates: string[]
  price: number
  menuDescription: string
  isFull: boolean
  minGuests: number
  depositAmount: number
}

export interface ThermomixData {
  _id: string
  monthlyText: string
  videoUrl: string
  featuredImage: any
  demoRecipes: Array<{
    title: string
    description: string
    videoUrl: string
  }>
  instagramUrl?: string
}

export interface LocationData {
  _id: string
  type: 'societe' | 'prive'
  title: string
  subtitle: string
  price: string
  features: string[]
  description: string
  maxCapacity: number
  image: any
}

export interface RecipeData {
  _id: string
  title: string
  slug: { current: string }
  category: string
  description: string
  featuredImage: any
  prepTime: number
  cookTime: number
  servings: number
  difficulty: string
  ingredients: Array<{
    name: string
    quantity: string
    unit: string
  }>
  instructions: any[]
  tags: string[]
  isPremium: boolean
  publishedAt: string
}

export interface AboutData {
  _id: string
  title: string
  heroTitle: string
  heroSubtitle: string
  aboutTitle: string
  bio: string
  photo: any
  achievements: string[]
  services: Array<{
    title: string
    description: string
    price: string
    features: string[]
  }>
  contactTitle: string
  contactText: string
}

export interface HomeData {
  _id: string
  title: string
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  locationSectionTitle: string
  locationSectionDescription: string
  restaurantSectionTitle: string
  restaurantSectionDescription: string
  ctaTitle: string
  ctaDescription: string
  ctaPrimaryButton: string
  ctaSecondaryButton: string
}

export interface ContactData {
  _id: string
  title: string
  heroTitle: string
  heroSubtitle: string
  contactInfo: {
    phone: string
    email: string
    address: string
  }
  socialLinks: Array<{
    platform: string
    url: string
    label: string
  }>
  bookingInfo: {
    title: string
    text: string
    depositInfo: string
  }
}

// Requêtes GROQ pour récupérer les données
export const queries = {
  // Restaurant - Récupère le document le plus récent
  restaurant: `*[_type == "restaurant"] | order(_updatedAt desc)[0] {
    _id,
    title,
    subtitle,
    menuTitle,
    datesTitle,
    reservationTitle,
    dates,
    price,
    menuDescription,
    isFull,
    minGuests,
    depositAmount
  }`,

  // Thermomix - Document unique
  thermomix: `*[_type == "thermomix"] | order(_updatedAt desc)[0] {
    _id,
    monthlyText,
    videoUrl,
    featuredImage,
    demoRecipes,
    instagramUrl
  }`,

  // Locations - Tous les types
  locations: `*[_type == "location"] {
    _id,
    type,
    title,
    subtitle,
    price,
    features,
    description,
    maxCapacity,
    image
  }`,

  // Recettes - Toutes les recettes publiques
  recipes: `*[_type == "recipe" && isPremium == false] | order(publishedAt desc) {
    _id,
    title,
    slug,
    category,
    description,
    featuredImage,
    prepTime,
    cookTime,
    servings,
    difficulty,
    ingredients,
    instructions,
    tags,
    isPremium,
    publishedAt
  }`,

  // Recette spécifique par slug
  recipeBySlug: (slug: string) => `*[_type == "recipe" && slug.current == "${slug}"][0] {
    _id,
    title,
    slug,
    category,
    description,
    featuredImage,
    prepTime,
    cookTime,
    servings,
    difficulty,
    ingredients,
    instructions,
    tags,
    isPremium,
    publishedAt
  }`,

  // Recettes par catégorie
  recipesByCategory: (category: string) => `*[_type == "recipe" && category == "${category}" && isPremium == false] | order(publishedAt desc) {
    _id,
    title,
    slug,
    description,
    featuredImage,
    prepTime,
    difficulty,
    tags
  }`,

  // About - Informations personnelles
  about: `*[_type == "about"] | order(_updatedAt desc)[0] {
    _id,
    title,
    heroTitle,
    heroSubtitle,
    aboutTitle,
    bio,
    photo {
      asset->{
        url
      }
    },
    achievements,
    services,
    contactTitle,
    contactText
  }`,

  // Contact - Informations de contact
  contact: `*[_type == "contact"] | order(_updatedAt desc)[0] {
    _id,
    title,
    heroTitle,
    heroSubtitle,
    contactInfo,
    socialLinks,
    bookingInfo
  }`,
  // Home - Page d'accueil
  home: `*[_type == "home"] | order(_updatedAt desc)[0] {
    _id,
    title,
    heroTitle,
    heroSubtitle,
    heroDescription,
    locationSectionTitle,
    locationSectionDescription,
    restaurantSectionTitle,
    restaurantSectionDescription,
    ctaTitle,
    ctaDescription,
    ctaPrimaryButton,
    ctaSecondaryButton
  }`}

// Fonctions utilitaires pour récupérer les données
export async function getThermomixData(): Promise<ThermomixData | null> {
  try {
    return await sanityClient.fetch(queries.thermomix)
  } catch (error) {
    console.error('Erreur lors de la récupération des données thermomix:', error)
    return null
  }
}

export async function getRecipesData(): Promise<RecipeData[]> {
  try {
    return await sanityClient.fetch(queries.recipes)
  } catch (error) {
    console.error('Erreur lors de la récupération des données recettes:', error)
    return []
  }
}

export async function getRecipeBySlug(slug: string): Promise<RecipeData | null> {
  try {
    return await sanityClient.fetch(queries.recipeBySlug(slug))
  } catch (error) {
    console.error('Erreur lors de la récupération de la recette:', error)
    return null
  }
}

export async function getRecipesByCategory(category: string): Promise<RecipeData[]> {
  try {
    return await sanityClient.fetch(queries.recipesByCategory(category))
  } catch (error) {
    console.error('Erreur lors de la récupération des recettes par catégorie:', error)
    return []
  }
}

export async function getAboutData(): Promise<AboutData | null> {
  try {
    return await sanityClient.fetch(queries.about)
  } catch (error) {
    console.error('Erreur lors de la récupération des données about:', error)
    return null
  }
}

export async function getContactData(): Promise<ContactData | null> {
  try {
    return await sanityClient.fetch(queries.contact)
  } catch (error) {
    console.error('Erreur lors de la récupération des données contact:', error)
    return null
  }
}

export async function getHomeData(): Promise<HomeData | null> {
  try {
    return await sanityClient.fetch(queries.home)
  } catch (error) {
    console.error('Erreur lors de la récupération des données home:', error)
    return null
  }
}