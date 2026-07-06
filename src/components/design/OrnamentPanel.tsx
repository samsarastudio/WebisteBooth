'use client'

import { LayoutTemplate } from 'lucide-react'

import type { FrameOrnamentData } from '@/lib/frame-design/types'
import { getTemplatesForFinish } from '@/lib/frame-design/ornament-templates'
import { OrnamentShapeArt } from '@/components/design/OrnamentShapeArt'

type OrnamentTab = 'raised3d' | 'sticker'

export function OrnamentPanel({
  raisedOrnaments,
  stickerOrnaments,
  activeTab,
  onTabChange,
  onAdd,
  onApplyTemplate,
}: {
  raisedOrnaments: FrameOrnamentData[]
  stickerOrnaments: FrameOrnamentData[]
  activeTab: OrnamentTab
  onTabChange: (tab: OrnamentTab) => void
  onAdd: (ornament: FrameOrnamentData) => void
  onApplyTemplate: (templateId: string) => void
}) {
  const list = activeTab === 'raised3d' ? raisedOrnaments : stickerOrnaments
  const templates = getTemplatesForFinish(activeTab)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onTabChange('raised3d')}
          className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'raised3d'
              ? 'bg-accent text-[#1f1c12]'
              : 'bg-bg-secondary text-text-secondary hover:text-text-primary'
          }`}
        >
          Raised 3D
        </button>
        <button
          type="button"
          onClick={() => onTabChange('sticker')}
          className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'sticker'
              ? 'bg-accent text-[#1f1c12]'
              : 'bg-bg-secondary text-text-secondary hover:text-text-primary'
          }`}
        >
          Stickers
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary flex items-center gap-1.5">
          <LayoutTemplate size={13} aria-hidden />
          Quick frame styles
        </p>
        <p className="text-[11px] text-text-secondary leading-relaxed">
          One tap applies a full border layout sized to your frame. Replaces existing{' '}
          {activeTab === 'raised3d' ? 'raised' : 'sticker'} decor.
        </p>
        <div className="space-y-2">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onApplyTemplate(t.id)}
              className="w-full card p-3 text-left hover:ring-2 hover:ring-accent transition-all touch-manipulation"
            >
              <p className="text-sm font-semibold mb-0.5">{t.name}</p>
              <p className="text-[11px] text-text-secondary leading-snug">{t.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-3">
        {activeTab === 'raised3d' ? (
          <p className="text-xs text-text-secondary mb-3">
            Single raised accents — uses your accent print color.
          </p>
        ) : (
          <p className="text-xs text-text-secondary mb-3">
            Individual sticker overlays — border and caption areas only.
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[min(280px,40vh)] overflow-y-auto pr-1">
          {list.map((o) => (
            <button
              key={String(o.id)}
              type="button"
              onClick={() => onAdd(o)}
              className="card p-2 min-h-[48px] text-center hover:ring-2 hover:ring-accent transition-all touch-manipulation"
              title={o.name}
            >
              {o.finish === 'sticker' && (o.imageUrl || o.assetPath) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={o.imageUrl || o.assetPath}
                  alt=""
                  className="w-10 h-10 mx-auto mb-1 object-contain"
                />
              ) : (
                <OrnamentShapeArt
                  shapeType={o.shapeType}
                  className="w-10 h-10 mx-auto mb-1 text-accent"
                  fill="currentColor"
                />
              )}
              <span className="text-[10px] text-text-secondary line-clamp-2">{o.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
