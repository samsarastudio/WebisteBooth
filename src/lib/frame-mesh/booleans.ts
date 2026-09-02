import type { Manifold } from 'manifold-3d'
import type { ManifoldModule } from './manifold-runtime'
import type { BooleanOpSpec, Vec3 } from './types'

export function boxFromOriginSize(
  M: ManifoldModule,
  origin: Vec3,
  size: Vec3,
): Manifold {
  const [ox, oy, oz] = origin
  const [sx, sy, sz] = size
  // Manifold.cube(size, center=false) sits in first octant from origin
  return M.Manifold.cube([sx, sy, sz], false).translate([ox, oy, oz])
}

/**
 * Apply an ordered list of boolean operations to a base solid.
 * Each op's box is converted to a Manifold and union/subtract/intersect applied.
 */
export function applyBooleanOps(
  M: ManifoldModule,
  base: Manifold,
  operations: BooleanOpSpec[],
): Manifold {
  let current = base
  for (const op of operations) {
    const tool = boxFromOriginSize(M, op.box.origin, op.box.size)
    let next: Manifold
    try {
      if (op.kind === 'union') next = current.add(tool)
      else if (op.kind === 'subtract') next = current.subtract(tool)
      else next = current.intersect(tool)
    } finally {
      tool.delete()
    }
    current.delete()
    current = next
  }
  return current
}
