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

// Types pour les données Sanity
export interface RestaurantData {
  _id: string
  title: string
  subtitle: string
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
  type: 'societe' | 'prive'
  title: string
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
  title: string
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

export interface HomeData {
  _id: string
  title: string
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
  title: string
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
    title,
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
    type,
    title,
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
    title,
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
    title,
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
  // Home - Page d'accueil
  home: `*[_type == "home"] | order(_updatedAt desc)[0] {
    _id,
    title,
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
    return await sanityClient.fetch(queries.recipeBySlug, { slug })
  } catch (error) {
    console.error('Erreur lors de la récupération de la recette:', error)
    return null
  }
}

export async function getRecipesByCategory(category: string): Promise<RecipeData[]> {
  try {
    return await sanityClient.fetch(queries.recipesByCategory, { category })
  } catch (error) {
    console.error('Erreur lors de la récupération des recettes par catégorie:', error)
    return []
  }
}


export async function getPacksData(): Promise<PackData[]> {
  try {
    return await sanityClient.fetch(queries.packs)
  } catch (error) {
    console.error('Erreur lors de la récupération des packs:', error)
    return []
  }
}

export async function getPackById(id: string): Promise<PackData | null> {
  try {
    return await sanityClient.fetch(queries.packById, { id })
  } catch (error) {
    console.error('Erreur lors de la récupération du pack:', error)
    return null
  }
}

export async function getRecipesByPackIds(packIds: string[]): Promise<RecipeData[]> {
  if (!packIds.length) return []
  try {
    return await sanityClient.fetch(queries.recipesByPackIds, { packIds })
  } catch (error) {
    console.error('Erreur lors de la récupération des recettes premium:', error)
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

export async function getSiteSettingsData(): Promise<SiteSettingsData | null> {
  try {
    return await sanityClient.fetch(queries.siteSettings)
  } catch (error) {
    console.error('Erreur lors de la récupération des réglages du site:', error)
    return null
  }
}

export async function getRecipesPageData(): Promise<RecipesPageData | null> {
  try {
    return await sanityClient.fetch(queries.recipesPage)
  } catch (error) {
    console.error('Erreur lors de la récupération des données recettes:', error)
    return null
  }
}

export async function getNewsletterSettingsData(): Promise<NewsletterSettingsData | null> {
  try {
    return await sanityClient.fetch(queries.newsletterSettings)
  } catch (error) {
    console.error('Erreur lors de la récupération des réglages newsletter:', error)
    return null
  }
}
