import { rateLimit } from '@/lib/rate-limit'
import {
  getDesignerEmailFromRequest,
  setDesignerSessionCookie,
  validateDesignerEmailInput,
} from '@/lib/designer-session'
import { getActiveDraftToken, upsertDesigner } from '@/lib/designer-registry'
import { sendDesignerLoginEmail } from '@/lib/design-emails'

export const dynamic = 'force-dynamic'

export async function GET() {
  const email = await getDesignerEmailFromRequest()
  if (!email) {
    return Response.json({ ok: true, email: null, activeDesignToken: null })
  }

  const activeDesignToken = await getActiveDraftToken(email)
  return Response.json({ ok: true, email, activeDesignToken })
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const limited = rateLimit(`design-auth:${ip}`, 8, 60_000)
  if (!limited.ok) {
    return Response.json({ ok: false, error: 'Too many attempts. Try again shortly.' }, { status: 429 })
  }

  let body: { email?: string }
  try {
    body = (await req.json()) as { email?: string }
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 })
  }

  const check = validateDesignerEmailInput(String(body.email || ''))
  if (!check.ok) {
    return Response.json({ ok: false, error: check.error }, { status: 400 })
  }

  await setDesignerSessionCookie(check.email)
  await upsertDesigner(check.email)
  const activeDesignToken = await getActiveDraftToken(check.email)
  void sendDesignerLoginEmail(check.email)

  return Response.json({ ok: true, email: check.email, activeDesignToken })
}
