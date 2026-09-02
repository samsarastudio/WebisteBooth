import { lexicalFromBlocks } from '@/lib/lexical-content'
import {
  ONLINE_PHOTOS_ESSENTIAL,
  ONLINE_PHOTOS_PREMIUM,
  ONLINE_PHOTOS_SIGNATURE,
} from '@/lib/retention-policy'

export const HOURS_LINE = '3 hours coverage (excluding setup time)'
export const FRAMES_60 = '60 guest photo frames'
export const FRAMES_120 = '120 guest photo frames'
export const FRAMES_LINE = FRAMES_60
export const ONLINE_PHOTOS_LINE = ONLINE_PHOTOS_ESSENTIAL
export { ONLINE_PHOTOS_PREMIUM, ONLINE_PHOTOS_SIGNATURE }

export const ATTENDANT_LINE =
  'On-site attendant included. We set up, run the booth, and tear down'

export const defaultPackages = [
  {
    name: 'Essential',
    slug: 'essential',
    basePrice: 49500,
    priceRange: '$495–$695',
    frameSummary: '60 guest frames',
    description: 'Ideal for birthdays and smaller gatherings. We run the booth so you can enjoy the party.',
    icon: '📸',
    features: [
      { item: HOURS_LINE },
      { item: FRAMES_60 },
      { item: ATTENDANT_LINE },
      { item: 'Dye-sublimation prints (waterproof, fade-proof)' },
      { item: 'Custom frame design for your event theme' },
      { item: ONLINE_PHOTOS_LINE },
      { item: 'Basic prop set included' },
    ],
    notIncluded: [
      { item: 'Video clips & GIF frames' },
      { item: 'Photo booth backdrops' },
    ],
    popular: false,
    active: true,
    sortOrder: 1,
  },
  {
    name: 'Premium',
    slug: 'premium',
    basePrice: 79500,
    priceRange: '$795–$1,195',
    frameSummary: '120 guest frames',
    description: 'Our most popular. More guest magnets, fully handled from setup to teardown.',
    icon: '✨',
    features: [
      { item: HOURS_LINE },
      { item: FRAMES_120 },
      { item: ATTENDANT_LINE },
      { item: 'Dye-sublimation prints (waterproof, fade-proof)' },
      { item: 'Custom frame design + QR code insert' },
      { item: 'Guest engagement & crowd support' },
      { item: ONLINE_PHOTOS_PREMIUM },
      { item: 'Premium prop set with themed accessories' },
    ],
    notIncluded: [
      { item: 'Video clips & GIF frames' },
      { item: 'Custom backdrop installation' },
    ],
    popular: true,
    active: true,
    sortOrder: 2,
  },
  {
    name: 'Signature',
    slug: 'signature',
    basePrice: 0,
    priceRange: 'Custom quote',
    frameSummary: 'Custom frame count',
    description:
      'Completely custom. If our packages are not the right fit, we would love to hear from you.',
    icon: '✦',
    features: [
      { item: 'Coverage hours tailored to your event' },
      { item: 'Custom guest frame count' },
      { item: ATTENDANT_LINE },
      { item: 'Custom frame design with your approval' },
      { item: 'Multi-day or multi-venue options' },
      { item: ONLINE_PHOTOS_SIGNATURE },
      { item: 'Dedicated planning support' },
    ],
    notIncluded: [],
    popular: false,
    active: true,
    sortOrder: 3,
  },
]

export const defaultAddOns = [
  {
    name: 'Extra Frames (20-pack)',
    slug: 'extra-frames-20-pack',
    price: 30000,
    pricingUnit: 'per_pack' as const,
    description: 'Add 20 more guest frames. Final pricing confirmed in your quote.',
    active: true,
    sortOrder: 1,
  },
  {
    name: 'Additional Attendant Hour',
    slug: 'additional-hour',
    price: 8500,
    pricingUnit: 'per_hour' as const,
    description: 'Extend coverage beyond the included 3 hours (setup still excluded).',
    active: true,
    sortOrder: 2,
  },
  {
    name: 'Custom Backdrop',
    slug: 'custom-backdrop',
    price: 20000,
    pricingUnit: 'fixed' as const,
    description: 'Themed backdrop designed to match your event.',
    active: true,
    sortOrder: 3,
  },
  {
    name: 'Video/GIF Clips (+30)',
    slug: 'video-gif',
    price: 15000,
    pricingUnit: 'fixed' as const,
    description: '30 digital video and GIF clips for guests to share.',
    active: true,
    sortOrder: 4,
  },
  {
    name: 'Photo Album (50 pages)',
    slug: 'photo-album',
    price: 18000,
    pricingUnit: 'fixed' as const,
    description: 'Premium keepsake album with curated event photos.',
    active: true,
    sortOrder: 5,
  },
]

export const defaultFaqs = [
  {
    question: 'What exactly is a FrameFlix photobooth?',
    answer:
      'Guests pose at our booth, get a print in minutes, and leave with a custom fridge magnet. Add your names, date, or logo on the name plate. Paper strips fade. This stays on the fridge.',
    active: true,
    sortOrder: 1,
  },
  {
    question: 'How long is each package?',
    answer:
      'Essential and Premium include 3 hours of coverage, excluding setup time. Setup and teardown are handled by our attendant so you get a full 3 hours of booth time. Need longer? Note it in your quote request.',
    active: true,
    sortOrder: 2,
  },
  {
    question: 'How long before my event do I need to book?',
    answer:
      'We recommend booking at least 2-3 months in advance for weddings and peak season events. For corporate events and birthdays, 4-6 weeks usually works. We do accommodate rush requests. Just email us.',
    active: true,
    sortOrder: 3,
  },
  {
    question: "What's the difference between dye-sublimation and regular printing?",
    answer:
      'Dye-sublimation prints are waterproof, fade-proof, tear-proof, and have a glossy professional finish. Regular inkjet prints fade within months, can smear when wet, and feel cheap to the touch. Ours will still look brand new in 20 years.',
    active: true,
    sortOrder: 4,
  },
  {
    question: 'Can I customize the frame design?',
    answer:
      'Pick a pastel colour and tell us what goes on the name plate. Share your event copy and we’ll send a proof before printing.',
    active: true,
    sortOrder: 5,
  },
  {
    question: 'What colors can you print?',
    answer:
      'The magnet comes in blush pink, cream, mint, and baby blue. Mix colours at an event if you like.',
    active: true,
    sortOrder: 6,
  },
  {
    question: 'How many photo frames are included?',
    answer:
      'Essential includes 60 guest magnets and Premium includes about 120. Signature is fully custom for larger or unique events. Need more? Request extra 20-packs in your quote. Final numbers are confirmed in your proposal.',
    active: true,
    sortOrder: 7,
  },
  {
    question: 'How long are online photos available?',
    answer:
      'Essential includes 3 months of online gallery access. Premium includes 12 months of online gallery access. Signature packages use a custom retention period agreed in writing when we plan your event together.',
    active: true,
    sortOrder: 8,
  },
  {
    question: 'How many guests can use the photobooth?',
    answer:
      "There's no limit! All packages include unlimited shots during your 3-hour coverage window. Whether you have 30 or 500 guests, the booth keeps running. Physical frames are limited to the 60 included (plus any 20-packs you add).",
    active: true,
    sortOrder: 9,
  },
  {
    question: 'Where do you host events?',
    answer:
      'We regularly host in Kitchener, Cambridge, Waterloo, and Guelph, and we are happy to celebrate with you in other cities too. Share your venue when you request a quote and we will tailor everything to your location.',
    active: true,
    sortOrder: 10,
  },
  {
    question: 'What happens if equipment fails at my event?',
    answer:
      "We bring backup equipment for every event. Our setup includes redundant cameras, printers, and power supplies so that even in the unlikely event of a hardware issue, there's zero disruption to your party.",
    active: true,
    sortOrder: 11,
  },
  {
    question: 'Can I see examples of actual frames before booking?',
    answer:
      'Yes. The gallery and magnet page show this fridge magnet. Email us and we’ll send more shots based on your event.',
    active: true,
    sortOrder: 12,
  },
  {
    question: 'Do you provide an attendant at the event?',
    answer:
      'Yes. Every package includes an on-site attendant. We set up, run the booth, help your guests, and tear down so you can enjoy the event.',
    active: true,
    sortOrder: 13,
  },
]

/** Public quote colours. One fridge magnet design. */
export const defaultFrameStyles = [
  {
    name: 'Blush pink',
    slug: 'magnet-pink',
    tagline: 'Custom fridge magnet',
    description:
      'The same fridge magnet in blush pink. Custom name plate. Instant print from the photo booth.',
    sampleMessage: 'Your celebration',
    imagePath: '/brand/magnet-hero-pink.png',
    plaColors: [{ name: 'Blush', hex: '#E8B4C0', role: 'base' as const }],
    active: true,
    sortOrder: 1,
  },
  {
    name: 'Cream',
    slug: 'magnet-cream',
    tagline: 'Custom fridge magnet',
    description:
      'The same fridge magnet in cream. Custom name plate. Instant print from the photo booth.',
    sampleMessage: 'Your celebration',
    imagePath: '/brand/magnet-cream.png',
    plaColors: [{ name: 'Cream', hex: '#F3EDE2', role: 'base' as const }],
    active: true,
    sortOrder: 2,
  },
  {
    name: 'Mint',
    slug: 'magnet-mint',
    tagline: 'Custom fridge magnet',
    description:
      'The same fridge magnet in mint. Custom name plate. Instant print from the photo booth.',
    sampleMessage: 'Your celebration',
    imagePath: '/brand/magnet-mint.png',
    plaColors: [{ name: 'Mint', hex: '#A8C9B8', role: 'base' as const }],
    active: true,
    sortOrder: 3,
  },
  {
    name: 'Baby blue',
    slug: 'magnet-blue',
    tagline: 'Custom fridge magnet',
    description:
      'The same fridge magnet in baby blue. Custom name plate. Instant print from the photo booth.',
    sampleMessage: 'Your celebration',
    imagePath: '/brand/magnet-blue.png',
    plaColors: [{ name: 'Baby blue', hex: '#A9C4D6', role: 'base' as const }],
    active: true,
    sortOrder: 4,
  },
]

export const defaultFrameTemplates = [
  {
    name: '6×4 Landscape',
    slug: 'frame-6x4-classic',
    format: '6x4' as const,
    canvasWidth: 600,
    canvasHeight: 400,
    photoSlot: { x: 60, y: 16, width: 480, height: 232 },
    captionZone: { x: 16, y: 256, width: 568, height: 128 },
    borderRadius: 2,
    active: true,
    sortOrder: 1,
  },
  {
    name: 'Original Keepsake',
    slug: 'frame-original-classic',
    format: 'original' as const,
    canvasWidth: 400,
    canvasHeight: 400,
    photoSlot: { x: 48, y: 32, width: 304, height: 260 },
    captionZone: { x: 20, y: 302, width: 360, height: 68 },
    borderRadius: 4,
    active: true,
    sortOrder: 2,
  },
]

export const defaultFrameOrnaments = [
  {
    name: 'Gold heart',
    slug: 'heart-accent',
    category: 'geometric' as const,
    kind: 'shape' as const,
    finish: 'raised3d' as const,
    shapeType: 'heart' as const,
    active: true,
    sortOrder: 1,
  },
  {
    name: 'Accent star',
    slug: 'star-accent',
    category: 'geometric' as const,
    kind: 'shape' as const,
    finish: 'raised3d' as const,
    shapeType: 'star' as const,
    active: true,
    sortOrder: 2,
  },
  {
    name: 'Soft circle',
    slug: 'circle-soft',
    category: 'geometric' as const,
    kind: 'shape' as const,
    finish: 'raised3d' as const,
    shapeType: 'circle' as const,
    active: true,
    sortOrder: 3,
  },
  {
    name: 'Diamond detail',
    slug: 'diamond-detail',
    category: 'geometric' as const,
    kind: 'shape' as const,
    finish: 'raised3d' as const,
    shapeType: 'diamond' as const,
    active: true,
    sortOrder: 4,
  },
  {
    name: 'Corner flourish',
    slug: 'flourish-corner',
    category: 'corner' as const,
    kind: 'shape' as const,
    finish: 'raised3d' as const,
    shapeType: 'flourish' as const,
    active: true,
    sortOrder: 5,
  },
  {
    name: 'Subtle arc',
    slug: 'arc-geometric',
    category: 'geometric' as const,
    kind: 'shape' as const,
    finish: 'raised3d' as const,
    shapeType: 'arc' as const,
    active: true,
    sortOrder: 6,
  },
  {
    name: 'Romance tulip',
    slug: 'tulip-romance',
    category: 'floral' as const,
    kind: 'shape' as const,
    finish: 'raised3d' as const,
    shapeType: 'tulip' as const,
    active: true,
    sortOrder: 7,
  },
  {
    name: 'Dove & letter',
    slug: 'bird-mail-romance',
    category: 'floral' as const,
    kind: 'shape' as const,
    finish: 'raised3d' as const,
    shapeType: 'bird-mail' as const,
    active: true,
    sortOrder: 8,
  },
  {
    name: 'Love envelope',
    slug: 'envelope-love',
    category: 'seasonal' as const,
    kind: 'shape' as const,
    finish: 'raised3d' as const,
    shapeType: 'envelope' as const,
    active: true,
    sortOrder: 9,
  },
  {
    name: 'Vine scroll',
    slug: 'vine-scroll-raised',
    category: 'floral' as const,
    kind: 'shape' as const,
    finish: 'raised3d' as const,
    shapeType: 'vine-scroll' as const,
    active: true,
    sortOrder: 10,
  },
  {
    name: 'Corner vine',
    slug: 'vine-corner-raised',
    category: 'corner' as const,
    kind: 'shape' as const,
    finish: 'raised3d' as const,
    shapeType: 'vine-corner' as const,
    active: true,
    sortOrder: 11,
  },
  {
    name: 'Floral cluster',
    slug: 'floral-cluster-raised',
    category: 'floral' as const,
    kind: 'shape' as const,
    finish: 'raised3d' as const,
    shapeType: 'floral-cluster' as const,
    active: true,
    sortOrder: 12,
  },
  {
    name: 'Rose bud',
    slug: 'rose-bud-raised',
    category: 'floral' as const,
    kind: 'shape' as const,
    finish: 'raised3d' as const,
    shapeType: 'rose-bud' as const,
    active: true,
    sortOrder: 13,
  },
  {
    name: 'Leaf sprig',
    slug: 'leaf-sprig-raised',
    category: 'floral' as const,
    kind: 'shape' as const,
    finish: 'raised3d' as const,
    shapeType: 'leaf-sprig' as const,
    active: true,
    sortOrder: 14,
  },
  {
    name: 'Floral corner',
    slug: 'sticker-floral',
    category: 'floral' as const,
    kind: 'image' as const,
    finish: 'sticker' as const,
    assetPath: '/brand/ornaments/sticker-floral-corner.svg',
    active: true,
    sortOrder: 20,
  },
  {
    name: 'Confetti burst',
    slug: 'sticker-confetti',
    category: 'seasonal' as const,
    kind: 'image' as const,
    finish: 'sticker' as const,
    assetPath: '/brand/ornaments/sticker-confetti.svg',
    active: true,
    sortOrder: 21,
  },
  {
    name: 'Star cluster',
    slug: 'sticker-stars',
    category: 'geometric' as const,
    kind: 'image' as const,
    finish: 'sticker' as const,
    assetPath: '/brand/ornaments/sticker-star-cluster.svg',
    active: true,
    sortOrder: 22,
  },
  {
    name: 'Heart wreath',
    slug: 'sticker-heart-wreath',
    category: 'floral' as const,
    kind: 'image' as const,
    finish: 'sticker' as const,
    assetPath: '/brand/ornaments/sticker-heart-wreath.svg',
    active: true,
    sortOrder: 23,
  },
  {
    name: 'Vine scroll sticker',
    slug: 'sticker-vine',
    category: 'floral' as const,
    kind: 'image' as const,
    finish: 'sticker' as const,
    assetPath: '/brand/ornaments/sticker-vine-scroll.svg',
    active: true,
    sortOrder: 24,
  },
]

export const defaultSiteSettings = {
  phone: '',
  email: 'hello@inmomentservices.com',
  serviceArea: 'Kitchener, Cambridge, Waterloo, Guelph & beyond',
  googleBusinessUrl: '',
  instagramUrl: '',
  facebookUrl: '',
  heroEyebrow: 'FrameFlix by InMoment',
  heroTitle: 'They don’t toss this. They put it on the fridge.',
  heroSubtitle:
    'Pose at our booth. Instant print. Custom name plate. A fridge magnet guests actually keep. Events are quoted.',
  testimonials: [] as { text: string; author: string }[],
  trustBadges: [
    { icon: '✦', label: 'Custom name plate' },
    { icon: '📸', label: 'DSLR photobooth' },
    { icon: '🖨️', label: 'Instant prints' },
    { icon: '☁️', label: 'QR share & gallery' },
  ],
  // Pages
  showAboutPage: true,
  showPackagesPage: true,
  showStickersPage: false,
  showGalleryPage: true,
  showBlogPage: true,
  showFaqPage: true,
  showContactPage: true,
  showQuotePage: true,
  showDesignPage: false,
  // Home sections
  showTrustBar: true,
  showStylesSection: false,
  showProductStory: true,
  showHowItWorks: true,
  showPackagesSection: false,
  showEventOrganisersSection: true,
  eventOrganisersTitle: 'We would love to be part of your success stories',
  eventOrganisersBody:
    'Partner with FrameFlix for weddings, corporate nights, and milestone events. Branded fridge magnets guests still have on the fridge months later.',
  showLifestyleBanner: true,
  showGalleryPreview: true,
  showBlogPreview: true,
  showTestimonials: false,
  showFinalCta: true,
  showFrameCountOnHome: false,
  showPricing: false,
}

export const defaultPosts = [
  {
    title: 'Why Personalized Photobooth Keepsakes Beat Paper Strips',
    slug: 'personalized-keepsakes-vs-paper-strips',
    excerpt:
      'Paper strips fade in weeks. Custom fridge magnets with dye-sublimation prints last for years, and guests actually put them up.',
    category: 'tips' as const,
    author: 'FrameFlix Team',
    status: 'published' as const,
    publishedAt: '2025-11-15T10:00:00.000Z',
    metaDescription:
      'Why custom fridge magnets beat paper strips at weddings and events. Durable prints, a name plate for your night, and a keepsake guests keep.',
    tags: [{ tag: 'photobooth' }, { tag: 'keepsakes' }, { tag: 'wedding favors' }],
    source: 'seed' as const,
    content: lexicalFromBlocks([
      {
        type: 'paragraph',
        text: 'Walk through any wedding after-party and you will find crumpled photobooth strips in purses, on dashboards, or forgotten in coat pockets. They were fun in the moment. They rarely survive the week.',
      },
      {
        type: 'paragraph',
        text: 'FrameFlix was built around a simpler idea. Give every guest a fridge magnet they will actually keep. Instant print from the booth. Your names, date, or logo on the name plate. Prints that will not fade, smear, or tear.',
      },
      { type: 'heading', level: 2, text: 'What makes a keepsake worth keeping?' },
      {
        type: 'list',
        items: [
          'Durable prints: dye-sublimation is waterproof and fade-proof for 20+ years',
          'A name plate for your event, names, or logo',
          'Display-ready: guests put it on the fridge that night',
          'It feels like a product, not a party favour',
        ],
      },
      { type: 'heading', level: 2, text: 'The guest experience difference' },
      {
        type: 'paragraph',
        text: 'At a traditional booth, guests grab a strip and move on. With FrameFlix, they pose, pick up a finished magnet minutes later, and leave with something tied to your celebration. Hosts tell us guests still mention the magnets months later.',
      },
      {
        type: 'paragraph',
        text: 'Planning a wedding, milestone birthday, or corporate night in Kitchener, Waterloo, Cambridge, or Guelph? Request a quote and we will help you plan magnets your guests will keep.',
      },
    ]),
  },
  {
    title: '10 Wedding Guest Favor Ideas Guests Will Actually Use',
    slug: 'wedding-guest-favors-guests-actually-keep',
    excerpt:
      'Skip the trinkets that end up in a drawer. From custom fridge magnets to on-site stickers, here are favours that create real memories.',
    category: 'events' as const,
    author: 'FrameFlix Team',
    status: 'published' as const,
    publishedAt: '2025-12-01T10:00:00.000Z',
    metaDescription:
      'Ten wedding guest favour ideas guests love and keep, including custom fridge magnets and live sticker stations.',
    tags: [{ tag: 'wedding' }, { tag: 'guest favors' }, { tag: 'planning' }],
    source: 'seed' as const,
    content: lexicalFromBlocks([
      {
        type: 'paragraph',
        text: 'The best wedding favours are not the cheapest. They are the ones guests talk about on the drive home. If you are tired of koozies and mini succulents collecting dust, pick favours that connect to the day itself.',
      },
      { type: 'heading', level: 2, text: 'Favours that create memories' },
      {
        type: 'list',
        items: [
          'Custom fridge magnets with each guest’s photo inside',
          'On-site sticker station with names, inside jokes, or your wedding hashtag',
          'Instant photo magnets with a name plate that matches your palette',
          'Mini recipe cards from family favorites, printed beautifully',
          'Local honey or jam with a custom label featuring your monogram',
        ],
      },
      { type: 'heading', level: 2, text: 'Why photo keepsakes win' },
      {
        type: 'paragraph',
        text: 'Photos are the one thing every guest already wants from your wedding. A fridge magnet turns that into something they display for years. Unlike a digital gallery alone, a magnet on the fridge keeps your day visible long after the last dance.',
      },
      { type: 'heading', level: 2, text: 'Timing tips for your reception' },
      {
        type: 'paragraph',
        text: 'Schedule your photobooth during cocktail hour or early reception when energy is high and lines stay short. Our attendant handles setup and flow so you never worry about a backup. Three hours of coverage is included in every package, enough for most celebrations without rushing guests.',
      },
    ]),
  },
  {
    title: 'How Dye-Sublimation Printing Makes Photos Last a Lifetime',
    slug: 'dye-sublimation-photobooth-prints-explained',
    excerpt:
      'Not all event prints are equal. Here is why dye-sublimation beats inkjet for keepsakes you want to last 20 years.',
    category: 'studio' as const,
    author: 'FrameFlix Team',
    status: 'published' as const,
    publishedAt: '2026-01-10T10:00:00.000Z',
    metaDescription:
      'Dye-sublimation vs inkjet for event photos. Why FrameFlix uses sublimation for waterproof, fade-proof guest magnets.',
    tags: [{ tag: 'printing' }, { tag: 'quality' }, { tag: 'behind the scenes' }],
    source: 'seed' as const,
    content: lexicalFromBlocks([
      {
        type: 'paragraph',
        text: 'When we say your guests’ photos will still look brand new in twenty years, we mean it. The printing method is the reason.',
      },
      { type: 'heading', level: 2, text: 'What is dye-sublimation?' },
      {
        type: 'paragraph',
        text: 'Dye-sublimation uses heat to bond dye directly into the print surface. The colour becomes part of the material rather than sitting on top like inkjet ink. That means no cracking, no smearing when wet, and no fading from sunlight on a fridge door.',
      },
      { type: 'heading', level: 2, text: 'Inkjet vs sublimation at events' },
      {
        type: 'list',
        items: [
          'Inkjet: fast and cheap, but fades within months and smears with moisture',
          'Sublimation: slightly slower, with a professional gloss and archival durability',
          'Guest perception: sublimation feels like a product, not a party favour',
        ],
      },
      {
        type: 'paragraph',
        text: 'Every FrameFlix package includes sublimation prints loaded into custom fridge magnets. We would rather print fewer, better keepsakes than flood your event with strips that end up in the recycling bin.',
      },
    ]),
  },
  {
    title: 'Corporate Event Ideas: Branded Keepsakes That Employees Share',
    slug: 'corporate-event-branded-photobooth-ideas',
    excerpt:
      'Holiday parties, product launches, and team offsites. How custom fridge magnets and sticker stations get people talking.',
    category: 'trends' as const,
    author: 'FrameFlix Team',
    status: 'published' as const,
    publishedAt: '2026-02-05T10:00:00.000Z',
    metaDescription:
      'Corporate event photo booth ideas with branded fridge magnets and sticker stations. Drive engagement and organic social posts.',
    tags: [{ tag: 'corporate' }, { tag: 'branding' }, { tag: 'events' }],
    source: 'seed' as const,
    content: lexicalFromBlocks([
      {
        type: 'paragraph',
        text: 'Corporate events need more than an open bar to generate buzz. Branded fridge magnets give employees something to post, and a story to tell on LinkedIn Monday morning.',
      },
      { type: 'heading', level: 2, text: 'Your logo on the name plate, not generic strips' },
      {
        type: 'paragraph',
        text: 'We design around your brand guidelines: logo placement, colour palette, event hashtag. Every guest photo becomes something they take home. QR codes can link to an internal gallery or campaign page.',
      },
      { type: 'heading', level: 2, text: 'Sticker studio for team culture' },
      {
        type: 'paragraph',
        text: 'Our on-site sticker station lets guests create custom stickers with names, team inside jokes, or product mascots. It is lighter than a full magnet experience and a fit for mixers and trade-show booths.',
      },
      { type: 'heading', level: 2, text: 'What planners ask us most' },
      {
        type: 'list',
        items: [
          'Can you match our brand colours exactly? Yes. We send proofs before printing.',
          'Do you travel outside Kitchener-Waterloo? We serve Cambridge, Guelph, and beyond.',
          'How fast is setup? Our attendant handles everything. Coverage starts after setup.',
        ],
      },
    ]),
  },
  {
    title: 'Photobooth Timing: When to Run Yours During the Reception',
    slug: 'when-to-schedule-photobooth-reception',
    excerpt:
      'Cocktail hour, dinner, or dancing? The best window for guest participation without emptying the dance floor.',
    category: 'tips' as const,
    author: 'FrameFlix Team',
    status: 'published' as const,
    publishedAt: '2026-03-01T10:00:00.000Z',
    metaDescription:
      'When to schedule your wedding photobooth. Timing tips for cocktail hour, dinner, and reception flow.',
    tags: [{ tag: 'planning' }, { tag: 'wedding' }, { tag: 'timeline' }],
    source: 'seed' as const,
    content: lexicalFromBlocks([
      {
        type: 'paragraph',
        text: 'The right timing can double your participation rate. The wrong timing leaves you with an empty booth and a full dance floor, or the reverse.',
      },
      { type: 'heading', level: 2, text: 'Best windows we recommend' },
      {
        type: 'list',
        items: [
          'Cocktail hour: guests are mingling, energy is high, lines stay manageable',
          'Post-dinner, pre-dancing: after speeches, when people want an activity before the band',
          'Avoid during first dance or cake cutting unless you have a second attendant area',
        ],
      },
      { type: 'heading', level: 2, text: 'How long do you need?' },
      {
        type: 'paragraph',
        text: 'Our Essential and Premium packages include three hours of active booth time (setup excluded). For most weddings of 80 to 150 guests, that covers the peak window. Larger celebrations or all-day corporate events can extend with additional hours. Note it in your quote request.',
      },
      {
        type: 'paragraph',
        text: 'Your FrameFlix attendant manages line flow and helps shy guests jump in. That human touch matters more than you might think.',
      },
    ]),
  },
  {
    title: 'Sticker Studio vs Custom Frames: Which Experience Fits Your Event?',
    slug: 'sticker-studio-vs-custom-frames',
    excerpt:
      'Two ways to send guests home with something special. Compare sticker stations and custom fridge magnets for your celebration.',
    category: 'tips' as const,
    author: 'FrameFlix Team',
    status: 'published' as const,
    publishedAt: '2026-03-20T10:00:00.000Z',
    metaDescription:
      'Sticker studio or custom fridge magnets? Compare both FrameFlix experiences for weddings, parties, and corporate events.',
    tags: [{ tag: 'stickers' }, { tag: 'frames' }, { tag: 'planning' }],
    source: 'seed' as const,
    content: lexicalFromBlocks([
      {
        type: 'paragraph',
        text: 'FrameFlix offers two guest experiences, and many hosts combine both. Here is how to choose, or mix them, for your event.',
      },
      { type: 'heading', level: 2, text: 'Custom fridge magnets, the keepsake they display' },
      {
        type: 'paragraph',
        text: 'Best for weddings, anniversaries, and milestone birthdays where you want a display-worthy souvenir. Each guest receives their photo in a fridge magnet with a name plate for your event.',
      },
      { type: 'heading', level: 2, text: 'Sticker studio: fast, fun, shareable' },
      {
        type: 'paragraph',
        text: 'Ideal for corporate mixers, teen parties, and festivals. Guests create custom stickers on the spot with names, doodles, or hashtags, then slap them on laptops, water bottles, and notebooks.',
      },
      { type: 'heading', level: 2, text: 'Can you do both?' },
      {
        type: 'paragraph',
        text: 'Absolutely. Many Signature events run magnets for VIP guests and a sticker station for open networking. Request both in your quote and we will map the logistics.',
      },
    ]),
  },
]

