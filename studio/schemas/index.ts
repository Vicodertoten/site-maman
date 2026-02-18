// studio/schemas/index.ts
import { restaurant } from './restaurant'
import { thermomix } from './thermomix'
import { location } from './location'
import { recipe } from './recipe'
import { about } from './about'
import { contact } from './contact'
import { home } from './home'
import { newsletter } from './newsletter'
import { pack } from './pack'
import { siteSettings } from './siteSettings'
import { newsletterSettings } from './newsletterSettings'
import { recipesPage } from './recipesPage'
import { authorProfile } from './authorProfile'
import { pageHero } from './pageHero'

export const schemaTypes = [
  pageHero,
  restaurant,
  thermomix,
  location,
  recipe,
  authorProfile,
  about,
  contact,
  home,
  newsletter,
  pack,
  siteSettings,
  newsletterSettings,
  recipesPage
]
