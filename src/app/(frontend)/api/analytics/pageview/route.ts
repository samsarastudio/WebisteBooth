import { headers } from 'next/headers'

import { recordPageView } from '@/lib/record-pageview'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const cookieHeader = req.headers.get('cookie') || ''
  if (!cookieHeader.includes('ff_consent=1')) {
    return Response.json({ ok: false, error: 'Consent required.' }, { status: 403 })
  }

  let body: { path?: string; referrer?: string; sessionId?: string }
  try {
    body = (await req.json()) as { path?: string; referrer?: string; sessionId?: string }
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 })
  }

  const path = body.path?.trim()
  if (!path) {
    return Response.json({ ok: false, error: 'path is required.' }, { status: 400 })
  }

  const headerStore = await headers()
  const ip =
    headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headerStore.get('x-real-ip') ||
    'unknown'

  const result = await recordPageView({
    path,
    referrer: body.referrer,
    sessionId: body.sessionId,
    userAgent: req.headers.get('user-agent') || undefined,
    ip,
  })

  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: result.status })
  }

  return Response.json({ ok: true })
}
