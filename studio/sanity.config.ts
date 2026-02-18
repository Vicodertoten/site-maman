// studio/sanity.config.ts
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schemaTypes } from './schemas'
import { NewsletterTool } from './src/components/NewsletterTool'

// Helper function pour créer un item de page
const pageListItem = (S: any, schemaType: string, title: string) =>
  S.listItem()
    .title(title)
    .child(S.document().schemaType(schemaType).documentId(schemaType))

const projectId =
  import.meta.env.SANITY_PROJECT_ID ||
  import.meta.env.SANITY_STUDIO_PROJECT_ID ||
  import.meta.env.PUBLIC_SANITY_PROJECT_ID
const dataset =
  import.meta.env.SANITY_DATASET ||
  import.meta.env.SANITY_STUDIO_DATASET ||
  import.meta.env.PUBLIC_SANITY_DATASET ||
  'production'

if (!projectId) {
  throw new Error('SANITY_PROJECT_ID manquant. Ajoutez-le dans studio/.env.local.')
}

export default defineConfig({
  name: 'gastronomade-studio',
  title: 'Gastronomade - Studio d\'administration',

  projectId,
  dataset,

  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title('Studio Gastronomade')
          .items([
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 🎯 SECTION 1 : METTRE À JOUR UNE PAGE
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            S.listItem()
              .title('🎯 Mettre à jour une page')
              .icon(() => '📄')
              .child(
                S.list()
                  .title('Quelle page veux-tu modifier ?')
                  .items([
                    pageListItem(S, 'home', '🏠 Page d\'accueil'),
                    pageListItem(S, 'about', '📚 À propos — Cours & Coaching'),
                    pageListItem(S, 'contact', '📞 Page Contact'),
                    pageListItem(S, 'authorProfile', '👤 Profil — Muriel'),
                    pageListItem(S, 'recipesPage', '📖 Page Recettes (Index)'),
                    pageListItem(S, 'thermomix', '🤖 Espace Thermomix'),
                  ])
              ),

            S.divider(),

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 🏢 SECTION 2 : OFFRES & LOCALISATION
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            S.listItem()
              .title('🏢 Offres & Localisation')
              .icon(() => '🏠')
              .child(
                S.list()
                  .title('Que veux-tu modifier ?')
                  .items([
                    S.listItem()
                      .title('🏢 Privatisation — Entreprises')
                      .child(
                        S.list()
                          .title('Privatisation Entreprises')
                          .items([
                            S.listItem()
                              .title('Offres de privatisation')
                              .child(S.documentTypeList('location').filter('_type == "location" && type == "societe"').title('Privatisation Entreprises')),
                          ])
                      ),

                    S.listItem()
                      .title('🎉 Événements — Privés')
                      .child(
                        S.list()
                          .title('Événements Privés')
                          .items([
                            S.listItem()
                              .title('Offres d\'événements')
                              .child(S.documentTypeList('location').filter('_type == "location" && type == "prive"').title('Événements Privés')),
                          ])
                      ),

                    S.listItem()
                      .title('🍷 Restaurant Éphémère')
                      .child(S.document().schemaType('restaurant').documentId('restaurant')),


                  ])
              ),

            S.divider(),

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 📚 SECTION 3 : CONTENU ÉDUCATIF
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            S.listItem()
              .title('📚 Contenu Éducatif')
              .icon(() => '📖')
              .child(
                S.list()
                  .title('Créer ou modifier')
                  .items([
                    S.listItem()
                      .title('📖 Les Recettes')
                      .child(S.documentTypeList('recipe').title('Toutes les recettes')),

                    // FAQs section — À activer une fois le schéma créé
                    // S.listItem()
                    //   .title('❓ Questions Fréquentes')
                    //   .description('Répondre aux questions récurrentes')
                    //   .child(S.documentTypeList('faq').title('Toutes les FAQs')),
                  ])
              ),

            S.divider(),

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 🛒 SECTION 4 : BOUTIQUE & VENTES
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            S.listItem()
              .title('🛒 Boutique')
              .icon(() => '🛍️')
              .child(
                S.list()
                  .title('Gérer ma boutique')
                  .items([
                    S.listItem()
                      .title('📦 Mes Packs (Produits)')
                      .child(S.documentTypeList('pack').title('Tous les packs')),
                  ])
              ),

            S.divider(),

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 📧 SECTION 5 : COMMUNICATION
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            S.listItem()
              .title('📧 Communication')
              .icon(() => '💌')
              .child(
                S.list()
                  .title('Gérer la communication')
                  .items([
                    S.listItem()
                      .title('📧 Newsletter — Abonnés')
                      .child(S.component(NewsletterTool).title('Gestion des abonnés newsletter')),
                  ])
              ),

            S.divider(),

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 📊 SECTION 6 : DONNÉES & STATS
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // Placeholder pour dashboard futur
            // S.listItem()
            //   .title('📊 Données & Stats')
            //   .icon(() => '📈')
            //   .description('Voir mes données'),

            S.divider(),

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // ⚙️ SECTION 7 : CONFIGURATION (Avancé)
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            S.listItem()
              .title('⚙️ Configuration Avancée')
              .icon(() => '🔧')
              .child(
                S.list()
                  .title('Réglages du site')
                  .items([
                    S.listItem()
                      .title('🌐 Navigation & Infos Globales')
                      .child(S.document().schemaType('siteSettings').documentId('siteSettings')),

                    S.listItem()
                      .title('📧 Newsletter — Paramètres')
                      .child(S.document().schemaType('newsletterSettings').documentId('newsletterSettings')),
                  ])
              ),
          ]),
    })
  ],

  schema: {
    types: schemaTypes,
  },

  // Configuration pour éviter les problèmes de permissions
  auth: {
    redirectOnSingle: false,
    providers: []
  }
})
