export type FrameFormat = '6x4' | 'original'

export type PlaColorRole = 'base' | 'accent' | 'text' | 'detail'

export type FrameDesignColors = Record<PlaColorRole, string>

export type TextLayer = {
  id: string
  text: string
  font: string
  size: number
  color: string
  x: number
  y: number
  rotation: number
  maxLength?: number
}

export type OrnamentLayer = {
  id: string
  assetId: string
  x: number
  y: number
  scale: number
  rotation: number
  zIndex: number
}

export type PhotoTransform = {
  x: number
  y: number
  scale: number
}

export type FrameThemeId = 'keepsake' | 'minimal' | 'dark-accent' | 'celebration' | 'modern'

export type FrameDesignState = {
  format: FrameFormat
  templateId: string
  baseId?: string
  paletteId?: string
  themeId?: FrameThemeId
  shapeVariant?: 'classic' | 'rounded' | 'bold'
  stylePresetId?: string
  colors: FrameDesignColors
  borderWidth?: number
  photoMediaId?: string | number
  photoUrl?: string
  photoNaturalSize?: { width: number; height: number }
  photoTransform: PhotoTransform
  textLayers: TextLayer[]
  ornaments: OrnamentLayer[]
}

export type FrameTemplateData = {
  id: string | number
  name: string
  slug: string
  format: FrameFormat
  canvasWidth: number
  canvasHeight: number
  photoSlot: { x: number; y: number; width: number; height: number }
  captionZone?: { x: number; y: number; width: number; height: number }
  borderRadius: number
  borderWidth?: number
  printSizeLabel?: string
}

export type OrnamentFinish = 'raised3d' | 'sticker'

export type OrnamentShapeType =
  | 'heart'
  | 'star'
  | 'circle'
  | 'diamond'
  | 'flourish'
  | 'arc'
  | 'tulip'
  | 'bird-mail'
  | 'envelope'
  | 'vine-scroll'
  | 'vine-corner'
  | 'floral-cluster'
  | 'rose-bud'
  | 'leaf-sprig'

export type FrameOrnamentData = {
  id: string | number
  name: string
  slug: string
  category: 'corner' | 'floral' | 'geometric' | 'seasonal'
  kind: 'image' | 'shape'
  finish: OrnamentFinish
  assetPath?: string
  shapeType?: OrnamentShapeType
  imageUrl?: string
}

export type FrameStylePreset = {
  id: string | number
  name: string
  slug: string
  sampleMessage: string
  imagePath: string
  plaColors: { name: string; hex: string; role: PlaColorRole }[]
  templateSlug?: string
}

export const DEFAULT_COLORS: FrameDesignColors = {
  base: '#F4F1EA',
  accent: '#E8D36A',
  text: '#2B2B2B',
  detail: '#8A8F96',
}

export const CANVAS_FONTS = [
  'Playfair Display',
  'Georgia',
  'Inter',
  'Cursive',
] as const

import { getFrameLayout, type FrameShapeVariant } from '@/lib/frame-design/layouts'
import { CAPTION_TEXT_SIZE } from '@/lib/frame-design/text-utils'

export function createDefaultDesign(
  template: FrameTemplateData,
  stylePreset?: FrameStylePreset,
  shapeVariant: FrameShapeVariant = 'classic',
): FrameDesignState {
  const layout = getFrameLayout(
    (template.format as FrameFormat) || '6x4',
    shapeVariant,
  )
  const format = (template.format as FrameFormat) || '6x4'
  const active = { ...layout, ...template, id: template.id || layout.id, format }

  const colors = { ...DEFAULT_COLORS }
  if (stylePreset) {
    for (const c of stylePreset.plaColors) colors[c.role] = c.hex
  }

  const caption = active.captionZone
  const textLayers: TextLayer[] = caption
    ? [
        {
          id: 'text-primary',
          text: stylePreset?.sampleMessage || 'Your names here',
          font: 'Playfair Display',
          size: CAPTION_TEXT_SIZE,
          color: colors.text,
          x: caption.x + caption.width / 2,
          y: caption.y + caption.height / 2,
          rotation: 0,
        },
      ]
    : []

  return {
    format,
    templateId: String(active.id),
    shapeVariant,
    stylePresetId: stylePreset ? String(stylePreset.id) : undefined,
    colors,
    borderWidth: active.borderWidth,
    photoTransform: { x: 0, y: 0, scale: 1 },
    textLayers,
    ornaments: [],
  }
}

export function normalizeDesignState(
  state: FrameDesignState & { format?: string; themeId?: string },
): FrameDesignState {
  const rawTheme = state.themeId as string | undefined
  const themeId = rawTheme === 'spotify' ? 'dark-accent' : state.themeId
  const rawFormat = state.format as string | undefined
  const format: FrameFormat =
    rawFormat === '6x4'
      ? '6x4'
      : rawFormat === 'original' || rawFormat === 'polaroid' || rawFormat === '4x6'
        ? 'original'
        : '6x4'
  return {
    ...state,
    format,
    themeId: themeId as FrameThemeId | undefined,
    shapeVariant: state.shapeVariant || 'classic',
    textLayers: state.textLayers.map((t) => ({
      ...t,
      size: CAPTION_TEXT_SIZE,
      rotation: 0,
    })),
  }
}

export function designStorageKey(token?: string) {
  return token ? `ff_design_${token}` : 'ff_design_draft'
}
