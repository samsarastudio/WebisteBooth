import { lexicalFromBlocks } from '@/lib/lexical-content'

export const HOURS_LINE = '3 hours coverage (excluding setup time)'
export const FRAMES_60 = '60 guest photo frames'
export const FRAMES_120 = '120 guest photo frames'
export const FRAMES_LINE = FRAMES_60
export const ONLINE_PHOTOS_LINE =
  'Online digital photos available for download — access expires after 3 months'
export const ONLINE_PHOTOS_PREMIUM =
  'Online digital photos available for download — access up to 1 year'
export const ONLINE_PHOTOS_RETENTION_NOTE = 'Extended retention plans available on request'
export const ONLINE_PHOTOS_SIGNATURE =
  'Online gallery access tailored to your event — discuss options with us'

export const ATTENDANT_LINE =
  'On-site attendant included — we set up, run the booth, and tear down'

export const defaultPackages = [
  {
    name: 'Essential',
    slug: 'essential',
    basePrice: 49500,
    priceRange: '$495–$695',
    frameSummary: '60 guest frames',
    description: 'Ideal for birthdays and smaller gatherings — we run the booth so you can enjoy the party.',
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
    description: 'Our most popular — more guest frames, fully handled from setup to teardown.',
    icon: '✨',
    features: [
      { item: HOURS_LINE },
      { item: FRAMES_120 },
      { item: ATTENDANT_LINE },
      { item: 'Dye-sublimation prints (waterproof, fade-proof)' },
      { item: 'Custom frame design + QR code insert' },
      { item: 'Guest engagement & crowd support' },
      { item: ONLINE_PHOTOS_PREMIUM },
      { item: ONLINE_PHOTOS_RETENTION_NOTE },
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
      'Completely custom tailored — if our packages are not the right fit, we would love to hear from you.',
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
      'Unlike traditional photobooths that print strips on the spot, we pre-design and 3D-print custom frames for your event. At your event, guests pose for photos that are dye-sublimation printed and inserted into their personalized frame — creating a premium keepsake they\'ll actually keep.',
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
      'We recommend booking at least 2-3 months in advance for weddings and peak season events. For corporate events and birthdays, 4-6 weeks usually works. We do accommodate rush requests — just call us!',
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
      "Absolutely! Choose one of our 4 upgraded styles, then personalize names and messages. Share your theme and we'll send a proof before printing.",
    active: true,
    sortOrder: 5,
  },
  {
    question: 'What colors can you print?',
    answer:
      'Each style has its own color palette for a clean, consistent look. Browse styles on our site or in your quote request to find the perfect match.',
    active: true,
    sortOrder: 6,
  },
  {
    question: 'How many photo frames are included?',
    answer:
      'Essential includes 60 guest frames and Premium includes about 120. Signature is fully custom for larger or unique events. Need more frames? Request extra 20-packs in your quote — final numbers are confirmed in your proposal.',
    active: true,
    sortOrder: 7,
  },
  {
    question: 'How long are online photos available?',
    answer:
      'Essential includes 3 months of online gallery access. Premium includes access up to 1 year, with extended retention plans available on request. Signature packages are fully custom — we will tailor online access to your event when we plan together.',
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
      "Of course! Check out our gallery for real event photos, or email us and we'll send sample designs based on your event theme.",
    active: true,
    sortOrder: 12,
  },
  {
    question: 'Do you provide an attendant at the event?',
    answer:
      'Yes — every package includes an on-site attendant. We set up, run the booth, help your guests, and tear down so you can enjoy the event.',
    active: true,
    sortOrder: 13,
  },
]

/** Frame styles shown on the public site. */
export const defaultFrameStyles = [
  {
    name: 'Romance',
    slug: 'romance',
    tagline: '3D raised details · weddings',
    description: 'Raised 3D-printed accents on the frame. Guests take home their photo in a classic keepsake.',
    sampleMessage: 'Anna & Stephen',
    imagePath: '/brand/style-romance-photo.png',
    plaColors: [
      { name: 'White', hex: '#F4F1EA', role: 'base' as const },
      { name: 'Yellow', hex: '#E8D36A', role: 'accent' as const },
    ],
    active: true,
    sortOrder: 1,
  },
  {
    name: 'Celebration',
    slug: 'celebration',
    tagline: '3D raised details · birthdays',
    description: 'Raised 3D-printed accents. A fun party favor your guests will keep.',
    sampleMessage: 'With love — Mia',
    imagePath: '/brand/style-celebration-photo.png',
    plaColors: [
      { name: 'White', hex: '#F7F5F0', role: 'base' as const },
      { name: 'Pink', hex: '#E85A8C', role: 'accent' as const },
      { name: 'Yellow', hex: '#F0C44A', role: 'detail' as const },
    ],
    active: true,
    sortOrder: 2,
  },
  {
    name: 'Modern',
    slug: 'modern',
    tagline: '3D raised details · events',
    description: 'Raised 3D-printed accents with a clean, minimal look for every guest.',
    sampleMessage: 'Anna & Stephen',
    imagePath: '/brand/style-modern-photo.png',
    plaColors: [
      { name: 'White', hex: '#F2F2F0', role: 'base' as const },
      { name: 'Black', hex: '#2B2B2B', role: 'text' as const },
      { name: 'Gray', hex: '#8A8F96', role: 'detail' as const },
    ],
    active: true,
    sortOrder: 3,
  },
  {
    name: 'Garden',
    slug: 'garden',
    tagline: '3D raised details · anniversaries',
    description: 'Raised 3D-printed botanical accents. Soft keepsakes for anniversary guests.',
    sampleMessage: 'With love — Anna & Stephen',
    imagePath: '/brand/style-garden-photo.png',
    plaColors: [
      { name: 'Cream', hex: '#F3EDE2', role: 'base' as const },
      { name: 'Green', hex: '#8FA88A', role: 'accent' as const },
      { name: 'Pink', hex: '#E8B4C0', role: 'detail' as const },
    ],
    active: true,
    sortOrder: 4,
  },
  {
    name: 'Stickered & Painted',
    slug: 'stickered-painted',
    tagline: 'Painted / sticker finish',
    description:
      'Decorations are painted or stickered onto the frame (not raised 3D print). A softer, hand-finished look for your guests.',
    sampleMessage: 'With love — Anna & Stephen',
    imagePath: '/brand/stickered-wedding-1.png',
    plaColors: [
      { name: 'Cream', hex: '#F4F1EA', role: 'base' as const },
      { name: 'Green', hex: '#5F7A52', role: 'accent' as const },
      { name: 'Pink', hex: '#E8B4C0', role: 'detail' as const },
    ],
    active: true,
    sortOrder: 5,
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
  phone: '(416) 555-1234',
  email: 'frameflix@inmoment.com',
  serviceArea: 'Kitchener, Cambridge, Waterloo, Guelph & beyond',
  heroEyebrow: 'Frames & sticker experiences',
  heroTitle: 'Souvenirs Your Guests Will Actually Keep',
  heroSubtitle:
    'Personalized photo frames and on-site custom stickers — two ways to send every guest home with something special.',
  testimonials: [] as { text: string; author: string }[],
  trustBadges: [
    { icon: '⏱️', label: '3 hrs coverage' },
    { icon: '🙋', label: 'Attendant included' },
    { icon: '☁️', label: 'Online photos up to 1 yr' },
    { icon: '✨', label: 'Fully custom' },
  ],
  // Pages
  showAboutPage: true,
  showPackagesPage: true,
  showStickersPage: true,
  showGalleryPage: true,
  showBlogPage: true,
  showFaqPage: true,
  showContactPage: true,
  showQuotePage: true,
  showDesignPage: true,
  // Home sections
  showTrustBar: true,
  showStylesSection: true,
  showProductStory: true,
  showHowItWorks: true,
  showPackagesSection: true,
  showEventOrganisersSection: true,
  eventOrganisersTitle: 'We would love to be part of your success stories',
  eventOrganisersBody:
    'Partner with FrameFlix for weddings, corporate activations, and milestone events — branded keepsakes your guests share long after the night ends.',
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
      'Paper strips fade in weeks. Custom 3D-printed frames with dye-sublimation prints last decades — and guests actually display them.',
    category: 'tips' as const,
    author: 'FrameFlix Team',
    status: 'published' as const,
    publishedAt: '2025-11-15T10:00:00.000Z',
    metaDescription:
      'Discover why personalized photobooth keepsakes outperform paper strips at weddings and events — durability, design, and guest delight.',
    tags: [{ tag: 'photobooth' }, { tag: 'keepsakes' }, { tag: 'wedding favors' }],
    source: 'seed' as const,
    content: lexicalFromBlocks([
      {
        type: 'paragraph',
        text: 'Walk through any wedding after-party and you will find crumpled photobooth strips in purses, on dashboards, or forgotten in coat pockets. They were fun in the moment — but they rarely survive the week.',
      },
      {
        type: 'paragraph',
        text: 'FrameFlix was built around a different idea: give every guest a souvenir they will actually keep. That means a custom-designed frame with their photo inside — printed with dye-sublimation so it will not fade, smear, or tear.',
      },
      { type: 'heading', level: 2, text: 'What makes a keepsake worth keeping?' },
      {
        type: 'list',
        items: [
          'Durability — dye-sublimation prints are waterproof and fade-proof for 20+ years',
          'Personalization — names, dates, and themes baked into the frame design',
          'Display-ready — guests take home something they put on a shelf or fridge',
          'Premium feel — translucent 3D-printed frames feel intentional, not disposable',
        ],
      },
      { type: 'heading', level: 2, text: 'The guest experience difference' },
      {
        type: 'paragraph',
        text: 'At a traditional booth, guests grab a strip and move on. With FrameFlix, they pose, pick up a finished frame minutes later, and leave with a memento tied to your celebration. Hosts tell us guests still mention the frames months later — that is the kind of word-of-mouth marketing money cannot buy.',
      },
      {
        type: 'paragraph',
        text: 'Planning a wedding, milestone birthday, or corporate celebration in Kitchener, Waterloo, Cambridge, or Guelph? Request a quote and we will help you design frames your guests will treasure.',
      },
    ]),
  },
  {
    title: '10 Wedding Guest Favor Ideas Guests Will Actually Use',
    slug: 'wedding-guest-favors-guests-actually-keep',
    excerpt:
      'Skip the trinkets that end up in a drawer. From custom photo frames to on-site stickers, here are favors that create real memories.',
    category: 'events' as const,
    author: 'FrameFlix Team',
    status: 'published' as const,
    publishedAt: '2025-12-01T10:00:00.000Z',
    metaDescription:
      'Ten wedding guest favor ideas that guests love and keep — including personalized photobooth frames and live sticker stations.',
    tags: [{ tag: 'wedding' }, { tag: 'guest favors' }, { tag: 'planning' }],
    source: 'seed' as const,
    content: lexicalFromBlocks([
      {
        type: 'paragraph',
        text: 'The best wedding favors are not the cheapest — they are the ones guests talk about on the drive home. If you are tired of koozies and mini succulents collecting dust, consider favors that connect to the experience of your day.',
      },
      { type: 'heading', level: 2, text: 'Favors that create memories' },
      {
        type: 'list',
        items: [
          'Personalized photobooth frames with each guest’s photo inside',
          'On-site custom sticker station — names, inside jokes, wedding hashtag',
          'Instant photo magnets with a designed border matching your palette',
          'Mini recipe cards from family favorites, printed beautifully',
          'Local honey or jam with a custom label featuring your monogram',
        ],
      },
      { type: 'heading', level: 2, text: 'Why photo keepsakes win' },
      {
        type: 'paragraph',
        text: 'Photos are the one thing every guest already wants from your wedding. A custom frame turns that desire into a physical object they display for years. Unlike digital galleries alone, a frame on a mantle keeps your celebration visible long after the last dance.',
      },
      { type: 'heading', level: 2, text: 'Timing tips for your reception' },
      {
        type: 'paragraph',
        text: 'Schedule your photobooth during cocktail hour or early reception when energy is high and lines stay short. Our attendant handles setup and flow so you never worry about a backup. Three hours of coverage is included in every package — enough for most celebrations without rushing guests.',
      },
    ]),
  },
  {
    title: 'How Dye-Sublimation Printing Makes Photos Last a Lifetime',
    slug: 'dye-sublimation-photobooth-prints-explained',
    excerpt:
      'Not all event prints are equal. Learn why dye-sublimation beats inkjet for keepsakes you want to last 20 years.',
    category: 'studio' as const,
    author: 'FrameFlix Team',
    status: 'published' as const,
    publishedAt: '2026-01-10T10:00:00.000Z',
    metaDescription:
      'Dye-sublimation vs inkjet for event photos — why FrameFlix uses sublimation for waterproof, fade-proof guest keepsakes.',
    tags: [{ tag: 'printing' }, { tag: 'quality' }, { tag: 'behind the scenes' }],
    source: 'seed' as const,
    content: lexicalFromBlocks([
      {
        type: 'paragraph',
        text: 'When we say your guests’ photos will still look brand new in twenty years, we mean it — and the printing method is the reason.',
      },
      { type: 'heading', level: 2, text: 'What is dye-sublimation?' },
      {
        type: 'paragraph',
        text: 'Dye-sublimation uses heat to bond dye directly into the print surface. The color becomes part of the material rather than sitting on top like inkjet ink. That means no cracking, no smearing when wet, and no fading from sunlight on a fridge door.',
      },
      { type: 'heading', level: 2, text: 'Inkjet vs sublimation at events' },
      {
        type: 'list',
        items: [
          'Inkjet: fast and cheap, but fades within months and smears with moisture',
          'Sublimation: slightly slower, but professional gloss and archival durability',
          'Guest perception: sublimation feels like a product, not a party favor',
        ],
      },
      {
        type: 'paragraph',
        text: 'Every FrameFlix package includes sublimation prints paired with custom 3D-printed frames. We would rather print fewer, better keepsakes than flood your event with strips that end up in the recycling bin.',
      },
    ]),
  },
  {
    title: 'Corporate Event Ideas: Branded Keepsakes That Employees Share',
    slug: 'corporate-event-branded-photobooth-ideas',
    excerpt:
      'Holiday parties, product launches, and team offsites — how custom frames and sticker stations boost engagement and social sharing.',
    category: 'trends' as const,
    author: 'FrameFlix Team',
    status: 'published' as const,
    publishedAt: '2026-02-05T10:00:00.000Z',
    metaDescription:
      'Corporate event photobooth ideas with branded frames and sticker stations — drive engagement and organic social posts.',
    tags: [{ tag: 'corporate' }, { tag: 'branding' }, { tag: 'events' }],
    source: 'seed' as const,
    content: lexicalFromBlocks([
      {
        type: 'paragraph',
        text: 'Corporate events need more than a open bar to generate buzz. Branded keepsakes give employees something to post — and a story to tell on LinkedIn Monday morning.',
      },
      { type: 'heading', level: 2, text: 'Frames with your logo, not generic strips' },
      {
        type: 'paragraph',
        text: 'We design frames around your brand guidelines — logo placement, color palette, event hashtag — so every guest photo becomes shareable marketing. QR codes can link to an internal gallery or campaign landing page.',
      },
      { type: 'heading', level: 2, text: 'Sticker studio for team culture' },
      {
        type: 'paragraph',
        text: 'Our on-site sticker station lets guests create custom stickers with names, team inside jokes, or product mascots. It is lighter than a full frame experience but perfect for mixers and trade-show booths.',
      },
      { type: 'heading', level: 2, text: 'What planners ask us most' },
      {
        type: 'list',
        items: [
          'Can you match our brand colors exactly? Yes — we send proofs before printing.',
          'Do you travel outside Kitchener-Waterloo? We serve Cambridge, Guelph, and beyond.',
          'How fast is setup? Our attendant handles everything; coverage starts after setup.',
        ],
      },
    ]),
  },
  {
    title: 'Photobooth Timing: When to Run Yours During the Reception',
    slug: 'when-to-schedule-photobooth-reception',
    excerpt:
      'Cocktail hour vs dinner vs dancing — the best window for maximum guest participation without killing the dance floor.',
    category: 'tips' as const,
    author: 'FrameFlix Team',
    status: 'published' as const,
    publishedAt: '2026-03-01T10:00:00.000Z',
    metaDescription:
      'When to schedule your wedding photobooth — timing tips for cocktail hour, dinner, and reception flow.',
    tags: [{ tag: 'planning' }, { tag: 'wedding' }, { tag: 'timeline' }],
    source: 'seed' as const,
    content: lexicalFromBlocks([
      {
        type: 'paragraph',
        text: 'The right timing can double your participation rate. The wrong timing leaves you with an empty booth and a full dance floor — or the reverse.',
      },
      { type: 'heading', level: 2, text: 'Best windows we recommend' },
      {
        type: 'list',
        items: [
          'Cocktail hour — guests are mingling, energy is high, lines stay manageable',
          'Post-dinner, pre-dancing — after speeches when people need a activity before the band',
          'Avoid: during first dance or cake cutting unless you have a second attendant area',
        ],
      },
      { type: 'heading', level: 2, text: 'How long do you need?' },
      {
        type: 'paragraph',
        text: 'Our Essential and Premium packages include three hours of active booth time (setup excluded). For most weddings of 80–150 guests, that covers the peak window. Larger celebrations or all-day corporate events can extend with additional hours — just note it in your quote request.',
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
      'Two ways to send guests home with something special — compare sticker stations and 3D-printed photo frames for your celebration.',
    category: 'tips' as const,
    author: 'FrameFlix Team',
    status: 'published' as const,
    publishedAt: '2026-03-20T10:00:00.000Z',
    metaDescription:
      'Sticker studio or custom photobooth frames? Compare both FrameFlix experiences for weddings, parties, and corporate events.',
    tags: [{ tag: 'stickers' }, { tag: 'frames' }, { tag: 'planning' }],
    source: 'seed' as const,
    content: lexicalFromBlocks([
      {
        type: 'paragraph',
        text: 'FrameFlix offers two distinct guest experiences — and many hosts combine both. Here is how to choose (or mix) them for your event.',
      },
      { type: 'heading', level: 2, text: 'Custom frames — the premium keepsake' },
      {
        type: 'paragraph',
        text: 'Best for weddings, anniversaries, and milestone birthdays where you want a display-worthy souvenir. Each guest receives their photo in a personalized 3D-printed frame designed for your theme.',
      },
      { type: 'heading', level: 2, text: 'Sticker studio — fast, fun, shareable' },
      {
        type: 'paragraph',
        text: 'Ideal for corporate mixers, teen parties, and festivals. Guests create custom stickers on the spot — names, doodles, hashtags — and slap them on laptops, water bottles, and notebooks.',
      },
      { type: 'heading', level: 2, text: 'Can you do both?' },
      {
        type: 'paragraph',
        text: 'Absolutely. Many Signature events run frames for VIP guests and a sticker station for open networking. Request both in your quote and we will map the logistics.',
      },
    ]),
  },
]

