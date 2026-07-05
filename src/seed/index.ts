import type { Payload } from 'payload'

import {
  defaultAddOns,
  defaultFaqs,
  defaultFrameStyles,
  defaultPackages,
  defaultSiteSettings,
} from './defaults'

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

export async function seedIfEmpty(payload: Payload) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await runSeed(payload)
      await syncPackages(payload)
      await syncAddOns(payload)
      await syncFrameStyles(payload)
      await syncFaqs(payload)
      await syncSiteSettings(payload)
      return
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      if (!message.includes('no such table') || attempt === 4) {
        payload.logger.error(`Seed failed: ${message}`)
        return
      }
      await sleep(500 * (attempt + 1))
    }
  }
}

async function runSeed(payload: Payload) {
  const packages = await payload.count({ collection: 'packages' })
  if (packages.totalDocs === 0) {
    for (const pkg of defaultPackages) {
      await payload.create({ collection: 'packages', data: pkg })
    }
    payload.logger.info('Seeded packages')
  }

  const addons = await payload.count({ collection: 'addons' })
  if (addons.totalDocs === 0) {
    for (const addon of defaultAddOns) {
      await payload.create({ collection: 'addons', data: addon })
    }
    payload.logger.info('Seeded add-ons')
  }

  const styles = await payload.count({ collection: 'frame-styles' })
  if (styles.totalDocs === 0) {
    for (const style of defaultFrameStyles) {
      await payload.create({ collection: 'frame-styles', data: style })
    }
    payload.logger.info('Seeded frame styles')
  }

  const faqs = await payload.count({ collection: 'faqs' })
  if (faqs.totalDocs === 0) {
    for (const faq of defaultFaqs) {
      await payload.create({ collection: 'faqs', data: faq })
    }
    payload.logger.info('Seeded FAQs')
  }

  const settings = await payload.findGlobal({ slug: 'site-settings' })
  if (!settings.testimonials?.length) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: defaultSiteSettings,
    })
    payload.logger.info('Seeded site settings')
  }
}

async function syncPackages(payload: Payload) {
  const result = await payload.find({ collection: 'packages', limit: 50, depth: 0 })

  // Rename Enterprise → Signature in place when needed
  const enterprise = result.docs.find((d) => d.slug === 'enterprise')
  const signatureDef = defaultPackages.find((d) => d.slug === 'signature')
  if (enterprise && signatureDef) {
    const existingSignature = result.docs.find((d) => d.slug === 'signature')
    if (!existingSignature) {
      await payload.update({
        collection: 'packages',
        id: enterprise.id,
        data: {
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
          active: true,
          sortOrder: signatureDef.sortOrder,
        },
      })
      payload.logger.info('Renamed Enterprise package to Signature')
    } else {
      await payload.update({
        collection: 'packages',
        id: enterprise.id,
        data: { active: false },
      })
    }
  }

  const refreshed = await payload.find({ collection: 'packages', limit: 50, depth: 0 })
  for (const def of defaultPackages) {
    const found = refreshed.docs.find((d) => d.slug === def.slug)
    if (!found) {
      await payload.create({ collection: 'packages', data: def })
      payload.logger.info(`Added package: ${def.name}`)
    } else {
      await payload.update({
        collection: 'packages',
        id: found.id,
        data: {
          name: def.name,
          basePrice: def.basePrice,
          priceRange: def.priceRange,
          frameSummary: def.frameSummary,
          description: def.description,
          icon: def.icon,
          features: def.features,
          notIncluded: def.notIncluded,
          popular: def.popular,
          active: true,
          sortOrder: def.sortOrder,
        },
      })
    }
  }
}

async function syncAddOns(payload: Payload) {
  const existing = await payload.find({ collection: 'addons', limit: 50, depth: 0 })

  // Retire old / unwanted add-ons (never show travel/GTA options publicly)
  for (const addon of existing.docs) {
    const name = (addon.name || '').toLowerCase()
    const slug = (addon.slug || '').toLowerCase()
    const retire =
      slug === 'extra-frames' ||
      slug === 'travel-beyond-gta' ||
      slug === 'extended-service-area' ||
      name.includes('travel') ||
      name.includes('gta') ||
      slug.includes('travel') ||
      slug.includes('gta')
    if (retire) {
      try {
        await payload.delete({
          collection: 'addons',
          id: addon.id,
        })
        payload.logger.info(`Deleted add-on: ${addon.name}`)
      } catch {
        await payload.update({
          collection: 'addons',
          id: addon.id,
          data: { active: false, name: `[retired] ${addon.name}` },
        })
        payload.logger.info(`Retired add-on: ${addon.name}`)
      }
    }
  }

  for (const addon of defaultAddOns) {
    const found = existing.docs.find((d) => d.slug === addon.slug)
    if (!found) {
      await payload.create({ collection: 'addons', data: addon })
      payload.logger.info(`Added add-on: ${addon.name}`)
    } else {
      await payload.update({
        collection: 'addons',
        id: found.id,
        data: {
          name: addon.name,
          price: addon.price,
          pricingUnit: addon.pricingUnit,
          description: addon.description,
          active: true,
          sortOrder: addon.sortOrder,
        },
      })
    }
  }
}

async function syncFrameStyles(payload: Payload) {
  const existing = await payload.find({
    collection: 'frame-styles',
    limit: 20,
    depth: 0,
  })

  // Migrate Hand Painted → Stickered & Painted
  const handPainted = existing.docs.find((d) => d.slug === 'hand-painted')
  const stickeredDef = defaultFrameStyles.find((d) => d.slug === 'stickered-painted')
  if (handPainted && stickeredDef) {
    const already = existing.docs.find((d) => d.slug === 'stickered-painted')
    if (!already) {
      await payload.update({
        collection: 'frame-styles',
        id: handPainted.id,
        data: {
          name: stickeredDef.name,
          slug: stickeredDef.slug,
          tagline: stickeredDef.tagline,
          description: stickeredDef.description,
          sampleMessage: stickeredDef.sampleMessage,
          imagePath: stickeredDef.imagePath,
          plaColors: stickeredDef.plaColors,
          sortOrder: stickeredDef.sortOrder,
          active: true,
        },
      })
      payload.logger.info('Renamed Hand Painted to Stickered & Painted')
    } else {
      await payload.update({
        collection: 'frame-styles',
        id: handPainted.id,
        data: { active: false },
      })
    }
  }

  const refreshedStyles = await payload.find({
    collection: 'frame-styles',
    limit: 20,
    depth: 0,
  })

  for (const style of defaultFrameStyles) {
    const found = refreshedStyles.docs.find((d) => d.slug === style.slug)
    if (!found) {
      const activeCount = refreshedStyles.docs.filter((d) => d.active).length
      if (activeCount >= 5) break
      await payload.create({ collection: 'frame-styles', data: style })
      payload.logger.info(`Added frame style: ${style.name}`)
    } else {
      await payload.update({
        collection: 'frame-styles',
        id: found.id,
        data: {
          name: style.name,
          tagline: style.tagline,
          description: style.description,
          sampleMessage: style.sampleMessage,
          imagePath: style.imagePath,
          plaColors: style.plaColors,
          sortOrder: style.sortOrder,
          active: true,
        },
      })
    }
  }
}

async function syncFaqs(payload: Payload) {
  // Retire old GTA travel FAQ title if present
  const oldTravel = await payload.find({
    collection: 'faqs',
    where: { question: { equals: 'Do you travel outside of the GTA?' } },
    limit: 1,
  })
  if (oldTravel.totalDocs > 0) {
    await payload.update({
      collection: 'faqs',
      id: oldTravel.docs[0].id,
      data: { active: false },
    })
  }

  for (const question of [
    'How long is each package?',
    'What colors can you print?',
    'How many photo frames are included?',
    'How long are online photos available?',
    'Where do you host events?',
    'Do you provide an attendant at the event?',
  ]) {
    const found = await payload.find({
      collection: 'faqs',
      where: { question: { equals: question } },
      limit: 1,
    })
    const def = defaultFaqs.find((f) => f.question === question)
    if (!def) continue
    if (found.totalDocs === 0) {
      await payload.create({ collection: 'faqs', data: def })
    } else {
      await payload.update({
        collection: 'faqs',
        id: found.docs[0].id,
        data: { answer: def.answer, sortOrder: def.sortOrder, active: true },
      })
    }
  }
}

async function syncSiteSettings(payload: Payload) {
  const current = await payload.findGlobal({ slug: 'site-settings' })
  const email =
    !current.email || current.email === 'hello@frameflixstudio.com'
      ? defaultSiteSettings.email
      : current.email

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      email,
      heroSubtitle: defaultSiteSettings.heroSubtitle,
      trustBadges: defaultSiteSettings.trustBadges,
      serviceArea: defaultSiteSettings.serviceArea,
      // Only force testimonials off if still empty / never configured
      showTestimonials:
        typeof current.showTestimonials === 'boolean'
          ? current.showTestimonials
          : false,
      showFrameCountOnHome:
        typeof current.showFrameCountOnHome === 'boolean'
          ? current.showFrameCountOnHome
          : false,
      showPricing:
        typeof current.showPricing === 'boolean' ? current.showPricing : false,
      testimonials: current.testimonials?.length ? current.testimonials : [],
    },
  })
}
