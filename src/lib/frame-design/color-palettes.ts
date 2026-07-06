import type { FrameDesignColors, TextLayer } from './types'

export type ColorPaletteId =
  | 'classic-gold'
  | 'golden-romance'
  | 'blush-celebration'
  | 'ivory-copper'
  | 'garden-sage'
  | 'modern-slate'
  | 'snow-minimal'
  | 'rose-gold'
  | 'midnight-accent'
  | 'navy-champagne'

export type FrameColorPalette = {
  id: ColorPaletteId
  name: string
  colors: FrameDesignColors
  /** Mini swatch strip for the picker */
  swatch: [string, string, string, string]
}

export const FRAME_COLOR_PALETTES: FrameColorPalette[] = [
  {
    id: 'classic-gold',
    name: 'Classic Gold',
    colors: {
      base: '#F6F4EF',
      accent: '#D4AF37',
      text: '#B8941F',
      detail: '#DDD8CF',
    },
    swatch: ['#F6F4EF', '#D4AF37', '#B8941F', '#DDD8CF'],
  },
  {
    id: 'golden-romance',
    name: 'Golden Romance',
    colors: {
      base: '#F3F1EA',
      accent: '#E8C547',
      text: '#C9A227',
      detail: '#E5DCC8',
    },
    swatch: ['#F3F1EA', '#E8C547', '#C9A227', '#E5DCC8'],
  },
  {
    id: 'blush-celebration',
    name: 'Blush Celebration',
    colors: {
      base: '#FFF8F6',
      accent: '#E8A598',
      text: '#C4726E',
      detail: '#F0DDD8',
    },
    swatch: ['#FFF8F6', '#E8A598', '#C4726E', '#F0DDD8'],
  },
  {
    id: 'ivory-copper',
    name: 'Ivory & Copper',
    colors: {
      base: '#FAF8F4',
      accent: '#C17F3B',
      text: '#8B5A2B',
      detail: '#E8E0D4',
    },
    swatch: ['#FAF8F4', '#C17F3B', '#8B5A2B', '#E8E0D4'],
  },
  {
    id: 'garden-sage',
    name: 'Garden Sage',
    colors: {
      base: '#F4F6F0',
      accent: '#7A9E7E',
      text: '#4A6B4E',
      detail: '#D8E4D0',
    },
    swatch: ['#F4F6F0', '#7A9E7E', '#4A6B4E', '#D8E4D0'],
  },
  {
    id: 'modern-slate',
    name: 'Modern Slate',
    colors: {
      base: '#ECECEA',
      accent: '#6B7280',
      text: '#374151',
      detail: '#D1D5DB',
    },
    swatch: ['#ECECEA', '#6B7280', '#374151', '#D1D5DB'],
  },
  {
    id: 'snow-minimal',
    name: 'Snow Minimal',
    colors: {
      base: '#FAFAF8',
      accent: '#B8B8B4',
      text: '#3A3A38',
      detail: '#E8E8E6',
    },
    swatch: ['#FAFAF8', '#B8B8B4', '#3A3A38', '#E8E8E6'],
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    colors: {
      base: '#FFF9F7',
      accent: '#E8B4B8',
      text: '#B76E79',
      detail: '#F5E6E0',
    },
    swatch: ['#FFF9F7', '#E8B4B8', '#B76E79', '#F5E6E0'],
  },
  {
    id: 'midnight-accent',
    name: 'Midnight Accent',
    colors: {
      base: '#141414',
      accent: '#4ADE80',
      text: '#F5F5F5',
      detail: '#3A3A3A',
    },
    swatch: ['#141414', '#4ADE80', '#F5F5F5', '#3A3A3A'],
  },
  {
    id: 'navy-champagne',
    name: 'Navy & Champagne',
    colors: {
      base: '#1E2A3A',
      accent: '#D4C5A0',
      text: '#F5E6C8',
      detail: '#3D4F63',
    },
    swatch: ['#1E2A3A', '#D4C5A0', '#F5E6C8', '#3D4F63'],
  },
]

export function getPalette(id?: string): FrameColorPalette {
  return (
    FRAME_COLOR_PALETTES.find((p) => p.id === id) ?? FRAME_COLOR_PALETTES[0]
  )
}

export function applyPaletteToTextColor(textLayers: TextLayer[], textColor: string) {
  return textLayers.map((t) => ({ ...t, color: textColor }))
}
