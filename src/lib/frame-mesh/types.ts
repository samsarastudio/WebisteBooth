import type { FrameFormat } from '@/lib/frame-design/types'

/** Millimetres — slicer-native units */
export const MM_PER_INCH = 25.4

export type Vec3 = [number, number, number]

export type FramePartId = 'front' | 'back' | 'spacer'

export type BooleanOpKind = 'union' | 'subtract' | 'intersect'

export type BooleanOpSpec = {
  id: string
  kind: BooleanOpKind
  /** Human label for manifests / debugging */
  label: string
  /**
   * Axis-aligned box in part-local mm.
   * Origin is the part corner at (0,0,0); +Z is away from the print bed
   * when the part is oriented layflat (bed = XY plane).
   */
  box: {
    origin: Vec3
    size: Vec3
  }
}

export type LayflatPrintHints = {
  /** Part sits flat on the bed — no supports by design */
  supportsRequired: false
  bedPlane: 'XY'
  /** Which face points +Z (away from bed) when printing */
  faceUp: 'guest' | 'magnet' | 'inner'
  maxOverhangDegrees: 0
  notes: string[]
}

export type FramePartSpec = {
  partId: FramePartId
  name: string
  format: FrameFormat
  /** Outer plate size mm */
  outer: { width: number; height: number; thickness: number }
  baseSolid: { origin: Vec3; size: Vec3 }
  operations: BooleanOpSpec[]
  print: LayflatPrintHints
}

export type FrameAssemblyManifest = {
  format: FrameFormat
  outerMm: { width: number; height: number }
  stackOrder: FramePartId[]
  parts: FramePartSpec[]
  assemblyNotes: string[]
}

/** Size-common hardware features (shared by all designs of that format). */
export type SizeCommonBackFeatures = {
  magnetStrip: {
    /** Recess pockets for adhesive magnet strip(s) */
    recesses: Array<{
      id: string
      /** Centered along X; Y from bottom edge of back plate */
      width: number
      height: number
      depth: number
      /** Offset of pocket center from plate center X, and from bottom edge Y */
      centerXFromMid: number
      yFromBottom: number
    }>
  }
  qrCode: {
    /** Shallow pocket for QR sticker / insert — not engraving */
    width: number
    height: number
    depth: number
    /** Center of pocket from plate center */
    centerXFromMid: number
    centerYFromMid: number
  }
}
