import { normalizeDesignerEmail } from '@/lib/designer-auth'
import { getPayloadClient } from '@/lib/payload'

/**
 * Record (or refresh) a design-studio visitor. Never throws — sign-in must not
 * fail just because the registry write hit a transient/schema issue.
 */
export async function upsertDesigner(email: string): Promise<string> {
  const normalized = normalizeDesignerEmail(email)

  try {
    const payload = await getPayloadClient()
    const now = new Date().toISOString()

    const existing = await payload.find({
      collection: 'designers',
      where: { email: { equals: normalized } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    if (existing.totalDocs > 0) {
      await payload.update({
        collection: 'designers',
        id: existing.docs[0].id,
        data: { lastSeenAt: now },
        overrideAccess: true,
      })
      return normalized
    }

    await payload.create({
      collection: 'designers',
      data: {
        email: normalized,
        firstSeenAt: now,
        lastSeenAt: now,
      },
      overrideAccess: true,
    })
  } catch (err) {
    console.error('upsertDesigner failed (non-fatal):', normalized, err)
  }

  return normalized
}

/** Latest in-progress draft for this designer (server-side design history). */
export async function getActiveDraftToken(email: string): Promise<string | null> {
  const normalized = normalizeDesignerEmail(email)

  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'frame-designs',
      where: {
        and: [
          { designerEmail: { equals: normalized } },
          { status: { equals: 'draft' } },
        ],
      },
      sort: '-updatedAt',
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    const token = result.docs[0]?.designToken
    return typeof token === 'string' ? token : null
  } catch (err) {
    console.error('getActiveDraftToken failed (non-fatal):', normalized, err)
    return null
  }
}
