export const CONSENT_STORAGE_KEY = 'ff_consent'
export const CONSENT_COOKIE = 'ff_consent=1'
export const CONSENT_VERSION = 'v1'

export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) === CONSENT_VERSION
  } catch {
    return false
  }
}

export function setAnalyticsConsent(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, CONSENT_VERSION)
    document.cookie = `${CONSENT_COOKIE}; path=/; max-age=31536000; SameSite=Lax`
  } catch {
    // ignore
  }
}

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return ''
  const key = 'ff_session'
  try {
    let id = sessionStorage.getItem(key)
    if (!id) {
      id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`
      sessionStorage.setItem(key, id)
    }
    return id
  } catch {
    return `s-${Date.now()}`
  }
}
