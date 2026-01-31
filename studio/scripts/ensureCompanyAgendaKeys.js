#!/usr/bin/env node
const sanityClient = require('@sanity/client')
const { randomUUID } = require('crypto')

const projectId = process.env.SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET || 'production'

const client = sanityClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN
})

async function ensureKeys() {
  if (!projectId) {
    console.error('Définis SANITY_PROJECT_ID avant de lancer ce script.')
    process.exit(1)
  }

  if (!process.env.SANITY_AUTH_TOKEN) {
    console.error('Définis SANITY_AUTH_TOKEN avant de lancer ce script.')
    process.exit(1)
  }

  const doc = await client.fetch(`*[_type == "companyAgenda"] | order(_updatedAt desc)[0] { _id, slots }`)
  if (!doc) {
    console.error('Pas de document companyAgenda trouvé dans le dataset.')
    process.exit(1)
  }

  const normalizedSlots = (doc.slots || []).map((slot, index) => {
    const keyCandidate = slot?._key || `slot-${slot?.date ?? index}-${randomUUID()}`
    if (slot?._key === keyCandidate) {
      return slot
    }
    return { ...slot, _key: keyCandidate }
  })

  await client
    .patch(doc._id)
    .set({ slots: normalizedSlots })
    .commit({ autoGenerateArrayKeys: false })

  console.log(`Document ${doc._id} mis à jour (${normalizedSlots.length} créneaux).`)
}

ensureKeys().catch(err => {
  console.error('Erreur :', err.message || err)
  process.exit(1)
})
