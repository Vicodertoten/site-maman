// Fonction Netlify pour la newsletter avec Sanity
import { createClient } from '@sanity/client';

let sanityClient: any = null;

// Initialiser le client Sanity de manière sécurisée
try {
  const projectId =
    process.env.PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
  const dataset =
    process.env.PUBLIC_SANITY_DATASET ||
    process.env.SANITY_DATASET ||
    'production';
  const token = process.env.SANITY_AUTH_TOKEN;
  const apiVersion = process.env.SANITY_API_VERSION || '2024-01-01';

  if (projectId && token) {
    sanityClient = createClient({
      projectId,
      dataset,
      useCdn: false,
      token,
      apiVersion,
    });
    console.log('Sanity client initialized successfully');
  } else {
    console.error('Missing required environment variables for Sanity client');
  }
} catch (error) {
  console.error('Failed to initialize Sanity client:', error);
}

export default async (req: Request, context: any) => {
  console.log('Newsletter function called with method:', req.method);

  // Uniquement accepter les requêtes POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Vérifier que le client Sanity est disponible
    if (!sanityClient) {
      console.error('Sanity client not available');
      return new Response(
        JSON.stringify({
          error: 'Service temporairement indisponible',
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Récupérer les données du formulaire
    const formData = await req.formData();
    const email = formData.get('email') as string;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email requis' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Email invalide' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Processing newsletter subscription for:', email);

    // Vérifier si l'email existe déjà
    const existingSubscription = await sanityClient.fetch(
      `*[_type == "newsletter" && email == $email][0]`,
      { email }
    );

    if (existingSubscription) {
      return new Response(
        JSON.stringify({
          error: 'Cet email est déjà inscrit à la newsletter',
        }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Créer la nouvelle inscription dans Sanity
    const newSubscription = {
      _type: 'newsletter',
      email,
      subscribedAt: new Date().toISOString(),
      status: 'active',
    };

    await sanityClient.create(newSubscription);
    console.log('Newsletter subscription created successfully for:', email);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Inscription réussie !',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Erreur lors de l'inscription newsletter:", error);
    return new Response(
      JSON.stringify({
        error: "Erreur serveur lors de l'inscription",
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
