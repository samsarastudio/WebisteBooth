'use client'

import { Sparkles } from 'lucide-react'

import { ProductImage } from '@/components/marketing/ProductImage'
import type { FrameStyleData } from '@/lib/brand-images'
import type { PricedPackage } from '@/lib/pricing'
import { retentionHintForPackage } from '@/lib/retention-policy'

export function QuoteSummary({
  compact = false,
  serviceType,
  wantsFrames,
  selectedPkg,
  selectedStyle,
  estimateAddOnLines,
  showPricing,
  previewSrc,
  frameFormatLabel = '6×4 Landscape',
  pending = false,
  showSubmit = false,
}: {
  compact?: boolean
  serviceType: 'frames' | 'stickers' | 'both'
  wantsFrames: boolean
  selectedPkg: PricedPackage | null
  selectedStyle: FrameStyleData | null
  estimateAddOnLines: { id: string | number; name: string; quantity: number; pricingUnit: string }[]
  showPricing: boolean
  previewSrc: string
  frameFormatLabel?: string
  pending?: boolean
  showSubmit?: boolean
}) {
  const serviceLabel =
    serviceType === 'stickers'
      ? 'Sticker Studio'
      : serviceType === 'both'
        ? 'Frames + Stickers'
        : 'Custom Frames'

  if (compact) {
    return (
      <div className="lg:hidden flex flex-wrap gap-2 text-xs">
        <span className="px-2.5 py-1 rounded-full bg-bg-secondary border border-border font-medium">
          {serviceLabel}
        </span>
        {wantsFrames && selectedPkg ? (
          <span className="px-2.5 py-1 rounded-full bg-bg-secondary border border-border font-medium">
            {selectedPkg.name}
          </span>
        ) : null}
        {wantsFrames && selectedStyle ? (
          <span className="px-2.5 py-1 rounded-full bg-bg-secondary border border-border font-medium">
            {selectedStyle.name}
          </span>
        ) : null}
        {wantsFrames ? (
          <span className="px-2.5 py-1 rounded-full bg-bg-secondary border border-border font-medium">
            {frameFormatLabel}
          </span>
        ) : null}
      </div>
    )
  }

  return (
    <aside className="card p-6 space-y-4 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <div>
        <h3 className="font-serif text-xl mb-2">Your selection</h3>
        <p className="text-xs text-text-secondary">A quick summary of what you&apos;ve chosen so far.</p>
      </div>

      {showSubmit ? (
        <div className="space-y-2">
          <button
            type="submit"
            form="quote-form"
            className="btn-primary w-full justify-center"
            disabled={pending}
          >
            {pending ? 'Sending...' : 'Get my quote'}
            <Sparkles size={16} />
          </button>
          <p className="text-xs text-center text-text-secondary">
            Free quote by email. Submit anytime.
          </p>
        </div>
      ) : null}

      <div className="relative aspect-[6/4] rounded-[var(--radius-md)] overflow-hidden bg-bg-secondary">
        <ProductImage src={previewSrc} alt="" fill className="object-cover" sizes="400px" />
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wide mb-0.5">Service</p>
          <p className="font-medium">{serviceLabel}</p>
        </div>
        {wantsFrames && (
          <div>
            <p className="text-text-secondary text-xs uppercase tracking-wide mb-0.5">Package</p>
            <p className="font-medium">
              {selectedPkg?.name || 'Not selected'}
              {showPricing && selectedPkg ? (
                <span className="text-accent font-normal"> · {selectedPkg.priceRange}</span>
              ) : null}
            </p>
            {selectedPkg ? (
              <>
                <p className="text-xs text-text-secondary mt-0.5">{selectedPkg.frameSummary}</p>
                {retentionHintForPackage(selectedPkg.slug) ? (
                  <p className="text-xs text-text-secondary/90 mt-0.5">
                    {retentionHintForPackage(selectedPkg.slug)}
                  </p>
                ) : null}
              </>
            ) : null}
          </div>
        )}
        {wantsFrames && selectedStyle ? (
          <div>
            <p className="text-text-secondary text-xs uppercase tracking-wide mb-0.5">Style</p>
            <p className="font-medium">{selectedStyle.name}</p>
          </div>
        ) : null}
        {wantsFrames ? (
          <div>
            <p className="text-text-secondary text-xs uppercase tracking-wide mb-0.5">Format</p>
            <p className="font-medium">{frameFormatLabel}</p>
          </div>
        ) : null}
        {estimateAddOnLines.length > 0 ? (
          <div>
            <p className="text-text-secondary text-xs uppercase tracking-wide mb-1">Add-ons</p>
            <ul className="space-y-1">
              {estimateAddOnLines.map((line) => (
                <li key={String(line.id)} className="text-text-secondary">
                  • {line.name}
                  {line.quantity > 1
                    ? ` × ${line.quantity}${line.pricingUnit === 'per_pack' ? ' packs' : ''}`
                    : ''}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </aside>
  )
}
