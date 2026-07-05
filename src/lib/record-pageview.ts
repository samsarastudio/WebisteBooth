import { getPayloadClient } from '@/lib/payload'
import { rateLimit } from '@/lib/rate-limit'

const SKIP_PREFIXES = ['/admin', '/api', '/_next', '/icon', '/apple-icon', '/favicon']
const DEDUPE_MS = 30 * 60 * 1000

function isTrackablePath(path: string): boolean {
  if (!path || !path.startsWith('/')) return false
  if (SKIP_PREFIXES.some((p) => path.startsWith(p))) return false
  if (/\.[a-z0-9]+$/i.test(path)) return false
  return true
}

function truncate(value: string | undefined, max: number): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  return trimmed.length <= max ? trimmed : `${trimmed.slice(0, max - 1)}…`
}

export async function recordPageView(input: {
  path: string
  referrer?: string
  sessionId?: string
  userAgent?: string
  ip: string
}): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  const path = input.path.trim()
  if (!isTrackablePath(path)) {
    return { ok: false, error: 'Path not trackable.', status: 400 }
  }

  const limited = rateLimit(`pv:${input.ip}`, 60, 60_000)
  if (!limited.ok) {
    return { ok: false, error: 'Rate limit exceeded.', status: 429 }
  }

  const sessionId = truncate(input.sessionId, 80)
  const referrer = truncate(input.referrer, 500)
  const userAgent = truncate(input.userAgent, 300)

  try {
    const payload = await getPayloadClient()

    if (sessionId) {
      const since = new Date(Date.now() - DEDUPE_MS).toISOString()
      const existing = await payload.find({
        collection: 'page-views',
        where: {
          and: [
            { path: { equals: path } },
            { sessionId: { equals: sessionId } },
            { createdAt: { greater_than: since } },
          ],
        },
        limit: 1,
        depth: 0,
      })
      if (existing.totalDocs > 0) {
        return { ok: true }
      }
    }

    await payload.create({
      collection: 'page-views',
      data: {
        path,
        referrer,
        sessionId,
        userAgent,
      },
      overrideAccess: true,
    })

    return { ok: true }
  } catch (err) {
    console.error('Page view record failed:', err)
    return { ok: false, error: 'Failed to record page view.', status: 500 }
  }
}
