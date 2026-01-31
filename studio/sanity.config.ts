// studio/sanity.config.ts
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schemaTypes } from './schemas'
import { NewsletterTool } from './src/components/NewsletterTool'

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
          .title('Administration')
          .items([
            S.listItem()
              .title('Réglages du site')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            // Pages
            S.listItem()
              .title('Pages')
              .child(
                S.list()
                  .title('Pages du site')
                  .items([
                    S.listItem().title('Accueil — Gastronomade').child(S.document().schemaType('home').documentId('home')),
                    S.listItem().title('À propos — Cours & coaching').child(S.document().schemaType('about').documentId('about')),
                    S.listItem().title('Thermomix').child(S.document().schemaType('thermomix').documentId('thermomix')),
                    S.listItem().title('Recettes').child(S.document().schemaType('recipesPage').documentId('recipesPage')),
                    S.listItem().title('Contact').child(S.document().schemaType('contact').documentId('contact')),
                    S.listItem().title('Newsletter — Inscription').child(S.document().schemaType('newsletterSettings').documentId('newsletterSettings')),
                  ])
              ),

            // Offres & lieu
            S.listItem()
              .title('Offres & lieu')
              .child(
                S.list()
                  .title('Offres & lieu')
                  .items([
                    S.listItem().title('Privatisation du lieu').child(S.documentTypeList('location').title('Offres de privatisation')),
                    S.listItem().title('Restaurant éphémère').child(S.documentTypeList('restaurant').title('Soirées & menus')),
                    S.listItem()
                      .title('Agenda entreprises')
                      .child(S.document().schemaType('companyAgenda').documentId('companyAgenda')),
                  ])
              ),

            // Recettes
            S.listItem()
              .title('Recettes')
              .child(S.documentTypeList('recipe').title('Toutes les recettes')),

            // Boutique
            S.listItem()
              .title('Boutique')
              .child(S.documentTypeList('pack').title('Packs')),

            // Newsletter Tool
            S.listItem()
              .title('Newsletter')
              .icon(() => '📧')
              .child(S.component(NewsletterTool).title('Gestion des abonnés')),
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
