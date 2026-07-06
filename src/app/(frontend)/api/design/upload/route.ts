import { headers } from 'next/headers'

import { getDesignerEmailFromRequest } from '@/lib/designer-session'
import { uploadDesignPhoto } from '@/lib/frame-design/save-design'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const headerStore = await headers()
  const ip =
    headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headerStore.get('x-real-ip') ||
    'unknown'

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return Response.json({ ok: false, error: 'Invalid form data.' }, { status: 400 })
  }

  const file = formData.get('photo')
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ ok: false, error: 'photo file is required.' }, { status: 400 })
  }

  const designerEmail = await getDesignerEmailFromRequest()
  if (!designerEmail) {
    return Response.json(
      { ok: false, error: 'Please sign in with your email to upload photos.' },
      { status: 401 },
    )
  }

  const result = await uploadDesignPhoto(file, ip)
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: result.status })
  }

  return Response.json({
    ok: true,
    mediaId: result.mediaId,
    url: result.url,
  })
}
