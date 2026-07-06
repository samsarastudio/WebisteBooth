import type { FrameFormat, FrameTemplateData } from './types'

/** Canvas scale: 100 px = 1 inch (print preview) */
export const PX_PER_INCH = 100

export type FrameShapeVariant = 'classic' | 'rounded' | 'bold'
export type FrameLayoutProfile = 'standard' | 'instant' | 'gallery-mat'

export type FrameLayoutSpec = FrameTemplateData & {
  label: string
  printSizeLabel: string
  borderWidth: number
  shapeVariant: FrameShapeVariant
  profile: FrameLayoutProfile
}

const FRAME_6X4_OUTER = { w: 6, h: 4 }
const FRAME_ORIGINAL_OUTER = { w: 4, h: 4 }

/** 6×4 landscape — wide photo window, bottom caption rail */
function landscape6x4Layout(
  shapeVariant: FrameShapeVariant,
  profile: FrameLayoutProfile,
  slug: string,
  name: string,
): FrameLayoutSpec {
  const canvasWidth = Math.round(FRAME_6X4_OUTER.w * PX_PER_INCH)
  const canvasHeight = Math.round(FRAME_6X4_OUTER.h * PX_PER_INCH)
  const margin = profile === 'instant' ? 12 : 16
  const borderRadius =
    shapeVariant === 'rounded' ? 10 : shapeVariant === 'bold' ? 4 : 2

  const photoW = Math.round(canvasWidth * (profile === 'instant' ? 0.86 : 0.8))
  const photoH = Math.round(
    canvasHeight * (profile === 'instant' ? 0.52 : profile === 'gallery-mat' ? 0.54 : 0.58),
  )
  const photoX = Math.round((canvasWidth - photoW) / 2)
  const photoY = margin
  const captionY = photoY + photoH + (profile === 'instant' ? 6 : 8)
  const captionH = canvasHeight - captionY - margin

  return {
    id: `layout-6x4-${profile}-${shapeVariant}`,
    name,
    slug,
    format: '6x4',
    label: '6×4 landscape frame',
    printSizeLabel: `6" × 4" landscape`,
    canvasWidth,
    canvasHeight,
    borderWidth: margin,
    borderRadius,
    shapeVariant,
    profile,
    photoSlot: { x: photoX, y: photoY, width: photoW, height: photoH },
    captionZone: {
      x: margin,
      y: captionY,
      width: canvasWidth - margin * 2,
      height: Math.max(captionH, profile === 'instant' ? 56 : 48),
    },
  }
}

/** Original keepsake — square gallery frame (portrait photo window) */
function originalLayout(
  shapeVariant: FrameShapeVariant,
  profile: FrameLayoutProfile,
  slug: string,
  name: string,
): FrameLayoutSpec {
  const canvasWidth = Math.round(FRAME_ORIGINAL_OUTER.w * PX_PER_INCH)
  const canvasHeight = Math.round(FRAME_ORIGINAL_OUTER.h * PX_PER_INCH)
  const margin = profile === 'instant' ? 14 : 20
  const borderRadius =
    shapeVariant === 'rounded' ? 12 : shapeVariant === 'bold' ? 6 : 4

  const photoW =
    profile === 'instant'
      ? canvasWidth - margin * 2
      : Math.round(canvasWidth * 0.76)
  const photoH =
    profile === 'instant'
      ? Math.round(canvasHeight * 0.7)
      : Math.round(canvasHeight * 0.65)
  const photoX = Math.round((canvasWidth - photoW) / 2)
  const photoY = profile === 'instant' ? margin : Math.round(canvasHeight * 0.08)
  const captionY = photoY + photoH + (profile === 'instant' ? 4 : 10)
  const captionH = canvasHeight - captionY - margin

  return {
    id: `layout-original-${profile}-${shapeVariant}`,
    name,
    slug,
    format: 'original',
    label: 'Original keepsake frame',
    printSizeLabel: 'Original keepsake',
    canvasWidth,
    canvasHeight,
    borderWidth: margin,
    borderRadius,
    shapeVariant,
    profile,
    photoSlot: { x: photoX, y: photoY, width: photoW, height: photoH },
    captionZone: {
      x: margin,
      y: captionY,
      width: canvasWidth - margin * 2,
      height: Math.max(captionH, profile === 'instant' ? 72 : 56),
    },
  }
}

export const FRAME_LAYOUTS: FrameLayoutSpec[] = [
  landscape6x4Layout('classic', 'standard', 'frame-6x4-classic', 'Classic landscape'),
  landscape6x4Layout('rounded', 'standard', 'frame-6x4-soft', 'Soft corners'),
  landscape6x4Layout('bold', 'standard', 'frame-6x4-bold', 'Bold rail'),
  landscape6x4Layout('classic', 'instant', 'frame-6x4-instant', 'Instant landscape'),
  landscape6x4Layout('classic', 'gallery-mat', 'frame-6x4-mat', 'Gallery mat'),
  originalLayout('classic', 'standard', 'frame-original-classic', 'Classic original'),
  originalLayout('rounded', 'standard', 'frame-original-soft', 'Soft original'),
  originalLayout('classic', 'instant', 'frame-original-instant', 'Instant original'),
  originalLayout('classic', 'gallery-mat', 'frame-original-mat', 'Gallery mat original'),
]

export function getFrameLayout(
  format: FrameFormat = '6x4',
  shapeVariant: FrameShapeVariant = 'classic',
  profile: FrameLayoutProfile = 'standard',
) {
  return (
    FRAME_LAYOUTS.find(
      (l) =>
        l.format === format &&
        l.shapeVariant === shapeVariant &&
        l.profile === profile,
    ) ||
    FRAME_LAYOUTS.find((l) => l.format === format && l.profile === profile) ||
    FRAME_LAYOUTS.find((l) => l.format === format) ||
    FRAME_LAYOUTS[0]
  )
}

export function getLayoutsForFormat(format: FrameFormat = '6x4') {
  return FRAME_LAYOUTS.filter((l) => l.format === format)
}

export function photoTransformForCover(
  photoW: number,
  photoH: number,
  slotW: number,
  slotH: number,
): { x: number; y: number; scale: number } {
  if (!photoW || !photoH) return { x: 0, y: 0, scale: 1 }
  const scale = Math.max(slotW / photoW, slotH / photoH)
  const drawW = photoW * scale
  const drawH = photoH * scale
  return {
    x: (slotW - drawW) / 2,
    y: (slotH - drawH) / 2,
    scale,
  }
}

export function normalizeFrameFormat(format: string | undefined): FrameFormat {
  if (format === 'original' || format === 'polaroid' || format === '4x6') return 'original'
  return '6x4'
}

export function formatDisplayLabel(format: FrameFormat): string {
  return format === 'original' ? 'Original' : '6×4 Landscape'
}
