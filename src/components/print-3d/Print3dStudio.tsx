'use client'

import { useCallback, useEffect, useState } from 'react'
import { Box, Download, Loader2, RefreshCw, TriangleAlert } from 'lucide-react'

import type { PrintModelStatus } from '@/lib/comfy/types'

type PrintDesignSummary = {
  id: number
  designToken: string
  designerEmail?: string | null
  label?: string | null
  status?: string | null
  lastSavedAt?: string | null
  previewUrl?: string | null
  printModelStatus: PrintModelStatus
  printModelError?: string | null
  printGeneratedAt?: string | null
  hasGlb: boolean
  hasStl: boolean
  hasFrontStl: boolean
  hasBackStl: boolean
  hasSpacerStl: boolean
  printMode?: 'modular' | 'tripo' | null
}

function statusLabel(status: PrintModelStatus) {
  switch (status) {
    case 'queued':
      return 'Queued'
    case 'running':
      return 'Running'
    case 'ready':
      return 'Ready'
    case 'error':
      return 'Error'
    default:
      return 'Idle'
  }
}

function statusClass(status: PrintModelStatus) {
  switch (status) {
    case 'ready':
      return 'bg-emerald-100 text-emerald-800'
    case 'error':
      return 'bg-red-100 text-red-800'
    case 'queued':
    case 'running':
      return 'bg-amber-100 text-amber-900'
    default:
      return 'bg-stone-100 text-stone-700'
  }
}

function downloadHref(token: string, part: string) {
  return `/api/print-3d/download?designToken=${encodeURIComponent(token)}&part=${part}`
}

export function Print3dStudio() {
  const [designs, setDesigns] = useState<PrintDesignSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyToken, setBusyToken] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  const loadDesigns = useCallback(async () => {
    setError(null)
    try {
      const res = await fetch('/api/print-3d/designs')
      const data = (await res.json()) as {
        ok: boolean
        error?: string
        designs?: PrintDesignSummary[]
      }
      if (!res.ok || !data.ok) {
        setError(data.error || 'Could not load designs.')
        setDesigns([])
        return
      }
      setDesigns(data.designs || [])
    } catch {
      setError('Could not load designs.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadDesigns()
  }, [loadDesigns])

  // Poll Tripo jobs only
  useEffect(() => {
    const active = designs.filter(
      (d) =>
        d.printMode === 'tripo' &&
        (d.printModelStatus === 'queued' || d.printModelStatus === 'running'),
    )
    if (active.length === 0) return

    const id = window.setInterval(async () => {
      for (const d of active) {
        try {
          const res = await fetch(
            `/api/print-3d/status?designToken=${encodeURIComponent(d.designToken)}`,
          )
          const data = (await res.json()) as {
            ok: boolean
            design?: PrintDesignSummary
          }
          if (data.ok && data.design) {
            setDesigns((prev) =>
              prev.map((item) =>
                item.designToken === data.design!.designToken ? data.design! : item,
              ),
            )
          }
        } catch {
          // keep polling
        }
      }
    }, 4000)

    return () => window.clearInterval(id)
  }, [designs])

  async function generate(designToken: string, mode: 'modular' | 'tripo' = 'modular') {
    setBusyToken(designToken)
    setError(null)
    setSelected(designToken)
    try {
      const res = await fetch('/api/print-3d/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ designToken, mode }),
      })
      const data = (await res.json()) as {
        ok: boolean
        error?: string
        status?: PrintModelStatus
        mode?: string
      }
      if (!res.ok || !data.ok) {
        setError(data.error || 'Generation failed.')
        return
      }
      await loadDesigns()
      setSelected(designToken)
    } catch {
      setError('Generation request failed.')
    } finally {
      setBusyToken(null)
    }
  }

  const selectedDesign = designs.find((d) => d.designToken === selected) || null

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
            Owner tools
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-stone-900">Print 3D</h1>
          <p className="mt-2 text-stone-600 max-w-2xl text-sm md:text-base leading-relaxed">
            Modular layflat PLA parts: front (photo window) · spacer · back (size-common magnet
            strip recesses + QR pocket). Boolean ops via Manifold. No supports by design.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setLoading(true)
            void loadDesigns()
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-50"
        >
          <RefreshCw className="size-4" />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <TriangleAlert className="size-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center gap-2 text-stone-500 text-sm">
          <Loader2 className="size-4 animate-spin" />
          Loading designs…
        </div>
      ) : designs.length === 0 ? (
        <p className="text-stone-500 text-sm">
          No saved designs yet. Create one in{' '}
          <a href="/design" className="underline underline-offset-2">
            Design Studio
          </a>
          .
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <ul className="grid gap-4 sm:grid-cols-2">
            {designs.map((d) => {
              const inFlight =
                d.printModelStatus === 'queued' || d.printModelStatus === 'running'
              const isBusy = busyToken === d.designToken
              return (
                <li
                  key={d.designToken}
                  className={`rounded-xl border bg-white overflow-hidden ${
                    selected === d.designToken ? 'border-stone-800' : 'border-stone-200'
                  }`}
                >
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={() => setSelected(d.designToken)}
                  >
                    <div className="aspect-[4/3] bg-stone-100 relative">
                      {d.previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={d.previewUrl}
                          alt=""
                          className="absolute inset-0 size-full object-contain"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-stone-400 text-sm">
                          No preview
                        </div>
                      )}
                    </div>
                  </button>
                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusClass(d.printModelStatus)}`}
                      >
                        {statusLabel(d.printModelStatus)}
                        {d.printMode ? ` · ${d.printMode}` : ''}
                      </span>
                      {inFlight || isBusy ? (
                        <Loader2 className="size-3.5 animate-spin text-amber-700" />
                      ) : null}
                    </div>
                    <p className="text-xs font-mono text-stone-500 truncate">{d.designToken}</p>
                    {d.designerEmail ? (
                      <p className="text-xs text-stone-600 truncate">{d.designerEmail}</p>
                    ) : null}
                    {d.printModelError ? (
                      <p className="text-xs text-red-700 line-clamp-3">{d.printModelError}</p>
                    ) : null}
                    <button
                      type="button"
                      disabled={isBusy || inFlight}
                      onClick={() => void generate(d.designToken, 'modular')}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-stone-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-40 hover:bg-stone-800"
                    >
                      {isBusy ? <Loader2 className="size-4 animate-spin" /> : <Box className="size-4" />}
                      {d.hasFrontStl ? 'Regenerate modular STLs' : 'Generate modular STLs'}
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>

          <aside className="rounded-xl border border-stone-200 bg-white p-4 h-fit sticky top-24 space-y-4">
            <h2 className="text-lg font-semibold text-stone-900">Assembly & downloads</h2>
            {!selectedDesign ? (
              <p className="text-sm text-stone-500">Select a design.</p>
            ) : selectedDesign.printModelStatus !== 'ready' || !selectedDesign.hasFrontStl ? (
              <p className="text-sm text-stone-500">
                {selectedDesign.printModelStatus === 'error'
                  ? 'Generation failed — see the card error, then retry.'
                  : 'Generate modular STLs to download front, spacer, and back plates.'}
              </p>
            ) : (
              <>
                <ol className="text-sm text-stone-700 space-y-1 list-decimal pl-4">
                  <li>Front — guest face, photo window cutout</li>
                  <li>Photo print (dye-sub)</li>
                  <li>Spacer ring</li>
                  <li>Back — magnet recesses + QR pocket (size-common)</li>
                </ol>
                <div className="flex flex-col gap-2">
                  {selectedDesign.hasFrontStl ? (
                    <a
                      href={downloadHref(selectedDesign.designToken, 'front')}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-stone-900 px-3 py-2 text-sm font-medium text-white hover:bg-stone-800"
                    >
                      <Download className="size-4" />
                      Front STL
                    </a>
                  ) : null}
                  {selectedDesign.hasSpacerStl ? (
                    <a
                      href={downloadHref(selectedDesign.designToken, 'spacer')}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-50"
                    >
                      <Download className="size-4" />
                      Spacer STL
                    </a>
                  ) : null}
                  {selectedDesign.hasBackStl ? (
                    <a
                      href={downloadHref(selectedDesign.designToken, 'back')}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-50"
                    >
                      <Download className="size-4" />
                      Back STL (magnet + QR)
                    </a>
                  ) : null}
                  <a
                    href={downloadHref(selectedDesign.designToken, 'manifest')}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-dashed border-stone-300 px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50"
                  >
                    Boolean / assembly manifest (JSON)
                  </a>
                </div>
                <ul className="text-xs text-stone-500 space-y-1 list-disc pl-4">
                  <li>Print each plate flat on the bed — no supports.</li>
                  <li>Back: magnet face up (recesses open upward).</li>
                  <li>Magnet + QR pockets are identical for all frames of this size.</li>
                  <li>Units are millimetres (binary STL).</li>
                </ul>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}
