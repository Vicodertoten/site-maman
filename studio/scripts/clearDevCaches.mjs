import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const studioRoot = path.resolve(__dirname, '..')

const cachePaths = [
  path.join(studioRoot, 'node_modules', '.sanity', 'vite'),
  path.join(studioRoot, '.sanity', 'runtime'),
]

for (const target of cachePaths) {
  if (!fs.existsSync(target)) continue
  fs.rmSync(target, { recursive: true, force: true })
  process.stdout.write(`[studio:cache] removed ${path.relative(studioRoot, target)}\n`)
}

