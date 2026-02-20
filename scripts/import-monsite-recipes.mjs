#!/usr/bin/env node

import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { createClient } from '@sanity/client'

const RECIPE_SLUG_MAX_LENGTH = 72
const DEFAULT_SOURCE_DIR = './src/monsite'
const DEFAULT_REPORT_PATH = './.reports/monsite-import-report.json'
const DEFAULT_CACHE_PATH = './.cache/monsite-asset-cache.json'
const DEFAULT_API_VERSION = '2024-01-01'
const DEFAULT_CONCURRENCY = 6
const DELETE_BATCH_SIZE = 100
const UPSERT_BATCH_SIZE = 40
const MAX_DESCRIPTION_LENGTH = 220
const MIN_DESCRIPTION_LENGTH = 30

const CATEGORY_LABELS = {
  entree: 'entree',
  plat: 'plat principal',
  dessert: 'dessert',
  boisson: 'boisson',
  accompagnement: 'accompagnement'
}

function parseArgs(argv) {
  const has = (flag) => argv.includes(flag)
  const valueOf = (flag, fallback) => {
    const index = argv.indexOf(flag)
    if (index < 0) return fallback
    return argv[index + 1] || fallback
  }

  const apply = has('--apply')
  const dryRun = has('--dry-run') || !apply
  const sourceDir = valueOf('--source', DEFAULT_SOURCE_DIR)
  const reportPath = valueOf('--report', DEFAULT_REPORT_PATH)
  const cachePath = valueOf('--cache', DEFAULT_CACHE_PATH)
  const apiVersion = valueOf('--api-version', DEFAULT_API_VERSION)
  const concurrencyRaw = Number.parseInt(valueOf('--concurrency', `${DEFAULT_CONCURRENCY}`), 10)

  return {
    apply,
    dryRun,
    reset: has('--reset'),
    sourceDir,
    reportPath,
    cachePath,
    apiVersion,
    concurrency: Number.isFinite(concurrencyRaw) && concurrencyRaw > 0 ? concurrencyRaw : DEFAULT_CONCURRENCY
  }
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return
  const content = fs.readFileSync(filePath, 'utf-8')
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return

    const equalsIndex = trimmed.indexOf('=')
    if (equalsIndex <= 0) return

    const key = trimmed.slice(0, equalsIndex).trim()
    if (!key || process.env[key] !== undefined) return

    let value = trimmed.slice(equalsIndex + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    process.env[key] = value
  })
}

function loadEnvFromKnownFiles(rootDir) {
  ;[
    path.join(rootDir, '.env'),
    path.join(rootDir, '.env.local'),
    path.join(rootDir, '.env.production'),
    path.join(rootDir, 'studio/.env'),
    path.join(rootDir, 'studio/.env.local'),
    path.join(rootDir, 'studio/.env.production')
  ].forEach(loadEnvFile)
}

function ensureParentDir(filePath) {
  const absolutePath = path.resolve(process.cwd(), filePath)
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true })
  return absolutePath
}

function writeJsonFile(filePath, payload) {
  const absolutePath = ensureParentDir(filePath)
  fs.writeFileSync(absolutePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf-8')
  return absolutePath
}

function readJsonFileSafe(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function decodeUtf16Be(buffer) {
  const swapped = Buffer.allocUnsafe(buffer.length)
  for (let i = 0; i < buffer.length; i += 2) {
    swapped[i] = buffer[i + 1] ?? 0
    swapped[i + 1] = buffer[i] ?? 0
  }
  return new TextDecoder('utf-16le').decode(swapped)
}

function looksLikeUtf16Le(buffer) {
  const length = Math.min(buffer.length, 400)
  let zeroCount = 0
  for (let i = 1; i < length; i += 2) {
    if (buffer[i] === 0) zeroCount += 1
  }
  return zeroCount > length * 0.2
}

function readRecipeFile(filePath) {
  const buffer = fs.readFileSync(filePath)
  if (buffer.length >= 2) {
    if (buffer[0] === 0xff && buffer[1] === 0xfe) {
      return new TextDecoder('utf-16le').decode(buffer.slice(2))
    }
    if (buffer[0] === 0xfe && buffer[1] === 0xff) {
      return decodeUtf16Be(buffer.slice(2))
    }
  }

  if (looksLikeUtf16Le(buffer)) {
    return new TextDecoder('utf-16le').decode(buffer)
  }

  return buffer.toString('utf-8')
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function decodeHtmlEntities(value) {
  if (!value) return ''

  const namedMap = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
    rsquo: "'",
    lsquo: "'",
    rdquo: '"',
    ldquo: '"',
    eacute: 'e',
    egrave: 'e',
    ecirc: 'e',
    agrave: 'a',
    aacute: 'a',
    acirc: 'a',
    ccedil: 'c',
    icirc: 'i',
    ocirc: 'o',
    ugrave: 'u',
    ucirc: 'u',
    uuml: 'u',
    oelig: 'oe'
  }

  return value
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      const cp = Number.parseInt(hex, 16)
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : ''
    })
    .replace(/&#([0-9]+);/g, (_, dec) => {
      const cp = Number.parseInt(dec, 10)
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : ''
    })
    .replace(/&([a-zA-Z]+);/g, (_, name) => namedMap[name.toLowerCase()] ?? '')
}

function htmlToText(value) {
  return decodeHtmlEntities(
    value
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<li[^>]*>/gi, '')
      .replace(/<[^>]+>/g, ' ')
  )
}

function normalizeWhitespace(value) {
  return (value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeRecipeTitle(rawTitle, fileName) {
  const fallback = normalizeWhitespace(path.basename(fileName, '.html'))
  let title = normalizeWhitespace(rawTitle || fallback)
  if (!title) title = fallback

  const markerPatterns = [
    /\b\d+\s*(?:pers?|personnes?|gr|g|kg|ml|cl|dl|l)\b/i,
    /\bmettre\b/i,
    /\bprechauffer\b/i,
    /\benfourner\b/i,
    /\bmixer\b/i
  ]

  let markerIndex = -1
  for (const pattern of markerPatterns) {
    const match = title.match(pattern)
    if (!match || typeof match.index !== 'number') continue
    if (match.index < 15) continue
    if (markerIndex === -1 || match.index < markerIndex) {
      markerIndex = match.index
    }
  }

  if (markerIndex > 0) {
    title = title.slice(0, markerIndex).trim()
  }

  title = title.replace(/[;:,.!?/\- ]+$/g, '').trim()
  if (!title) title = fallback

  if (title.length > 120) {
    title = title.slice(0, 120).replace(/[;:,.!?/\- ]+$/g, '').trim()
  }

  return title || fallback
}

function normalizeForLookup(value) {
  return normalizeWhitespace(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function splitToLines(value) {
  return (value || '')
    .split(/\r?\n+/)
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean)
}

function extractClassContent(html, className) {
  const pattern = new RegExp(
    `<([a-zA-Z0-9]+)[^>]*class=(["'])[^"']*\\b${escapeRegExp(className)}\\b[^"']*\\2[^>]*>([\\s\\S]*?)<\\/\\1>`,
    'i'
  )
  const match = html.match(pattern)
  return match ? match[3] : ''
}

function extractClassText(html, className) {
  return normalizeWhitespace(htmlToText(extractClassContent(html, className)))
}

function getAttribute(tag, attributeName) {
  const regex = new RegExp(`${escapeRegExp(attributeName)}\\s*=\\s*(["'])(.*?)\\1`, 'i')
  const match = tag.match(regex)
  return match ? match[2] : ''
}

function extractPhotoSource(html) {
  const imageTagRegex = /<img\b[^>]*>/gi
  for (const tag of html.match(imageTagRegex) || []) {
    const classValue = getAttribute(tag, 'class')
    if (!classValue) continue
    const classes = classValue.split(/\s+/).filter(Boolean)
    if (!classes.includes('photo')) continue
    const src = getAttribute(tag, 'src')
    if (src) return src
  }
  return ''
}

function extractIngredientLines(html) {
  const regex = /<li\b[^>]*class=(['"])[^'"]*\bingredient\b[^'"]*\1[^>]*>([\s\S]*?)<\/li>/gi
  const lines = []
  let match
  while ((match = regex.exec(html)) !== null) {
    const raw = normalizeWhitespace(htmlToText(match[2]))
    if (!raw) continue
    lines.push(raw)
  }
  return lines
}

function parseMinutes(value) {
  if (!value) return 0

  const normalized = normalizeForLookup(value).replace(/,/g, '.')

  const both = normalized.match(/(\d+(?:\.\d+)?)\s*h\s*(\d{1,2})/)
  if (both) {
    const hours = Number.parseFloat(both[1]) || 0
    const minutes = Number.parseFloat(both[2]) || 0
    return Math.round(hours * 60 + minutes)
  }

  let hours = 0
  let minutes = 0

  const onlyHours = normalized.match(/(\d+(?:\.\d+)?)\s*h/)
  if (onlyHours) {
    hours = Number.parseFloat(onlyHours[1]) || 0
  }

  const onlyMinutes = normalized.match(/(\d+(?:\.\d+)?)\s*(?:min|mn|minute|minutes)/)
  if (onlyMinutes) {
    minutes = Number.parseFloat(onlyMinutes[1]) || 0
  }

  if (hours || minutes) {
    return Math.round(hours * 60 + minutes)
  }

  const values = (normalized.match(/\d+(?:\.\d+)?/g) || [])
    .map((raw) => Number.parseFloat(raw))
    .filter((n) => Number.isFinite(n))

  if (!values.length) return 0
  return Math.round(Math.max(...values))
}

function parseServings(value) {
  if (!value) return null
  const normalized = normalizeForLookup(value)
  const values = (normalized.match(/\d+(?:\.\d+)?/g) || [])
    .map((raw) => Number.parseFloat(raw))
    .filter((n) => Number.isFinite(n))

  if (!values.length) return null
  return Math.max(1, Math.round(Math.max(...values)))
}

function toAsciiSlug(value) {
  const normalized = (value || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')

  if (!normalized) return 'recette'
  if (normalized.length <= RECIPE_SLUG_MAX_LENGTH) return normalized

  return normalized.slice(0, RECIPE_SLUG_MAX_LENGTH).replace(/-+$/g, '')
}

function dedupeKeepOrder(values) {
  const seen = new Set()
  const output = []
  for (const value of values) {
    if (!value || seen.has(value)) continue
    seen.add(value)
    output.push(value)
  }
  return output
}

function tagsContain(tags, needle) {
  if (needle.length <= 3) {
    const shortWordRegex = new RegExp(`\\b${escapeRegExp(needle)}\\b`)
    return tags.some((tag) => shortWordRegex.test(tag))
  }
  return tags.some((tag) => tag.includes(needle))
}

function parseTagMetadata(rawCategories) {
  const tags = (rawCategories || '')
    .split(',')
    .map((tag) => normalizeWhitespace(tag))
    .filter(Boolean)

  const normalizedTags = tags.map((tag) => normalizeForLookup(tag))

  let category = 'plat'
  if (['dessert', 'gateau', 'tarte', 'sucre', 'biscuit', 'cookie'].some((needle) => tagsContain(normalizedTags, needle))) {
    category = 'dessert'
  } else if (['boisson', 'cocktail', 'jus', 'smoothie', 'infusion', 'the'].some((needle) => tagsContain(normalizedTags, needle))) {
    category = 'boisson'
  } else if (['entree', 'apero', 'starter', 'salade', 'petit dej', 'petit dejeuner'].some((needle) => tagsContain(normalizedTags, needle))) {
    category = 'entree'
  } else if (['accompagnement', 'legumes et accompagnement', 'garniture', 'sauce', 'dip', 'tartinade', 'side'].some((needle) => tagsContain(normalizedTags, needle))) {
    category = 'accompagnement'
  } else if (['plat', 'plats principaux', 'plat principal', 'plats'].some((needle) => tagsContain(normalizedTags, needle))) {
    category = 'plat'
  }

  const diet = []
  const dietMap = {
    vegetarien: 'vegetarien',
    vegan: 'vegan',
    vegetalien: 'vegan',
    pescetarien: 'pescetarien',
    'sans gluten': 'sans-gluten',
    'sans-gluten': 'sans-gluten',
    'sans lactose': 'sans-lactose',
    'sans lait': 'sans-lactose',
    'sans sucre': 'sans-sucre',
    'ig bas': 'ig-bas'
  }

  for (const tag of normalizedTags) {
    for (const [needle, value] of Object.entries(dietMap)) {
      if (tag.includes(needle)) {
        diet.push(value)
        break
      }
    }
  }

  const season = []
  for (const tag of normalizedTags) {
    if (tag.includes('printemps')) season.push('printemps')
    else if (tag.includes('ete')) season.push('ete')
    else if (tag.includes('automne')) season.push('automne')
    else if (tag.includes('hiver')) season.push('hiver')
  }

  const equipment = normalizedTags
    .filter((tag) => tag.includes('thermomix'))
    .map(() => 'Thermomix')

  return {
    category,
    tags: dedupeKeepOrder(tags),
    diet: dedupeKeepOrder(diet),
    season: dedupeKeepOrder(season),
    equipment: dedupeKeepOrder(equipment)
  }
}

function clampRecipeDescription(value) {
  const compact = normalizeWhitespace(value)
  if (compact.length <= MAX_DESCRIPTION_LENGTH) return compact
  return `${compact.slice(0, MAX_DESCRIPTION_LENGTH - 3).trimEnd()}...`
}

function buildDescription(title, category) {
  const categoryLabel = CATEGORY_LABELS[category] || 'de cuisine'
  let description = `${title} est une recette ${categoryLabel} simple et equilibree, avec des ingredients clairs et des etapes faciles a suivre.`
  description = clampRecipeDescription(description)

  if (description.length < MIN_DESCRIPTION_LENGTH) {
    description = clampRecipeDescription(`${title} - recette detaillee et facile a realiser.`)
  }

  return description
}

function buildImageAlt(title) {
  const alt = normalizeWhitespace(`Photo de ${title}`)
  return alt.length >= 5 ? alt : `Photo ${title}`
}

function parseRating(html) {
  const ratingTagMatch = html.match(/<[^>]*class=(['"])[^'"]*\brating\b[^'"]*\1[^>]*>/i)
  if (ratingTagMatch) {
    const valueAttribute = getAttribute(ratingTagMatch[0], 'value')
    if (valueAttribute) {
      const value = Number.parseFloat(valueAttribute.replace(',', '.'))
      if (Number.isFinite(value)) return Math.max(0, Math.min(5, value))
    }
  }

  const ratingText = extractClassText(html, 'rating')
  if (!ratingText) return null

  const stars = (ratingText.match(/\u2605/g) || []).length
  if (stars > 0) return Math.max(0, Math.min(5, stars))

  const value = Number.parseFloat((ratingText.match(/\d+(?:[.,]\d+)?/) || [''])[0].replace(',', '.'))
  if (Number.isFinite(value)) return Math.max(0, Math.min(5, value))

  return null
}

const FRACTION_MAP = {
  '½': '1/2',
  '¼': '1/4',
  '¾': '3/4'
}

const UNIT_SET = new Set([
  'g', 'gr', 'gramme', 'grammes', 'kg',
  'ml', 'cl', 'l', 'dl',
  'c', 'cs', 'c.s', 'cas', 'c.a.s', 'càs',
  'cc', 'c.c', 'cac', 'c.a.c', 'càc',
  'tbsp', 'tsp',
  'cup', 'cups',
  'pincee', 'tranche', 'tranches'
])

function parseIngredientLine(rawLine) {
  const raw = normalizeWhitespace(rawLine)
  if (!raw) return null

  const tokens = raw.split(' ')
  let quantity = ''
  let unit = ''
  let name = raw

  if (tokens.length > 0) {
    const normalizedToken = FRACTION_MAP[tokens[0]] || tokens[0]
    const isQuantity = /^(\d+(?:[./]\d+)?|\d+\.\d+|\d+-\d+)$/.test(normalizedToken)

    if (isQuantity) {
      quantity = normalizedToken
      if (tokens.length > 1) {
        const unitTokenNormalized = normalizeForLookup(tokens[1]).replace(/\.$/, '')
        if (UNIT_SET.has(unitTokenNormalized)) {
          unit = tokens[1]
          name = normalizeWhitespace(tokens.slice(2).join(' '))
        } else {
          name = normalizeWhitespace(tokens.slice(1).join(' '))
        }
      } else {
        name = ''
      }
    }
  }

  if (!name) name = raw

  return {
    name,
    quantity,
    unit,
    notes: ''
  }
}

function isInstructionLike(line) {
  const normalized = normalizeForLookup(line)
  return /(?:^|\b)(prechauff|mettre|verser|cuire|ajouter|melanger|mixer|hacher|retirer|enfourner|servir|deposer|programmer|peler|couper|plonger|transferer|reserver|deguster|chauffer|monter)\b/.test(normalized)
}

function isIngredientLike(line) {
  const normalized = normalizeForLookup(line)
  if (!normalized) return false
  if (/^\d+\./.test(normalized)) return false
  if (isInstructionLike(line)) return false

  if (/^(?:\d+(?:[./,]\d+)?|1\/2|1\/4|3\/4|un|une|deux|trois|quelques|poignee|pincee|cs|cc)\b/.test(normalized)) {
    return true
  }

  if (/\b(?:gr|g|kg|ml|cl|l|c\.?s|c\.?c|cuillere|pincee|poignee|tranche|boite)\b/.test(normalized)) {
    return true
  }

  return false
}

function createStableKey(seed, prefix) {
  return `${prefix}-${crypto.createHash('md5').update(seed).digest('hex').slice(0, 12)}`
}

function linesToPortableTextBlocks(lines, fileName) {
  return lines.map((line, index) => {
    const lineKey = createStableKey(`${fileName}-instruction-${index}-${line}`, 'block')
    return {
      _key: lineKey,
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _key: createStableKey(`${lineKey}-span`, 'span'),
          _type: 'span',
          text: line
        }
      ]
    }
  })
}

function fileHashSha1(filePath) {
  const hash = crypto.createHash('sha1')
  hash.update(fs.readFileSync(filePath))
  return hash.digest('hex')
}

function parseRecipeFile(filePath, sourceDir) {
  const fileName = path.basename(filePath)
  if (fileName.toLowerCase() === 'index.html') {
    return { status: 'skip', fileName, reason: 'index_file' }
  }

  const html = readRecipeFile(filePath)

  const titleFromHtml = extractClassText(html, 'fn')
  const title = normalizeRecipeTitle(titleFromHtml, fileName)

  const photoSource = extractPhotoSource(html)
  const imageFileName = photoSource ? path.basename(photoSource.split('?')[0]) : ''
  const imagePath = imageFileName ? path.join(sourceDir, imageFileName) : ''

  if (!imageFileName) {
    return { status: 'skip', fileName, title, reason: 'missing_image_tag' }
  }

  if (!fs.existsSync(imagePath)) {
    return { status: 'skip', fileName, title, reason: 'missing_image_file', imageFileName }
  }

  const categoriesRaw = extractClassText(html, 'categories')
  const metadata = parseTagMetadata(categoriesRaw)
  const servingsText = extractClassText(html, 'yield')
  const prepTimeText = extractClassText(html, 'prepTime')
  const cookTimeText = extractClassText(html, 'cookTime')

  let ingredientLines = extractIngredientLines(html)
  const instructionsContainer = extractClassContent(html, 'instructions')
  let instructionLines = splitToLines(htmlToText(instructionsContainer))

  if (instructionLines.length === 0 && ingredientLines.length > 0) {
    const inferredInstructions = ingredientLines.filter((line) => isInstructionLike(line))
    if (inferredInstructions.length > 0) {
      instructionLines = inferredInstructions
    }
  }

  if (ingredientLines.length === 0 && instructionLines.length > 0) {
    ingredientLines = instructionLines.filter((line) => isIngredientLike(line))
  }

  if (!instructionsContainer && instructionLines.length > 0 && ingredientLines.length > 0) {
    const instructionSet = new Set(instructionLines)
    const filteredIngredients = ingredientLines.filter((line) => !instructionSet.has(line))
    if (filteredIngredients.length > 0) {
      ingredientLines = filteredIngredients
    }
  }

  const ingredients = ingredientLines
    .map((line) => parseIngredientLine(line))
    .filter(Boolean)
    .map((ingredient, index) => ({
      _key: createStableKey(`${fileName}-ingredient-${index}-${ingredient.name}`, 'ing'),
      ...ingredient
    }))

  const warnings = []
  if (ingredients.length === 0) warnings.push('no_ingredients')
  if (instructionLines.length === 0) warnings.push('no_instructions')

  const slug = toAsciiSlug(title)
  const description = buildDescription(title, metadata.category)
  const rating = parseRating(html)
  const servings = parseServings(servingsText)
  const prepTime = parseMinutes(prepTimeText)
  const cookTime = parseMinutes(cookTimeText)

  return {
    status: 'ok',
    fileName,
    filePath,
    title,
    slug,
    description,
    imagePath,
    imageFileName,
    imageHash: fileHashSha1(imagePath),
    category: metadata.category,
    tags: metadata.tags,
    diet: metadata.diet,
    season: metadata.season,
    equipment: metadata.equipment,
    ingredients,
    instructionLines,
    servings,
    prepTime,
    cookTime,
    rating,
    warnings
  }
}

function buildRecipeDocument(parsedRecipe, assetId, publishedAt) {
  const docId = `recipe-monsite-${crypto.createHash('md5').update(parsedRecipe.fileName).digest('hex').slice(0, 16)}`
  const instructions = linesToPortableTextBlocks(parsedRecipe.instructionLines, parsedRecipe.fileName)

  const document = {
    _id: docId,
    _type: 'recipe',
    title: parsedRecipe.title,
    slug: {
      _type: 'slug',
      current: parsedRecipe.slug
    },
    category: parsedRecipe.category,
    description: parsedRecipe.description,
    featuredImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: assetId
      },
      alt: buildImageAlt(parsedRecipe.title)
    },
    isPremium: false,
    publishedAt
  }

  if (parsedRecipe.prepTime > 0) document.prepTime = parsedRecipe.prepTime
  if (parsedRecipe.cookTime > 0) document.cookTime = parsedRecipe.cookTime
  if (parsedRecipe.servings && parsedRecipe.servings > 0) document.servings = parsedRecipe.servings
  if (parsedRecipe.ingredients.length > 0) document.ingredients = parsedRecipe.ingredients
  if (instructions.length > 0) document.instructions = instructions
  if (parsedRecipe.tags.length > 0) document.tags = parsedRecipe.tags
  if (parsedRecipe.diet.length > 0) document.diet = parsedRecipe.diet
  if (parsedRecipe.season.length > 0) document.season = parsedRecipe.season
  if (parsedRecipe.equipment.length > 0) document.equipment = parsedRecipe.equipment
  if (typeof parsedRecipe.rating === 'number') document.rating = parsedRecipe.rating

  return document
}

function chunkArray(items, size) {
  const chunks = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function withRetry(task, retries = 3, initialDelayMs = 400) {
  let attempt = 0
  while (true) {
    try {
      return await task()
    } catch (error) {
      if (attempt >= retries) throw error
      const delay = initialDelayMs * Math.pow(2, attempt)
      await sleep(delay)
      attempt += 1
    }
  }
}

async function runPool(items, limit, worker) {
  if (!items.length) return []

  const results = new Array(items.length)
  let cursor = 0

  async function runner() {
    while (true) {
      const current = cursor
      cursor += 1
      if (current >= items.length) break
      results[current] = await worker(items[current], current)
    }
  }

  const workerCount = Math.min(limit, items.length)
  await Promise.all(Array.from({ length: workerCount }, () => runner()))
  return results
}

async function deleteAllRecipes(client) {
  const ids = await client.fetch('*[_type == "recipe"]._id')
  if (!Array.isArray(ids) || ids.length === 0) {
    return { recipeIds: [], deletedCount: 0 }
  }

  const batches = chunkArray(ids, DELETE_BATCH_SIZE)
  for (const batch of batches) {
    const mutations = batch.map((id) => ({ delete: { id } }))
    await withRetry(() => client.mutate(mutations, { returnDocuments: false }))
  }

  return { recipeIds: ids, deletedCount: ids.length }
}

async function uploadMissingImages({
  client,
  parsedRecipes,
  cacheByHash,
  concurrency
}) {
  const uniqueImagesByHash = new Map()
  for (const recipe of parsedRecipes) {
    if (!uniqueImagesByHash.has(recipe.imageHash)) {
      uniqueImagesByHash.set(recipe.imageHash, {
        imageHash: recipe.imageHash,
        imagePath: recipe.imagePath,
        imageFileName: recipe.imageFileName
      })
    }
  }

  const uniqueImages = Array.from(uniqueImagesByHash.values())
  const alreadyCached = uniqueImages.filter((image) => typeof cacheByHash[image.imageHash] === 'string')
  const toUpload = uniqueImages.filter((image) => typeof cacheByHash[image.imageHash] !== 'string')

  const uploaded = await runPool(toUpload, concurrency, async (image) => {
    const ext = path.extname(image.imageFileName).toLowerCase()
    const contentType = ext === '.png'
      ? 'image/png'
      : ext === '.webp'
        ? 'image/webp'
        : 'image/jpeg'

    const fileBuffer = fs.readFileSync(image.imagePath)
    const asset = await withRetry(() => client.assets.upload('image', fileBuffer, {
      filename: image.imageFileName,
      contentType
    }))

    if (!asset?._id) {
      throw new Error(`No Sanity asset id for image ${image.imageFileName}`)
    }

    return {
      imageHash: image.imageHash,
      assetId: asset._id
    }
  })

  for (const item of uploaded) {
    cacheByHash[item.imageHash] = item.assetId
  }

  return {
    cacheByHash,
    uniqueImageCount: uniqueImages.length,
    cachedImageCount: alreadyCached.length,
    uploadedImageCount: uploaded.length
  }
}

async function upsertRecipes(client, documents) {
  if (!documents.length) return { upsertedCount: 0 }
  const batches = chunkArray(documents, UPSERT_BATCH_SIZE)

  for (const batch of batches) {
    const mutations = batch.map((document) => ({ createOrReplace: document }))
    await withRetry(() => client.mutate(mutations, { returnDocuments: false }))
  }

  return { upsertedCount: documents.length }
}

function printSummary(summary) {
  console.log('--- monsite import summary ---')
  console.log(`mode: ${summary.mode}`)
  console.log(`source recipes: ${summary.totalRecipeHtmlFiles}`)
  console.log(`parsed recipes: ${summary.parsedRecipeCount}`)
  console.log(`skipped recipes (no image): ${summary.skippedMissingImageCount}`)
  console.log(`recipes with parser warnings: ${summary.warningRecipeCount}`)
  console.log(`unique images: ${summary.uniqueImageCount}`)
  console.log(`reused images from cache: ${summary.cachedImageCount}`)
  console.log(`uploaded images: ${summary.uploadedImageCount}`)
  console.log(`deleted existing recipes: ${summary.deletedRecipeCount}`)
  console.log(`upserted recipes: ${summary.upsertedRecipeCount}`)
  console.log(`report: ${summary.reportAbsolutePath}`)
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const rootDir = process.cwd()
  loadEnvFromKnownFiles(rootDir)

  const sourceDir = path.resolve(rootDir, options.sourceDir)
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Source directory not found: ${sourceDir}`)
  }

  const htmlFiles = fs.readdirSync(sourceDir)
    .filter((fileName) => fileName.toLowerCase().endsWith('.html'))
    .sort((a, b) => a.localeCompare(b, 'fr'))
    .map((fileName) => path.join(sourceDir, fileName))

  const parsedResults = htmlFiles.map((filePath) => parseRecipeFile(filePath, sourceDir))
  const skipped = parsedResults.filter((item) => item.status === 'skip')
  const parsedRecipes = parsedResults.filter((item) => item.status === 'ok')

  const skippedMissingImage = skipped.filter((item) => item.reason === 'missing_image_tag' || item.reason === 'missing_image_file')
  const warningRecipes = parsedRecipes.filter((item) => item.warnings.length > 0)

  const projectId = process.env.SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET || 'production'
  const token = process.env.SANITY_AUTH_TOKEN

  let client = null
  if (options.apply) {
    if (!projectId) {
      throw new Error('Missing SANITY_PROJECT_ID (or PUBLIC_SANITY_PROJECT_ID)')
    }
    if (!token) {
      throw new Error('Missing SANITY_AUTH_TOKEN for write operations')
    }

    client = createClient({
      projectId,
      dataset,
      apiVersion: options.apiVersion,
      useCdn: false,
      token
    })
  }

  if (options.reset && !options.apply) {
    console.warn('Warning: --reset is ignored in dry-run mode.')
  }

  let deletedRecipeCount = 0
  if (options.apply && options.reset) {
    const deleteResult = await deleteAllRecipes(client)
    deletedRecipeCount = deleteResult.deletedCount
  }

  const cachePayload = readJsonFileSafe(options.cachePath, { byHash: {} })
  const cacheByHash = cachePayload?.byHash && typeof cachePayload.byHash === 'object'
    ? { ...cachePayload.byHash }
    : {}

  let uniqueImageCount = 0
  let cachedImageCount = 0
  let uploadedImageCount = 0

  if (options.apply) {
    const uploadResult = await uploadMissingImages({
      client,
      parsedRecipes,
      cacheByHash,
      concurrency: options.concurrency
    })
    uniqueImageCount = uploadResult.uniqueImageCount
    cachedImageCount = uploadResult.cachedImageCount
    uploadedImageCount = uploadResult.uploadedImageCount
  } else {
    const uniqueImageHashes = new Set(parsedRecipes.map((recipe) => recipe.imageHash))
    uniqueImageCount = uniqueImageHashes.size
    cachedImageCount = 0
    uploadedImageCount = 0
  }

  const publishedAt = new Date().toISOString()
  const documents = parsedRecipes.map((recipe) => {
    const assetId = options.apply
      ? cacheByHash[recipe.imageHash]
      : `dryrun-image-${recipe.imageHash.slice(0, 24)}`
    return buildRecipeDocument(recipe, assetId, publishedAt)
  })

  let upsertedRecipeCount = 0
  if (options.apply) {
    const upsertResult = await upsertRecipes(client, documents)
    upsertedRecipeCount = upsertResult.upsertedCount

    writeJsonFile(options.cachePath, {
      updatedAt: new Date().toISOString(),
      byHash: cacheByHash
    })
  }

  const report = {
    generatedAt: new Date().toISOString(),
    options,
    projectId: projectId || null,
    dataset,
    totals: {
      htmlFiles: htmlFiles.length,
      recipeHtmlFiles: htmlFiles.filter((filePath) => path.basename(filePath).toLowerCase() !== 'index.html').length,
      parsedRecipes: parsedRecipes.length,
      skippedRecipes: skipped.length,
      skippedMissingImage: skippedMissingImage.length,
      warningRecipes: warningRecipes.length,
      uniqueImages: uniqueImageCount,
      cachedImages: cachedImageCount,
      uploadedImages: uploadedImageCount,
      deletedRecipes: deletedRecipeCount,
      upsertedRecipes: upsertedRecipeCount
    },
    skipped: skipped.map((item) => ({
      fileName: item.fileName,
      title: item.title || null,
      reason: item.reason,
      imageFileName: item.imageFileName || null
    })),
    warnings: warningRecipes.map((item) => ({
      fileName: item.fileName,
      title: item.title,
      warnings: item.warnings
    })),
    importedRecipeSample: documents.slice(0, 10).map((doc) => ({
      id: doc._id,
      title: doc.title,
      slug: doc.slug?.current,
      category: doc.category
    }))
  }

  const reportAbsolutePath = writeJsonFile(options.reportPath, report)

  printSummary({
    mode: options.apply ? 'apply' : 'dry-run',
    totalRecipeHtmlFiles: report.totals.recipeHtmlFiles,
    parsedRecipeCount: report.totals.parsedRecipes,
    skippedMissingImageCount: report.totals.skippedMissingImage,
    warningRecipeCount: report.totals.warningRecipes,
    uniqueImageCount: report.totals.uniqueImages,
    cachedImageCount: report.totals.cachedImages,
    uploadedImageCount: report.totals.uploadedImages,
    deletedRecipeCount: report.totals.deletedRecipes,
    upsertedRecipeCount: report.totals.upsertedRecipes,
    reportAbsolutePath
  })
}

main().catch((error) => {
  console.error('Import failed:', error instanceof Error ? error.message : error)
  process.exit(1)
})
