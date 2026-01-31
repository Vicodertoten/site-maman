// studio/schemas/index.ts
import { restaurant } from './restaurant'
import { thermomix } from './thermomix'
import { location } from './location'
import { recipe } from './recipe'
import { about } from './about'
import { contact } from './contact'
import { home } from './home'
import { newsletter } from './newsletter'
import { companyAgenda } from './companyAgenda'
import { pack } from './pack'
import { siteSettings } from './siteSettings'
import { newsletterSettings } from './newsletterSettings'
import { recipesPage } from './recipesPage'

export const schemaTypes = [
  restaurant,
  thermomix,
  location,
  recipe,
  about,
  contact,
  home,
  companyAgenda,
  newsletter,
  pack,
  siteSettings,
  newsletterSettings,
  recipesPage
]
