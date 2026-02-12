import { sendContactRequestEmail } from '../../../lib/server/email'

export const prerender = false

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 8
const rateBucket = new Map<string, { count: number; resetAt: number }>()

const allowedNeeds = new Set(['entreprise', 'prive', 'premium', 'autre'])

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for') || ''
  const ip = forwarded.split(',')[0]?.trim()
  return ip || request.headers.get('x-real-ip') || 'unknown'
}

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const existing = rateBucket.get(key)
  if (!existing || existing.resetAt <= now) {
    rateBucket.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }
  existing.count += 1
  rateBucket.set(key, existing)
  return existing.count > RATE_LIMIT_MAX
}

function normalizeText(value?: string | null): string {
  return (value || '').trim()
}

function normalizeNeed(value?: string | null): string {
  const raw = normalizeText(value).toLowerCase()
  if (raw === 'privé') return 'prive'
  if (raw === 'recettes premium') return 'premium'
  return raw
}

function labelNeed(value: string): string {
  const labels: Record<string, string> = {
    entreprise: 'Entreprise',
    prive: 'Privé',
    premium: 'Recettes premium',
    autre: 'Autre'
  }
  return labels[value] || 'Autre'
}

export async function POST({ request }: { request: Request }) {
  const ipKey = getClientIp(request)
  if (isRateLimited(ipKey)) {
    return json({
      success: false,
      code: 'RATE_LIMITED',
      message: 'Trop de requêtes. Réessaie dans quelques minutes.'
    }, 429)
  }

  let payload: {
    name?: string
    email?: string
    need?: string
    preferredDate?: string
    message?: string
    website?: string
  } = {}

  try {
    payload = await request.json()
  } catch {
    return json({
      success: false,
      code: 'INVALID_JSON',
      message: 'Requête invalide.'
    }, 400)
  }

  if (normalizeText(payload.website)) {
    return json({ success: true, message: 'Merci, votre demande a bien été envoyée.' })
  }

  const name = normalizeText(payload.name)
  const email = normalizeText(payload.email).toLowerCase()
  const need = normalizeNeed(payload.need)
  const preferredDate = normalizeText(payload.preferredDate)
  const message = normalizeText(payload.message)

  const errors: Record<string, string> = {}

  if (name.length < 2 || name.length > 80) {
    errors.name = 'Le nom doit contenir entre 2 et 80 caractères.'
  }
  if (!emailRegex.test(email)) {
    errors.email = 'Adresse email invalide.'
  }
  if (!allowedNeeds.has(need)) {
    errors.need = 'Sélectionne un besoin valide.'
  }
  if (preferredDate && !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) {
    errors.preferredDate = 'Date invalide.'
  }
  if (message.length > 500) {
    errors.message = 'Le message ne peut pas dépasser 500 caractères.'
  }

  if (Object.keys(errors).length > 0) {
    return json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Certains champs sont invalides.',
      errors
    }, 400)
  }

  try {
    await sendContactRequestEmail({
      name,
      email,
      need: labelNeed(need),
      preferredDate: preferredDate || null,
      message: message || null
    })
  } catch (error) {
    console.error('Contact submit error', error)
    return json({
      success: false,
      code: 'EMAIL_SEND_FAILED',
      message: 'Impossible d’envoyer la demande pour le moment.'
    }, 503)
  }

  return json({
    success: true,
    code: 'CONTACT_SENT',
    message: 'Merci, votre demande a bien été envoyée.'
  })
}
