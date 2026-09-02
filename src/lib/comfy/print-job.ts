import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

import type { FrameDesign, Media } from '@/payload-types'
import type { FrameDesignState } from '@/lib/frame-design/types'
import {
  buildAssemblyManifest,
  generateAssemblyMeshes,
  type FrameAssemblyManifest,
  type FramePartId,
} from '@/lib/frame-mesh'
import { getPayloadClient } from '@/lib/payload'
import {
  ComfyCloudError,
  collectOutputFiles,
  downloadViewFile,
  getJobStatus,
  submitPrompt,
  uploadImage,
} from './client'
import type { PrintModelStatus } from './types'
import { buildPrintWorkflow } from './workflow'

const PRINT_MODELS_DIR = path.join(process.cwd(), 'media', 'print-models')

export type PrintDesignSummary = {
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

function mediaUrl(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') return undefined
  const url = (value as { url?: string }).url
  return typeof url === 'string' ? url : undefined
}

function asPrintStatus(value: unknown): PrintModelStatus {
  if (
    value === 'idle' ||
    value === 'queued' ||
    value === 'running' ||
    value === 'ready' ||
    value === 'error'
  ) {
    return value
  }
  return 'idle'
}

function toSummary(doc: FrameDesign): PrintDesignSummary {
  return {
    id: Number(doc.id),
    designToken: doc.designToken,
    designerEmail: doc.designerEmail,
    label: doc.label,
    status: doc.status,
    lastSavedAt: doc.lastSavedAt,
    previewUrl: mediaUrl(doc.previewImage) ?? null,
    printModelStatus: asPrintStatus(doc.printModelStatus),
    printModelError: doc.printModelError ?? null,
    printGeneratedAt: doc.printGeneratedAt ?? null,
    hasGlb: Boolean(doc.printGlbPath),
    hasStl: Boolean(doc.printStlPath || doc.printFrontStlPath || doc.printBackStlPath),
    hasFrontStl: Boolean(doc.printFrontStlPath),
    hasBackStl: Boolean(doc.printBackStlPath),
    hasSpacerStl: Boolean(doc.printSpacerStlPath),
    printMode: (doc.printMode as PrintDesignSummary['printMode']) ?? null,
  }
}

function tokenBase(designToken: string) {
  return designToken.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 48) || 'design'
}

async function persistPartFiles(
  designToken: string,
  parts: { partId: FramePartId; stl: Buffer }[],
  manifest: FrameAssemblyManifest,
): Promise<{
  front?: string
  back?: string
  spacer?: string
  manifestPath: string
}> {
  await mkdir(PRINT_MODELS_DIR, { recursive: true })
  const base = tokenBase(designToken)
  const result: {
    front?: string
    back?: string
    spacer?: string
    manifestPath: string
  } = {
    manifestPath: `print-models/${base}-manifest.json`,
  }

  for (const part of parts) {
    const name = `${base}-${part.partId}.stl`
    await writeFile(path.join(PRINT_MODELS_DIR, name), part.stl)
    if (part.partId === 'front') result.front = `print-models/${name}`
    if (part.partId === 'back') result.back = `print-models/${name}`
    if (part.partId === 'spacer') result.spacer = `print-models/${name}`
  }

  await writeFile(
    path.join(PRINT_MODELS_DIR, `${base}-manifest.json`),
    JSON.stringify(manifest, null, 2),
    'utf8',
  )

  return result
}

export async function listPrintDesigns(options?: {
  page?: number
  limit?: number
}): Promise<{ designs: PrintDesignSummary[]; totalDocs: number; page: number; totalPages: number }> {
  const payload = await getPayloadClient()
  const page = options?.page ?? 1
  const limit = options?.limit ?? 24

  const result = await payload.find({
    collection: 'frame-designs',
    sort: '-updatedAt',
    page,
    limit,
    depth: 1,
    overrideAccess: true,
  })

  return {
    designs: result.docs.map((doc) => toSummary(doc as FrameDesign)),
    totalDocs: result.totalDocs,
    page: result.page ?? page,
    totalPages: result.totalPages ?? 1,
  }
}

export async function getPrintDesignByToken(designToken: string): Promise<PrintDesignSummary | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'frame-designs',
    where: { designToken: { equals: designToken } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })
  const doc = result.docs[0] as FrameDesign | undefined
  return doc ? toSummary(doc) : null
}

/**
 * Primary path: parametric modular layflat parts (front / spacer / back)
 * with Manifold boolean ops for photo window, magnet recesses, QR pocket.
 */
export async function startModularPrintGeneration(designToken: string): Promise<{
  designToken: string
  status: PrintModelStatus
  mode: 'modular'
  parts: FramePartId[]
}> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'frame-designs',
    where: { designToken: { equals: designToken } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })

  const design = result.docs[0] as FrameDesign | undefined
  if (!design) {
    throw new ComfyCloudError('Design not found.', 404)
  }

  const state = design.state as FrameDesignState
  if (!state?.format) {
    throw new ComfyCloudError('Design state is missing format.', 400)
  }

  await payload.update({
    collection: 'frame-designs',
    id: design.id,
    data: {
      printModelStatus: 'running',
      printMode: 'modular',
      printModelError: null,
      printComfyPromptId: null,
    },
    overrideAccess: true,
  })

  try {
    const manifest = buildAssemblyManifest(state)
    const meshes = await generateAssemblyMeshes(manifest)
    const paths = await persistPartFiles(
      designToken,
      meshes.map((m) => ({ partId: m.partId, stl: m.stl })),
      manifest,
    )

    // Prefer back STL as the "primary" download for legacy field; keep all part paths.
    await payload.update({
      collection: 'frame-designs',
      id: design.id,
      data: {
        printModelStatus: 'ready',
        printMode: 'modular',
        printModelError: null,
        printFrontStlPath: paths.front,
        printBackStlPath: paths.back,
        printSpacerStlPath: paths.spacer,
        printManifestPath: paths.manifestPath,
        printStlPath: paths.back ?? paths.front,
        printGeneratedAt: new Date().toISOString(),
      },
      overrideAccess: true,
    })

    return {
      designToken,
      status: 'ready',
      mode: 'modular',
      parts: meshes.map((m) => m.partId),
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Modular mesh generation failed.'
    await payload.update({
      collection: 'frame-designs',
      id: design.id,
      data: {
        printModelStatus: 'error',
        printModelError: message,
      },
      overrideAccess: true,
    })
    throw err instanceof ComfyCloudError ? err : new ComfyCloudError(message, 500)
  }
}

async function resolvePreviewBuffer(design: FrameDesign): Promise<{ buffer: Buffer; filename: string; mime: string }> {
  const preview = design.previewImage
  if (!preview || typeof preview !== 'object') {
    throw new ComfyCloudError('This design has no preview image. Save it from Design Studio first.', 400)
  }

  const media = preview as Media
  const filename = media.filename || `preview-${design.designToken}.png`
  const mime = media.mimeType || 'image/png'

  if (media.url) {
    const absolute =
      media.url.startsWith('http://') || media.url.startsWith('https://')
        ? media.url
        : `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}${media.url}`
    const res = await fetch(absolute)
    if (res.ok) {
      return { buffer: Buffer.from(await res.arrayBuffer()), filename, mime }
    }
  }

  if (media.filename) {
    const localPath = path.join(process.cwd(), 'media', media.filename)
    const { readFile } = await import('fs/promises')
    try {
      const buffer = await readFile(localPath)
      return { buffer, filename, mime }
    } catch {
      // fall through
    }
  }

  throw new ComfyCloudError('Could not load the design preview image from storage.', 404)
}

/** Optional: Tripo sculptural preview via Comfy Cloud (not used for production layflat parts). */
export async function startTripoPreviewGeneration(designToken: string): Promise<{
  designToken: string
  promptId: string
  status: PrintModelStatus
  mode: 'tripo'
}> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'frame-designs',
    where: { designToken: { equals: designToken } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })

  const design = result.docs[0] as FrameDesign | undefined
  if (!design) {
    throw new ComfyCloudError('Design not found.', 404)
  }

  const current = asPrintStatus(design.printModelStatus)
  if (current === 'queued' || current === 'running') {
    throw new ComfyCloudError('A print model job is already in progress for this design.', 409)
  }

  const { buffer, filename, mime } = await resolvePreviewBuffer(design)
  const safeName = `frameflix-${designToken.slice(0, 12)}-${Date.now()}${path.extname(filename) || '.png'}`

  const uploaded = await uploadImage(buffer, safeName, mime)
  const imageRef = uploaded.subfolder ? `${uploaded.subfolder}/${uploaded.name}` : uploaded.name

  const workflow = buildPrintWorkflow(imageRef, {
    model: Math.floor(Math.random() * 1_000_000),
    texture: Math.floor(Math.random() * 1_000_000),
  })

  const promptId = await submitPrompt(workflow)

  await payload.update({
    collection: 'frame-designs',
    id: design.id,
    data: {
      printModelStatus: 'queued',
      printMode: 'tripo',
      printComfyPromptId: promptId,
      printModelError: null,
    },
    overrideAccess: true,
  })

  return { designToken, promptId, status: 'queued', mode: 'tripo' }
}

/** @deprecated Use startModularPrintGeneration — kept name for API compatibility. */
export async function startPrintGeneration(designToken: string) {
  return startModularPrintGeneration(designToken)
}

async function persistModelFiles(
  designToken: string,
  files: { glb?: Buffer; stl?: Buffer },
): Promise<{ glbPath?: string; stlPath?: string }> {
  await mkdir(PRINT_MODELS_DIR, { recursive: true })
  const base = tokenBase(designToken)
  const result: { glbPath?: string; stlPath?: string } = {}

  if (files.glb) {
    const name = `${base}.glb`
    await writeFile(path.join(PRINT_MODELS_DIR, name), files.glb)
    result.glbPath = `print-models/${name}`
  }
  if (files.stl) {
    const name = `${base}-tripo.stl`
    await writeFile(path.join(PRINT_MODELS_DIR, name), files.stl)
    result.stlPath = `print-models/${name}`
  }

  return result
}

export async function refreshPrintJob(designToken: string): Promise<PrintDesignSummary> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'frame-designs',
    where: { designToken: { equals: designToken } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })

  const design = result.docs[0] as FrameDesign | undefined
  if (!design) {
    throw new ComfyCloudError('Design not found.', 404)
  }

  const status = asPrintStatus(design.printModelStatus)
  const promptId = design.printComfyPromptId
  const mode = design.printMode

  // Modular jobs finish synchronously — nothing to poll
  if (mode === 'modular' || !promptId || status === 'idle' || status === 'ready') {
    return toSummary(design)
  }

  try {
    const job = await getJobStatus(promptId)

    if (job.error && (job.completed || ['failed', 'error', 'cancelled', 'canceled'].includes(job.status || ''))) {
      await payload.update({
        collection: 'frame-designs',
        id: design.id,
        data: {
          printModelStatus: 'error',
          printModelError: job.error,
        },
        overrideAccess: true,
      })
      return (await getPrintDesignByToken(designToken))!
    }

    if (!job.completed) {
      if (status !== 'running') {
        await payload.update({
          collection: 'frame-designs',
          id: design.id,
          data: { printModelStatus: 'running' },
          overrideAccess: true,
        })
      }
      return (await getPrintDesignByToken(designToken))!
    }

    const collected = collectOutputFiles(job.outputs)
    let glbBuf: Buffer | undefined
    let stlBuf: Buffer | undefined

    if (collected.glb[0]) glbBuf = await downloadViewFile(collected.glb[0])
    if (collected.stl[0]) stlBuf = await downloadViewFile(collected.stl[0])
    if (!stlBuf) {
      for (const file of collected.other) {
        if (file.filename.toLowerCase().endsWith('.stl')) {
          stlBuf = await downloadViewFile(file)
          break
        }
      }
    }

    if (!glbBuf && !stlBuf) {
      await payload.update({
        collection: 'frame-designs',
        id: design.id,
        data: {
          printModelStatus: 'error',
          printModelError:
            'Job finished but no GLB/STL outputs were found. Check the Comfy Cloud job history.',
        },
        overrideAccess: true,
      })
      return (await getPrintDesignByToken(designToken))!
    }

    const paths = await persistModelFiles(designToken, { glb: glbBuf, stl: stlBuf })

    await payload.update({
      collection: 'frame-designs',
      id: design.id,
      data: {
        printModelStatus: 'ready',
        printModelError: null,
        printGlbPath: paths.glbPath ?? design.printGlbPath,
        printStlPath: paths.stlPath ?? design.printStlPath,
        printGeneratedAt: new Date().toISOString(),
      },
      overrideAccess: true,
    })

    return (await getPrintDesignByToken(designToken))!
  } catch (err) {
    const message =
      err instanceof ComfyCloudError
        ? err.message
        : err instanceof Error
          ? err.message
          : 'Failed to refresh print job.'

    await payload.update({
      collection: 'frame-designs',
      id: design.id,
      data: {
        printModelStatus: 'error',
        printModelError: message,
      },
      overrideAccess: true,
    })

    return (await getPrintDesignByToken(designToken))!
  }
}

export function resolvePrintModelAbsolutePath(relativePath: string): string | null {
  if (!relativePath || relativePath.includes('..')) return null
  const normalized = relativePath.replace(/^\/+/, '')
  if (!normalized.startsWith('print-models/')) return null
  return path.join(process.cwd(), 'media', normalized)
}

export function partPathFromDesign(
  design: FrameDesign,
  part: 'front' | 'back' | 'spacer' | 'stl' | 'glb' | 'manifest',
): string | null {
  if (part === 'front') return design.printFrontStlPath || null
  if (part === 'back') return design.printBackStlPath || null
  if (part === 'spacer') return design.printSpacerStlPath || null
  if (part === 'stl') return design.printStlPath || design.printBackStlPath || design.printFrontStlPath || null
  if (part === 'glb') return design.printGlbPath || null
  if (part === 'manifest') return design.printManifestPath || null
  return null
}
