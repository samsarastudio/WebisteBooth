import { sql } from 'drizzle-orm'
import type { LeadFormState } from '@/lib/lead-form'
import { getPayloadClient } from '@/lib/payload'
import { calculateEstimate, type PricingUnit } from '@/lib/pricing'
import { sendLeadEmails, UNSET_LEAD_EMAIL } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'
import { getFrameDesignByToken, linkDesignToLead } from '@/lib/frame-design/save-design'
import type { FrameDesignState } from '@/lib/frame-design/types'

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
  const eventCity = String(formData.get('eventCity') || '').trim()
  const postalCode = String(formData.get('postalCode') || '').trim()
  const packageRecommendationRequested =
    String(formData.get('packageRecommendationRequested') || '').trim() === '1'
  const message = String(formData.get('message') || '').trim()
  const packageId = String(formData.get('packageId') || '').trim()
  const frameStyleId = String(formData.get('frameStyleId') || '').trim()
  const designToken = String(formData.get('designToken') || '').trim()
  const frameFormatRaw = String(formData.get('frameFormat') || '6x4').trim()
  const frameFormat =
    frameFormatRaw === 'original' || frameFormatRaw === 'polaroid' ? 'original' : '6x4'
  const frameFormatLabel =
    frameFormat === 'original' ? 'Original keepsake frame' : '6×4 landscape frame'
  const selectedRaw = String(formData.get('selectedAddOns') || '[]')

  const namePlateCopy = String(formData.get('namePlateCopy') || '').trim()
  const magnetColor = String(formData.get('magnetColor') || '').trim()
  const bookPhotobooth = String(formData.get('bookPhotobooth') || '').trim() === '1'
  const intent = String(formData.get('intent') || 'contact')
  const intentValue =
    intent === 'quote' ? 'quote' : intent === 'custom-frame' ? 'custom-frame' : 'contact'
  const isCustomFrame = intentValue === 'custom-frame'
  const isQuote = intentValue === 'quote'

  if (isQuote) {
    if (!name || !email || !eventType || !eventDate || !eventCity || !postalCode) {
      return {
        ok: false,
        error: 'Name, email, event type, date, city, and postal code are required.',
      }
    }
  }

  const serviceTypeRaw = String(formData.get('serviceType') || 'frames').trim()
  const serviceType =
    serviceTypeRaw === 'stickers' || serviceTypeRaw === 'both' ? serviceTypeRaw : 'frames'
  const wantsFrames = serviceType === 'frames' || serviceType === 'both'

  if (intent === 'quote' && wantsFrames && !packageRecommendationRequested) {
    if (!packageId) {
      return { ok: false, error: 'Please choose a package.' }
    }
    if (!frameStyleId && !designToken) {
      return { ok: false, error: 'Please choose a magnet colour.' }
    }
  }

  if (email && !email.includes('@')) {
    return { ok: false, error: 'Please provide a valid email address.' }
  }

  const privacyConsent = String(formData.get('privacyConsent') || '').trim()
  if (isQuote && privacyConsent !== '1') {
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
    await ensureLeadSqliteColumns(payload)

    const savedDesign = designToken ? await getFrameDesignByToken(designToken) : null
    const designState = savedDesign?.state as FrameDesignState | undefined
    let resolvedFrameStyleId = frameStyleId
    let resolvedFrameFormat = frameFormat
    let resolvedFrameFormatLabel = frameFormatLabel

    if (designState) {
      if (designState.stylePresetId) resolvedFrameStyleId = designState.stylePresetId
      if (designState.format) {
        resolvedFrameFormat =
          designState.format === 'original' ? 'original' : '6x4'
        resolvedFrameFormatLabel =
          resolvedFrameFormat === 'original'
            ? 'Original keepsake frame'
            : '6×4 landscape frame'
      }
    }

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
        limit: 10,
        depth: 0,
      }),
    ])

    const pkg = packages.docs.find((p) => String(p.id) === packageId) || null
    const style = styles.docs.find((s) => String(s.id) === resolvedFrameStyleId) || null
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

    const previewMedia =
      savedDesign?.previewImage && typeof savedDesign.previewImage === 'object'
        ? savedDesign.previewImage
        : null

    const createdLead = await createLeadDoc(payload, {
      intent: intentValue,
      serviceType,
      name: name || '—',
      email: email || UNSET_LEAD_EMAIL,
      phone: phone || '—',
      eventType: eventType || (isCustomFrame ? 'Custom fridge magnet' : undefined),
      eventDate: eventDate || undefined,
      guestCount: guestCount || undefined,
      eventCity: eventCity || undefined,
      postalCode: postalCode || undefined,
      packageRecommendationRequested,
      message: message || undefined,
      namePlateCopy: namePlateCopy || undefined,
      magnetColor: magnetColor || undefined,
      bookPhotobooth,
      package: pkg?.id ?? undefined,
      packageName: pkg?.name,
      packagePrice: pkg?.basePrice ?? 0,
      frameStyle: style?.id ?? undefined,
      frameStyleName: style?.name,
      frameStyleColors: styleColors,
      frameFormat: resolvedFrameFormat as '6x4' | 'original',
      frameFormatLabel: resolvedFrameFormatLabel,
      frameDesign: savedDesign?.id ?? undefined,
      frameConfig: designState ?? undefined,
      designPreview: previewMedia?.id ?? undefined,
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
      privacyConsentAt: privacyConsent === '1' ? new Date().toISOString() : undefined,
    })

    if (designToken && createdLead.id) {
      await linkDesignToLead(designToken, Number(createdLead.id))
    }

    const designPreviewUrl =
      previewMedia && 'url' in previewMedia && previewMedia.url
        ? previewMedia.url
        : undefined

    const serviceLabel = isCustomFrame
      ? 'Fridge magnet / name plate'
      : serviceType === 'stickers'
        ? 'Sticker Studio'
        : serviceType === 'both'
          ? 'Frames + Stickers'
          : 'Custom Frames'

    try {
      await sendLeadEmails({
        inquiryId,
        intent: intentValue,
        name: name || '—',
        email: email || UNSET_LEAD_EMAIL,
        phone: phone || '—',
        eventType: eventType || (isCustomFrame ? 'Custom fridge magnet' : '—'),
        eventDate: eventDate || '—',
        guestCount,
        eventCity,
        postalCode,
        packageRecommendationRequested,
        message,
        namePlateCopy,
        magnetColor,
        bookPhotobooth,
        serviceLabel,
        packageName: pkg?.name,
        priceRange: pkg?.priceRange || (wantsFrames ? 'Custom quote' : undefined),
        frameSummary: pkg?.frameSummary || undefined,
        frameStyleName: style?.name,
        frameStyleColors: styleColors,
        frameFormatLabel: wantsFrames ? resolvedFrameFormatLabel : undefined,
        hasFrameDesign: Boolean(savedDesign),
        designPreviewUrl,
        addOnLines: estimate.addOnLines.map((line) => ({
          name: line.name,
          quantity: line.quantity,
          pricingUnit: line.pricingUnit,
        })),
      })
    } catch (err) {
      console.error('Lead notification emails failed:', inquiryId, err)
    }

    return { ok: true, inquiryId }
  } catch (err) {
    console.error('Lead submit failed:', inspectLeadError(err))
    return { ok: false, error: 'Something went wrong. Please try again.' }
  }
}

let leadColumnsReady = false

async function ensureLeadSqliteColumns(
  payload: Awaited<ReturnType<typeof getPayloadClient>>,
) {
  if (leadColumnsReady) return

  try {
    const drizzle = (
      payload.db as {
        drizzle?: {
          all: (query: unknown) => Promise<unknown>
          run: (query: unknown) => Promise<unknown>
        }
      }
    ).drizzle

    if (!drizzle?.all || !drizzle?.run) return

    const pragma = await drizzle.all(sql.raw(`PRAGMA table_info('leads')`))
    const names = new Set(readPragmaNames(pragma))

    const additions: [string, string][] = [
      ['name_plate_copy', 'text'],
      ['magnet_color', 'text'],
      ['book_photobooth', 'integer DEFAULT 0'],
    ]

    for (const [column, definition] of additions) {
      if (names.has(column)) continue
      await drizzle.run(sql.raw(`ALTER TABLE leads ADD COLUMN ${column} ${definition}`))
    }

    leadColumnsReady = true
  } catch (err) {
    console.error('Could not ensure lead columns:', inspectLeadError(err))
  }
}

function readPragmaNames(result: unknown): string[] {
  const rows = Array.isArray(result)
    ? result
    : result && typeof result === 'object' && 'rows' in result
      ? (result as { rows: unknown[] }).rows
      : []

  return rows
    .map((row) => {
      if (Array.isArray(row)) return String(row[1] ?? '')
      if (row && typeof row === 'object' && 'name' in row) {
        return String((row as { name: unknown }).name ?? '')
      }
      return ''
    })
    .filter(Boolean)
}

async function createLeadDoc(
  payload: Awaited<ReturnType<typeof getPayloadClient>>,
  data: Record<string, unknown>,
) {
  try {
    return await payload.create({
      collection: 'leads',
      overrideAccess: true,
      data: data as never,
    })
  } catch (err) {
    const detail = inspectLeadError(err)
    console.warn('Lead create failed, retrying with legacy-safe fields:', detail)
    try {
      return await payload.create({
        collection: 'leads',
        overrideAccess: true,
        data: legacySafeLead(data, detail) as never,
      })
    } catch (retryErr) {
      console.error('Lead create retry failed:', inspectLeadError(retryErr))
      throw err
    }
  }
}

function legacySafeLead(data: Record<string, unknown>, detail: string) {
  const next: Record<string, unknown> = { ...data }
  next.phone = next.phone || '—'
  next.name = next.name || '—'
  next.email = next.email || UNSET_LEAD_EMAIL
  next.eventType = next.eventType || '—'
  if (!next.eventDate) {
    next.eventDate = '1970-01-01'
    const note = 'Event date not specified.'
    next.message = next.message ? `${next.message}\n${note}` : note
  }

  if (/no such column/i.test(detail)) {
    const extras = [
      next.namePlateCopy ? `Name plate: ${next.namePlateCopy}` : '',
      next.magnetColor ? `Magnet colour: ${next.magnetColor}` : '',
      next.bookPhotobooth ? 'Also book the photobooth: Yes' : '',
    ].filter(Boolean)
    delete next.namePlateCopy
    delete next.magnetColor
    delete next.bookPhotobooth
    if (extras.length) {
      next.message = [next.message, ...extras].filter(Boolean).join('\n')
    }
  }

  if (/invalid|enum|option/i.test(detail) && /intent|custom-frame/i.test(detail)) {
    next.intent = 'contact'
  }

  return next
}

function inspectLeadError(err: unknown): string {
  const chunks: string[] = []
  const seen = new Set<unknown>()

  const walk = (value: unknown) => {
    if (!value || seen.has(value)) return
    seen.add(value)
    if (typeof value === 'string') {
      chunks.push(value)
      return
    }
    if (value instanceof Error) {
      chunks.push(value.message)
      walk((value as { cause?: unknown }).cause)
      walk((value as { data?: unknown }).data)
      return
    }
    if (typeof value === 'object') {
      const obj = value as Record<string, unknown>
      if (typeof obj.message === 'string') chunks.push(obj.message)
      if (typeof obj.code === 'string') chunks.push(obj.code)
      walk(obj.cause)
    }
  }

  walk(err)
  return chunks.join(' | ') || 'unknown error'
}
