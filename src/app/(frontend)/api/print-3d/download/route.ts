import { createReadStream } from 'fs'
import { stat } from 'fs/promises'
import { Readable } from 'stream'

import { getPayloadClient } from '@/lib/payload'
import {
  ComfyCloudError,
  partPathFromDesign,
  requireAdminUser,
  resolvePrintModelAbsolutePath,
} from '@/lib/comfy'
import type { FrameDesign } from '@/payload-types'

export const dynamic = 'force-dynamic'

const PARTS = new Set(['front', 'back', 'spacer', 'stl', 'glb', 'manifest'])

export async function GET(req: Request) {
  const auth = await requireAdminUser()
  if (!auth.ok) {
    return Response.json({ ok: false, error: auth.error }, { status: auth.status })
  }

  const url = new URL(req.url)
  const designToken = url.searchParams.get('designToken')?.trim()
  const format = url.searchParams.get('format')?.trim().toLowerCase()
  const part = (url.searchParams.get('part') || format || 'back').trim().toLowerCase()

  if (!designToken) {
    return Response.json({ ok: false, error: 'designToken is required.' }, { status: 400 })
  }
  if (!PARTS.has(part)) {
    return Response.json(
      { ok: false, error: 'part must be front|back|spacer|stl|glb|manifest.' },
      { status: 400 },
    )
  }

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'frame-designs',
      where: { designToken: { equals: designToken } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    const design = result.docs[0] as FrameDesign | undefined
    if (!design) {
      throw new ComfyCloudError('Design not found.', 404)
    }

    const relative = partPathFromDesign(
      design,
      part as 'front' | 'back' | 'spacer' | 'stl' | 'glb' | 'manifest',
    )
    if (!relative) {
      throw new ComfyCloudError(`No ${part} file for this design yet.`, 404)
    }

    const absolute = resolvePrintModelAbsolutePath(relative)
    if (!absolute) {
      throw new ComfyCloudError('Invalid model path.', 400)
    }

    const info = await stat(absolute)
    const stream = createReadStream(absolute)
    const webStream = Readable.toWeb(stream) as ReadableStream

    const inline = url.searchParams.get('inline') === '1'
    const ext = part === 'manifest' ? 'json' : part === 'glb' ? 'glb' : 'stl'
    const contentType =
      part === 'manifest'
        ? 'application/json'
        : part === 'glb'
          ? 'model/gltf-binary'
          : 'model/stl'
    const filename = `${designToken}-${part}.${ext}`

    return new Response(webStream, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(info.size),
        'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename="${filename}"`,
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (err) {
    if (err instanceof ComfyCloudError) {
      return Response.json({ ok: false, error: err.message }, { status: err.status })
    }
    console.error('print-3d download failed:', err)
    return Response.json({ ok: false, error: 'Download failed.' }, { status: 500 })
  }
}
