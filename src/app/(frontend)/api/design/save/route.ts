import { headers } from 'next/headers'

import type { FrameDesignState } from '@/lib/frame-design/types'
import { getDesignerEmailFromRequest } from '@/lib/designer-session'
import { saveFrameDesign } from '@/lib/frame-design/save-design'
import { sendDesignSnapshotEmail } from '@/lib/design-emails'
import { rateLimit } from '@/lib/rate-limit'
import { brand } from '@/lib/brand'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const headerStore = await headers()
  const ip =
    headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headerStore.get('x-real-ip') ||
    'unknown'

  let body: {
    designToken?: string
    state?: FrameDesignState
    previewDataUrl?: string
    photoMediaId?: number
    autosave?: boolean
  }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 })
  }

  const isAutosave = body.autosave === true
  const limited = rateLimit(
    isAutosave ? `design-autosave:${ip}` : `design-save:${ip}`,
    isAutosave ? 40 : 15,
    60_000,
  )
  if (!limited.ok) {
    return Response.json({ ok: false, error: 'Rate limit exceeded.' }, { status: 429 })
  }

  if (!body.state) {
    return Response.json({ ok: false, error: 'state is required.' }, { status: 400 })
  }

  const designerEmail = await getDesignerEmailFromRequest()
  if (!designerEmail) {
    return Response.json(
      { ok: false, error: 'Please sign in with your email to save designs.' },
      { status: 401 },
    )
  }

  const result = await saveFrameDesign({
    designToken: body.designToken,
    state: body.state,
    previewDataUrl: body.previewDataUrl,
    photoMediaId: body.photoMediaId,
    designerEmail,
    autosave: isAutosave,
  })

  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: result.status })
  }

  const designUrl = `${brand.siteUrl}/design?design=${encodeURIComponent(result.designToken)}`
  if (!isAutosave) {
    void sendDesignSnapshotEmail({
      email: designerEmail,
      designToken: result.designToken,
      designUrl,
    })
  }

  return Response.json({
    ok: true,
    designToken: result.designToken,
    id: result.id,
    designerEmail,
    autosaved: isAutosave,
  })
}
