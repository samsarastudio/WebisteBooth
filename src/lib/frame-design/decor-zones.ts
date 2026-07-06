import type { FrameOrnamentData, OrnamentLayer } from '@/lib/frame-design/types'

export type ZoneRect = { x: number; y: number; width: number; height: number }

export function getDecorZones(
  canvasWidth: number,
  canvasHeight: number,
  photoSlot: ZoneRect,
  captionZone?: ZoneRect,
): ZoneRect[] {
  const zones: ZoneRect[] = []

  if (photoSlot.y > 0) {
    zones.push({ x: 0, y: 0, width: canvasWidth, height: photoSlot.y })
  }
  if (photoSlot.x > 0) {
    zones.push({
      x: 0,
      y: photoSlot.y,
      width: photoSlot.x,
      height: photoSlot.height,
    })
  }
  const rightX = photoSlot.x + photoSlot.width
  if (rightX < canvasWidth) {
    zones.push({
      x: rightX,
      y: photoSlot.y,
      width: canvasWidth - rightX,
      height: photoSlot.height,
    })
  }
  const belowPhoto = photoSlot.y + photoSlot.height
  if (belowPhoto < canvasHeight) {
    zones.push({
      x: 0,
      y: belowPhoto,
      width: canvasWidth,
      height: canvasHeight - belowPhoto,
    })
  }
  if (captionZone && !zones.some((z) => zonesOverlap(z, captionZone))) {
    zones.push({ ...captionZone })
  }
  return zones
}

function zonesOverlap(a: ZoneRect, b: ZoneRect) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}

export function pointInRect(x: number, y: number, r: number, rect: ZoneRect) {
  return (
    x + r > rect.x &&
    x - r < rect.x + rect.width &&
    y + r > rect.y &&
    y - r < rect.y + rect.height
  )
}

export function overlapsPhotoSlot(
  x: number,
  y: number,
  halfSize: number,
  photoSlot: ZoneRect,
): boolean {
  return pointInRect(x, y, halfSize, photoSlot)
}

export function clampToDecorZones(
  x: number,
  y: number,
  halfSize: number,
  zones: ZoneRect[],
  photoSlot: ZoneRect,
): { x: number; y: number } {
  if (!overlapsPhotoSlot(x, y, halfSize, photoSlot)) return { x, y }

  let best = { x, y, dist: Infinity }
  for (const zone of zones) {
    const cx = Math.min(
      Math.max(x, zone.x + halfSize),
      zone.x + zone.width - halfSize,
    )
    const cy = Math.min(
      Math.max(y, zone.y + halfSize),
      zone.y + zone.height - halfSize,
    )
    if (!overlapsPhotoSlot(cx, cy, halfSize, photoSlot)) {
      const dist = (cx - x) ** 2 + (cy - y) ** 2
      if (dist < best.dist) best = { x: cx, y: cy, dist }
    }
  }
  if (best.dist < Infinity) return { x: best.x, y: best.y }

  const fallback = zones[0]
  if (fallback) {
    return {
      x: fallback.x + fallback.width * 0.2,
      y: fallback.y + fallback.height / 2,
    }
  }
  return { x: photoSlot.x - halfSize - 4, y: photoSlot.y / 2 }
}

export function clampToCanvas(
  x: number,
  y: number,
  halfSize: number,
  canvasWidth: number,
  canvasHeight: number,
  edgePad = 4,
): { x: number; y: number } {
  const pad = edgePad + halfSize
  return {
    x: Math.min(Math.max(x, pad), canvasWidth - pad),
    y: Math.min(Math.max(y, pad), canvasHeight - pad),
  }
}

const FLORAL_SHAPES = new Set([
  'tulip',
  'bird-mail',
  'envelope',
  'vine-scroll',
  'vine-corner',
  'floral-cluster',
  'rose-bud',
  'leaf-sprig',
  'flourish',
])

export function getOrnamentHalfSize(ornament: FrameOrnamentData | undefined, scale = 1) {
  const baseSize =
    ornament?.finish === 'sticker'
      ? 56
      : FLORAL_SHAPES.has(ornament?.shapeType || '')
        ? 48
        : 40
  return (baseSize * scale) / 2
}

export function clampOrnamentPosition(
  x: number,
  y: number,
  halfSize: number,
  zones: ZoneRect[],
  photoSlot: ZoneRect,
  canvasWidth: number,
  canvasHeight: number,
): { x: number; y: number } {
  const inDecor = clampToDecorZones(x, y, halfSize, zones, photoSlot)
  return clampToCanvas(inDecor.x, inDecor.y, halfSize, canvasWidth, canvasHeight)
}

export function normalizeOrnamentLayer(
  layer: OrnamentLayer,
  ornament: FrameOrnamentData | undefined,
  zones: ZoneRect[],
  photoSlot: ZoneRect,
  canvasWidth: number,
  canvasHeight: number,
): OrnamentLayer {
  const half = getOrnamentHalfSize(ornament, layer.scale)
  const pos = clampOrnamentPosition(
    layer.x,
    layer.y,
    half,
    zones,
    photoSlot,
    canvasWidth,
    canvasHeight,
  )
  return { ...layer, x: pos.x, y: pos.y }
}

export function spawnOrnamentPosition(
  zones: ZoneRect[],
  photoSlot: ZoneRect,
  canvasWidth: number,
  canvasHeight: number,
): { x: number; y: number } {
  const top = zones.find((z) => z.y === 0 && z.height <= photoSlot.y + 4)
  if (top) {
    const x = top.x + Math.min(48, top.width * 0.12)
    const y = top.y + top.height / 2
    return clampToCanvas(x, y, 28, canvasWidth, canvasHeight)
  }
  const side = zones.find((z) => z.width < photoSlot.width * 0.5)
  if (side) {
    const x = side.x + side.width / 2
    const y = side.y + side.height * 0.25
    return clampToCanvas(x, y, 28, canvasWidth, canvasHeight)
  }
  return clampToCanvas(canvasWidth * 0.1, photoSlot.y / 2, 28, canvasWidth, canvasHeight)
}
