'use client'

import type { QuoteStepId } from '@/lib/quote-validation'

export function QuoteStepper({
  steps,
  currentIndex,
}: {
  steps: { id: QuoteStepId; label: string }[]
  currentIndex: number
}) {
  return (
    <div className="lg:hidden sticky top-16 z-30 -mx-4 px-4 py-3 mb-6 bg-bg-primary/95 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
          Step {currentIndex + 1} of {steps.length}
        </p>
        <p className="text-sm font-medium">{steps[currentIndex]?.label}</p>
      </div>
      <div className="flex gap-1.5">
        {steps.map((step, i) => (
          <div
            key={step.id}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= currentIndex ? 'bg-accent' : 'bg-border'
            }`}
            aria-hidden
          />
        ))}
      </div>
    </div>
  )
}
