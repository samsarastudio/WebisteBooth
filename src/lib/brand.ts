/** Central brand constants — FrameFlix runs as a subdomain of InMoment. */
export const brand = {
  name: 'FrameFlix',
  parentName: 'InMoment',
  fullName: 'FrameFlix by InMoment',
  tagline: 'Custom Photobooth Souvenirs',
  profileDescription:
    'Personalized photo-frame keepsakes and live sticker experiences for weddings, birthdays, corporate events and celebrations across Kitchener, Waterloo, Cambridge, Guelph and surrounding areas.',
  heroHeadline: 'A photo booth experience your guests take home',
  heroSupporting:
    'Every guest receives their photo inside a personalized frame—or watches their custom sticker get printed and cut live at your event.',
  ctaDesign: 'Design Your Frame Free',
  email: process.env.LEAD_NOTIFY_EMAIL || 'hello@inmomentservices.com',
  siteUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  parentUrl: process.env.NEXT_PUBLIC_PARENT_URL || 'https://inmomentservices.com',
} as const

export function pageTitle(suffix?: string) {
  if (!suffix) return `${brand.fullName} — ${brand.tagline}`
  return `${suffix} | ${brand.fullName}`
}
