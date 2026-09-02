/** Two main service branches: fridge magnets and sticker experiences. */

export const frameOffering = {
  id: 'frames',
  name: 'Fridge Magnet Frames',
  eyebrow: 'Guest favours',
  headline: 'Custom fridge magnets',
  summary:
    'Instant prints from our photo booth, loaded into a fridge magnet with your name plate. Pastel colours. Event packages are quoted.',
  href: '/fridge-magnet-frames',
  quoteHref: '/quote?service=frames',
  highlights: [
    'Custom name plate',
    'Instant prints',
    'DSLR booth and attendant',
    'QR share and online gallery',
  ],
}

export const stickerOffering = {
  id: 'stickers',
  name: 'Sticker Studio',
  eyebrow: 'On-site stickers',
  headline: 'Print and cut custom stickers',
  summary:
    'Live sticker stations for events. Photo stickers, labels, and favours made on the spot.',
  href: '/stickers',
  quoteHref: '/quote?service=stickers',
  highlights: [
    'Print and cut in one step',
    '3 hours on site, attendant included',
    'Sized to your guest count',
    'On its own or with magnet packages',
  ],
  features: [
    {
      title: 'Print and cut together',
      desc: 'Finished stickers in minutes. No juggling a printer and a cutter.',
    },
    {
      title: 'Vivid, true-to-life color',
      desc: 'High-resolution dye-sublimation prints with rich color and sharp detail.',
    },
    {
      title: 'Smart subject cutouts',
      desc: 'We isolate people or objects from photos, then cut cleanly along every edge.',
    },
    {
      title: 'Built to last',
      desc: 'Laminated stickers that are waterproof and scratch-resistant. Great as event favours.',
    },
    {
      title: 'Endless custom options',
      desc: 'Photo stickers, name tags, labels, phone skins, branding, and party favours.',
    },
    {
      title: 'Guest-ready fun',
      desc: 'Guests leave with something playful they can stick, share, and keep.',
    },
  ],
}
