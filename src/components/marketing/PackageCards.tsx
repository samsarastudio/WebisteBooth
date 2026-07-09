import Link from 'next/link'
import { Check, Clock, Sparkles } from 'lucide-react'

import type { PricedPackage } from '@/lib/pricing'
import {
  retentionFootnoteForPackage,
  retentionHintForPackage,
  RETENTION_TIER_SUMMARY,
} from '@/lib/retention-policy'

const HOURS_HINT = '3 hours coverage (excluding setup time)'

function hasHoursFeature(pkg: PricedPackage) {
  return pkg.features.some(
    (f) =>
      f.item.toLowerCase().includes('3 hours') &&
      f.item.toLowerCase().includes('excluding setup'),
  )
}

function isFrameQuantityLine(text: string) {
  return (
    /\d+\s*(custom\s*)?(photo\s*)?frames?/i.test(text) ||
    /20-pack/i.test(text) ||
    /custom guest frame/i.test(text) ||
    /custom frame count/i.test(text)
  )
}

function isOnlineRetentionLine(text: string) {
  return /online (digital )?photos|online gallery/i.test(text)
}

export function PackageCards({
  packages,
  ctaHref = '/quote',
  showFeatures = true,
  showFrameCounts = true,
  showPricing = false,
}: {
  packages: PricedPackage[]
  ctaHref?: string
  showFeatures?: boolean
  showFrameCounts?: boolean
  showPricing?: boolean
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
      {packages.map((pkg) => {
        const isCustomTier =
          pkg.slug === 'signature' ||
          pkg.slug === 'enterprise' ||
          (pkg.priceRange || '').toLowerCase().includes('custom')

        const onlineHint = retentionHintForPackage(pkg.slug)
        const onlineFootnote = retentionFootnoteForPackage(pkg.slug)

        const features = (hasHoursFeature(pkg) || isCustomTier
          ? pkg.features
          : [{ item: HOURS_HINT }, ...pkg.features]
        ).filter(
          (f) =>
            (showFrameCounts || !isFrameQuantityLine(f.item)) &&
            !isOnlineRetentionLine(f.item),
        )

        return (
          <article
            key={String(pkg.id)}
            className={`card p-6 md:p-8 relative flex flex-col ${
              pkg.popular ? 'ring-2 ring-accent/70 border-accent/40' : ''
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-[#1f1c12] text-xs font-semibold tracking-wide uppercase shadow-sm">
                Most Popular
              </span>
            )}

            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="text-3xl">{pkg.icon || '✨'}</div>
              {!isCustomTier && (
                <span className="hours-badge">
                  <Clock size={12} />
                  3 hrs
                </span>
              )}
            </div>

            <h3 className="text-2xl font-serif mb-1">{pkg.name}</h3>
            {showPricing && (
              <p className="text-xl font-semibold text-accent mb-2">{pkg.priceRange}</p>
            )}
            <div className={`space-y-1 ${showPricing ? 'mb-3' : 'mb-3 mt-1'}`}>
              {showFrameCounts && (
                <p className="text-xs font-medium text-text-secondary">{pkg.frameSummary}</p>
              )}
              {!isCustomTier && (
                <p className="text-xs font-medium text-text-secondary">{HOURS_HINT}</p>
              )}
              {onlineHint ? (
                <p className="text-xs font-medium text-text-secondary">{onlineHint}</p>
              ) : null}
              {onlineFootnote ? (
                <p className="text-[11px] text-text-secondary/90">{onlineFootnote}</p>
              ) : null}
            </div>
            <p className="text-text-secondary text-sm mb-6 leading-relaxed">{pkg.description}</p>

            {showFeatures && (
              <ul className="space-y-2.5 mb-8 flex-1">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="text-accent mt-0.5 shrink-0" />
                    <span>{f.item}</span>
                  </li>
                ))}
              </ul>
            )}

            <Link
              href={`${ctaHref}?package=${pkg.slug}`}
              className={pkg.popular ? 'btn-primary justify-center' : 'btn-secondary justify-center'}
            >
              {isCustomTier ? 'Contact us' : 'Request a quote'}
              <Sparkles size={16} />
            </Link>
          </article>
        )
      })}
    </div>
  )
}

export { RETENTION_TIER_SUMMARY }
