import type { FrameFormat } from '@/lib/frame-design/types'
import { MM_PER_INCH, type SizeCommonBackFeatures } from './types'

/** Physical outer envelope (inches → mm). Matches Design Studio canvas scale. */
export const FRAME_OUTER_IN: Record<FrameFormat, { w: number; h: number }> = {
  '6x4': { w: 6, h: 4 },
  original: { w: 4, h: 4 },
}

export function outerMm(format: FrameFormat) {
  const inch = FRAME_OUTER_IN[format]
  return {
    width: roundMm(inch.w * MM_PER_INCH),
    height: roundMm(inch.h * MM_PER_INCH),
  }
}

export function roundMm(n: number, digits = 3) {
  const f = 10 ** digits
  return Math.round(n * f) / f
}

/** Default plate thicknesses — thin enough for FDM, stiff enough for fridge use. */
export const PART_THICKNESS_MM = {
  front: 2.2,
  back: 2.0,
  spacer: 1.2,
} as const

/**
 * Back-panel hardware that is identical for every design of a given size.
 * Magnet strip recess + QR pocket only — no engraving.
 */
export const SIZE_COMMON_BACK: Record<FrameFormat, SizeCommonBackFeatures> = {
  '6x4': {
    magnetStrip: {
      recesses: [
        {
          id: 'magnet-left',
          width: 12,
          height: 50,
          depth: 0.9,
          centerXFromMid: -45,
          yFromBottom: 25,
        },
        {
          id: 'magnet-right',
          width: 12,
          height: 50,
          depth: 0.9,
          centerXFromMid: 45,
          yFromBottom: 25,
        },
      ],
    },
    qrCode: {
      width: 22,
      height: 22,
      depth: 0.5,
      centerXFromMid: 0,
      centerYFromMid: -28,
    },
  },
  original: {
    magnetStrip: {
      recesses: [
        {
          id: 'magnet-left',
          width: 10,
          height: 40,
          depth: 0.9,
          centerXFromMid: -28,
          yFromBottom: 22,
        },
        {
          id: 'magnet-right',
          width: 10,
          height: 40,
          depth: 0.9,
          centerXFromMid: 28,
          yFromBottom: 22,
        },
      ],
    },
    qrCode: {
      width: 20,
      height: 20,
      depth: 0.5,
      centerXFromMid: 0,
      centerYFromMid: -24,
    },
  },
}

/** Clearance added around the design-studio photo slot when cutting the front window. */
export const PHOTO_WINDOW_CLEARANCE_MM = 0.4

/** Lip depth for nesting front↔back (vertical walls only — layflat safe). */
export const NEST_LIP_MM = {
  width: 1.2,
  depth: 0.8,
} as const
