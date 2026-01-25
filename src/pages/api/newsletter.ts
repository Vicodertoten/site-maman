import type { APIRoute } from 'astro';
import { sanityClient, sanityWriteClient } from '../../lib/sanity';

// Désactiver le prerendering pour cette route API
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Email invalide' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Vérifier si l'email existe déjà
    const existingSubscription = await sanityClient.fetch(
      `*[_type == "newsletter" && email == $email][0]`,
      { email }
    );

    if (existingSubscription) {
      return new Response(JSON.stringify({ error: 'Cet email est déjà inscrit à la newsletter' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Créer la nouvelle inscription dans Sanity
    const newSubscription = {
      _type: 'newsletter',
      email,
      subscribedAt: new Date().toISOString(),
      status: 'active'
    };

    await sanityWriteClient.create(newSubscription);

    return new Response(JSON.stringify({
      success: true,
      message: 'Inscription à la newsletter réussie !'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription à la newsletter:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};