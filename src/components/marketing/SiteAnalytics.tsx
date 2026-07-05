'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

import { getOrCreateSessionId, hasAnalyticsConsent } from '@/lib/consent'

function trackPageView(path: string) {
  if (!hasAnalyticsConsent()) return

  const sessionId = getOrCreateSessionId()
  const referrer = typeof document !== 'undefined' ? document.referrer : undefined

  fetch('/api/analytics/pageview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, referrer, sessionId }),
    keepalive: true,
  }).catch(() => {
    // non-blocking
  })
}

export function SiteAnalytics() {
  const pathname = usePathname()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname || pathname === lastPath.current) return
    lastPath.current = pathname
    trackPageView(pathname)
  }, [pathname])

  useEffect(() => {
    const onConsent = () => {
      if (pathname) trackPageView(pathname)
    }
    window.addEventListener('ff-consent-accepted', onConsent)
    return () => window.removeEventListener('ff-consent-accepted', onConsent)
  }, [pathname])

  return null
}
