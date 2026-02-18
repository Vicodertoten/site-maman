// src/lib/sanity.ts
import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  useCdn: true, // CDN pour les lectures publiques
  apiVersion: '2024-01-01',
})

// Client pour les opérations d'écriture (nécessite un token)
export const sanityWriteClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: import.meta.env.SANITY_AUTH_TOKEN, // Token requis pour les écritures
})

export interface CommonHeroData {
  variant?: 'simple' | 'split' | 'utilitaire'
  kicker?: string
  title?: string
  subtitle?: string
  showUpdatedDate?: boolean
  ctaCount?: number
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
  imageUrl?: string
  imageAlt?: string
}

// Types pour les données Sanity
export interface RestaurantData {
  _id: string
  _updatedAt?: string
  title: string
  subtitle: string
  hero?: CommonHeroData
  image?: any
  imageUrl?: string
  imageAlt?: string
  menuTitle: string
  reservationTitle: string
  dateSlots?: Array<{
    date?: string
    status?: string
    isVisible?: boolean
  }>
  price: number
  menuDescription: string
  highlights?: string[]
  minGuests: number
  depositAmount: number
  isVisible?: boolean
}

export interface ThermomixData {
  _id: string
  _updatedAt?: string
  hero?: CommonHeroData
  heroKicker?: string
  heroTitle?: string
  heroLead?: string
  heroHighlights?: Array<{
    label?: string
    title?: string
    text?: string
    isVisible?: boolean
  }>
  heroPrimaryCtaLabel?: string
  heroPrimaryCtaUrl?: string
  heroSecondaryCtaLabel?: string
  heroSecondaryCtaUrl?: string
  heroVideoCaption?: string
  monthlyText: string
  promoKicker?: string
  promoTitle?: string
  videoUrl: string
  featuredImage: any
  featuredImageUrl?: string
  benefitsTitle?: string
  benefits?: Array<{
    title?: string
    text?: string
    isVisible?: boolean
  }>
  benefitsCtaLabel?: string
  benefitsCtaLink?: string
  demoTitle?: string
  demoText?: string
  demoPrimaryCtaLabel?: string
  demoPrimaryCtaLink?: string
  demoSecondaryCtaLabel?: string
  demoSecondaryCtaLink?: string
  demoDetails?: Array<{
    label?: string
    text?: string
    isVisible?: boolean
  }>
  showHero?: boolean
  showPromo?: boolean
  showBenefits?: boolean
  showDemo?: boolean
}

export interface LocationData {
  _id: string
  _updatedAt?: string
  type: 'societe' | 'prive'
  title: string
  hero?: CommonHeroData
  subtitle: string
  price: string
  features: string[]
  description: string
  details?: string[]
  ctaLabel?: string
  ctaLink?: string
  maxCapacity: number
  image: any
  imageUrl?: string
  isVisible?: boolean
}

export interface CompanyAgendaSlot {
  date?: string
  status?: string
}

export interface RecipeData {
  _id: string
  _updatedAt?: string
  title: string
  slug: { current: string }
  category: string
  subtitle?: string
  description?: string
  featuredImage: any
  featuredImageUrl?: string
  featuredImageAlt?: string
  gallery?: Array<{ url?: string; alt?: string }>
  prepTime?: number
  cookTime?: number
  restTime?: number
  servings?: number
  difficulty?: string
  budget?: string
  ingredients?: Array<{
    group?: string
    name: string
    quantity: string
    unit: string
    notes?: string
  }>
  instructions?: any[]
  highlights?: Array<{
    title?: string
    text?: string
    icon?: string
  }>
  tips?: string[]
  variations?: string[]
  tags?: string[]
  diet?: string[]
  season?: string[]
  equipment?: string[]
  allergens?: string[]
  storage?: string
  nutrition?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    fiber?: number
  }
  isPremium: boolean
  packIds?: string[]
  publishedAt: string
  rating?: number
  isNew?: boolean
  isPopular?: boolean
}


export interface PackData {
  _id: string
  title: string
  slug?: { current: string }
  description?: string
  price?: number
  currency?: string
  stripePriceId?: string
  coverImage?: any
  coverImageUrl?: string
  ebookKey?: string
  recipeIds?: string[]
  recipeCount?: number
  isActive?: boolean
}

export interface AboutData {
  _id: string
  _updatedAt?: string
  title: string
  hero?: CommonHeroData
  heroTitle: string
  heroSubtitle: string
  heroCtaLabel?: string
  heroCtaLink?: string
  visionKicker?: string
  visionTitle?: string
  visionText?: string
  visionCards?: Array<{
    label?: string
    title?: string
    text?: string
    isVisible?: boolean
  }>
  aboutTitle: string
  aboutLead?: string
  bio: string
  aboutParagraphs?: string[]
  photo: any
  achievements: string[]
  aboutCtaLabel?: string
  aboutCtaLink?: string
  journeyTitle?: string
  journeyIntro?: string
  journeyItems?: string[]
  signatureTitle?: string
  signatureParagraphs?: string[]
  servicesTitle?: string
  servicesSubtitle?: string
  servicesCtaText?: string
  servicesCtaLink?: string
  services: Array<{
    title: string
    description: string
    price: string
    features: string[]
  }>
  showHero?: boolean
  showVision?: boolean
  showAboutSection?: boolean
  showAchievements?: boolean
  showServices?: boolean
  showJourney?: boolean
  showSignature?: boolean
}

export interface AuthorData {
  _id: string
  _updatedAt?: string
  hero?: CommonHeroData
  name?: string
  title?: string
  tagline?: string
  shortBio?: string
  longBio?: string
  photo?: any
  photoUrl?: string
  journeyIntro?: string
  journeyItems?: string[]
  visionTitle?: string
  visionParagraphs?: string[]
  signatureTitle?: string
  signatureParagraphs?: string[]
  publications?: Array<{
    title?: string
    type?: string
    year?: string
    publisher?: string
    url?: string
    description?: string
    coverImageUrl?: string
    logoUrl?: string
  }>
  proofs?: Array<{
    label?: string
    value?: string
    description?: string
  }>
  testimonials?: Array<{
    name?: string
    role?: string
    quote?: string
  }>
  faqs?: Array<{
    question?: string
    answer?: string
  }>
  ctaLabel?: string
  ctaLink?: string
}

export interface HomeData {
  _id: string
  _updatedAt?: string
  title: string
  hero?: CommonHeroData
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  heroBackgroundImage?: {
    asset?: {
      url?: string
    }
  }
  locationSectionTitle: string
  locationSectionDescription: string
  locationGallery?: Array<{
    url?: string
    alt?: string
  }>
  restaurantSectionTitle: string
  restaurantSectionDescription: string
  ctaExcerpt?: string
  ctaTitle: string
  ctaDescription: string
  ctaPrimaryButton: string
}

export interface CompanyAgendaData {
  _id: string
  title: string
  description: string
  slots: CompanyAgendaSlot[]
  calendarTitle?: string
  startMonth?: string
  monthsToShow?: number
  isVisible?: boolean
}

export interface ContactData {
  _id: string
  _updatedAt?: string
  title: string
  hero?: CommonHeroData
  heroTitle: string
  heroSubtitle: string
  phoneLabel?: string
  phoneButtonLabel?: string
  emailLabel?: string
  emailButtonLabel?: string
  instagramLabel?: string
  instagramHandle?: string
  instagramButtonLabel?: string
  instagramUrl?: string
  mapTitle?: string
  mapCtaLabel?: string
  mapCtaUrl?: string
  mapEmbedUrl?: string
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
  showContactCards?: boolean
  showPhoneCard?: boolean
  showEmailCard?: boolean
  showInstagramCard?: boolean
  showBookingInfo?: boolean
  showMap?: boolean
}

export interface SiteSettingsData {
  _id: string
  siteName?: string
  siteTagline?: string
  navigation?: Array<{
    label?: string
    href?: string
    isVisible?: boolean
  }>
  footer?: {
    brandTitle?: string
    brandSubtitle?: string
    contact?: {
      phone?: string
      email?: string
    }
    socialLinks?: Array<{
      platform?: string
      url?: string
      label?: string
      isVisible?: boolean
    }>
    copyrightText?: string
  }
  address?: {
    street?: string
    city?: string
    region?: string
    postalCode?: string
    country?: string
    isVisible?: boolean
  }
  seo?: {
    defaultTitle?: string
    defaultDescription?: string
    shareImageUrl?: string
    siteUrl?: string
  }
  showNavigation?: boolean
  showFooter?: boolean
  showNewsletter?: boolean
}

export interface RecipesPageData {
  _id: string
  pageTitle?: string
  heroKicker?: string
  heroTitle?: string
  heroDescription?: string
  heroShopLabel?: string
  filtersEmptyTitle?: string
  filtersEmptyText?: string
  comingSoonTitle?: string
  comingSoonText?: string
  comingSoonHighlight?: string
  previewCards?: Array<{
    title?: string
    description?: string
    time?: string
    servings?: string
    difficulty?: string
    tags?: string[]
    isVisible?: boolean
  }>
  previewImageLabel?: string
  shopBadgeLabel?: string
  shopButtonAriaLabel?: string
  shopKicker?: string
  shopTitle?: string
  shopDescription?: string
  shopCloseLabel?: string
  shopEmptyText?: string
  shopCardPlaceholder?: string
  shopActiveLabel?: string
  shopBuyLabel?: string
  shopDownloadLabel?: string
  accessTitle?: string
  accessText?: string
  accessPlaceholder?: string
  accessButtonLabel?: string
  showHero?: boolean
  showShop?: boolean
  showPreviewCards?: boolean
}

export interface NewsletterSettingsData {
  _id: string
  title?: string
  description?: string
  inputPlaceholder?: string
  buttonLabel?: string
  successTitle?: string
  successText?: string
  successButtonLabel?: string
  errorMessage?: string
}

// Requêtes GROQ pour récupérer les données
export const queries = {
  // Restaurant - Récupère le document le plus récent
  restaurant: `*[_type == "restaurant"] | order(_updatedAt desc)[0] {
    _id,
    _updatedAt,
    title,
    hero{
      variant,
      kicker,
      title,
      subtitle,
      showUpdatedDate,
      ctaCount,
      primaryCtaLabel,
      primaryCtaUrl,
      secondaryCtaLabel,
      secondaryCtaUrl,
      "imageUrl": splitImage.asset->url,
      "imageAlt": splitImageAlt
    },
    subtitle,
    image,
    "imageUrl": image.asset->url,
    imageAlt,
    menuTitle,
    reservationTitle,
    dateSlots[]{
      date,
      status,
      isVisible
    },
    price,
    menuDescription,
    highlights,
    minGuests,
    depositAmount,
    isVisible
  }`,

  // Thermomix - Document unique
  thermomix: `*[_type == "thermomix"] | order(_updatedAt desc)[0] {
    _id,
    _updatedAt,
    hero{
      variant,
      kicker,
      title,
      subtitle,
      showUpdatedDate,
      ctaCount,
      primaryCtaLabel,
      primaryCtaUrl,
      secondaryCtaLabel,
      secondaryCtaUrl,
      "imageUrl": splitImage.asset->url,
      "imageAlt": splitImageAlt
    },
    heroKicker,
    heroTitle,
    heroLead,
    heroHighlights,
    heroPrimaryCtaLabel,
    heroPrimaryCtaUrl,
    heroSecondaryCtaLabel,
    heroSecondaryCtaUrl,
    heroVideoCaption,
    monthlyText,
    promoKicker,
    promoTitle,
    videoUrl,
    featuredImage,
    "featuredImageUrl": featuredImage.asset->url,
    benefitsTitle,
    benefits,
    benefitsCtaLabel,
    benefitsCtaLink,
    demoTitle,
    demoText,
    demoPrimaryCtaLabel,
    demoPrimaryCtaLink,
    demoSecondaryCtaLabel,
    demoSecondaryCtaLink,
    demoDetails,
    showHero,
    showPromo,
    showBenefits,
    showDemo
  }`,

  // Locations - Tous les types
  locations: `*[_type == "location"] {
    _id,
    _updatedAt,
    type,
    title,
    hero{
      variant,
      kicker,
      title,
      subtitle,
      showUpdatedDate,
      ctaCount,
      primaryCtaLabel,
      primaryCtaUrl,
      secondaryCtaLabel,
      secondaryCtaUrl,
      "imageUrl": splitImage.asset->url,
      "imageAlt": splitImageAlt
    },
    subtitle,
    price,
    features,
    description,
    details,
    ctaLabel,
    ctaLink,
    maxCapacity,
    image,
    "imageUrl": image.asset->url,
    isVisible
  }`,

  companyAgenda: `*[_type == "companyAgenda"] | order(_updatedAt desc)[0] {
    _id,
    title,
    description,
    calendarTitle,
    startMonth,
    monthsToShow,
    slots[]{
      date,
      status
    },
    isVisible
  }`,

  // Recettes - Toutes les recettes gratuites (hors packs)
  recipes: `*[_type == "recipe" && !(_id in *[_type == "pack" && isActive == true].recipes[]._ref)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    category,
    subtitle,
    description,
    featuredImage,
    "featuredImageUrl": featuredImage.asset->url,
    "featuredImageAlt": featuredImage.alt,
    gallery[]{ "url": asset->url, alt },
    prepTime,
    cookTime,
    restTime,
    servings,
    difficulty,
    budget,
    ingredients,
    instructions,
    highlights,
    tips,
    variations,
    tags,
    diet,
    season,
    equipment,
    allergens,
    storage,
    nutrition,
    isPremium,
    publishedAt,
    rating,
    isNew,
    isPopular
  }`,

  // Recette spécifique par slug
  recipeBySlug: `*[_type == "recipe" && slug.current == $slug][0] {
    _id,
    _updatedAt,
    title,
    slug,
    category,
    subtitle,
    description,
    featuredImage,
    "featuredImageUrl": featuredImage.asset->url,
    "featuredImageAlt": featuredImage.alt,
    gallery[]{ "url": asset->url, alt },
    prepTime,
    cookTime,
    restTime,
    servings,
    difficulty,
    budget,
    ingredients,
    instructions,
    highlights,
    tips,
    variations,
    tags,
    diet,
    season,
    equipment,
    allergens,
    storage,
    nutrition,
    isPremium,
    publishedAt,
    rating,
    isNew,
    isPopular,
    "packIds": *[_type == "pack" && isActive == true && references(^._id)]._id
  }`,

  // Recettes par catégorie
  recipesByCategory: `*[_type == "recipe" && category == $category && !(_id in *[_type == "pack" && isActive == true].recipes[]._ref)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    description,
    featuredImage,
    "featuredImageUrl": featuredImage.asset->url,
    "featuredImageAlt": featuredImage.alt,
    prepTime,
    cookTime,
    restTime,
    difficulty,
    tags,
    diet,
    season,
    budget
  }`,


  // Packs - Boutique
  packs: `*[_type == "pack" && isActive == true] | order(_createdAt desc) {
    _id,
    title,
    slug,
    description,
    price,
    currency,
    stripePriceId,
    coverImage,
    "coverImageUrl": coverImage.asset->url,
    ebookKey,
    "recipeIds": recipes[]._ref,
    "recipeCount": count(recipes),
    isActive
  }`,

  packById: `*[_type == "pack" && _id == $id][0] {
    _id,
    title,
    slug,
    description,
    price,
    currency,
    stripePriceId,
    coverImage,
    "coverImageUrl": coverImage.asset->url,
    ebookKey,
    "recipeIds": recipes[]._ref,
    "recipeCount": count(recipes),
    isActive
  }`,

  recipesByPackIds: `*[_type == "recipe" && _id in *[_type == "pack" && _id in $packIds].recipes[]._ref] | order(publishedAt desc) {
    _id,
    title,
    slug,
    category,
    subtitle,
    description,
    featuredImage,
    "featuredImageUrl": featuredImage.asset->url,
    "featuredImageAlt": featuredImage.alt,
    gallery[]{ "url": asset->url, alt },
    prepTime,
    cookTime,
    restTime,
    servings,
    difficulty,
    budget,
    ingredients,
    instructions,
    highlights,
    tips,
    variations,
    tags,
    diet,
    season,
    equipment,
    allergens,
    storage,
    nutrition,
    isPremium,
    publishedAt,
    rating,
    isNew,
    isPopular
  }`,

  // About - Informations personnelles
  about: `*[_type == "about"] | order(_updatedAt desc)[0] {
    _id,
    _updatedAt,
    title,
    hero{
      variant,
      kicker,
      title,
      subtitle,
      showUpdatedDate,
      ctaCount,
      primaryCtaLabel,
      primaryCtaUrl,
      secondaryCtaLabel,
      secondaryCtaUrl,
      "imageUrl": splitImage.asset->url,
      "imageAlt": splitImageAlt
    },
    heroTitle,
    heroSubtitle,
    heroCtaLabel,
    heroCtaLink,
    visionKicker,
    visionTitle,
    visionText,
    visionCards,
    aboutTitle,
    aboutLead,
    bio,
    aboutParagraphs,
    photo {
      asset->{
        url
      }
    },
    achievements,
    aboutCtaLabel,
    aboutCtaLink,
    journeyTitle,
    journeyIntro,
    journeyItems,
    signatureTitle,
    signatureParagraphs,
    servicesTitle,
    servicesSubtitle,
    servicesCtaText,
    servicesCtaLink,
    services,
    showHero,
    showVision,
    showAboutSection,
    showAchievements,
    showServices,
    showJourney,
    showSignature
  }`,

  // Contact - Informations de contact
  contact: `*[_type == "contact"] | order(_updatedAt desc)[0] {
    _id,
    _updatedAt,
    title,
    hero{
      variant,
      kicker,
      title,
      subtitle,
      showUpdatedDate,
      ctaCount,
      primaryCtaLabel,
      primaryCtaUrl,
      secondaryCtaLabel,
      secondaryCtaUrl,
      "imageUrl": splitImage.asset->url,
      "imageAlt": splitImageAlt
    },
    heroTitle,
    heroSubtitle,
    phoneLabel,
    phoneButtonLabel,
    emailLabel,
    emailButtonLabel,
    instagramLabel,
    instagramHandle,
    instagramButtonLabel,
    instagramUrl,
    mapTitle,
    mapCtaLabel,
    mapCtaUrl,
    mapEmbedUrl,
    contactInfo,
    socialLinks,
    bookingInfo,
    showContactCards,
    showPhoneCard,
    showEmailCard,
    showInstagramCard,
    showBookingInfo,
    showMap
  }`,
  recipesPage: `*[_type == "recipesPage"][0] {
    _id,
    pageTitle,
    heroKicker,
    heroTitle,
    heroDescription,
    heroShopLabel,
    filtersEmptyTitle,
    filtersEmptyText,
    comingSoonTitle,
    comingSoonText,
    comingSoonHighlight,
    previewCards[]{
      title,
      description,
      time,
      servings,
      difficulty,
      tags,
      isVisible
    },
    previewImageLabel,
    shopBadgeLabel,
    shopButtonAriaLabel,
    shopKicker,
    shopTitle,
    shopDescription,
    shopCloseLabel,
    shopEmptyText,
    shopCardPlaceholder,
    shopActiveLabel,
    shopBuyLabel,
    shopDownloadLabel,
    accessTitle,
    accessText,
    accessPlaceholder,
    accessButtonLabel,
    showHero,
    showShop,
    showPreviewCards
  }`,
  newsletterSettings: `*[_type == "newsletterSettings"][0] {
    _id,
    title,
    description,
    inputPlaceholder,
    buttonLabel,
    successTitle,
    successText,
    successButtonLabel,
    errorMessage
  }`,
  // Réglages du site
  siteSettings: `*[_type == "siteSettings"][0] {
    _id,
    siteName,
    siteTagline,
    navigation[]{
      label,
      href,
      isVisible
    },
    footer{
      brandTitle,
      brandSubtitle,
      contact{
        phone,
        email
      },
      socialLinks[]{
        platform,
        url,
        label,
        isVisible
      },
      copyrightText
    },
    address{
      street,
      city,
      region,
      postalCode,
      country,
      isVisible
    },
    seo{
      defaultTitle,
      defaultDescription,
      "shareImageUrl": shareImage.asset->url,
      siteUrl
    },
    showNavigation,
    showFooter,
    showNewsletter
  }`,
  // Auteur
  authorProfile: `*[_type == "authorProfile"][0] {
    _id,
    _updatedAt,
    hero{
      variant,
      kicker,
      title,
      subtitle,
      showUpdatedDate,
      ctaCount,
      primaryCtaLabel,
      primaryCtaUrl,
      secondaryCtaLabel,
      secondaryCtaUrl,
      "imageUrl": splitImage.asset->url,
      "imageAlt": splitImageAlt
    },
    name,
    title,
    tagline,
    shortBio,
    longBio,
    photo,
    "photoUrl": photo.asset->url,
    journeyIntro,
    journeyItems,
    visionTitle,
    visionParagraphs,
    signatureTitle,
    signatureParagraphs,
    publications[]{
      title,
      type,
      year,
      publisher,
      url,
      description,
      "coverImageUrl": coverImage.asset->url,
      "logoUrl": logo.asset->url
    },
    proofs[]{
      label,
      value,
      description
    },
    testimonials[]{
      name,
      role,
      quote
    },
    faqs[]{
      question,
      answer
    },
    ctaLabel,
    ctaLink
  }`,
  // Home - Page d'accueil
  home: `*[_type == "home"] | order(_updatedAt desc)[0] {
    _id,
    _updatedAt,
    title,
    hero{
      variant,
      kicker,
      title,
      subtitle,
      showUpdatedDate,
      ctaCount,
      primaryCtaLabel,
      primaryCtaUrl,
      secondaryCtaLabel,
      secondaryCtaUrl,
      "imageUrl": splitImage.asset->url,
      "imageAlt": splitImageAlt
    },
    heroTitle,
    heroSubtitle,
    heroDescription,
    heroBackgroundImage {
      asset-> {
        url
      }
    },
    locationSectionTitle,
    locationSectionDescription,
    locationGallery[]{
      "url": asset->url,
      alt
    },
    restaurantSectionTitle,
    restaurantSectionDescription,
    ctaExcerpt,
    ctaTitle,
    ctaDescription,
    ctaPrimaryButton
  }`}

// Fonctions utilitaires pour récupérer les données
const SANITY_CACHE_TTL_MS = 30_000
const sanityCache = new Map<string, { expiresAt: number; value: unknown }>()

function makeCacheKey(key: string, params?: Record<string, unknown>) {
  if (!params) return key
  return `${key}:${JSON.stringify(params)}`
}

async function fetchSanityWithCache<T>(options: {
  cacheKey: string
  query: string
  params?: Record<string, unknown>
  fallback: T
  errorLabel: string
}): Promise<T> {
  const key = makeCacheKey(options.cacheKey, options.params)
  const now = Date.now()
  const cached = sanityCache.get(key)
  if (cached && cached.expiresAt > now) {
    return cached.value as T
  }

  try {
    const data = await sanityClient.fetch<T>(options.query, options.params)
    sanityCache.set(key, { expiresAt: now + SANITY_CACHE_TTL_MS, value: data })
    return data
  } catch (error) {
    console.error(options.errorLabel, error)
    return options.fallback
  }
}

export async function getThermomixData(): Promise<ThermomixData | null> {
  return fetchSanityWithCache({
    cacheKey: 'thermomix',
    query: queries.thermomix,
    fallback: null,
    errorLabel: 'Erreur lors de la récupération des données thermomix:'
  })
}

export async function getRestaurantData(): Promise<RestaurantData | null> {
  return fetchSanityWithCache({
    cacheKey: 'restaurant',
    query: queries.restaurant,
    fallback: null,
    errorLabel: 'Erreur lors de la récupération des données restaurant:'
  })
}

export async function getLocationsData(): Promise<LocationData[]> {
  return fetchSanityWithCache({
    cacheKey: 'locations',
    query: queries.locations,
    fallback: [],
    errorLabel: 'Erreur lors de la récupération des données locations:'
  })
}

export async function getCompanyAgendaData(): Promise<CompanyAgendaData | null> {
  return fetchSanityWithCache({
    cacheKey: 'companyAgenda',
    query: queries.companyAgenda,
    fallback: null,
    errorLabel: 'Erreur lors de la récupération des données agenda entreprises:'
  })
}

export async function getRecipesData(): Promise<RecipeData[]> {
  return fetchSanityWithCache({
    cacheKey: 'recipes',
    query: queries.recipes,
    fallback: [],
    errorLabel: 'Erreur lors de la récupération des données recettes:'
  })
}

export async function getRecipeBySlug(slug: string): Promise<RecipeData | null> {
  return fetchSanityWithCache({
    cacheKey: 'recipeBySlug',
    query: queries.recipeBySlug,
    params: { slug },
    fallback: null,
    errorLabel: 'Erreur lors de la récupération de la recette:'
  })
}

export async function getRecipesByCategory(category: string): Promise<RecipeData[]> {
  return fetchSanityWithCache({
    cacheKey: 'recipesByCategory',
    query: queries.recipesByCategory,
    params: { category },
    fallback: [],
    errorLabel: 'Erreur lors de la récupération des recettes par catégorie:'
  })
}

export async function getPacksData(): Promise<PackData[]> {
  return fetchSanityWithCache({
    cacheKey: 'packs',
    query: queries.packs,
    fallback: [],
    errorLabel: 'Erreur lors de la récupération des packs:'
  })
}

export async function getPackById(id: string): Promise<PackData | null> {
  return fetchSanityWithCache({
    cacheKey: 'packById',
    query: queries.packById,
    params: { id },
    fallback: null,
    errorLabel: 'Erreur lors de la récupération du pack:'
  })
}

export async function getRecipesByPackIds(packIds: string[]): Promise<RecipeData[]> {
  if (!packIds.length) return []
  return fetchSanityWithCache({
    cacheKey: 'recipesByPackIds',
    query: queries.recipesByPackIds,
    params: { packIds },
    fallback: [],
    errorLabel: 'Erreur lors de la récupération des recettes premium:'
  })
}

export async function getAboutData(): Promise<AboutData | null> {
  return fetchSanityWithCache({
    cacheKey: 'about',
    query: queries.about,
    fallback: null,
    errorLabel: 'Erreur lors de la récupération des données about:'
  })
}

export async function getAuthorData(): Promise<AuthorData | null> {
  return fetchSanityWithCache({
    cacheKey: 'authorProfile',
    query: queries.authorProfile,
    fallback: null,
    errorLabel: 'Erreur lors de la récupération du profil auteur:'
  })
}

export async function getContactData(): Promise<ContactData | null> {
  return fetchSanityWithCache({
    cacheKey: 'contact',
    query: queries.contact,
    fallback: null,
    errorLabel: 'Erreur lors de la récupération des données contact:'
  })
}

export async function getHomeData(): Promise<HomeData | null> {
  return fetchSanityWithCache({
    cacheKey: 'home',
    query: queries.home,
    fallback: null,
    errorLabel: 'Erreur lors de la récupération des données home:'
  })
}

export async function getSiteSettingsData(): Promise<SiteSettingsData | null> {
  return fetchSanityWithCache({
    cacheKey: 'siteSettings',
    query: queries.siteSettings,
    fallback: null,
    errorLabel: 'Erreur lors de la récupération des réglages du site:'
  })
}

export async function getRecipesPageData(): Promise<RecipesPageData | null> {
  return fetchSanityWithCache({
    cacheKey: 'recipesPage',
    query: queries.recipesPage,
    fallback: null,
    errorLabel: 'Erreur lors de la récupération des données recettes:'
  })
}

export async function getNewsletterSettingsData(): Promise<NewsletterSettingsData | null> {
  return fetchSanityWithCache({
    cacheKey: 'newsletterSettings',
    query: queries.newsletterSettings,
    fallback: null,
    errorLabel: 'Erreur lors de la récupération des réglages newsletter:'
  })
}
