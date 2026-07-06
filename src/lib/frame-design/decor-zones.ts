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

export function spawnOrnamentPosition(
  zones: ZoneRect[],
  photoSlot: ZoneRect,
  canvasWidth: number,
): { x: number; y: number } {
  const top = zones.find((z) => z.y === 0 && z.height <= photoSlot.y + 4)
  if (top) return { x: top.x + Math.min(48, top.width * 0.12), y: top.y + top.height / 2 }
  const side = zones.find((z) => z.width < photoSlot.width * 0.5)
  if (side) return { x: side.x + side.width / 2, y: side.y + side.height * 0.25 }
  return { x: canvasWidth * 0.1, y: photoSlot.y / 2 }
}
