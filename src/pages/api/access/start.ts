import { createAccessToken, getEntitledPackIds, normalizeEmail } from '../../../lib/server/access'
import { sendAccessEmail } from '../../../lib/server/email'

export const prerender = false

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 5
const rateBucket = new Map<string, { count: number; resetAt: number }>()

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

export async function POST({ request }: { request: Request }) {
  const ipKey = getClientIp(request)
  if (isRateLimited(ipKey)) {
    return new Response(JSON.stringify({ error: 'Trop de requêtes' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  let payload: { email?: string; website?: string } = {}
  try {
    payload = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Requête invalide' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const email = normalizeEmail(payload.email)
  const honeypot = (payload.website || '').trim()
  if (honeypot) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  if (!email || !emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: 'Email invalide' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const packIds = await getEntitledPackIds(email)
  if (!packIds.length) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const { token } = await createAccessToken(email)
  await sendAccessEmail({ email, token })

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
