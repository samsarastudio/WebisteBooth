import { createRequire } from 'module'
import type sharp from 'sharp'

const require = createRequire(import.meta.url)

/** Load sharp if native bindings work; otherwise Payload runs without image transforms. */
export function loadSharp(): typeof sharp | undefined {
  try {
    return require('sharp') as typeof sharp
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.warn(`[payload] sharp unavailable — image resizing disabled: ${message}`)
    return undefined
  }
}
