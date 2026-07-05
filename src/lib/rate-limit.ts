type Entry = { count: number; resetAt: number }

const store = new Map<string, Entry>()

export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000,
): { ok: boolean; retryAfterMs?: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true }
  }

  if (entry.count >= limit) {
    return { ok: false, retryAfterMs: entry.resetAt - now }
  }

  entry.count += 1
  store.set(key, entry)
  return { ok: true }
}
