import { defaultFrameStyles } from '@/seed/defaults'

/** Primary style images (with guest photos in-frame). */
export const brandImages = {
  romance: {
    src: '/brand/style-romance-photo.png',
    alt: 'Guest keepsake frame',
  },
  celebration: {
    src: '/brand/style-celebration-photo.png',
    alt: 'Guest keepsake frame',
  },
  modern: {
    src: '/brand/style-modern-photo.png',
    alt: 'Guest keepsake frame',
  },
  garden: {
    src: '/brand/style-garden-photo.png',
    alt: 'Guest keepsake frame',
  },
  stickered: {
    src: '/brand/stickered-wedding-1.png',
    alt: 'Stickered and painted guest keepsake frame',
  },
} as const

export type GallerySample = {
  src: string
  eventType: 'wedding' | 'corporate' | 'birthday' | 'graduation' | 'anniversary' | 'other'
}

/**
 * Curated gallery samples for production.
 * Decorations stay inside the frame.
 */
export const gallerySamples: GallerySample[] = [
  // 3D raised styles
  { src: '/brand/style-romance-photo.png', eventType: 'wedding' },
  { src: '/brand/style-romance-v2.png', eventType: 'wedding' },
  { src: '/brand/style-celebration-photo.png', eventType: 'birthday' },
  { src: '/brand/style-celebration-v2.png', eventType: 'birthday' },
  { src: '/brand/style-modern-photo.png', eventType: 'corporate' },
  { src: '/brand/style-garden-photo.png', eventType: 'anniversary' },
  { src: '/brand/frame-4x6-sample.png', eventType: 'other' },
  // Stickered & painted
  { src: '/brand/stickered-wedding-1.png', eventType: 'wedding' },
  { src: '/brand/stickered-wedding-2.png', eventType: 'wedding' },
  { src: '/brand/stickered-birthday-1.png', eventType: 'birthday' },
  { src: '/brand/stickered-anniversary-1.png', eventType: 'anniversary' },
  { src: '/brand/stickered-event-1.png', eventType: 'corporate' },
]

/** @deprecated use gallerySamples */
export const galleryFallbacks = gallerySamples.map((s) => ({
  src: s.src,
  alt: 'Guest keepsake frame',
}))

/** Per-style slider variations. */
export const styleVariations: Record<string, { src: string; caption: string }[]> = {
  romance: [
    { src: '/brand/style-romance-photo.png', caption: 'Anna & Stephen' },
    { src: '/brand/style-romance-v2.png', caption: 'With love — Anna & Stephen' },
  ],
  celebration: [
    { src: '/brand/style-celebration-photo.png', caption: 'With love — Mia' },
    { src: '/brand/style-celebration-v2.png', caption: 'With love — Leo' },
  ],
  modern: [{ src: '/brand/style-modern-photo.png', caption: 'Anna & Stephen' }],
  garden: [{ src: '/brand/style-garden-photo.png', caption: 'With love — Anna & Stephen' }],
  'stickered-painted': [
    { src: '/brand/stickered-wedding-1.png', caption: 'With love — Anna & Stephen' },
    { src: '/brand/stickered-wedding-2.png', caption: 'Anna & Stephen' },
    { src: '/brand/stickered-birthday-1.png', caption: 'With love — Mia' },
    { src: '/brand/stickered-anniversary-1.png', caption: 'With love — Anna & Stephen' },
    { src: '/brand/stickered-event-1.png', caption: 'Anna & Stephen' },
  ],
  // legacy slug support
  'hand-painted': [
    { src: '/brand/stickered-wedding-1.png', caption: 'With love — Anna & Stephen' },
    { src: '/brand/stickered-wedding-2.png', caption: 'Anna & Stephen' },
    { src: '/brand/stickered-birthday-1.png', caption: 'With love — Mia' },
  ],
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
