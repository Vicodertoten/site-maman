#!/usr/bin/env node
const { createClient } = require('@sanity/client')
const { randomUUID } = require('crypto')

const projectId =
  process.env.SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.PUBLIC_SANITY_PROJECT_ID
const dataset =
  process.env.SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  process.env.PUBLIC_SANITY_DATASET ||
  'production'
const token = process.env.SANITY_AUTH_TOKEN

if (!projectId) {
  console.error('Définis SANITY_PROJECT_ID avant de lancer ce script.')
  process.exit(1)
}

if (!token) {
  console.error('Définis SANITY_AUTH_TOKEN avant de lancer ce script.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion: '2024-01-01',
  token
})

const normalize = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const shouldMarkUnavailable = (status = '') => {
  const normalized = normalize(status)
  if (!normalized) return false
  if (normalized.includes('indisponible')) return true
  if (normalized.includes('reserv')) return true
  if (normalized.includes('sur demande')) return true
  if (normalized.includes('bloqu')) return true
  if (normalized.includes('occup')) return true
  if (normalized.includes('complet')) return true
  return false
}

const ensureKey = (value, fallback) => value || fallback || `slot-${randomUUID()}`

async function migrateRestaurant() {
  const docs = await client.fetch(`*[_type == "restaurant"] {
    _id, dates, isFull, dateSlots
  }`)
  if (!Array.isArray(docs) || !docs.length) return

  for (const doc of docs) {
    let dateSlots = Array.isArray(doc.dateSlots) ? doc.dateSlots : []
    if (!dateSlots.length && Array.isArray(doc.dates) && doc.dates.length) {
      dateSlots = doc.dates.map((date) => ({
        _key: `slot-${date}-${randomUUID()}`,
        date,
        status: doc.isFull ? 'Complet' : 'Disponible',
        isVisible: true
      }))
    } else {
      dateSlots = dateSlots.map((slot) => ({
        _key: ensureKey(slot?._key, `slot-${slot?.date}-${randomUUID()}`),
        date: slot?.date,
        status: slot?.status || 'Disponible',
        isVisible: slot?.isVisible !== false
      }))
    }

    await client
      .patch(doc._id)
      .set({ dateSlots })
      .unset(['dates', 'isFull', 'datesTitle'])
      .commit({ autoGenerateArrayKeys: false })
  }
}

async function migrateCompanyAgenda() {
  const docs = await client.fetch(`*[_type == "companyAgenda"] { _id, slots }`)
  if (!Array.isArray(docs) || !docs.length) return

  for (const doc of docs) {
    const slots = Array.isArray(doc.slots) ? doc.slots : []
    const migrated = slots
      .filter((slot) => shouldMarkUnavailable(slot?.status))
      .map((slot) => ({
        _key: ensureKey(slot?._key, `slot-${slot?.date}-${randomUUID()}`),
        date: slot?.date,
        status: 'Indisponible'
      }))

    await client
      .patch(doc._id)
      .set({ slots: migrated })
      .commit({ autoGenerateArrayKeys: false })
  }
}

async function migrateAbout() {
  const docs = await client.fetch(`*[_type == "about"] {
    _id, visionTitle, visionText, contactTitle, contactText
  }`)
  if (!Array.isArray(docs) || !docs.length) return

  for (const doc of docs) {
    const updates = {}
    if (!doc.visionTitle && doc.contactTitle) updates.visionTitle = doc.contactTitle
    if (!doc.visionText && doc.contactText) updates.visionText = doc.contactText

    const patch = client.patch(doc._id)
    if (Object.keys(updates).length > 0) {
      patch.set(updates)
    }
    patch.unset(['contactTitle', 'contactText'])
    await patch.commit()
  }
}

async function migrateThermomix() {
  const docs = await client.fetch(`*[_type == "thermomix"] {
    _id, heroSecondaryCtaUrl, instagramUrl
  }`)
  if (!Array.isArray(docs) || !docs.length) return

  for (const doc of docs) {
    const updates = {}
    if (!doc.heroSecondaryCtaUrl && doc.instagramUrl) {
      updates.heroSecondaryCtaUrl = doc.instagramUrl
    }

    const patch = client.patch(doc._id)
    if (Object.keys(updates).length > 0) {
      patch.set(updates)
    }
    patch.unset(['instagramUrl', 'demoRecipes'])
    await patch.commit()
  }
}

async function migrateHome() {
  const docs = await client.fetch(`*[_type == "home"] { _id }`)
  if (!Array.isArray(docs) || !docs.length) return
  for (const doc of docs) {
    await client.patch(doc._id).unset(['ctaSecondaryButton']).commit()
  }
}

async function run() {
  await migrateRestaurant()
  await migrateCompanyAgenda()
  await migrateAbout()
  await migrateThermomix()
  await migrateHome()
  console.log('Migration legacy terminée.')
}

run().catch((error) => {
  console.error('Migration legacy échouée:', error)
  process.exit(1)
})
