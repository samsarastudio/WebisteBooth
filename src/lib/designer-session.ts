import { cookies } from 'next/headers'

import {
  createDesignerSessionToken,
  designerSessionCookieName,
  designerSessionMaxAge,
  isValidDesignerEmail,
  normalizeDesignerEmail,
  parseDesignerSessionToken,
} from '@/lib/designer-auth'

export async function getDesignerEmailFromRequest(): Promise<string | null> {
  const jar = await cookies()
  const token = jar.get(designerSessionCookieName())?.value
  return parseDesignerSessionToken(token)
}

export async function setDesignerSessionCookie(email: string) {
  const jar = await cookies()
  jar.set(designerSessionCookieName(), createDesignerSessionToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: designerSessionMaxAge(),
  })
}

export function validateDesignerEmailInput(email: string) {
  const normalized = normalizeDesignerEmail(email)
  if (!isValidDesignerEmail(normalized)) {
    return { ok: false as const, error: 'Please enter a valid email address.' }
  }
  return { ok: true as const, email: normalized }
}
