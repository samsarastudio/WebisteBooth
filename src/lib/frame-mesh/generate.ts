import { applyBooleanOps, boxFromOriginSize } from './booleans'
import { exportManifoldStl } from './export-stl'
import { getManifold } from './manifold-runtime'
import type { FrameAssemblyManifest, FramePartId, FramePartSpec } from './types'

export type GeneratedPartMesh = {
  partId: FramePartId
  name: string
  stl: Buffer
  print: FramePartSpec['print']
  operationIds: string[]
}

/**
 * Run the boolean graph for one part and export binary STL (mm).
 * After ops that extend below Z=0 (nest rim), the solid is translated so Z≥0 for the bed.
 */
export async function generatePartStl(part: FramePartSpec): Promise<GeneratedPartMesh> {
  const M = await getManifold()
  let solid = boxFromOriginSize(M, part.baseSolid.origin, part.baseSolid.size)
  solid = applyBooleanOps(M, solid, part.operations)

  // Lift so the entire part sits on Z≥0 (nest rim was built below Z=0)
  const box = solid.boundingBox()
  if (box.min[2] < -1e-6) {
    const lifted = solid.translate([0, 0, -box.min[2]])
    solid.delete()
    solid = lifted
  }

  try {
    const stl = exportManifoldStl(M, solid)
    return {
      partId: part.partId,
      name: part.name,
      stl,
      print: part.print,
      operationIds: part.operations.map((o) => o.id),
    }
  } finally {
    solid.delete()
  }
}

export async function generateAssemblyMeshes(
  manifest: FrameAssemblyManifest,
): Promise<GeneratedPartMesh[]> {
  const out: GeneratedPartMesh[] = []
  for (const part of manifest.parts) {
    out.push(await generatePartStl(part))
  }
  return out
}
