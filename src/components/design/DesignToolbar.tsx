'use client'

import { Undo2, Redo2, Type, Palette, Sparkles, ImagePlus } from 'lucide-react'

export type DesignPanel = 'photo' | 'style' | 'colors' | 'text' | 'ornaments'

export function DesignToolbar({
  activePanel,
  onPanelChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: {
  activePanel: DesignPanel
  onPanelChange: (panel: DesignPanel) => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
}) {
  const items: { id: DesignPanel; label: string; icon: React.ReactNode }[] = [
    { id: 'photo', label: 'Photo', icon: <ImagePlus size={16} /> },
    { id: 'style', label: 'Style', icon: <Sparkles size={16} /> },
    { id: 'colors', label: 'Colors', icon: <Palette size={16} /> },
    { id: 'text', label: 'Text', icon: <Type size={16} /> },
    { id: 'ornaments', label: 'Decor', icon: <Sparkles size={16} /> },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex gap-1">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="btn-secondary !p-2 disabled:opacity-40"
          aria-label="Undo"
        >
          <Undo2 size={16} />
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className="btn-secondary !p-2 disabled:opacity-40"
          aria-label="Redo"
        >
          <Redo2 size={16} />
        </button>
      </div>
      <div className="flex flex-wrap gap-1 flex-1">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onPanelChange(item.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activePanel === item.id
                ? 'bg-accent text-white'
                : 'bg-bg-secondary text-text-secondary hover:text-text-primary'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
