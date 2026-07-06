import type { ColorPaletteId } from './color-palettes'
import { getPalette } from './color-palettes'
import {
  getFrameLayout,
  type FrameLayoutProfile,
  type FrameLayoutSpec,
  type FrameShapeVariant,
} from './layouts'
import { getTheme } from './themes'
import {
  captionCenter,
  CAPTION_TEXT_SIZE,
  makeTextLayer,
} from './text-utils'
import {
  createDefaultDesign,
  type FrameDesignState,
  type FrameFormat,
  type FrameOrnamentData,
  type FrameStylePreset,
  type FrameThemeId,
  type TextLayer,
} from './types'

export type FrameBaseRenderStyle =
  | 'classic-ornate'
  | 'celebration-soft'
  | 'modern-stripe'
  | 'plain-lines'
  | 'plain-double'
  | 'instant-rail'
  | 'romance-decor'
  | 'gallery-mat'
  | 'fabric-weave'

export type FrameBaseId =
  | 'landscape-classic'
  | 'landscape-celebration'
  | 'landscape-modern'
  | 'landscape-plain-lines'
  | 'landscape-plain-frame'
  | 'landscape-instant'
  | 'landscape-romance'
  | 'original-romance'
  | 'original-celebration'
  | 'original-instant'
  | 'original-gallery-mat'
  | 'original-classic'
  | 'original-plain'

export type FrameBaseStructure = {
  id: FrameBaseId
  name: string
  blurb: string
  format: FrameFormat
  shapeVariant: FrameShapeVariant
  layoutProfile: FrameLayoutProfile
  themeId: FrameThemeId
  defaultPaletteId: ColorPaletteId
  renderStyle: FrameBaseRenderStyle
  baseAssetPath?: string
}

export const FRAME_BASE_STRUCTURES: FrameBaseStructure[] = [
  {
    id: 'original-romance',
    name: 'Romance',
    blurb: 'Gallery keepsake with dove & tulips',
    format: 'original',
    shapeVariant: 'classic',
    layoutProfile: 'standard',
    themeId: 'keepsake',
    defaultPaletteId: 'golden-romance',
    renderStyle: 'romance-decor',
    baseAssetPath: '/brand/frame-bases/original-romance.svg',
  },
  {
    id: 'original-instant',
    name: 'Instant',
    blurb: 'Thick caption rail, ribbed texture',
    format: 'original',
    shapeVariant: 'classic',
    layoutProfile: 'instant',
    themeId: 'minimal',
    defaultPaletteId: 'snow-minimal',
    renderStyle: 'instant-rail',
    baseAssetPath: '/brand/frame-bases/original-instant.svg',
  },
  {
    id: 'original-gallery-mat',
    name: 'Gallery mat',
    blurb: 'Recessed mat with soft inset',
    format: 'original',
    shapeVariant: 'classic',
    layoutProfile: 'gallery-mat',
    themeId: 'keepsake',
    defaultPaletteId: 'ivory-copper',
    renderStyle: 'gallery-mat',
    baseAssetPath: '/brand/frame-bases/original-gallery-mat.svg',
  },
  {
    id: 'original-celebration',
    name: 'Celebration',
    blurb: 'Soft blush corners, rounded rail',
    format: 'original',
    shapeVariant: 'rounded',
    layoutProfile: 'standard',
    themeId: 'celebration',
    defaultPaletteId: 'blush-celebration',
    renderStyle: 'celebration-soft',
    baseAssetPath: '/brand/frame-bases/original-celebration.svg',
  },
  {
    id: 'original-classic',
    name: 'Classic',
    blurb: 'Wide border with corner accents',
    format: 'original',
    shapeVariant: 'classic',
    layoutProfile: 'standard',
    themeId: 'keepsake',
    defaultPaletteId: 'classic-gold',
    renderStyle: 'classic-ornate',
    baseAssetPath: '/brand/frame-bases/original-classic.svg',
  },
  {
    id: 'original-plain',
    name: 'Plain lined',
    blurb: 'Minimal rules on caption rail',
    format: 'original',
    shapeVariant: 'classic',
    layoutProfile: 'standard',
    themeId: 'minimal',
    defaultPaletteId: 'snow-minimal',
    renderStyle: 'plain-lines',
    baseAssetPath: '/brand/frame-bases/original-plain.svg',
  },
  {
    id: 'landscape-classic',
    name: 'Classic keepsake',
    blurb: 'Wide border rail, subtle corner accents',
    format: '6x4',
    shapeVariant: 'classic',
    layoutProfile: 'standard',
    themeId: 'keepsake',
    defaultPaletteId: 'classic-gold',
    renderStyle: 'classic-ornate',
    baseAssetPath: '/brand/frame-bases/landscape-classic.svg',
  },
  {
    id: 'landscape-romance',
    name: 'Romance landscape',
    blurb: 'Dove & tulip accents on wide frame',
    format: '6x4',
    shapeVariant: 'classic',
    layoutProfile: 'standard',
    themeId: 'keepsake',
    defaultPaletteId: 'golden-romance',
    renderStyle: 'romance-decor',
    baseAssetPath: '/brand/frame-bases/landscape-romance.svg',
  },
  {
    id: 'landscape-instant',
    name: 'Instant landscape',
    blurb: 'Thick bottom caption, ribbed body',
    format: '6x4',
    shapeVariant: 'classic',
    layoutProfile: 'instant',
    themeId: 'minimal',
    defaultPaletteId: 'snow-minimal',
    renderStyle: 'instant-rail',
    baseAssetPath: '/brand/frame-bases/landscape-instant.svg',
  },
  {
    id: 'landscape-celebration',
    name: 'Celebration',
    blurb: 'Soft rounded corners, blush fillet',
    format: '6x4',
    shapeVariant: 'rounded',
    layoutProfile: 'standard',
    themeId: 'celebration',
    defaultPaletteId: 'blush-celebration',
    renderStyle: 'celebration-soft',
    baseAssetPath: '/brand/frame-bases/landscape-celebration.svg',
  },
  {
    id: 'landscape-modern',
    name: 'Modern slate',
    blurb: 'Clean flat body, accent caption stripe',
    format: '6x4',
    shapeVariant: 'classic',
    layoutProfile: 'standard',
    themeId: 'modern',
    defaultPaletteId: 'modern-slate',
    renderStyle: 'modern-stripe',
    baseAssetPath: '/brand/frame-bases/landscape-modern.svg',
  },
  {
    id: 'landscape-plain-lines',
    name: 'Plain lined',
    blurb: 'Minimal frame with horizontal rules',
    format: '6x4',
    shapeVariant: 'classic',
    layoutProfile: 'standard',
    themeId: 'minimal',
    defaultPaletteId: 'snow-minimal',
    renderStyle: 'plain-lines',
    baseAssetPath: '/brand/frame-bases/landscape-plain-lines.svg',
  },
  {
    id: 'landscape-plain-frame',
    name: 'Plain double frame',
    blurb: 'Simple inset double-line border',
    format: '6x4',
    shapeVariant: 'classic',
    layoutProfile: 'standard',
    themeId: 'minimal',
    defaultPaletteId: 'snow-minimal',
    renderStyle: 'plain-double',
    baseAssetPath: '/brand/frame-bases/landscape-plain-frame.svg',
  },
]

function buildTextLayers(
  layout: FrameLayoutSpec,
  theme: ReturnType<typeof getTheme>,
  textColor: string,
): TextLayer[] {
  const cap = layout.captionZone
  if (!cap) return []
  const c = captionCenter(cap)
  return [
    makeTextLayer('text-primary', theme.defaultText, c.x, c.y, {
      font: theme.defaultFont,
      size: CAPTION_TEXT_SIZE,
      color: textColor,
      maxLength: theme.captionMaxLength,
    }),
  ]
}

export function buildFrameFromBase(
  baseId: FrameBaseId,
  _ornaments: FrameOrnamentData[],
  _stylePresets: FrameStylePreset[],
  opts?: {
    keepPhoto?: Pick<
      FrameDesignState,
      'photoUrl' | 'photoMediaId' | 'photoNaturalSize' | 'photoTransform'
    >
    paletteId?: ColorPaletteId
  },
): FrameDesignState {
  const base =
    FRAME_BASE_STRUCTURES.find((b) => b.id === baseId) ?? FRAME_BASE_STRUCTURES[0]
  const theme = getTheme(base.themeId)
  const palette = getPalette(opts?.paletteId ?? base.defaultPaletteId)
  const layout = getFrameLayout(base.format, base.shapeVariant, base.layoutProfile)
  const core = createDefaultDesign(
    { ...layout, id: layout.id },
    undefined,
    base.shapeVariant,
  )

  return {
    ...core,
    format: base.format,
    shapeVariant: base.shapeVariant,
    templateId: String(layout.id),
    baseId: base.id,
    paletteId: palette.id,
    themeId: base.themeId,
    colors: { ...palette.colors },
    borderWidth: layout.borderWidth,
    textLayers: buildTextLayers(layout, theme, palette.colors.text),
    ornaments: [],
    photoUrl: opts?.keepPhoto?.photoUrl,
    photoMediaId: opts?.keepPhoto?.photoMediaId,
    photoNaturalSize: opts?.keepPhoto?.photoNaturalSize,
    photoTransform: opts?.keepPhoto?.photoTransform ?? core.photoTransform,
  }
}

export function basesForFormat(format: FrameFormat) {
  return FRAME_BASE_STRUCTURES.filter((b) => b.format === format)
}

export function getBaseStructure(baseId?: string) {
  return FRAME_BASE_STRUCTURES.find((b) => b.id === baseId) ?? FRAME_BASE_STRUCTURES[0]
}

export function defaultBaseForFormat(format: FrameFormat): FrameBaseId {
  return format === 'original' ? 'original-romance' : 'landscape-classic'
}
