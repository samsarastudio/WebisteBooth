const PRODUCTION_SITE_URL = 'https://inmomentservices.com'

function isLocalhostUrl(url: string) {
  return /localhost|127\.0\.0\.1/i.test(url)
}

function cleanUrl(raw: string | undefined) {
  const url = raw?.trim().replace(/\/$/, '')
  return url || ''
}

/** Public origin for Payload admin, CSRF, and canonical URLs. */
export function resolvePublicServerUrl() {
  const isProd = process.env.NODE_ENV === 'production'
  const candidates = [
    process.env.PAYLOAD_PUBLIC_SERVER_URL,
    process.env.NEXT_PUBLIC_SERVER_URL,
  ]

  for (const raw of candidates) {
    const url = cleanUrl(raw)
    if (!url) continue
    if (isProd && isLocalhostUrl(url)) continue
    return url
  }

  return isProd ? PRODUCTION_SITE_URL : 'http://localhost:3000'
}

export const PRODUCTION_SITE_ORIGINS = [
  PRODUCTION_SITE_URL,
  'https://www.inmomentservices.com',
]
