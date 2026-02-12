// src/lib/server/email.ts
import { Resend } from 'resend'

function getEnv(name: string): string {
  return (
    import.meta.env[name] ||
    (typeof process !== 'undefined' ? process.env[name] : undefined) ||
    ''
  )
}

function getSiteUrl(): string {
  return (
    getEnv('PUBLIC_SITE_URL') ||
    getEnv('SITE_URL') ||
    'http://localhost:4321'
  )
}

export async function sendAccessEmail(options: {
  email: string
  token: string
  packTitle?: string | null
}): Promise<void> {
  const apiKey = getEnv('RESEND_API_KEY')
  const from = getEnv('ACCESS_EMAIL_FROM') || 'Gastronomade <bonjour@gastronomade.fr>'
  const replyTo = getEnv('ACCESS_EMAIL_REPLY_TO') || ''

  if (!apiKey) {
    throw new Error('RESEND_API_KEY manquant')
  }

  const resend = new Resend(apiKey)
  const siteUrl = getSiteUrl()
  const magicLink = `${siteUrl}/acces?token=${encodeURIComponent(options.token)}`
  const packLine = options.packTitle ? `Pack : ${options.packTitle}` : ''

  const subject = 'Votre accès aux recettes premium'
  const text = `Bonjour,\n\nVoici votre lien d'accès :\n${magicLink}\n\n${packLine}\n\nSi vous avez un souci, répondez à cet email.\n`

  const html = `
    <div style="font-family: Arial, sans-serif; color: #2A3D34; line-height: 1.6;">
      <h2 style="margin: 0 0 12px;">Votre accès est prêt</h2>
      <p>Voici votre lien d'accès aux recettes premium :</p>
      <p><a href="${magicLink}" style="display: inline-block; padding: 12px 18px; background: #4A7C59; color: #fff; border-radius: 8px; text-decoration: none;">Accéder à mes recettes</a></p>
      ${options.packTitle ? `<p><strong>${packLine}</strong></p>` : ''}
      <p style="font-size: 14px; color: #4A7C59;">Si le bouton ne fonctionne pas, copiez-collez ce lien :<br />${magicLink}</p>
    </div>
  `

  await resend.emails.send({
    from,
    to: options.email,
    subject,
    text,
    html,
    replyTo: replyTo || undefined
  })
}

export async function sendContactRequestEmail(options: {
  name: string
  email: string
  need: string
  preferredDate?: string | null
  message?: string | null
}): Promise<void> {
  const apiKey = getEnv('RESEND_API_KEY')
  const from = getEnv('CONTACT_EMAIL_FROM') || getEnv('ACCESS_EMAIL_FROM') || 'Gastronomade <murielcruysmans@gmail.com>'
  const to = getEnv('CONTACT_EMAIL_TO') || getEnv('ACCESS_EMAIL_REPLY_TO') || 'muriel.cruysmans@gmail.com'
  const defaultReplyTo = getEnv('CONTACT_EMAIL_REPLY_TO') || getEnv('ACCESS_EMAIL_REPLY_TO') || ''

  if (!apiKey) {
    throw new Error('RESEND_API_KEY manquant')
  }

  const resend = new Resend(apiKey)
  const preferredDate = options.preferredDate?.trim() || 'Non renseignée'
  const note = options.message?.trim() || 'Aucun message complémentaire.'

  const subject = `Nouveau contact: ${options.need} - ${options.name}`
  const text = `Nouveau message depuis le formulaire contact.\n\nNom: ${options.name}\nEmail: ${options.email}\nBesoin: ${options.need}\nDate souhaitée: ${preferredDate}\n\nMessage:\n${note}\n`

  const html = `
    <div style="font-family: Arial, sans-serif; color: #2A3D34; line-height: 1.6;">
      <h2 style="margin: 0 0 12px;">Nouveau contact</h2>
      <p><strong>Nom:</strong> ${options.name}</p>
      <p><strong>Email:</strong> ${options.email}</p>
      <p><strong>Besoin:</strong> ${options.need}</p>
      <p><strong>Date souhaitée:</strong> ${preferredDate}</p>
      <p><strong>Message:</strong><br/>${note.replace(/\n/g, '<br/>')}</p>
    </div>
  `

  await resend.emails.send({
    from,
    to,
    subject,
    text,
    html,
    replyTo: options.email || defaultReplyTo || undefined
  })
}
