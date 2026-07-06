'use client'

import { AlertTriangle } from 'lucide-react'

export function ResetDesignDialog({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-design-title"
      onClick={onCancel}
    >
      <div
        className="card max-w-md w-full p-6 md:p-8 shadow-[var(--shadow-lg)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 shrink-0">
            <AlertTriangle size={20} aria-hidden />
          </span>
          <div>
            <h2 id="reset-design-title" className="font-serif text-xl mb-1">
              Reset this design?
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              This will remove your photo, caption, and all decorations. Your frame size and base
              style stay the same. Click Undo right after if you change your mind.
            </p>
          </div>
        </div>
        <p className="text-xs text-text-secondary mb-6 pl-[52px]">
          Your saved draft will be cleared on the next auto-save.
        </p>
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <button type="button" onClick={onCancel} className="btn-secondary justify-center">
            Keep designing
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-full font-semibold text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Reset design
          </button>
        </div>
      </div>
    </div>
  )
}
