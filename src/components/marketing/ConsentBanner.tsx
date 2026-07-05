'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { hasAnalyticsConsent, setAnalyticsConsent } from '@/lib/consent'

export function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(!hasAnalyticsConsent())
  }, [])

  if (!visible) return null

  function accept() {
    setAnalyticsConsent()
    setVisible(false)
    window.dispatchEvent(new Event('ff-consent-accepted'))
  }

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-[60] p-4 md:p-5 pb-[calc(1rem+var(--safe-bottom))] md:pb-5"
      role="dialog"
      aria-label="Privacy notice"
    >
      <div className="container-wide">
        <div className="card p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-[var(--shadow-lg)] border border-border/80">
          <p className="text-sm text-text-secondary leading-relaxed flex-1">
            By continuing to use this website, you agree to our{' '}
            <Link href="/privacy" className="text-accent hover:underline font-medium">
              Privacy Policy
            </Link>{' '}
            and our use of essential first-party analytics to improve the site. We do not sell your
            data or use third-party ad trackers.
          </p>
          <button type="button" onClick={accept} className="btn-primary shrink-0 !min-h-0 !py-2.5">
            I understand
          </button>
        </div>
      </div>
    </div>
  )
}
