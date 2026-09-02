import { defaultFrameStyles } from '@/seed/defaults'
import { magnetImages } from '@/lib/magnet'

/** Marketing photos — this camera-body magnet only. */
export const brandImages = {
  romance: {
    src: magnetImages.hero.src,
    alt: magnetImages.hero.alt,
  },
  celebration: {
    src: '/brand/magnet-mint.png',
    alt: 'Mint fridge magnet photo frame',
  },
  modern: {
    src: '/brand/magnet-cream.png',
    alt: 'Cream fridge magnet photo frame',
  },
  garden: {
    src: '/brand/magnet-blue.png',
    alt: 'Baby-blue fridge magnet photo frame',
  },
  stickered: {
    src: magnetImages.lineup.src,
    alt: magnetImages.lineup.alt,
  },
} as const

export type GallerySample = {
  src: string
  eventType: 'wedding' | 'corporate' | 'birthday' | 'graduation' | 'anniversary' | 'other'
}

/** Curated gallery — landscape camera-body magnet only. */
export const gallerySamples: GallerySample[] = [
  { src: magnetImages.hero.src, eventType: 'wedding' },
  { src: magnetImages.inHand.src, eventType: 'wedding' },
  { src: magnetImages.nameplate.src, eventType: 'anniversary' },
  { src: magnetImages.fridge.src, eventType: 'other' },
  { src: magnetImages.lineup.src, eventType: 'birthday' },
  { src: '/brand/magnet-cream.png', eventType: 'anniversary' },
  { src: '/brand/magnet-mint.png', eventType: 'birthday' },
  { src: '/brand/magnet-blue.png', eventType: 'corporate' },
  { src: magnetImages.setup.src, eventType: 'corporate' },
  { src: magnetImages.magnetBooth.src, eventType: 'graduation' },
  { src: magnetImages.instantPrint.src, eventType: 'other' },
]

/** @deprecated use gallerySamples */
export const galleryFallbacks = gallerySamples.map((s) => ({
  src: s.src,
  alt: 'Fridge magnet photo frame',
}))

const magnetShots = [
  { src: magnetImages.hero.src, caption: 'Blush pink magnet' },
  { src: '/brand/magnet-cream.png', caption: 'Cream magnet' },
  { src: '/brand/magnet-mint.png', caption: 'Mint magnet' },
  { src: '/brand/magnet-blue.png', caption: 'Baby blue magnet' },
  { src: magnetImages.lineup.src, caption: 'Pastel colour lineup' },
  { src: magnetImages.inHand.src, caption: 'Ready to take home' },
  { src: magnetImages.fridge.src, caption: 'On the fridge' },
]

/** Per-style slider variations — one mold, colour variants. */
export const styleVariations: Record<string, { src: string; caption: string }[]> = {
  'magnet-pink': [
    { src: magnetImages.hero.src, caption: 'Blush pink' },
    { src: magnetImages.inHand.src, caption: 'In hand' },
    { src: magnetImages.fridge.src, caption: 'On the fridge' },
  ],
  'magnet-cream': [
    { src: '/brand/magnet-cream.png', caption: 'Cream' },
    { src: magnetImages.lineup.src, caption: 'With the pastel set' },
  ],
  'magnet-mint': [
    { src: '/brand/magnet-mint.png', caption: 'Mint' },
    { src: magnetImages.nameplate.src, caption: 'Custom name plate' },
  ],
  'magnet-blue': [
    { src: '/brand/magnet-blue.png', caption: 'Baby blue' },
    { src: magnetImages.magnetBooth.src, caption: 'With the booth' },
  ],
  // legacy slugs remap to this magnet
  romance: magnetShots,
  celebration: magnetShots,
  modern: magnetShots,
  garden: magnetShots,
  'stickered-painted': magnetShots,
  'hand-painted': magnetShots,
}

export type FrameStyleData = {
  id: string | number
  name: string
  slug: string
  tagline: string
  description: string
  sampleMessage: string
  imagePath: string
  plaColors: { name: string; hex: string; role: string }[]
}

export function fallbackFrameStyles(): FrameStyleData[] {
  return defaultFrameStyles.map((s, i) => ({
    id: `fallback-style-${i}`,
    name: s.name,
    slug: s.slug,
    tagline: s.tagline,
    description: s.description,
    sampleMessage: s.sampleMessage,
    imagePath: s.imagePath,
    plaColors: s.plaColors.map((c) => ({ name: c.name, hex: c.hex, role: c.role })),
  }))
}

export function variationsForStyle(slug: string, fallbackSrc: string, fallbackCaption: string) {
  return styleVariations[slug] ?? [{ src: fallbackSrc, caption: fallbackCaption }]
}
