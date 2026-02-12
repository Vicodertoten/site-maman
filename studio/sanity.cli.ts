import { defineCliConfig } from 'sanity/cli'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return
  const content = fs.readFileSync(filePath, 'utf8')
  content.split(/\r?\n/).forEach((line) => {
    if (!line || line.trim().startsWith('#')) return
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/)
    if (!match) return
    const key = match[1]
    let value = match[2] ?? ''
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) {
      process.env[key] = value
    }
  })
}

const baseDir = path.dirname(fileURLToPath(import.meta.url))
loadEnvFile(path.join(baseDir, '.env.local'))
loadEnvFile(path.join(baseDir, '.env.production'))
loadEnvFile(path.join(baseDir, '.env'))

const projectId =
  process.env.SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.PUBLIC_SANITY_PROJECT_ID

const dataset =
  process.env.SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  process.env.PUBLIC_SANITY_DATASET ||
  'production'

const studioHost =
  process.env.SANITY_STUDIO_HOST ||
  process.env.SANITY_STUDIO_HOSTNAME ||
  ''

if (!projectId) {
  throw new Error('SANITY_PROJECT_ID manquant. Ajoutez-le dans studio/.env.local ou studio/.env.production.')
}

export default defineCliConfig({
  api: { projectId, dataset },
  studioHost: studioHost || undefined
})
