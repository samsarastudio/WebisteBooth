/** Fridge magnet product. Events are quoted. */

export const MAGNET_PATH = '/fridge-magnet-frames'
export const MAGNET_ENQUIRE_HREF = '/fridge-magnet-frames#enquire'
export const MAGNET_BOOK_HREF = '/quote?service=frames'

export const magnetImages = {
  hero: { src: '/brand/magnet-hero-pink.png', alt: 'Pastel pink fridge magnet photo frame' },
  lineup: {
    src: '/brand/magnet-lineup.png',
    alt: 'Fridge magnet frames in pink, cream, mint, and blue',
  },
  nameplate: {
    src: '/brand/magnet-nameplate-sticker.png',
    alt: 'Printed InMoment name plate sticker on the fridge magnet frame',
  },
  inHand: { src: '/brand/magnet-in-hand.png', alt: 'Hand holding pastel fridge magnet frames' },
  fridge: { src: '/brand/magnet-fridge.png', alt: 'Fridge magnet frame on a refrigerator' },
  boothStudio: { src: '/brand/booth-studio.png', alt: 'InMoment photobooth with ring light' },
  boothFront: { src: '/brand/booth-front.png', alt: 'Photobooth touchscreen ready to start' },
  boothEvent: { src: '/brand/booth-event.png', alt: 'Photobooth at an event venue' },
  boothDetail: { src: '/brand/booth-detail.png', alt: 'Photobooth side detail and stand' },
  setup: {
    src: '/brand/setup-booth-magnets.png',
    alt: 'Photobooth beside a table of fridge magnet frames',
  },
  magnetBooth: {
    src: '/brand/setup-magnet-booth.png',
    alt: 'Finished fridge magnet with the photobooth behind',
  },
  instantPrint: {
    src: '/brand/setup-instant-print.png',
    alt: 'Instant prints ready to load into fridge magnets',
  },
} as const

export const magnetColors = [
  { id: 'pink', label: 'Blush pink', src: '/brand/magnet-hero-pink.png' },
  { id: 'cream', label: 'Cream', src: '/brand/magnet-cream.png' },
  { id: 'mint', label: 'Mint', src: '/brand/magnet-mint.png' },
  { id: 'blue', label: 'Baby blue', src: '/brand/magnet-blue.png' },
  { id: 'mix', label: 'Mix / not sure', src: '/brand/magnet-lineup.png' },
] as const

export const magnetFeatures = [
  { title: 'Custom fridge magnets', desc: 'One design guests actually keep on the fridge.' },
  { title: 'DSLR photobooth', desc: 'Our booth, ring light, and attendant. Not a phone on a stick.' },
  { title: 'Instant prints', desc: 'The photo is in the magnet before they leave the line.' },
  { title: 'Custom name plate', desc: 'Your event, names, or logo printed on the tag.' },
  { title: 'QR share', desc: 'Digital copies for the group chat the same night.' },
  { title: 'Online gallery', desc: 'Guests can revisit the set after the party.' },
] as const
