import { createClient } from '@sanity/client'

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN,
  apiVersion: '2024-01-01',
})

export default async (req: Request, context: any) => {
  // Uniquement accepter les requêtes POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    // Récupérer les données du formulaire
    const formData = await req.formData()
    const email = formData.get('email') as string

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Email invalide' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Vérifier si l'email existe déjà
    const existingSubscription = await sanityClient.fetch(
      `*[_type == "newsletter" && email == $email][0]`,
      { email }
    )

    if (existingSubscription) {
      return new Response(JSON.stringify({ error: 'Cet email est déjà inscrit à la newsletter' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Créer la nouvelle inscription dans Sanity
    const newSubscription = {
      _type: 'newsletter',
      email,
      subscribedAt: new Date().toISOString(),
      status: 'active'
    }

    await sanityClient.create(newSubscription)

    console.log(`Nouvelle inscription newsletter: ${email}`)

    return new Response(JSON.stringify({
      success: true,
      message: 'Inscription réussie !'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Erreur lors de l\'inscription newsletter:', error)

    return new Response(JSON.stringify({
      error: 'Erreur serveur lors de l\'inscription'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const config = {
  path: '/api/newsletter'
}