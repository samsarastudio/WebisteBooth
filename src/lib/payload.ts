import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_noStore as noStore } from 'next/cache'

import type { PricedAddOn, PricedPackage, PricingUnit } from './pricing'
import {
  defaultAddOns,
  defaultFaqs,
  defaultFrameStyles,
  defaultPackages,
  defaultSiteSettings,
} from '@/seed/defaults'
import { fallbackFrameStyles, type FrameStyleData } from '@/lib/brand-images'

export async function getPayloadClient() {
  return getPayload({ config })
}

function mapPackage(doc: {
  id: string | number
  name: string
  slug: string
  basePrice: number
  priceRange?: string | null
  frameSummary?: string | null
  description: string
  icon?: string | null
  features?: { item: string; id?: string | null }[] | null
  notIncluded?: { item: string; id?: string | null }[] | null
  popular?: boolean | null
}): PricedPackage {
  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
    basePrice: doc.basePrice,
    priceRange: doc.priceRange || 'Custom quote',
    frameSummary: doc.frameSummary || 'Guest frames',
    description: doc.description,
    icon: doc.icon,
    features: doc.features ?? [],
    notIncluded: doc.notIncluded ?? [],
    popular: doc.popular,
  }
}

function mapAddOn(doc: {
  id: string | number
  name: string
  slug: string
  price: number
  pricingUnit: PricingUnit
  description?: string | null
}): PricedAddOn {
  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
    price: doc.price,
    pricingUnit: doc.pricingUnit,
    description: doc.description,
  }
}

export async function getActivePackages(): Promise<PricedPackage[]> {
  noStore()
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'packages',
      where: { active: { equals: true } },
      sort: 'sortOrder',
      limit: 50,
      depth: 0,
    })
    if (result.docs.length === 0) {
      return defaultPackages.map((p, i) => mapPackage({ ...p, id: `fallback-${i}` }))
    }
    const signatureDef = defaultPackages.find((p) => p.slug === 'signature')

    return result.docs
      .filter((doc) => !String(doc.name).startsWith('[retired]'))
      .map((doc) => {
        const isLegacyEnterprise = doc.slug === 'enterprise' || doc.name === 'Enterprise'
        if (isLegacyEnterprise && signatureDef) {
          return mapPackage({
            id: doc.id,
            name: signatureDef.name,
            slug: signatureDef.slug,
            basePrice: signatureDef.basePrice,
            priceRange: signatureDef.priceRange,
            frameSummary: signatureDef.frameSummary,
            description: signatureDef.description,
            icon: signatureDef.icon,
            features: signatureDef.features,
            notIncluded: signatureDef.notIncluded,
            popular: signatureDef.popular,
          })
        }
        return mapPackage({
          id: doc.id,
          name: doc.name,
          slug: doc.slug,
          basePrice: doc.basePrice,
          priceRange: doc.priceRange,
          frameSummary: doc.frameSummary,
          description: doc.description,
          icon: doc.icon,
          features: doc.features,
          notIncluded: doc.notIncluded,
          popular: doc.popular,
        })
      })
  } catch {
    return defaultPackages.map((p, i) => mapPackage({ ...p, id: `fallback-${i}` }))
  }
}

function isPublicAddOn(name: string, slug: string) {
  const n = name.toLowerCase()
  const s = slug.toLowerCase()
  if (n.includes('travel') || n.includes('gta')) return false
  if (s.includes('travel') || s.includes('gta')) return false
  return true
}

export async function getActiveAddOns(): Promise<PricedAddOn[]> {
  noStore()
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'addons',
      where: { active: { equals: true } },
      sort: 'sortOrder',
      limit: 50,
      depth: 0,
    })
    if (result.docs.length === 0) {
      return defaultAddOns.map((a, i) => mapAddOn({ ...a, id: `fallback-${i}` }))
    }
    return result.docs
      .filter((doc) => isPublicAddOn(doc.name, doc.slug))
      .map((doc) =>
        mapAddOn({
          id: doc.id,
          name: doc.name,
          slug: doc.slug,
          price: doc.price,
          pricingUnit: doc.pricingUnit as PricingUnit,
          description: doc.description,
        }),
      )
  } catch {
    return defaultAddOns.map((a, i) => mapAddOn({ ...a, id: `fallback-${i}` }))
  }
}

export async function getActiveFrameStyles(): Promise<FrameStyleData[]> {
  noStore()
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'frame-styles',
      where: { active: { equals: true } },
      sort: 'sortOrder',
      limit: 5,
      depth: 0,
    })
    if (result.docs.length === 0) return fallbackFrameStyles()

    const stickeredDef = defaultFrameStyles.find((s) => s.slug === 'stickered-painted')

    return result.docs.slice(0, 5).map((doc) => {
      const isLegacyHandPainted =
        doc.slug === 'hand-painted' || doc.name === 'Hand Painted'
      if (isLegacyHandPainted && stickeredDef) {
        return {
          id: doc.id,
          name: stickeredDef.name,
          slug: stickeredDef.slug,
          tagline: stickeredDef.tagline,
          description: stickeredDef.description,
          sampleMessage: stickeredDef.sampleMessage,
          imagePath: stickeredDef.imagePath,
          plaColors: stickeredDef.plaColors.map((c) => ({
            name: c.name,
            hex: c.hex,
            role: c.role,
          })),
        }
      }
      return {
        id: doc.id,
        name: doc.name,
        slug: doc.slug,
        tagline: doc.tagline,
        description: doc.description,
        sampleMessage: doc.sampleMessage,
        imagePath: doc.imagePath,
        plaColors: (doc.plaColors || []).slice(0, 4).map((c) => ({
          name: c.name,
          hex: c.hex,
          role: c.role,
        })),
      }
    })
  } catch {
    return fallbackFrameStyles()
  }
}

export async function getActiveFaqs(): Promise<{ question: string; answer: string }[]> {
  noStore()
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'faqs',
      where: { active: { equals: true } },
      sort: 'sortOrder',
      limit: 50,
      depth: 0,
    })
    if (result.docs.length === 0) {
      return defaultFaqs.map((f) => ({ question: f.question, answer: f.answer }))
    }
    return result.docs.map((f) => ({
      question: f.question,
      answer: f.answer,
    }))
  } catch {
    return defaultFaqs.map((f) => ({ question: f.question, answer: f.answer }))
  }
}

export type SiteSettingsData = typeof defaultSiteSettings & {
  testimonials: { text: string; author: string }[]
  trustBadges: { icon: string; label: string }[]
}

function bool(value: boolean | null | undefined, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback
}

export async function getSiteSettings(): Promise<SiteSettingsData> {
  noStore()
  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    return {
      phone: settings.phone || defaultSiteSettings.phone,
      email: settings.email || defaultSiteSettings.email,
      serviceArea: settings.serviceArea || defaultSiteSettings.serviceArea,
      heroEyebrow: settings.heroEyebrow || defaultSiteSettings.heroEyebrow,
      heroTitle: settings.heroTitle || defaultSiteSettings.heroTitle,
      heroSubtitle: settings.heroSubtitle || defaultSiteSettings.heroSubtitle,
      testimonials: settings.testimonials?.length
        ? settings.testimonials.map((t) => ({ text: t.text, author: t.author }))
        : [],
      trustBadges: settings.trustBadges?.length
        ? settings.trustBadges.map((b) => ({ icon: b.icon, label: b.label }))
        : defaultSiteSettings.trustBadges,
      showAboutPage: bool(settings.showAboutPage, defaultSiteSettings.showAboutPage),
      showPackagesPage: bool(settings.showPackagesPage, defaultSiteSettings.showPackagesPage),
      showStickersPage: bool(settings.showStickersPage, defaultSiteSettings.showStickersPage),
      showGalleryPage: bool(settings.showGalleryPage, defaultSiteSettings.showGalleryPage),
      showFaqPage: bool(settings.showFaqPage, defaultSiteSettings.showFaqPage),
      showContactPage: bool(settings.showContactPage, defaultSiteSettings.showContactPage),
      showQuotePage: bool(settings.showQuotePage, defaultSiteSettings.showQuotePage),
      showTrustBar: bool(settings.showTrustBar, defaultSiteSettings.showTrustBar),
      showStylesSection: bool(settings.showStylesSection, defaultSiteSettings.showStylesSection),
      showProductStory: bool(settings.showProductStory, defaultSiteSettings.showProductStory),
      showHowItWorks: bool(settings.showHowItWorks, defaultSiteSettings.showHowItWorks),
      showPackagesSection: bool(
        settings.showPackagesSection,
        defaultSiteSettings.showPackagesSection,
      ),
      showLifestyleBanner: bool(
        settings.showLifestyleBanner,
        defaultSiteSettings.showLifestyleBanner,
      ),
      showGalleryPreview: bool(settings.showGalleryPreview, defaultSiteSettings.showGalleryPreview),
      showTestimonials: bool(settings.showTestimonials, defaultSiteSettings.showTestimonials),
      showFinalCta: bool(settings.showFinalCta, defaultSiteSettings.showFinalCta),
      showFrameCountOnHome: bool(
        settings.showFrameCountOnHome,
        defaultSiteSettings.showFrameCountOnHome,
      ),
      showPricing: bool(settings.showPricing, defaultSiteSettings.showPricing),
    }
  } catch {
    return defaultSiteSettings
  }
}

export type GalleryItem = {
  id: string | number
  caption?: string | null
  eventType?: string | null
  featured?: boolean | null
  imageUrl?: string | null
  alt?: string | null
}

export async function getGalleryItems(options?: {
  featuredOnly?: boolean
  limit?: number
}): Promise<GalleryItem[]> {
  noStore()
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'gallery',
      where: options?.featuredOnly ? { featured: { equals: true } } : undefined,
      sort: 'sortOrder',
      limit: options?.limit ?? 50,
      depth: 1,
    })

    return result.docs.map((doc) => {
      const image = typeof doc.image === 'object' && doc.image ? doc.image : null
      return {
        id: doc.id,
        caption: doc.caption,
        eventType: doc.eventType,
        featured: doc.featured,
        imageUrl: image?.url ?? null,
        alt: image?.alt ?? doc.caption ?? 'Gallery image',
      }
    })
  } catch {
    return []
  }
}
