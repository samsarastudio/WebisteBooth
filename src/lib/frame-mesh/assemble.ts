import type { FrameDesignState } from '@/lib/frame-design/types'
import {
  getFrameLayout,
  normalizeFrameFormat,
  PX_PER_INCH,
  type FrameShapeVariant,
} from '@/lib/frame-design/layouts'
import {
  NEST_LIP_MM,
  PART_THICKNESS_MM,
  PHOTO_WINDOW_CLEARANCE_MM,
  SIZE_COMMON_BACK,
  outerMm,
  roundMm,
} from './sizes'
import type { BooleanOpSpec, FrameAssemblyManifest, FramePartSpec } from './types'

function pxToMm(px: number) {
  return roundMm((px / PX_PER_INCH) * 25.4)
}

/**
 * Build the modular BOM + boolean-op graph for a design.
 * Back panel ops are size-common (magnet + QR); front uses the design's photo slot.
 */
export function buildAssemblyManifest(state: FrameDesignState): FrameAssemblyManifest {
  const format = normalizeFrameFormat(state.format)
  const shape = (state.shapeVariant || 'classic') as FrameShapeVariant
  const layout = getFrameLayout(format, shape, 'standard')
  const outer = outerMm(format)
  const backCommon = SIZE_COMMON_BACK[format]

  const frontThickness = PART_THICKNESS_MM.front
  const backThickness = PART_THICKNESS_MM.back
  const spacerThickness = PART_THICKNESS_MM.spacer

  // Photo window in mm from design layout (canvas px → mm)
  const slot = layout.photoSlot
  const windowW = roundMm(pxToMm(slot.width) + PHOTO_WINDOW_CLEARANCE_MM * 2)
  const windowH = roundMm(pxToMm(slot.height) + PHOTO_WINDOW_CLEARANCE_MM * 2)
  const windowX = roundMm(pxToMm(slot.x) - PHOTO_WINDOW_CLEARANCE_MM)
  const windowY = roundMm(outer.height - pxToMm(slot.y) - pxToMm(slot.height) - PHOTO_WINDOW_CLEARANCE_MM)
  // Canvas Y grows down; mesh Y grows up from bottom of plate — convert.

  const frontOps: BooleanOpSpec[] = [
    {
      id: 'photo-window',
      kind: 'subtract',
      label: 'Photo window (through)',
      box: {
        // Oversize Z so the cut is cleanly through
        origin: [windowX, windowY, -0.5],
        size: [windowW, windowH, frontThickness + 1],
      },
    },
  ]

  // Nesting rebate on the inner (−Z when guest face is +Z): cut a shallow step
  // around the photo for the spacer/photo to sit — still layflat (pocket opens +Z-down).
  // Print with guest face UP: pocket is on the underside → would need supports.
  // Instead: print front with guest face UP and put the nest lip on the BACK plate
  // as a raised rim (union) that inserts into the front window — no underside pocket.

  const backOps: BooleanOpSpec[] = []

  // Magnet strip recesses — open on magnet face (+Z when printing magnet-up)
  for (const m of backCommon.magnetStrip.recesses) {
    const x = roundMm(outer.width / 2 + m.centerXFromMid - m.width / 2)
    const y = roundMm(m.yFromBottom - m.height / 2)
    const z = roundMm(backThickness - m.depth)
    backOps.push({
      id: m.id,
      kind: 'subtract',
      label: `Magnet strip recess (${m.id})`,
      box: {
        origin: [x, Math.max(0, y), z],
        size: [m.width, m.height, m.depth + 0.05],
      },
    })
  }

  // QR sticker pocket — size-common, shallow, open on magnet face
  {
    const q = backCommon.qrCode
    const x = roundMm(outer.width / 2 + q.centerXFromMid - q.width / 2)
    const y = roundMm(outer.height / 2 + q.centerYFromMid - q.height / 2)
    const z = roundMm(backThickness - q.depth)
    backOps.push({
      id: 'qr-pocket',
      kind: 'subtract',
      label: 'QR code sticker pocket',
      box: {
        origin: [x, y, z],
        size: [q.width, q.height, q.depth + 0.05],
      },
    })
  }

  // Raised nest rim on back (inner face = bed when magnet-up… wait):
  // Print back MAGNET FACE UP: magnet/QR recesses on +Z (no supports).
  // Nest rim must be on the opposite face (toward front) = bed side (−Z).
  // Union a rim on the bed would be first layers — OK if rim is flush-built as
  // thicker outer ring. Simpler: add a thin raised rectangle ring on −Z by
  // unioning a frame that starts below Z=0 then we'll translate… 
  // Cleaner approach: make back plate thicker in the outer ring via union on +Z
  // of a lip around the photo area that sticks toward the front when assembled
  // by flipping — document assembly: back magnet-out, rim toward front.
  //
  // For layflat: union lip on the SAME face as magnets would stick out into fridge.
  // So lip must be on the inner face. Print magnet-up ⇒ inner face on bed.
  // Building a rim on the bed: extrude first layers as a ring (union below Z=0
  // then shift whole part up). Spec ops with negative Z union, then shift.

  const rimInnerW = roundMm(windowW + 1.0)
  const rimInnerH = roundMm(windowH + 1.0)
  const rimOuterW = roundMm(rimInnerW + NEST_LIP_MM.width * 2)
  const rimOuterH = roundMm(rimInnerH + NEST_LIP_MM.width * 2)
  const rimX = roundMm((outer.width - rimOuterW) / 2)
  const rimY = roundMm((outer.height - rimOuterH) / 2)

  // Outer rim block (will subtract inner to make a ring) — applied as two ops
  backOps.push({
    id: 'nest-rim-outer',
    kind: 'union',
    label: 'Nest rim outer (inner face)',
    box: {
      origin: [rimX, rimY, -NEST_LIP_MM.depth],
      size: [rimOuterW, rimOuterH, NEST_LIP_MM.depth],
    },
  })
  backOps.push({
    id: 'nest-rim-inner-cut',
    kind: 'subtract',
    label: 'Nest rim inner clear',
    box: {
      origin: [
        roundMm(rimX + NEST_LIP_MM.width),
        roundMm(rimY + NEST_LIP_MM.width),
        -NEST_LIP_MM.depth - 0.05,
      ],
      size: [rimInnerW, rimInnerH, NEST_LIP_MM.depth + 0.1],
    },
  })

  const spacerOps: BooleanOpSpec[] = [
    {
      id: 'spacer-window',
      kind: 'subtract',
      label: 'Spacer photo opening',
      box: {
        origin: [windowX, windowY, -0.5],
        size: [windowW, windowH, spacerThickness + 1],
      },
    },
  ]

  const front: FramePartSpec = {
    partId: 'front',
    name: 'Front plate (guest face)',
    format,
    outer: { ...outer, thickness: frontThickness },
    baseSolid: {
      origin: [0, 0, 0],
      size: [outer.width, outer.height, frontThickness],
    },
    operations: frontOps,
    print: {
      supportsRequired: false,
      bedPlane: 'XY',
      faceUp: 'guest',
      maxOverhangDegrees: 0,
      notes: [
        'Print flat on bed, guest face up.',
        'Photo window is a through-cut — no bridges if walls are continuous.',
        'Decorative raised ornaments from Design Studio are not in this structural STL yet; use sticker finish or a second emboss pass.',
      ],
    },
  }

  const back: FramePartSpec = {
    partId: 'back',
    name: 'Back plate (size-common hardware)',
    format,
    outer: { ...outer, thickness: backThickness },
    baseSolid: {
      origin: [0, 0, 0],
      size: [outer.width, outer.height, backThickness],
    },
    operations: backOps,
    print: {
      supportsRequired: false,
      bedPlane: 'XY',
      faceUp: 'magnet',
      maxOverhangDegrees: 0,
      notes: [
        'Print flat, magnet face up — strip recesses & QR pocket open upward (no supports).',
        'Nest rim is built on the bed side (first layers) toward the front plate.',
        'Magnet strip recesses and QR pocket are size-common for this format — identical across designs.',
      ],
    },
  }

  const spacer: FramePartSpec = {
    partId: 'spacer',
    name: 'Photo spacer ring',
    format,
    outer: { ...outer, thickness: spacerThickness },
    baseSolid: {
      origin: [0, 0, 0],
      size: [outer.width, outer.height, spacerThickness],
    },
    operations: spacerOps,
    print: {
      supportsRequired: false,
      bedPlane: 'XY',
      faceUp: 'inner',
      maxOverhangDegrees: 0,
      notes: ['Thin layflat ring; sandwiches the dye-sub print between front and back.'],
    },
  }

  return {
    format,
    outerMm: outer,
    stackOrder: ['front', 'spacer', 'back'],
    parts: [front, spacer, back],
    assemblyNotes: [
      'Stack (guest → fridge): Front → photo print → Spacer → Back.',
      'Back magnet face points outward (fridge); QR pocket on same face.',
      'All parts are layflat plates — print separately, no supports by design.',
      'Back magnet + QR features are common for this size; only the front window follows the design layout.',
    ],
  }
}
