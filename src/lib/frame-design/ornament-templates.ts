import type { FrameLayoutSpec } from '@/lib/frame-design/layouts'
import type { FrameOrnamentData, OrnamentLayer } from '@/lib/frame-design/types'

import {
  clampOrnamentPosition,
  getDecorZones,
  getOrnamentHalfSize,
} from '@/lib/frame-design/decor-zones'

export type OrnamentTemplateFinish = 'raised3d' | 'sticker'

export type OrnamentTemplate = {
  id: string
  name: string
  description: string
  finish: OrnamentTemplateFinish
}

export const STICKER_ORNAMENT_TEMPLATES: OrnamentTemplate[] = [
  {
    id: 'sticker-floral-border',
    name: 'Full floral border',
    description: 'Corner florals with vine accents around the whole frame.',
    finish: 'sticker',
  },
  {
    id: 'sticker-celebration',
    name: 'Celebration scatter',
    description: 'Confetti and stars along every border edge.',
    finish: 'sticker',
  },
  {
    id: 'sticker-vine-garland',
    name: 'Vine garland',
    description: 'Flowing vine scrolls wrapping the keepsake.',
    finish: 'sticker',
  },
]

export const RAISED_ORNAMENT_TEMPLATES: OrnamentTemplate[] = [
  {
    id: 'raised-romance-mail',
    name: 'Doves & letters',
    description: 'Birds, envelopes, and tulips — romance gallery style.',
    finish: 'raised3d',
  },
  {
    id: 'raised-garden-frame',
    name: 'Garden florals',
    description: 'Corner vines, roses, and leaf sprigs around the frame.',
    finish: 'raised3d',
  },
  {
    id: 'raised-classic-flourish',
    name: 'Classic flourish',
    description: 'Elegant flourishes and scrolls on every edge.',
    finish: 'raised3d',
  },
]

export const ORNAMENT_TEMPLATES = [...STICKER_ORNAMENT_TEMPLATES, ...RAISED_ORNAMENT_TEMPLATES]

type Placement = {
  slug: string
  x: number
  y: number
  scale?: number
  rotation?: number
}

function findBySlug(ornaments: FrameOrnamentData[], slug: string) {
  return ornaments.find((o) => o.slug === slug)
}

function frameAnchors(layout: FrameLayoutSpec) {
  const { canvasWidth: w, canvasHeight: h, photoSlot: ps, captionZone: cap, borderWidth: m } =
    layout
  const inset = Math.max(18, m * 0.85)
  const capMidY = cap ? cap.y + cap.height / 2 : h - inset - 8
  const sideMidY = ps.y + ps.height / 2

  return {
    topLeft: { x: inset, y: inset },
    topCenter: { x: w / 2, y: inset + 4 },
    topRight: { x: w - inset, y: inset },
    midLeft: { x: inset, y: sideMidY },
    midRight: { x: w - inset, y: sideMidY },
    bottomLeft: { x: inset, y: capMidY },
    bottomCenter: { x: w / 2, y: h - inset - 2 },
    bottomRight: { x: w - inset, y: capMidY },
    topQuarter: { x: w * 0.28, y: inset + 2 },
    topThreeQuarter: { x: w * 0.72, y: inset + 2 },
  }
}

function buildLayers(
  layout: FrameLayoutSpec,
  ornaments: FrameOrnamentData[],
  placements: Placement[],
  startZ = 1,
): OrnamentLayer[] {
  const zones = getDecorZones(
    layout.canvasWidth,
    layout.canvasHeight,
    layout.photoSlot,
    layout.captionZone,
  )
  const stamp = Date.now()
  const layers: OrnamentLayer[] = []
  let z = startZ

  for (const p of placements) {
    const ornament = findBySlug(ornaments, p.slug)
    if (!ornament) continue

    const scale = p.scale ?? 1
    const half = getOrnamentHalfSize(ornament, scale)
    const { x, y } = clampOrnamentPosition(
      p.x,
      p.y,
      half,
      zones,
      layout.photoSlot,
      layout.canvasWidth,
      layout.canvasHeight,
    )

    layers.push({
      id: `orn-${stamp}-${z}`,
      assetId: String(ornament.id),
      x,
      y,
      scale,
      rotation: p.rotation ?? 0,
      zIndex: z,
    })
    z += 1
  }

  return layers
}

function stickerFloralBorder(layout: FrameLayoutSpec, ornaments: FrameOrnamentData[]) {
  const a = frameAnchors(layout)
  return buildLayers(layout, ornaments, [
    { slug: 'sticker-floral', x: a.topLeft.x, y: a.topLeft.y, rotation: 0, scale: 0.95 },
    { slug: 'sticker-floral', x: a.topRight.x, y: a.topRight.y, rotation: 90, scale: 0.95 },
    { slug: 'sticker-floral', x: a.bottomLeft.x, y: a.bottomLeft.y, rotation: -90, scale: 0.9 },
    { slug: 'sticker-floral', x: a.bottomRight.x, y: a.bottomRight.y, rotation: 180, scale: 0.9 },
    { slug: 'sticker-vine', x: a.topCenter.x, y: a.topCenter.y, scale: 0.75, rotation: 0 },
    { slug: 'sticker-vine', x: a.bottomCenter.x, y: a.bottomCenter.y, scale: 0.7, rotation: 180 },
    { slug: 'sticker-vine', x: a.midLeft.x, y: a.midLeft.y, scale: 0.65, rotation: -90 },
    { slug: 'sticker-vine', x: a.midRight.x, y: a.midRight.y, scale: 0.65, rotation: 90 },
    { slug: 'sticker-heart-wreath', x: a.topQuarter.x, y: a.topLeft.y + 8, scale: 0.55 },
    { slug: 'sticker-heart-wreath', x: a.topThreeQuarter.x, y: a.topRight.y + 8, scale: 0.55 },
  ])
}

function stickerCelebration(layout: FrameLayoutSpec, ornaments: FrameOrnamentData[]) {
  const a = frameAnchors(layout)
  return buildLayers(layout, ornaments, [
    { slug: 'sticker-confetti', x: a.topLeft.x, y: a.topLeft.y, scale: 0.85 },
    { slug: 'sticker-confetti', x: a.topRight.x, y: a.topRight.y, scale: 0.85 },
    { slug: 'sticker-confetti', x: a.bottomLeft.x, y: a.bottomLeft.y, scale: 0.8 },
    { slug: 'sticker-confetti', x: a.bottomRight.x, y: a.bottomRight.y, scale: 0.8 },
    { slug: 'sticker-stars', x: a.topCenter.x, y: a.topCenter.y, scale: 0.8 },
    { slug: 'sticker-stars', x: a.bottomCenter.x, y: a.bottomCenter.y, scale: 0.75 },
    { slug: 'sticker-stars', x: a.midLeft.x, y: a.midLeft.y - 20, scale: 0.65 },
    { slug: 'sticker-stars', x: a.midRight.x, y: a.midRight.y - 20, scale: 0.65 },
    { slug: 'sticker-confetti', x: a.topQuarter.x, y: a.topCenter.y, scale: 0.6 },
    { slug: 'sticker-confetti', x: a.topThreeQuarter.x, y: a.topCenter.y, scale: 0.6 },
    { slug: 'sticker-heart-wreath', x: a.midLeft.x, y: a.midLeft.y + 24, scale: 0.5 },
    { slug: 'sticker-heart-wreath', x: a.midRight.x, y: a.midRight.y + 24, scale: 0.5 },
  ])
}

function stickerVineGarland(layout: FrameLayoutSpec, ornaments: FrameOrnamentData[]) {
  const a = frameAnchors(layout)
  const { canvasWidth: w } = layout
  return buildLayers(layout, ornaments, [
    { slug: 'sticker-vine', x: w * 0.2, y: a.topLeft.y + 6, scale: 0.72, rotation: 8 },
    { slug: 'sticker-vine', x: w * 0.5, y: a.topCenter.y, scale: 0.78, rotation: 0 },
    { slug: 'sticker-vine', x: w * 0.8, y: a.topRight.y + 6, scale: 0.72, rotation: -8 },
    { slug: 'sticker-vine', x: a.midLeft.x, y: a.midLeft.y - 30, scale: 0.68, rotation: -90 },
    { slug: 'sticker-vine', x: a.midLeft.x, y: a.midLeft.y + 28, scale: 0.68, rotation: -90 },
    { slug: 'sticker-vine', x: a.midRight.x, y: a.midRight.y - 30, scale: 0.68, rotation: 90 },
    { slug: 'sticker-vine', x: a.midRight.x, y: a.midRight.y + 28, scale: 0.68, rotation: 90 },
    { slug: 'sticker-vine', x: w * 0.25, y: a.bottomCenter.y, scale: 0.7, rotation: 175 },
    { slug: 'sticker-vine', x: w * 0.75, y: a.bottomCenter.y, scale: 0.7, rotation: 185 },
    { slug: 'sticker-floral', x: a.bottomLeft.x, y: a.bottomLeft.y, scale: 0.75, rotation: -90 },
    { slug: 'sticker-floral', x: a.bottomRight.x, y: a.bottomRight.y, scale: 0.75, rotation: 180 },
  ])
}

function raisedRomanceMail(layout: FrameLayoutSpec, ornaments: FrameOrnamentData[]) {
  const a = frameAnchors(layout)
  const { canvasWidth: w } = layout
  return buildLayers(layout, ornaments, [
    { slug: 'bird-mail-romance', x: a.topLeft.x + 6, y: a.topLeft.y + 4, scale: 0.92, rotation: -8 },
    { slug: 'bird-mail-romance', x: a.topRight.x - 6, y: a.topRight.y + 4, scale: 0.92, rotation: 8 },
    { slug: 'envelope-love', x: a.topCenter.x, y: a.topCenter.y + 2, scale: 0.85 },
    { slug: 'tulip-romance', x: a.bottomLeft.x, y: a.bottomLeft.y, scale: 0.88, rotation: -12 },
    { slug: 'tulip-romance', x: a.bottomRight.x, y: a.bottomRight.y, scale: 0.88, rotation: 12 },
    { slug: 'vine-corner-raised', x: a.topLeft.x - 2, y: a.topLeft.y - 2, scale: 0.8, rotation: 0 },
    { slug: 'vine-corner-raised', x: a.topRight.x + 2, y: a.topRight.y - 2, scale: 0.8, rotation: 90 },
    { slug: 'leaf-sprig-raised', x: a.midLeft.x, y: a.midLeft.y, scale: 0.72, rotation: -90 },
    { slug: 'leaf-sprig-raised', x: a.midRight.x, y: a.midRight.y, scale: 0.72, rotation: 90 },
    { slug: 'envelope-love', x: w * 0.32, y: a.bottomCenter.y - 4, scale: 0.65, rotation: -6 },
    { slug: 'envelope-love', x: w * 0.68, y: a.bottomCenter.y - 4, scale: 0.65, rotation: 6 },
  ])
}

function raisedGardenFrame(layout: FrameLayoutSpec, ornaments: FrameOrnamentData[]) {
  const a = frameAnchors(layout)
  const { canvasWidth: w } = layout
  return buildLayers(layout, ornaments, [
    { slug: 'vine-corner-raised', x: a.topLeft.x, y: a.topLeft.y, scale: 0.95 },
    { slug: 'vine-corner-raised', x: a.topRight.x, y: a.topRight.y, scale: 0.95, rotation: 90 },
    { slug: 'vine-corner-raised', x: a.bottomLeft.x, y: a.bottomLeft.y, scale: 0.9, rotation: -90 },
    { slug: 'vine-corner-raised', x: a.bottomRight.x, y: a.bottomRight.y, scale: 0.9, rotation: 180 },
    { slug: 'floral-cluster-raised', x: a.topCenter.x, y: a.topCenter.y + 4, scale: 0.82 },
    { slug: 'rose-bud-raised', x: a.midLeft.x, y: a.midLeft.y - 22, scale: 0.78, rotation: -15 },
    { slug: 'rose-bud-raised', x: a.midRight.x, y: a.midRight.y - 22, scale: 0.78, rotation: 15 },
    { slug: 'leaf-sprig-raised', x: a.midLeft.x, y: a.midLeft.y + 26, scale: 0.7, rotation: -80 },
    { slug: 'leaf-sprig-raised', x: a.midRight.x, y: a.midRight.y + 26, scale: 0.7, rotation: 80 },
    { slug: 'tulip-romance', x: w * 0.22, y: a.bottomCenter.y, scale: 0.7 },
    { slug: 'tulip-romance', x: w * 0.78, y: a.bottomCenter.y, scale: 0.7 },
  ])
}

function raisedClassicFlourish(layout: FrameLayoutSpec, ornaments: FrameOrnamentData[]) {
  const a = frameAnchors(layout)
  return buildLayers(layout, ornaments, [
    { slug: 'flourish-corner', x: a.topLeft.x, y: a.topLeft.y, scale: 0.9, rotation: 0 },
    { slug: 'flourish-corner', x: a.topRight.x, y: a.topRight.y, scale: 0.9, rotation: 90 },
    { slug: 'flourish-corner', x: a.bottomLeft.x, y: a.bottomLeft.y, scale: 0.85, rotation: -90 },
    { slug: 'flourish-corner', x: a.bottomRight.x, y: a.bottomRight.y, scale: 0.85, rotation: 180 },
    { slug: 'vine-scroll-raised', x: a.topCenter.x, y: a.topCenter.y, scale: 0.8 },
    { slug: 'vine-scroll-raised', x: a.bottomCenter.x, y: a.bottomCenter.y, scale: 0.75, rotation: 180 },
    { slug: 'arc-geometric', x: a.midLeft.x, y: a.midLeft.y, scale: 0.7, rotation: -90 },
    { slug: 'arc-geometric', x: a.midRight.x, y: a.midRight.y, scale: 0.7, rotation: 90 },
    { slug: 'floral-cluster-raised', x: a.topQuarter.x, y: a.topLeft.y + 10, scale: 0.62 },
    { slug: 'floral-cluster-raised', x: a.topThreeQuarter.x, y: a.topRight.y + 10, scale: 0.62 },
  ])
}

const BUILDERS: Record<
  string,
  (layout: FrameLayoutSpec, ornaments: FrameOrnamentData[]) => OrnamentLayer[]
> = {
  'sticker-floral-border': stickerFloralBorder,
  'sticker-celebration': stickerCelebration,
  'sticker-vine-garland': stickerVineGarland,
  'raised-romance-mail': raisedRomanceMail,
  'raised-garden-frame': raisedGardenFrame,
  'raised-classic-flourish': raisedClassicFlourish,
}

export function applyOrnamentTemplate(
  templateId: string,
  layout: FrameLayoutSpec,
  ornaments: FrameOrnamentData[],
): OrnamentLayer[] {
  const build = BUILDERS[templateId]
  if (!build) return []
  return build(layout, ornaments)
}

export function getTemplatesForFinish(finish: OrnamentTemplateFinish) {
  return ORNAMENT_TEMPLATES.filter((t) => t.finish === finish)
}
