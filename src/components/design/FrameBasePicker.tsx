'use client'

import type { FrameBaseStructure } from '@/lib/frame-design/base-structures'
import { getPalette } from '@/lib/frame-design/color-palettes'

function MiniFramePreview({ base }: { base: FrameBaseStructure }) {
  const palette = getPalette(base.defaultPaletteId)
  const colors = palette.colors
  const aspect = base.format === 'original' ? '1/1' : '6/4'
  const isPlain = base.renderStyle === 'plain-lines' || base.renderStyle === 'plain-double'
  const isModern = base.renderStyle === 'modern-stripe'
  const isInstant = base.renderStyle === 'instant-rail'
  const isRomance = base.renderStyle === 'romance-decor'
  const isMat = base.renderStyle === 'gallery-mat'
  const isDark = palette.id === 'midnight-accent' || palette.id === 'navy-champagne'

  const photoBottom = isInstant ? '38%' : base.format === 'original' ? '34%' : '32%'

  return (
    <div
      className="relative w-full overflow-hidden border rounded-sm"
      style={{
        aspectRatio: aspect,
        backgroundColor: colors.base,
        borderColor: colors.accent,
      }}
    >
      <div
        className="absolute bg-black/25"
        style={{
          top: '8%',
          left: base.format === 'original' ? '12%' : '10%',
          right: base.format === 'original' ? '12%' : '10%',
          bottom: photoBottom,
          borderRadius: base.shapeVariant === 'rounded' ? 4 : 1,
        }}
      />
      {isMat ? (
        <div
          className="absolute border"
          style={{
            top: '6%',
            left: '8%',
            right: '8%',
            bottom: '30%',
            borderColor: colors.detail,
            opacity: 0.5,
          }}
        />
      ) : null}
      <div
        className="absolute left-[4%] right-[4%] bottom-[4%]"
        style={{
          top: isInstant ? '62%' : '72%',
          backgroundColor: colors.base,
          opacity: 0.85,
          borderRadius: base.shapeVariant === 'rounded' ? 4 : 0,
        }}
      />
      {isModern ? (
        <div
          className="absolute left-[4%] right-[4%] h-[3px]"
          style={{ top: '72%', backgroundColor: colors.accent, opacity: 0.6 }}
        />
      ) : null}
      {isRomance ? (
        <>
          <div
            className="absolute w-2 h-2 rounded-full top-[6%] right-[8%]"
            style={{ backgroundColor: colors.accent }}
          />
          <div
            className="absolute w-1.5 h-3 rounded-full bottom-[10%] left-[6%]"
            style={{ backgroundColor: colors.accent }}
          />
          <div
            className="absolute w-1.5 h-3 rounded-full bottom-[10%] right-[6%]"
            style={{ backgroundColor: colors.accent }}
          />
        </>
      ) : null}
      {isPlain && base.renderStyle === 'plain-lines' ? (
        <>
          <div
            className="absolute left-[12%] right-[12%] h-px top-[78%]"
            style={{ backgroundColor: colors.text, opacity: 0.35 }}
          />
          <div
            className="absolute left-[12%] right-[12%] h-px top-[84%]"
            style={{ backgroundColor: colors.text, opacity: 0.35 }}
          />
        </>
      ) : null}
      {isPlain && base.renderStyle === 'plain-double' ? (
        <div
          className="absolute inset-[6%] border rounded-sm pointer-events-none"
          style={{ borderColor: colors.text, opacity: 0.25 }}
        />
      ) : null}
      {!isPlain && !isDark && !isRomance ? (
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[35%] h-[2px] rounded bottom-[8%]"
          style={{ backgroundColor: colors.text, opacity: 0.5 }}
        />
      ) : null}
    </div>
  )
}

export function FrameBasePicker({
  bases,
  selectedId,
  onSelect,
}: {
  bases: FrameBaseStructure[]
  selectedId?: string
  onSelect: (base: FrameBaseStructure) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2 max-h-[min(480px,55vh)] overflow-y-auto pr-1">
      {bases.map((base) => (
        <button
          key={base.id}
          type="button"
          onClick={() => onSelect(base)}
          className={`text-left p-2 min-h-[48px] rounded-lg border transition-colors touch-manipulation ${
            selectedId === base.id
              ? 'border-accent ring-2 ring-accent bg-accent-light/30'
              : 'border-border hover:border-accent/50'
          }`}
        >
          <MiniFramePreview base={base} />
          <span className="block text-xs font-medium mt-1.5 leading-tight">{base.name}</span>
          <span className="block text-[10px] text-text-secondary mt-0.5">{base.blurb}</span>
        </button>
      ))}
    </div>
  )
}
