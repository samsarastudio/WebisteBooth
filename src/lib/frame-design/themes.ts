import type { FrameDesignColors, FrameThemeId } from './types'

export type FrameTheme = {
  id: FrameThemeId
  name: string
  blurb: string
  colors: FrameDesignColors
  captionMaxLength: number
  secondaryMaxLength: number
  defaultText: string
  defaultFont: string
  defaultTextSize: number
  photoRadius: number
  preview: { base: string; accent: string; text: string }
}

export const FRAME_THEMES: Record<FrameThemeId, FrameTheme> = {
  keepsake: {
    id: 'keepsake',
    name: 'Classic keepsake',
    blurb: 'Gallery-style white PLA, gold caption rail',
    colors: {
      base: '#F6F4EF',
      accent: '#D4AF37',
      text: '#C9A227',
      detail: '#DDD8CF',
    },
    captionMaxLength: 28,
    secondaryMaxLength: 18,
    defaultText: 'Anna & Stephen',
    defaultFont: 'Playfair Display',
    defaultTextSize: 28,
    photoRadius: 0,
    preview: { base: '#F6F4EF', accent: '#D4AF37', text: '#C9A227' },
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal white',
    blurb: 'Clean gallery frame, subtle rail',
    colors: {
      base: '#FAFAF8',
      accent: '#B8B8B4',
      text: '#3A3A38',
      detail: '#E8E8E6',
    },
    captionMaxLength: 24,
    secondaryMaxLength: 16,
    defaultText: 'Your names here',
    defaultFont: 'Inter',
    defaultTextSize: 28,
    photoRadius: 0,
    preview: { base: '#FAFAF8', accent: '#B8B8B4', text: '#3A3A38' },
  },
  'dark-accent': {
    id: 'dark-accent',
    name: 'Dark accent card',
    blurb: 'Dark base with bright accent rail',
    colors: {
      base: '#121212',
      accent: '#1DB954',
      text: '#FFFFFF',
      detail: '#535353',
    },
    captionMaxLength: 32,
    secondaryMaxLength: 20,
    defaultText: 'Our Song',
    defaultFont: 'Inter',
    defaultTextSize: 28,
    photoRadius: 4,
    preview: { base: '#121212', accent: '#1DB954', text: '#FFFFFF' },
  },
  celebration: {
    id: 'celebration',
    name: 'Celebration',
    blurb: 'Soft white frame, blush accent rail',
    colors: {
      base: '#FFF8F6',
      accent: '#E8A598',
      text: '#C4726E',
      detail: '#F0DDD8',
    },
    captionMaxLength: 28,
    secondaryMaxLength: 18,
    defaultText: 'With love — Mia',
    defaultFont: 'Playfair Display',
    defaultTextSize: 28,
    photoRadius: 4,
    preview: { base: '#FFF8F6', accent: '#E8A598', text: '#C4726E' },
  },
  modern: {
    id: 'modern',
    name: 'Modern slate',
    blurb: 'Cool grey gallery frame',
    colors: {
      base: '#ECECEA',
      accent: '#6B7280',
      text: '#374151',
      detail: '#D1D5DB',
    },
    captionMaxLength: 26,
    secondaryMaxLength: 18,
    defaultText: 'Anna & Stephen',
    defaultFont: 'Inter',
    defaultTextSize: 28,
    photoRadius: 2,
    preview: { base: '#ECECEA', accent: '#6B7280', text: '#374151' },
  },
}

export function getTheme(id?: FrameThemeId | string): FrameTheme {
  const key = id === 'spotify' ? 'dark-accent' : (id ?? 'keepsake')
  return FRAME_THEMES[key as FrameThemeId] ?? FRAME_THEMES.keepsake
}

export function shadeHex(hex: string, amount: number): string {
  const n = hex.replace('#', '')
  const num = parseInt(n.length === 3 ? n.split('').map((c) => c + c).join('') : n, 16)
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount))
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}
