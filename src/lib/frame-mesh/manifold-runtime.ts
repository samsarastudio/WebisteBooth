import type { ManifoldToplevel } from 'manifold-3d'
import Module from 'manifold-3d'

type ManifoldModule = ManifoldToplevel

let wasmPromise: Promise<ManifoldModule> | null = null

export async function getManifold(): Promise<ManifoldModule> {
  if (!wasmPromise) {
    wasmPromise = (async () => {
      const wasm = await Module()
      wasm.setup()
      return wasm
    })()
  }
  return wasmPromise
}

export type { ManifoldModule }
