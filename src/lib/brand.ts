/** Central brand constants — FrameFlix runs as a subdomain of inmoment. */
export const brand = {
  name: 'FrameFlix',
  parentName: 'inmoment',
  fullName: 'FrameFlix by inmoment',
  tagline: 'Custom Photobooth Souvenirs',
  email: process.env.LEAD_NOTIFY_EMAIL || 'hello@inmomentservices.com',
  siteUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  parentUrl: process.env.NEXT_PUBLIC_PARENT_URL || 'https://inmomentservices.com',
} as const

export function pageTitle(suffix?: string) {
  if (!suffix) return `${brand.fullName} — ${brand.tagline}`
  return `${suffix} | ${brand.fullName}`
}
