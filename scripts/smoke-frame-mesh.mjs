/**
 * Standalone smoke test (no path aliases).
 * Run: node scripts/smoke-frame-mesh.mjs
 */
import Module from 'manifold-3d'
import { writeFileSync, mkdirSync } from 'fs'

const wasm = await Module()
wasm.setup()
const { Manifold } = wasm

function box(ox, oy, oz, sx, sy, sz) {
  return Manifold.cube([sx, sy, sz], false).translate([ox, oy, oz])
}

// 6x4 outer mm
const W = 152.4
const H = 101.6
const T = 2.0

let back = box(0, 0, 0, W, H, T)
// magnet recess
const tool = box(20, 20, T - 0.9, 12, 50, 1.0)
const next = back.subtract(tool)
tool.delete()
back.delete()
back = next

const mesh = back.getMesh()
console.log('back verts', mesh.numVert, 'tris', mesh.numTri)
back.delete()
mkdirSync('media/print-models', { recursive: true })
writeFileSync('media/print-models/_smoke.txt', `ok tris=${mesh.numTri}\n`)
console.log('smoke ok')
