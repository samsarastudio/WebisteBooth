export type LocalPhoto = {
  src: string
  alt: string
  caption: string
}

export type LocalSectionItem = {
  title: string
  description: string
}

export type LocalFaq = {
  question: string
  answer: string
}

export type LocalPageConfig = {
  /** URL path segment, e.g. photo-booth-kitchener */
  path: string
  metaTitle: string
  metaDescription: string
  h1: string
  intro: string
  photos: LocalPhoto[]
  frameOptions: LocalSectionItem[]
  stickerOptions: LocalSectionItem[]
  eventTypes: LocalSectionItem[]
  setupSteps: LocalSectionItem[]
  nearbyAreas: string[]
  faqs: LocalFaq[]
  testimonial?: {
    quote: string
    attribution: string
  }
  relatedPages: { href: string; label: string }[]
  /** Schema.org locality */
  schemaCity: string
  schemaRegion: string
  serviceName: string
  serviceDescription: string
}
