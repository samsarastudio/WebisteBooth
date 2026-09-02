import type { Manifold } from 'manifold-3d'
import type { ManifoldModule } from './manifold-runtime'

/** Binary STL from a Manifold mesh (little-endian). */
export function manifoldToStlBuffer(mesh: {
  numVert: number
  numTri: number
  vertProperties: Float32Array
  triVerts: Uint32Array
  numProp: number
}): Buffer {
  const triCount = mesh.numTri
  const header = Buffer.alloc(84)
  header.write('FrameFlix modular layflat', 0, 'ascii')
  header.writeUInt32LE(triCount, 80)

  const body = Buffer.alloc(triCount * 50)
  const np = mesh.numProp
  let offset = 0

  for (let t = 0; t < triCount; t++) {
    const i0 = mesh.triVerts[t * 3]
    const i1 = mesh.triVerts[t * 3 + 1]
    const i2 = mesh.triVerts[t * 3 + 2]

    const ax = mesh.vertProperties[i0 * np]
    const ay = mesh.vertProperties[i0 * np + 1]
    const az = mesh.vertProperties[i0 * np + 2]
    const bx = mesh.vertProperties[i1 * np]
    const by = mesh.vertProperties[i1 * np + 1]
    const bz = mesh.vertProperties[i1 * np + 2]
    const cx = mesh.vertProperties[i2 * np]
    const cy = mesh.vertProperties[i2 * np + 1]
    const cz = mesh.vertProperties[i2 * np + 2]

    const ux = bx - ax
    const uy = by - ay
    const uz = bz - az
    const vx = cx - ax
    const vy = cy - ay
    const vz = cz - az
    let nx = uy * vz - uz * vy
    let ny = uz * vx - ux * vz
    let nz = ux * vy - uy * vx
    const len = Math.hypot(nx, ny, nz) || 1
    nx /= len
    ny /= len
    nz /= len

    body.writeFloatLE(nx, offset)
    body.writeFloatLE(ny, offset + 4)
    body.writeFloatLE(nz, offset + 8)
    body.writeFloatLE(ax, offset + 12)
    body.writeFloatLE(ay, offset + 16)
    body.writeFloatLE(az, offset + 20)
    body.writeFloatLE(bx, offset + 24)
    body.writeFloatLE(by, offset + 28)
    body.writeFloatLE(bz, offset + 32)
    body.writeFloatLE(cx, offset + 36)
    body.writeFloatLE(cy, offset + 40)
    body.writeFloatLE(cz, offset + 44)
    body.writeUInt16LE(0, offset + 48)
    offset += 50
  }

  return Buffer.concat([header, body])
}

export function exportManifoldStl(M: ManifoldModule, solid: Manifold): Buffer {
  const mesh = solid.getMesh()
  try {
    return manifoldToStlBuffer(mesh)
  } finally {
    // Mesh object may need delete on some builds — vert arrays are copied into Buffer
  }
}
