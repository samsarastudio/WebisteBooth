import type { LeadFormState } from '@/lib/lead-form'
import { getPayloadClient } from '@/lib/payload'
import { calculateEstimate, type PricingUnit } from '@/lib/pricing'
import { sendLeadEmails } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'

type HeaderStore = {
  get(name: string): string | null
}

export async function submitLeadFromFormData(
  formData: FormData,
  headerStore: HeaderStore,
): Promise<LeadFormState> {
  const honeypot = String(formData.get('website') || '')
  if (honeypot) {
    return { ok: true, inquiryId: `FF-${Date.now()}` }
  }

  const ip =
    headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headerStore.get('x-real-ip') ||
    'unknown'

  const limited = rateLimit(`lead:${ip}`, 5, 60_000)
  if (!limited.ok) {
    return { ok: false, error: 'Too many requests. Please wait a minute and try again.' }
  }

  const name = String(formData.get('name') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const phone = String(formData.get('phone') || '').trim()
  const eventType = String(formData.get('eventType') || '').trim()
  const eventDate = String(formData.get('eventDate') || '').trim()
  const guestCount = String(formData.get('guestCount') || '').trim()
  const message = String(formData.get('message') || '').trim()
  const packageId = String(formData.get('packageId') || '').trim()
  const frameStyleId = String(formData.get('frameStyleId') || '').trim()
  const frameFormatRaw = String(formData.get('frameFormat') || 'polaroid').trim()
  const frameFormat = frameFormatRaw === '4x6' ? '4x6' : 'polaroid'
  const frameFormatLabel = frameFormat === '4x6' ? '4×6 frame (premium size)' : 'Polaroid style'
  const selectedRaw = String(formData.get('selectedAddOns') || '[]')

  if (!name || !email || !phone || !eventType || !eventDate) {
    return { ok: false, error: 'Name, email, phone, event type, and date are required.' }
  }

  const intent = String(formData.get('intent') || 'contact')
  const intentValue = intent === 'quote' ? 'quote' : 'contact'
  const serviceTypeRaw = String(formData.get('serviceType') || 'frames').trim()
  const serviceType =
    serviceTypeRaw === 'stickers' || serviceTypeRaw === 'both' ? serviceTypeRaw : 'frames'
  const wantsFrames = serviceType === 'frames' || serviceType === 'both'

  if (intent === 'quote' && wantsFrames) {
    if (!packageId) {
      return { ok: false, error: 'Please choose a package.' }
    }
    if (!frameStyleId) {
      return { ok: false, error: 'Please choose a frame style.' }
    }
    if (!frameFormatRaw) {
      return { ok: false, error: 'Please choose a frame format.' }
    }
  }

  if (!email.includes('@')) {
    return { ok: false, error: 'Please provide a valid email address.' }
  }

  const privacyConsent = String(formData.get('privacyConsent') || '').trim()
  if (privacyConsent !== '1') {
    return {
      ok: false,
      error: 'Please agree to the Privacy Policy to submit your inquiry.',
    }
  }

  let selected: { id: string; quantity: number }[] = []
  try {
    selected = JSON.parse(selectedRaw)
  } catch {
    return { ok: false, error: 'Invalid add-on selection.' }
  }

  try {
    const payload = await getPayloadClient()

    const [packages, addons, styles] = await Promise.all([
      payload.find({
        collection: 'packages',
        where: { active: { equals: true } },
        limit: 50,
        depth: 0,
      }),
      payload.find({
        collection: 'addons',
        where: { active: { equals: true } },
        limit: 50,
        depth: 0,
      }),
      payload.find({
        collection: 'frame-styles',
        where: { active: { equals: true } },
        limit: 4,
        depth: 0,
      }),
    ])

    const pkg = packages.docs.find((p) => String(p.id) === packageId) || null
    const style = styles.docs.find((s) => String(s.id) === frameStyleId) || null
    const styleColors =
      style?.plaColors
        ?.slice(0, 4)
        .map((c) => c.name)
        .join(', ') || undefined
    const pricedAddons = addons.docs.map((a) => ({
      id: a.id,
      name: a.name,
      slug: a.slug,
      price: a.price,
      pricingUnit: a.pricingUnit as PricingUnit,
      description: a.description,
    }))

    const estimate = calculateEstimate(
      pkg
        ? {
            id: pkg.id,
            name: pkg.name,
            slug: pkg.slug,
            basePrice: pkg.basePrice ?? 0,
            priceRange: pkg.priceRange || 'Custom quote',
            frameSummary: pkg.frameSummary || 'Guest frames',
            description: pkg.description,
            features: pkg.features ?? [],
            notIncluded: pkg.notIncluded ?? [],
            popular: pkg.popular,
          }
        : null,
      pricedAddons,
      selected,
    )

    const inquiryId = `FF-${Date.now()}`

    await payload.create({
      collection: 'leads',
      data: {
        intent: intentValue,
        serviceType,
        name,
        email,
        phone,
        eventType,
        eventDate,
        guestCount: guestCount || undefined,
        message: message || undefined,
        package: pkg?.id ?? undefined,
        packageName: pkg?.name,
        packagePrice: pkg?.basePrice ?? 0,
        frameStyle: style?.id ?? undefined,
        frameStyleName: style?.name,
        frameStyleColors: styleColors,
        frameFormat,
        frameFormatLabel,
        selectedAddOns: estimate.addOnLines.map((line) => ({
          addonId: String(line.id),
          name: line.name,
          price: line.price,
          pricingUnit: line.pricingUnit,
          quantity: line.quantity,
          lineTotal: line.lineTotal,
        })),
        estimatedTotal: estimate.total,
        status: 'new',
        inquiryId,
        privacyConsentAt: new Date().toISOString(),
      },
    })

    const serviceLabel =
      serviceType === 'stickers'
        ? 'Sticker Studio'
        : serviceType === 'both'
          ? 'Frames + Stickers'
          : 'Custom Frames'

    await sendLeadEmails({
      inquiryId,
      name,
      email,
      phone,
      eventType,
      eventDate,
      guestCount,
      message,
      serviceLabel,
      packageName: pkg?.name,
      priceRange: pkg?.priceRange || (wantsFrames ? 'Custom quote' : undefined),
      frameSummary: pkg?.frameSummary || undefined,
      frameStyleName: style?.name,
      frameStyleColors: styleColors,
      frameFormatLabel: wantsFrames ? frameFormatLabel : undefined,
      addOnLines: estimate.addOnLines.map((line) => ({
        name: line.name,
        quantity: line.quantity,
        pricingUnit: line.pricingUnit,
      })),
    })

    return { ok: true, inquiryId }
  } catch (err) {
    console.error('Lead submit failed:', err)
    return { ok: false, error: 'Something went wrong. Please try again.' }
  }
}
