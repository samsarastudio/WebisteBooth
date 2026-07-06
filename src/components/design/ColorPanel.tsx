'use client'

import type { FrameDesignColors, PlaColorRole } from '@/lib/frame-design/types'

const ROLE_LABELS: Record<PlaColorRole, string> = {
  base: 'Frame base',
  accent: 'Accent border',
  text: 'Text',
  detail: 'Details',
}

export function ColorPanel({
  colors,
  onChange,
}: {
  colors: FrameDesignColors
  onChange: (role: PlaColorRole, hex: string) => void
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary">
        Pick PLA-inspired colors for your frame. Final print colors may vary slightly.
      </p>
      {(Object.keys(ROLE_LABELS) as PlaColorRole[]).map((role) => (
        <div key={role} className="flex items-center gap-3">
          <input
            type="color"
            value={colors[role]}
            onChange={(e) => onChange(role, e.target.value)}
            className="w-10 h-10 rounded-lg border border-border cursor-pointer shrink-0"
            aria-label={ROLE_LABELS[role]}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{ROLE_LABELS[role]}</p>
            <p className="text-xs text-text-secondary font-mono">{colors[role]}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
