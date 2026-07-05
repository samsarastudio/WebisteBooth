import { getSiteSettings, type SiteSettingsData } from '@/lib/payload'

export type PageKey =
  | 'about'
  | 'packages'
  | 'gallery'
  | 'faq'
  | 'contact'
  | 'quote'
  | 'stickers'

export function isPageEnabled(settings: SiteSettingsData, page: PageKey): boolean {
  switch (page) {
    case 'about':
      return settings.showAboutPage
    case 'packages':
      return settings.showPackagesPage
    case 'gallery':
      return settings.showGalleryPage
    case 'faq':
      return settings.showFaqPage
    case 'contact':
      return settings.showContactPage
    case 'quote':
      return settings.showQuotePage
    case 'stickers':
      return settings.showStickersPage
    default:
      return true
  }
}

export async function requirePage(page: PageKey) {
  const settings = await getSiteSettings()
  return { settings, enabled: isPageEnabled(settings, page) }
}

export function navLinks(settings: SiteSettingsData) {
  const links: { href: string; label: string }[] = []
  if (settings.showAboutPage) links.push({ href: '/about', label: 'About' })
  if (settings.showPackagesPage) links.push({ href: '/packages', label: 'Frames' })
  if (settings.showStickersPage) links.push({ href: '/stickers', label: 'Stickers' })
  if (settings.showGalleryPage) links.push({ href: '/gallery', label: 'Gallery' })
  if (settings.showFaqPage) links.push({ href: '/faq', label: 'FAQ' })
  if (settings.showContactPage) links.push({ href: '/contact', label: 'Contact' })
  return links
}
