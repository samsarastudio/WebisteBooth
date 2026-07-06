'use client'

import { CANVAS_FONTS, type TextLayer } from '@/lib/frame-design/types'
import { clampText, CAPTION_TEXT_SIZE } from '@/lib/frame-design/text-utils'
import { getTheme } from '@/lib/frame-design/themes'

const DEFAULT_MAX = 28

export function TextPanel({
  layers,
  selectedId,
  themeId,
  onChange,
  onAdd,
}: {
  layers: TextLayer[]
  selectedId: string | null
  themeId?: string
  onChange: (id: string, patch: Partial<TextLayer>) => void
  onAdd: () => void
}) {
  const theme = getTheme(themeId as Parameters<typeof getTheme>[0])
  const selected = layers.find((l) => l.id === selectedId) || layers[0]
  const maxLen =
    selected?.maxLength ??
    (selected?.id === 'text-secondary' ? theme.secondaryMaxLength : theme.captionMaxLength) ??
    DEFAULT_MAX

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-text-secondary">
          Caption stays centered and inside the print-safe rail — longer lines wrap automatically.
        </p>
        {layers.length < 3 ? (
          <button type="button" onClick={onAdd} className="btn-secondary !py-1.5 !px-3 text-xs shrink-0">
            Add text
          </button>
        ) : null}
      </div>

      {layers.length === 0 ? (
        <button type="button" onClick={onAdd} className="btn-primary w-full justify-center">
          Add caption text
        </button>
      ) : null}

      {selected ? (
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium" htmlFor="text-content">
                Caption
              </label>
              <span className="text-xs text-text-secondary tabular-nums">
                {selected.text.length}/{maxLen}
              </span>
            </div>
            <textarea
              id="text-content"
              className="field-input min-h-[72px] resize-y"
              value={selected.text}
              maxLength={maxLen}
              rows={2}
              placeholder="Type your caption…"
              onChange={(e) =>
                onChange(selected.id, {
                  text: clampText(e.target.value, maxLen),
                })
              }
            />
            <p className="text-xs text-text-secondary mt-1">
              Max {maxLen} characters · {CAPTION_TEXT_SIZE}px print size · wraps to the next centered
              line automatically
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="text-font">
              Font
            </label>
            <select
              id="text-font"
              className="field-input"
              value={selected.font}
              onChange={(e) => onChange(selected.id, { font: e.target.value })}
            >
              {CANVAS_FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="text-color">
              Color
            </label>
            <input
              id="text-color"
              type="color"
              value={selected.color}
              onChange={(e) => onChange(selected.id, { color: e.target.value })}
              className="w-full h-10 rounded-lg border border-border cursor-pointer"
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
