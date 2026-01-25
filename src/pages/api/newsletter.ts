import type { APIRoute } from 'astro';
import { sanityClient, sanityWriteClient } from '../../lib/sanity';
import fs from 'fs';
import path from 'path';

// Désactiver le prerendering pour cette route API
export const prerender = false;

// Fonction pour enregistrer dans le CSV
async function saveToCSV(email: string) {
  try {
    // Chemin du fichier CSV (dans le répertoire racine du projet)
    const csvPath = path.join(process.cwd(), 'newsletter_subscriptions.csv');

    // Vérifier si le fichier existe
    const fileExists = fs.existsSync(csvPath);

    // Données à ajouter
    const timestamp = new Date().toISOString();
    const csvLine = `"${email}","${timestamp}","active"\n`;

    // Si le fichier n'existe pas, ajouter l'en-tête
    if (!fileExists) {
      const header = 'email,date,status\n';
      fs.writeFileSync(csvPath, header + csvLine, 'utf8');
    } else {
      // Ajouter à la fin du fichier existant
      fs.appendFileSync(csvPath, csvLine, 'utf8');
    }

    console.log(`Email ${email} ajouté au CSV`);
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement CSV:', error);
    // Ne pas faire échouer l'inscription si le CSV échoue
  }
}

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

    // Enregistrer aussi dans le fichier CSV
    await saveToCSV(email);

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