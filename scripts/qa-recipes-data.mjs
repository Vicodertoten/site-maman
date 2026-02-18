#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { createClient } from '@sanity/client'

const RECIPE_SLUG_MAX_LENGTH = 72
const DEFAULT_REPORT_PATH = './.reports/seo-recipes-data-qa.json'
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const MIN_DESCRIPTION_LENGTH = 30
const MIN_ALT_LENGTH = 5

function parseArgs(argv) {
  const has = (flag) => argv.includes(flag)
  const valueOf = (flag, fallback) => {
    const index = argv.indexOf(flag)
    if (index < 0) return fallback
    return argv[index + 1] || fallback
  }

  const options = {
    strict: has('--strict'),
    write: has('--write'),
    fixSlug: has('--fix-slug') || has('--fix-slugs'),
    fixDescription: has('--fix-description'),
    fixAlt: has('--fix-alt'),
    reportPath: valueOf('--report', DEFAULT_REPORT_PATH)
  }

  if (options.write && !options.fixSlug && !options.fixDescription && !options.fixAlt) {
    options.fixSlug = true
    options.fixDescription = true
    options.fixAlt = true
  }

  return options
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

function categoryLabel(category) {
  const byKey = {
    entree: 'Entrée',
    plat: 'Plat principal',
    dessert: 'Dessert',
    boisson: 'Boisson',
    accompagnement: 'Accompagnement'
  }
  return byKey[category] || category || 'recette'
}

function buildDescription(recipe) {
  const explicit = (recipe.description || '').trim()
  if (explicit.length >= MIN_DESCRIPTION_LENGTH) return explicit

  const subtitle = (recipe.subtitle || '').trim()
  if (subtitle.length >= MIN_DESCRIPTION_LENGTH) return subtitle

  const category = categoryLabel(recipe.category).toLowerCase()
  return `${recipe.title} est une recette ${category} simple et équilibrée. Retrouvez les ingrédients, les étapes et les conseils pour la réussir facilement.`
}

function buildAlt(recipe) {
  const explicit = (recipe.featuredImageAlt || '').trim()
  if (explicit.length >= MIN_ALT_LENGTH) return explicit
  return `Photo de ${recipe.title}`
}

function hasFeaturedImage(recipe) {
  if (!recipe.featuredImage) return false
  if (recipe.featuredImage.asset?._ref) return true
  if (recipe.featuredImage.asset?._id) return true
  return Boolean(recipe.featuredImage._ref || recipe.featuredImage._id)
}

function writeReport(reportPath, report) {
  const absolutePath = path.resolve(process.cwd(), reportPath)
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true })
  fs.writeFileSync(absolutePath, `${JSON.stringify(report, null, 2)}\n`, 'utf-8')
  return absolutePath
}

async function main() {
  const options = parseArgs(process.argv.slice(2))

  const root = process.cwd()
  ;[
    path.join(root, '.env'),
    path.join(root, '.env.production'),
    path.join(root, 'studio/.env'),
    path.join(root, 'studio/.env.production')
  ].forEach(loadEnvFile)

  const projectId = process.env.PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.PUBLIC_SANITY_DATASET || 'production'
  const token = process.env.SANITY_AUTH_TOKEN

  if (!projectId) {
    console.error('Erreur: PUBLIC_SANITY_PROJECT_ID est manquant.')
    process.exit(1)
  }

  if (options.write && !token) {
    console.error('Erreur: --write requiert SANITY_AUTH_TOKEN dans les variables d’environnement.')
    process.exit(1)
  }

  const readClient = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false
  })

  const writeClient = token
    ? createClient({
        projectId,
        dataset,
        apiVersion: '2024-01-01',
        useCdn: false,
        token
      })
    : null

  const query = `*[_type == "recipe"]{
    _id,
    title,
    slug,
    category,
    subtitle,
    description,
    featuredImage,
    "featuredImageAlt": featuredImage.alt
  }`

  const recipes = await readClient.fetch(query)
  const findings = []

  for (const recipe of recipes) {
    const currentSlug = recipe?.slug?.current || ''
    const expectedSlug = toAsciiSlug(currentSlug || recipe.title || recipe._id)
    const slugInvalid = !currentSlug || currentSlug.length > RECIPE_SLUG_MAX_LENGTH || !SLUG_REGEX.test(currentSlug)
    const slugNeedsNormalization = currentSlug !== expectedSlug
    const description = (recipe?.description || '').trim()
    const descriptionMissing = description.length < MIN_DESCRIPTION_LENGTH
    const imagePresent = hasFeaturedImage(recipe)
    const altText = (recipe?.featuredImageAlt || '').trim()
    const altMissing = imagePresent ? altText.length < MIN_ALT_LENGTH : false
    const imageMissing = !imagePresent

    findings.push({
      id: recipe._id,
      title: recipe.title,
      currentSlug,
      expectedSlug,
      slugInvalid,
      slugNeedsNormalization,
      descriptionMissing,
      altMissing,
      imageMissing,
      generatedDescription: buildDescription(recipe),
      generatedAlt: buildAlt(recipe)
    })
  }

  const slugIssueCount = findings.filter((item) => item.slugInvalid || item.slugNeedsNormalization).length
  const descriptionIssueCount = findings.filter((item) => item.descriptionMissing).length
  const altIssueCount = findings.filter((item) => item.altMissing).length
  const missingImageCount = findings.filter((item) => item.imageMissing).length

  let updatedCount = 0
  const updateErrors = []

  if (options.write && writeClient) {
    for (const item of findings) {
      const patchSet = {}

      if (options.fixSlug && (item.slugInvalid || item.slugNeedsNormalization)) {
        patchSet.slug = { _type: 'slug', current: item.expectedSlug }
      }
      if (options.fixDescription && item.descriptionMissing) {
        patchSet.description = item.generatedDescription
      }
      if (options.fixAlt && item.altMissing) {
        patchSet['featuredImage.alt'] = item.generatedAlt
      }

      if (Object.keys(patchSet).length === 0) continue

      try {
        await writeClient.patch(item.id).set(patchSet).commit({ autoGenerateArrayKeys: false })
        updatedCount += 1
      } catch (error) {
        updateErrors.push({
          id: item.id,
          title: item.title,
          message: error instanceof Error ? error.message : String(error)
        })
      }
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    projectId,
    dataset,
    options,
    totals: {
      recipes: findings.length,
      slugIssues: slugIssueCount,
      descriptionIssues: descriptionIssueCount,
      altIssues: altIssueCount,
      missingImages: missingImageCount,
      updatesApplied: updatedCount,
      updateErrors: updateErrors.length
    },
    samples: {
      slugIssues: findings
        .filter((item) => item.slugInvalid || item.slugNeedsNormalization)
        .slice(0, 30)
        .map((item) => ({
          id: item.id,
          title: item.title,
          currentSlug: item.currentSlug,
          expectedSlug: item.expectedSlug
        })),
      missingDescriptions: findings
        .filter((item) => item.descriptionMissing)
        .slice(0, 30)
        .map((item) => ({
          id: item.id,
          title: item.title,
          generatedDescription: item.generatedDescription
        })),
      missingAlts: findings
        .filter((item) => item.altMissing)
        .slice(0, 30)
        .map((item) => ({
          id: item.id,
          title: item.title,
          generatedAlt: item.generatedAlt
        })),
      missingImages: findings
        .filter((item) => item.imageMissing)
        .slice(0, 30)
        .map((item) => ({
          id: item.id,
          title: item.title
        })),
      updateErrors
    }
  }

  const reportFile = writeReport(options.reportPath, report)

  console.log('SEO QA Recettes - Qualité des données')
  console.log(`- Recettes analysées: ${findings.length}`)
  console.log(`- Slugs à corriger: ${slugIssueCount}`)
  console.log(`- Descriptions manquantes/faibles: ${descriptionIssueCount}`)
  console.log(`- ALT manquants/faibles: ${altIssueCount}`)
  console.log(`- Images principales manquantes: ${missingImageCount}`)
  console.log(`- Mises à jour appliquées: ${updatedCount}`)
  console.log(`- Erreurs de mise à jour: ${updateErrors.length}`)
  console.log(`Rapport écrit: ${reportFile}`)

  if (options.write && updateErrors.length > 0) {
    process.exit(1)
  }

  const unresolvedIssues = slugIssueCount + descriptionIssueCount + altIssueCount + missingImageCount
  if (options.strict && unresolvedIssues > 0) {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Erreur fatale QA recettes:', error)
  process.exit(1)
})
