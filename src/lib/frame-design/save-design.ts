import sharp from 'sharp'
import { randomUUID } from 'crypto'

import type { FrameDesign } from '@/payload-types'
import type { FrameDesignState } from '@/lib/frame-design/types'
import { normalizeDesignerEmail } from '@/lib/designer-auth'
import { getPayloadClient } from '@/lib/payload'
import { rateLimit } from '@/lib/rate-limit'

const MAX_BYTES = 8 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export async function uploadDesignPhoto(
  file: File,
  ip: string,
): Promise<
  { ok: true; mediaId: number; url: string } | { ok: false; error: string; status: number }
> {
  const limited = rateLimit(`design-upload:${ip}`, 8, 60_000)
  if (!limited.ok) {
    return { ok: false, error: 'Rate limit exceeded. Try again in a minute.', status: 429 }
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return { ok: false, error: 'Please upload a JPG, PNG, or WebP image.', status: 400 }
  }

  if (file.size > MAX_BYTES) {
    return { ok: false, error: 'Image must be 8 MB or smaller.', status: 400 }
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  let output: Buffer
  try {
    output = await sharp(buffer)
      .rotate()
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 88 })
      .toBuffer()
  } catch {
    return { ok: false, error: 'Could not process image.', status: 400 }
  }

  try {
    const payload = await getPayloadClient()
    const created = await payload.create({
      collection: 'media',
      data: { alt: 'Frame design sample photo' },
      file: {
        data: output,
        mimetype: 'image/jpeg',
        name: `design-${Date.now()}.jpg`,
        size: output.length,
      },
      overrideAccess: true,
    })

    const url = typeof created.url === 'string' ? created.url : `/media/${created.filename}`
    return { ok: true, mediaId: Number(created.id), url }
  } catch (err) {
    console.error('Design photo upload failed:', err)
    return { ok: false, error: 'Upload failed.', status: 500 }
  }
}

function parsePreviewDataUrl(dataUrl: string): Buffer | null {
  const match = /^data:image\/(png|jpeg|webp);base64,(.+)$/i.exec(dataUrl)
  if (!match) return null
  try {
    return Buffer.from(match[2], 'base64')
  } catch {
    return null
  }
}

export async function saveFrameDesign(input: {
  designToken?: string
  state: FrameDesignState
  previewDataUrl?: string
  photoMediaId?: number
  designerEmail?: string
  autosave?: boolean
}): Promise<
  | { ok: true; designToken: string; id: number }
  | { ok: false; error: string; status: number }
> {
  if (!input.state?.templateId) {
    return { ok: false, error: 'Invalid design state.', status: 400 }
  }

  try {
    const payload = await getPayloadClient()
    let previewImageId: number | undefined

    if (input.previewDataUrl) {
      const buf = parsePreviewDataUrl(input.previewDataUrl)
      if (buf) {
        const preview = await payload.create({
          collection: 'media',
          data: { alt: 'Frame design preview' },
          file: {
            data: buf,
            mimetype: 'image/png',
            name: `preview-${Date.now()}.png`,
            size: buf.length,
          },
          overrideAccess: true,
        })
        previewImageId = Number(preview.id)
      }
    }

    let token = input.designToken?.trim() || randomUUID()

    const existing = input.designToken
      ? await payload.find({
          collection: 'frame-designs',
          where: { designToken: { equals: token } },
          limit: 1,
          depth: 0,
        })
      : { totalDocs: 0, docs: [] }

    // Decide whether we update the existing doc or fork a new one. We fork
    // (rather than error) when the token belongs to a different signed-in
    // person or was already submitted, so the current user is never stuck.
    let updateExistingId: number | string | null = null
    if (existing.totalDocs > 0) {
      const doc = existing.docs[0]
      const owner = doc.designerEmail
        ? normalizeDesignerEmail(String(doc.designerEmail))
        : null
      const sessionEmail = input.designerEmail
        ? normalizeDesignerEmail(input.designerEmail)
        : null

      const differentOwner = Boolean(owner && sessionEmail && owner !== sessionEmail)
      const alreadySubmitted = doc.status === 'submitted'

      if (differentOwner || alreadySubmitted) {
        token = randomUUID()
      } else {
        updateExistingId = doc.id
      }
    }

    const rawPhotoId = input.photoMediaId ?? input.state.photoMediaId
    const photoMedia =
      typeof rawPhotoId === 'number'
        ? rawPhotoId
        : typeof rawPhotoId === 'string' && /^\d+$/.test(rawPhotoId)
          ? Number(rawPhotoId)
          : undefined

    const now = new Date().toISOString()
    const designerEmail = input.designerEmail
      ? normalizeDesignerEmail(input.designerEmail)
      : undefined
    const label = designerEmail
      ? `Snapshot — ${new Date(now).toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short' })}`
      : undefined

    const data = {
      designToken: token,
      state: input.state as FrameDesign['state'],
      status: 'draft' as const,
      photoMedia,
      previewImage: previewImageId,
      designerEmail,
      label,
      lastSavedAt: now,
    }

    if (updateExistingId !== null) {
      await payload.update({
        collection: 'frame-designs',
        id: updateExistingId,
        data,
        overrideAccess: true,
      })
      return { ok: true, designToken: token, id: Number(updateExistingId) }
    }

    const created = await payload.create({
      collection: 'frame-designs',
      data,
      overrideAccess: true,
    })
    return { ok: true, designToken: token, id: Number(created.id) }
  } catch (err) {
    console.error('Save frame design failed:', err)
    return { ok: false, error: 'Failed to save design.', status: 500 }
  }
}

export async function getFrameDesignByToken(token: string): Promise<FrameDesign | null> {
  if (!token?.trim()) return null

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'frame-designs',
      where: { designToken: { equals: token.trim() } },
      limit: 1,
      depth: 2,
    })
    if (result.totalDocs === 0) return null
    return result.docs[0] as FrameDesign
  } catch {
    return null
  }
}

export async function linkDesignToLead(designToken: string, leadId: number) {
  try {
    const payload = await getPayloadClient()
    const design = await getFrameDesignByToken(designToken)
    if (!design) return

    await payload.update({
      collection: 'frame-designs',
      id: design.id,
      data: { status: 'submitted', lead: leadId },
      overrideAccess: true,
    })
  } catch (err) {
    console.error('Link design to lead failed:', err)
  }
}
