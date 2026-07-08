import { cityPages } from '@/lib/local-pages/cities'

/** City links for footer, contact, and navigation. */
export const serviceAreas = cityPages.map((page) => ({
  name: page.schemaCity,
  slug: page.path.replace('photo-booth-', ''),
  href: `/${page.path}`,
  region: page.schemaRegion,
}))
