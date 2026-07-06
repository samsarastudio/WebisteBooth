import { createHmac, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'ff_designer_session'
const SESSION_DAYS = 30

function secret() {
  return process.env.PAYLOAD_SECRET || 'dev-secret-change-me'
}

function encodePayload(payload: object) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url')
}

function decodePayload(raw: string) {
  return JSON.parse(Buffer.from(raw, 'base64url').toString('utf8')) as {
    email: string
    exp: number
  }
}

function sign(raw: string) {
  return createHmac('sha256', secret()).update(raw).digest('base64url')
}

export function createDesignerSessionToken(email: string) {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  const payload = encodePayload({ email: email.trim().toLowerCase(), exp })
  const signature = sign(payload)
  return `${payload}.${signature}`
}

export function parseDesignerSessionToken(token: string | undefined | null): string | null {
  if (!token) return null
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null

  const expected = sign(payload)
  try {
    const a = Buffer.from(signature)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  } catch {
    return null
  }

  try {
    const data = decodePayload(payload)
    if (!data.email?.includes('@') || data.exp < Date.now()) return null
    return data.email
  } catch {
    return null
  }
}

export function designerSessionCookieName() {
  return COOKIE_NAME
}

export function designerSessionMaxAge() {
  return SESSION_DAYS * 24 * 60 * 60
}

export function isValidDesignerEmail(email: string) {
  const trimmed = email.trim().toLowerCase()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
}

export function normalizeDesignerEmail(email: string) {
  return email.trim().toLowerCase()
}
