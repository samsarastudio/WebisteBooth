'use client'

import type { ColorPaletteId } from '@/lib/frame-design/color-palettes'
import { FRAME_COLOR_PALETTES } from '@/lib/frame-design/color-palettes'

export function PalettePanel({
  selectedId,
  onSelect,
}: {
  selectedId?: ColorPaletteId
  onSelect: (id: ColorPaletteId) => void
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary">
        Choose a finished color palette for your frame. Colors are matched for print.
      </p>
      <div className="grid grid-cols-1 gap-2 max-h-[min(420px,50vh)] overflow-y-auto pr-1">
        {FRAME_COLOR_PALETTES.map((palette) => {
          const active = selectedId === palette.id
          return (
            <button
              key={palette.id}
              type="button"
              onClick={() => onSelect(palette.id)}
              className={`w-full text-left rounded-lg border p-3 min-h-[48px] transition-all touch-manipulation ${
                active
                  ? 'border-accent ring-2 ring-accent bg-accent-light/25'
                  : 'border-border hover:border-accent/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-20 shrink-0 overflow-hidden rounded-md border border-border/60">
                  {palette.swatch.map((hex, i) => (
                    <span
                      key={`${palette.id}-${i}`}
                      className="flex-1 h-full"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{palette.name}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
