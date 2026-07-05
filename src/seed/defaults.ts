export const HOURS_LINE = '3 hours coverage (excluding setup time)'
export const FRAMES_60 = '60 guest photo frames'
export const FRAMES_120 = '120 guest photo frames'
export const FRAMES_LINE = FRAMES_60
export const ONLINE_PHOTOS_LINE =
  'Online digital photos available for download — access expires after 3 months'

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
      { item: ONLINE_PHOTOS_LINE },
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
      'Fully tailored for larger celebrations, branded events, or anything beyond our standard packages.',
    icon: '✦',
    features: [
      { item: 'Coverage hours tailored to your event' },
      { item: 'Custom guest frame count' },
      { item: ATTENDANT_LINE },
      { item: 'Custom frame design with your approval' },
      { item: 'Multi-day or multi-venue options' },
      { item: ONLINE_PHOTOS_LINE },
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
      'Digital photos from your event are available online for download for 3 months from your event date. After that, gallery access expires — we recommend downloading favorites before the 3-month window ends.',
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
    { icon: '☁️', label: 'Online photos 3 mo' },
    { icon: '✨', label: 'Fully custom' },
  ],
  // Pages
  showAboutPage: true,
  showPackagesPage: true,
  showStickersPage: true,
  showGalleryPage: true,
  showFaqPage: true,
  showContactPage: true,
  showQuotePage: true,
  // Home sections
  showTrustBar: true,
  showStylesSection: true,
  showProductStory: true,
  showHowItWorks: true,
  showPackagesSection: true,
  showLifestyleBanner: true,
  showGalleryPreview: true,
  showTestimonials: false,
  showFinalCta: true,
  showFrameCountOnHome: false,
  showPricing: false,
}
