/** Central brand constants — FrameFlix runs as a subdomain of InMoment. */
export const brand = {
  name: 'FrameFlix',
  displayName: 'FrameFlix Photo Booth & Event Keepsakes',
  parentName: 'InMoment',
  fullName: 'FrameFlix by InMoment',
  tagline: 'Custom Photobooth Souvenirs',
  defaultPageTitle: 'FrameFlix Photo Booth Kitchener-Waterloo | Custom Frames & Stickers',
  profileDescription:
    'Personalized photo-frame keepsakes and live sticker experiences for weddings, birthdays, corporate events and celebrations across Kitchener, Waterloo, Cambridge, Guelph and surrounding areas.',
  heroHeadline: 'A photo booth experience your guests take home',
  heroSupporting:
    'Guests receive their event photo inside a personalized keepsake frame, up to the frame quantity included in your package—or watch custom stickers print and cut live at your event.',
  frameKeepsakeLine:
    'Guests receive their event photo inside a personalized keepsake frame, up to the frame quantity included in your selected package.',
  ctaDesign: 'Design Your Frame Free',
  email: process.env.LEAD_NOTIFY_EMAIL || 'hello@inmomentservices.com',
  siteUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  parentUrl: process.env.NEXT_PUBLIC_PARENT_URL || 'https://inmomentservices.com',
} as const

export function pageTitle(suffix?: string) {
  if (!suffix) return brand.defaultPageTitle
  return `${suffix} | ${brand.name}`
}
