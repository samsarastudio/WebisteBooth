'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type Konva from 'konva'
import { Loader2, ArrowRight } from 'lucide-react'

import { DesignCanvas } from '@/components/design/DesignCanvas'
import { DesignToolbar, type DesignPanel } from '@/components/design/DesignToolbar'
import { ResetDesignDialog } from '@/components/design/ResetDesignDialog'
import { PalettePanel } from '@/components/design/PalettePanel'
import { TextPanel } from '@/components/design/TextPanel'
import { OrnamentPanel } from '@/components/design/OrnamentPanel'
import { FrameBasePicker } from '@/components/design/FrameBasePicker'
import { useDesignHistory } from '@/components/design/useDesignHistory'
import {
  basesForFormat,
  buildFrameFromBase,
  defaultBaseForFormat,
  getBaseStructure,
  type FrameBaseId,
} from '@/lib/frame-design/base-structures'
import {
  applyPaletteToTextColor,
  getPalette,
  type ColorPaletteId,
} from '@/lib/frame-design/color-palettes'
import {
  clampOrnamentPosition,
  getDecorZones,
  getOrnamentHalfSize,
  spawnOrnamentPosition,
} from '@/lib/frame-design/decor-zones'
import { applyOrnamentTemplate } from '@/lib/frame-design/ornament-templates'
import {
  formatDisplayLabel,
  getFrameLayout,
  photoTransformForCover,
} from '@/lib/frame-design/layouts'
import { getTheme } from '@/lib/frame-design/themes'
import {
  CAPTION_TEXT_SIZE,
  lockTextToCaption,
  repositionTextForLayout,
} from '@/lib/frame-design/text-utils'
import {
  designStorageKey,
  type FrameDesignState,
  type FrameFormat,
  type FrameOrnamentData,
  type FrameStylePreset,
  type TextLayer,
  normalizeDesignState,
} from '@/lib/frame-design/types'

function loadImageSize(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = reject
    img.src = url
  })
}

export function FrameConfigurator({
  ornaments,
  stylePresets,
  initialStyleSlug,
  initialDesignToken,
  initialDesign,
  designerEmail,
}: {
  ornaments: FrameOrnamentData[]
  stylePresets: FrameStylePreset[]
  initialStyleSlug?: string
  initialDesignToken?: string
  initialDesign?: FrameDesignState
  designerEmail: string
}) {
  const router = useRouter()
  const stageRef = useRef<Konva.Stage>(null)

  const startingDesign = useMemo(() => {
    if (initialDesign) return normalizeDesignState(initialDesign)
    const baseByStyle: Partial<Record<string, FrameBaseId>> = {
      romance: 'original-romance',
      modern: 'landscape-modern',
      celebration: 'original-celebration',
      garden: 'original-celebration',
    }
    const baseId = (initialStyleSlug && baseByStyle[initialStyleSlug]) || 'original-romance'
    return buildFrameFromBase(baseId, ornaments, stylePresets)
  }, [initialDesign, initialStyleSlug, ornaments, stylePresets])

  const { state: design, setState, undo, redo, canUndo, canRedo } =
    useDesignHistory<FrameDesignState>(startingDesign)

  const [activePanel, setActivePanel] = useState<DesignPanel>('photo')
  const [ornamentTab, setOrnamentTab] = useState<'raised3d' | 'sticker'>('raised3d')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [designToken, setDesignToken] = useState(initialDesignToken || '')
  const [resetOpen, setResetOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [saveNotice, setSaveNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const activeBase = getBaseStructure(design.baseId)
  const activeLayout = getFrameLayout(
    design.format,
    design.shapeVariant || 'classic',
    activeBase.layoutProfile,
  )

  const raisedOrnaments = useMemo(
    () => ornaments.filter((o) => o.finish === 'raised3d'),
    [ornaments],
  )
  const stickerOrnaments = useMemo(
    () => ornaments.filter((o) => o.finish === 'sticker'),
    [ornaments],
  )

  const formatBases = useMemo(() => basesForFormat(design.format), [design.format])

  const applyPhotoTransform = useCallback((state: FrameDesignState) => {
    if (!state.photoNaturalSize) return state.photoTransform
    const base = getBaseStructure(state.baseId)
    const layout = getFrameLayout(state.format, state.shapeVariant || 'classic', base.layoutProfile)
    return photoTransformForCover(
      state.photoNaturalSize.width,
      state.photoNaturalSize.height,
      layout.photoSlot.width,
      layout.photoSlot.height,
    )
  }, [])

  const applyBase = useCallback(
    (baseId: FrameBaseId) => {
      const next = buildFrameFromBase(baseId, ornaments, stylePresets, {
        keepPhoto: {
          photoUrl: design.photoUrl,
          photoMediaId: design.photoMediaId,
          photoNaturalSize: design.photoNaturalSize,
          photoTransform: design.photoTransform,
        },
      })
      const base = getBaseStructure(baseId)
      const layout = getFrameLayout(next.format, next.shapeVariant || 'classic', base.layoutProfile)
      setState({
        ...next,
        photoTransform: applyPhotoTransform(next),
        textLayers: repositionTextForLayout(
          next.textLayers,
          layout.captionZone,
          layout.canvasWidth,
          layout.canvasHeight,
        ),
      })
    },
    [applyPhotoTransform, design, ornaments, setState, stylePresets],
  )

  const applyFormat = useCallback(
    (format: FrameFormat) => {
      if (format === design.format) return
      applyBase(defaultBaseForFormat(format))
    },
    [applyBase, design.format],
  )

  const applyPalette = useCallback(
    (paletteId: ColorPaletteId) => {
      const palette = getPalette(paletteId)
      setState((prev) => ({
        ...prev,
        paletteId,
        colors: { ...palette.colors },
        textLayers: applyPaletteToTextColor(prev.textLayers, palette.colors.text),
      }))
    },
    [setState],
  )

  useEffect(() => {
    const key = designStorageKey(designToken || undefined)
    const t = window.setTimeout(() => {
      try {
        sessionStorage.setItem(key, JSON.stringify({ design, designToken }))
      } catch {
        // ignore
      }
    }, 400)
    return () => window.clearTimeout(t)
  }, [design, designToken])

  useEffect(() => {
    if (!designerEmail || !design.templateId || saving) return

    const t = window.setTimeout(() => {
      setAutosaveStatus('saving')
      fetch('/api/design/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designToken: designToken || undefined,
          state: design,
          photoMediaId: design.photoMediaId,
          autosave: true,
        }),
      })
        .then((r) => r.json())
        .then((data: { ok?: boolean; designToken?: string }) => {
          if (data.ok && data.designToken) {
            if (data.designToken !== designToken) setDesignToken(data.designToken)
            setAutosaveStatus('saved')
          } else {
            setAutosaveStatus('idle')
          }
        })
        .catch(() => setAutosaveStatus('idle'))
    }, 2500)

    return () => window.clearTimeout(t)
  }, [design, designToken, designerEmail, saving])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) redo()
        else undo()
      }
      if (e.key === 'Delete' && selectedId) {
        setState((prev) => ({
          ...prev,
          textLayers: prev.textLayers.filter((t) => t.id !== selectedId),
          ornaments: prev.ornaments.filter((o) => o.id !== selectedId),
        }))
        setSelectedId(null)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [undo, redo, selectedId, setState])

  async function handlePhotoUpload(file: File) {
    setUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('photo', file)
      const res = await fetch('/api/design/upload', { method: 'POST', body: fd })
      const data = (await res.json()) as {
        ok: boolean
        mediaId?: number
        url?: string
        error?: string
      }
      if (!data.ok || !data.mediaId || !data.url) {
        setError(
          res.status === 401
            ? 'Please sign in with your email to upload photos.'
            : data.error || 'Upload failed.',
        )
        return
      }

      const natural = await loadImageSize(data.url)
      const layout = getFrameLayout(
        design.format,
        design.shapeVariant || 'classic',
        activeBase.layoutProfile,
      )
      const transform = photoTransformForCover(
        natural.width,
        natural.height,
        layout.photoSlot.width,
        layout.photoSlot.height,
      )

      setState((prev) => ({
        ...prev,
        photoMediaId: data.mediaId,
        photoUrl: data.url,
        photoNaturalSize: natural,
        photoTransform: transform,
      }))
      setActivePanel('colors')
    } catch {
      setError('Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  async function handleSaveAndQuote() {
    setSaving(true)
    setError(null)
    setSaveNotice(null)
    try {
      let previewDataUrl: string | undefined
      const stage = stageRef.current
      if (stage) {
        previewDataUrl = stage.toDataURL({ pixelRatio: 2 })
      }

      const res = await fetch('/api/design/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designToken: designToken || undefined,
          state: design,
          previewDataUrl,
          photoMediaId: design.photoMediaId,
        }),
      })
      const data = (await res.json()) as {
        ok: boolean
        designToken?: string
        error?: string
      }
      if (!res.ok || !data.ok || !data.designToken) {
        setError(data.error || 'Could not save design.')
        return
      }
      setDesignToken(data.designToken)
      setSaveNotice(`Snapshot saved — we emailed ${designerEmail} a link to recreate this design.`)
      router.push(`/quote?design=${encodeURIComponent(data.designToken)}&service=frames`)
    } catch {
      setError('Could not save design.')
    } finally {
      setSaving(false)
    }
  }

  function updateBorderWidth(borderWidth: number) {
    setState((prev) => ({ ...prev, borderWidth }))
  }

  function updateText(id: string, patch: Partial<TextLayer>) {
    setState((prev) => {
      const base = getBaseStructure(prev.baseId)
      const layout = getFrameLayout(prev.format, prev.shapeVariant || 'classic', base.layoutProfile)
      const cap = layout.captionZone
      const maxLength = patch.maxLength ?? getTheme(prev.themeId).captionMaxLength

      return {
        ...prev,
        textLayers: prev.textLayers.map((t) => {
          if (t.id !== id) return t
          const text =
            patch.text !== undefined ? patch.text.slice(0, maxLength) : t.text
          const next: TextLayer = {
            ...t,
            ...patch,
            text,
            maxLength,
            size: CAPTION_TEXT_SIZE,
            rotation: 0,
          }
          return cap ? lockTextToCaption(next, cap) : next
        }),
      }
    })
  }

  function addTextLayer() {
    const cap = activeLayout.captionZone
    const theme = getTheme(design.themeId)
    const id = `text-${Date.now()}`
    const layer: TextLayer = {
      id,
      text: 'Your text',
      font: theme.defaultFont,
      size: CAPTION_TEXT_SIZE,
      color: design.colors.text,
      x: cap ? cap.x + cap.width / 2 : activeLayout.canvasWidth / 2,
      y: cap ? cap.y + cap.height / 2 : activeLayout.canvasHeight - 40,
      rotation: 0,
      maxLength: theme.captionMaxLength,
    }
    const locked = cap ? lockTextToCaption(layer, cap) : layer
    setState((prev) => ({ ...prev, textLayers: [...prev.textLayers, locked] }))
    setSelectedId(id)
    setActivePanel('text')
  }

  function addOrnament(ornament: FrameOrnamentData) {
    const id = `orn-${Date.now()}`
    const layout = getFrameLayout(
      design.format,
      design.shapeVariant || 'classic',
      activeBase.layoutProfile,
    )
    const zones = getDecorZones(
      layout.canvasWidth,
      layout.canvasHeight,
      layout.photoSlot,
      layout.captionZone,
    )
    const spawn = spawnOrnamentPosition(
      zones,
      layout.photoSlot,
      layout.canvasWidth,
      layout.canvasHeight,
    )
    const half = getOrnamentHalfSize(ornament, 1)
    const placed = clampOrnamentPosition(
      spawn.x,
      spawn.y,
      half,
      zones,
      layout.photoSlot,
      layout.canvasWidth,
      layout.canvasHeight,
    )
    setState((prev) => ({
      ...prev,
      ornaments: [
        ...prev.ornaments,
        {
          id,
          assetId: String(ornament.id),
          x: placed.x,
          y: placed.y,
          scale: 1,
          rotation: 0,
          zIndex: prev.ornaments.length + 1,
        },
      ],
    }))
    setSelectedId(id)
  }

  function applyTemplate(templateId: string) {
    const layout = getFrameLayout(
      design.format,
      design.shapeVariant || 'classic',
      activeBase.layoutProfile,
    )
    const template = applyOrnamentTemplate(templateId, layout, ornaments)
    if (template.length === 0) return

    const finish = templateId.startsWith('sticker') ? 'sticker' : 'raised3d'
    setState((prev) => ({
      ...prev,
      ornaments: [
        ...prev.ornaments.filter((layer) => {
          const orn = ornaments.find((o) => String(o.id) === layer.assetId)
          return orn?.finish !== finish
        }),
        ...template,
      ],
    }))
    setSelectedId(null)
  }

  function confirmResetDesign() {
    const baseId = (design.baseId || 'original-romance') as FrameBaseId
    const fresh = buildFrameFromBase(baseId, ornaments, stylePresets)
    setState(fresh)
    setDesignToken('')
    setSelectedId(null)
    setError(null)
    setSaveNotice(null)
    setAutosaveStatus('idle')
    setActivePanel('photo')
    try {
      sessionStorage.removeItem(designStorageKey(designToken || undefined))
      sessionStorage.removeItem(designStorageKey())
    } catch {
      // ignore
    }
    setResetOpen(false)
  }

  const formatLabel = formatDisplayLabel(design.format)

  return (
    <>
      <ResetDesignDialog
        open={resetOpen}
        onCancel={() => setResetOpen(false)}
        onConfirm={confirmResetDesign}
      />
      <div className="grid lg:grid-cols-[240px_1fr_280px] gap-6">
      <aside className="space-y-4 order-2 lg:order-1">
        <div className="card p-4 space-y-3">
          <h3 className="font-serif text-lg">Size</h3>
          <div className="grid grid-cols-2 gap-2">
            {(['original', '6x4'] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => applyFormat(fmt)}
                className={`min-h-[48px] rounded-lg border px-2 py-2 text-xs font-medium transition-colors touch-manipulation ${
                  design.format === fmt
                    ? 'border-accent ring-2 ring-accent bg-accent-light/30'
                    : 'border-border hover:border-accent/50'
                }`}
              >
                {formatDisplayLabel(fmt)}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-4 space-y-3">
          <h3 className="font-serif text-lg">Frame base</h3>
          <p className="text-xs text-text-secondary">
            Gallery-style structures for {formatLabel.toLowerCase()}. Pick a base, then choose a
            color palette.
          </p>
          <FrameBasePicker
            bases={formatBases}
            selectedId={design.baseId}
            onSelect={(base) => applyBase(base.id)}
          />
        </div>
      </aside>

      <div className="space-y-4 order-1 lg:order-2">
        <DesignToolbar
          activePanel={activePanel}
          onPanelChange={setActivePanel}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          onReset={() => setResetOpen(true)}
        />

        <div className="card p-4 md:p-6">
          <DesignCanvas
            design={design}
            ornaments={ornaments}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onChange={setState}
            stageRef={stageRef}
          />
          <p className="text-xs text-text-secondary text-center mt-4">
            Preview — {formatLabel.toLowerCase()}. Add your photo, text, and decor on border areas
            only. Final colors may vary slightly.
          </p>
        </div>

        {error ? (
          <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 px-4 py-3 rounded-lg">
            {error}
          </p>
        ) : null}

        {saveNotice ? (
          <p className="text-sm text-accent bg-accent-light/30 px-4 py-3 rounded-lg">{saveNotice}</p>
        ) : null}

        <button
          type="button"
          onClick={handleSaveAndQuote}
          disabled={saving}
          className="btn-primary w-full justify-center lg:w-auto"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving…
            </>
          ) : (
            <>
              Save snapshot &amp; continue to quote
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>

      <aside className="card p-4 md:p-5 order-3 space-y-4">
        <div className="space-y-1">
          <p className="text-xs text-text-secondary">
            Signed in as <span className="font-medium text-text-primary">{designerEmail}</span>
          </p>
          {autosaveStatus === 'saving' ? (
            <p className="text-xs text-text-secondary">Saving draft…</p>
          ) : autosaveStatus === 'saved' ? (
            <p className="text-xs text-accent">Draft saved to your history</p>
          ) : null}
        </div>
        <h3 className="font-serif text-lg capitalize">{activePanel}</h3>

        {activePanel === 'photo' ? (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Upload your photo — it fills the window inside your custom frame.
            </p>
            <label className="btn-secondary w-full justify-center cursor-pointer">
              {uploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Uploading…
                </>
              ) : (
                <>Upload photo</>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) void handlePhotoUpload(f)
                }}
              />
            </label>
            {design.photoUrl ? (
              <p className="text-xs text-accent font-medium">Photo added — drag text & decor on the canvas.</p>
            ) : null}
          </div>
        ) : null}

        {activePanel === 'style' ? (
          <div className="space-y-4 text-sm text-text-secondary">
            <p>Pick a frame base on the left. Adjust border thickness below.</p>
            <label className="block">
              <span className="font-medium text-text-primary">
                Border thickness ({design.borderWidth ?? activeLayout.borderWidth}px)
              </span>
              <input
                type="range"
                min={8}
                max={40}
                value={design.borderWidth ?? activeLayout.borderWidth}
                onChange={(e) => updateBorderWidth(Number(e.target.value))}
                className="w-full mt-2 accent-accent"
              />
            </label>
          </div>
        ) : null}

        {activePanel === 'colors' ? (
          <PalettePanel
            selectedId={design.paletteId as ColorPaletteId | undefined}
            onSelect={applyPalette}
          />
        ) : null}

        {activePanel === 'text' ? (
          <TextPanel
            layers={design.textLayers}
            selectedId={selectedId}
            themeId={design.themeId}
            onChange={updateText}
            onAdd={addTextLayer}
          />
        ) : null}

        {activePanel === 'ornaments' ? (
          <OrnamentPanel
            raisedOrnaments={raisedOrnaments}
            stickerOrnaments={stickerOrnaments}
            activeTab={ornamentTab}
            onTabChange={setOrnamentTab}
            onAdd={addOrnament}
            onApplyTemplate={applyTemplate}
          />
        ) : null}
      </aside>
    </div>
    </>
  )
}
