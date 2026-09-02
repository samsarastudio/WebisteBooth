/** Central brand constants. FrameFlix runs as a subdomain of InMoment. */
export const brand = {
  name: 'FrameFlix',
  displayName: 'FrameFlix Photo Booth & Fridge Magnets',
  parentName: 'InMoment',
  fullName: 'FrameFlix by InMoment',
  tagline: 'The magnet they put on the fridge',
  defaultPageTitle: 'FrameFlix Photo Booth Kitchener-Waterloo | Fridge Magnet Frames',
  profileDescription:
    'Photo booth rental in Kitchener, Waterloo, Cambridge, and Guelph. Guests leave with a custom fridge magnet, a name plate for your event, and an online gallery.',
  heroHeadline: "They don't toss this. They put it on the fridge.",
  heroSupporting:
    'Guests pose at our booth, get a print in minutes, and take home a fridge magnet with your name plate. We quote event packages.',
  frameKeepsakeLine:
    'Every guest photo goes into a custom fridge magnet, ready for the fridge that night.',
  ctaDesign: 'Design a similar frame',
  ctaEnquire: 'Enquire',
  ctaBook: 'Book the booth',
  email: process.env.LEAD_NOTIFY_EMAIL || 'hello@inmomentservices.com',
  siteUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  parentUrl: process.env.NEXT_PUBLIC_PARENT_URL || 'https://inmomentservices.com',
} as const

export function pageTitle(suffix?: string) {
  if (!suffix) return brand.defaultPageTitle
  return `${suffix} | ${brand.name}`
}
