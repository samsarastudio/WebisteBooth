import type { TextLayer } from './types'

/** Default raised caption size tuned for print legibility */
export const CAPTION_TEXT_SIZE = 28

/** Inset from caption rail edges — text stays inside for 3D print */
export const CAPTION_TEXT_PADDING = 14

export const CAPTION_LINE_HEIGHT = 1.35

export function captionCenter(zone: {
  x: number
  y: number
  width: number
  height: number
}): { x: number; y: number } {
  return {
    x: zone.x + zone.width / 2,
    y: zone.y + zone.height / 2,
  }
}

export function makeTextLayer(
  id: string,
  text: string,
  x: number,
  y: number,
  opts?: Partial<Pick<TextLayer, 'font' | 'size' | 'color' | 'rotation' | 'maxLength'>>,
): TextLayer {
  const maxLength = opts?.maxLength ?? 28
  return {
    id,
    text: text.slice(0, maxLength),
    font: opts?.font ?? 'Playfair Display',
    size: opts?.size ?? CAPTION_TEXT_SIZE,
    color: opts?.color ?? '#2B2B2B',
    x,
    y,
    rotation: opts?.rotation ?? 0,
    maxLength,
  }
}

export function clampText(text: string, maxLength: number) {
  return text.slice(0, maxLength)
}

/** Estimate how many characters fit on one caption line for wrapping. */
export function charsPerCaptionLine(boxWidth: number, fontSize: number) {
  const avgCharWidth = fontSize * 0.52
  return Math.max(6, Math.floor(boxWidth / avgCharWidth))
}

/** Break long captions into centered print lines (handles unbroken strings + explicit newlines). */
export function wrapCaptionText(text: string, boxWidth: number, fontSize: number) {
  const maxChars = charsPerCaptionLine(boxWidth, fontSize)
  const lines: string[] = []

  for (const paragraph of text.split('\n')) {
    let chunk = paragraph
    while (chunk.length > maxChars) {
      lines.push(chunk.slice(0, maxChars))
      chunk = chunk.slice(maxChars)
    }
    if (chunk.length) lines.push(chunk)
  }

  return lines.join('\n')
}

export function captionCenterX(zone: { x: number; width: number }) {
  return zone.x + zone.width / 2
}

/** Snap text layer to horizontal center of caption rail (and vertical middle by default). */
export function centerTextInCaption(
  layer: TextLayer,
  captionZone: { x: number; y: number; width: number; height: number },
): TextLayer {
  const c = captionCenter(captionZone)
  return { ...layer, x: c.x, y: c.y }
}

/** Lock caption text to the center of the print-safe caption rail. */
export function lockTextToCaption(
  layer: TextLayer,
  captionZone: { x: number; y: number; width: number; height: number },
): TextLayer {
  const c = captionCenter(captionZone)
  return {
    ...layer,
    x: c.x,
    y: c.y,
    rotation: 0,
    size: CAPTION_TEXT_SIZE,
  }
}

/** Re-anchor text layers to the caption zone after a layout change. */
export function repositionTextForLayout(
  layers: TextLayer[],
  captionZone: { x: number; y: number; width: number; height: number } | undefined,
  canvasWidth: number,
  canvasHeight: number,
): TextLayer[] {
  if (!layers.length) return layers
  if (!captionZone) {
    return layers.map((t, i) =>
      i === 0
        ? { ...t, x: canvasWidth / 2, y: canvasHeight - 40, size: CAPTION_TEXT_SIZE, rotation: 0 }
        : t,
    )
  }

  return layers.map((t) => lockTextToCaption(t, captionZone))
}
