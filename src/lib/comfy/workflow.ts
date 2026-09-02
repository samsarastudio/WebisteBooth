import printWorkflow from './tripo-image-to-print.json'
import type { ComfyWorkflow } from './types'

const LOAD_IMAGE_NODE = '10'

/** Deep-clone the print-oriented Tripo workflow and set the LoadImage filename. */
export function buildPrintWorkflow(imageFilename: string, seeds?: { model?: number; texture?: number }): ComfyWorkflow {
  const workflow = structuredClone(printWorkflow) as ComfyWorkflow

  if (!workflow[LOAD_IMAGE_NODE]) {
    throw new Error('Print workflow is missing LoadImage node 10')
  }

  workflow[LOAD_IMAGE_NODE].inputs.image = imageFilename

  if (workflow['11']) {
    if (typeof seeds?.model === 'number') {
      workflow['11'].inputs.model_seed = seeds.model
    }
    if (typeof seeds?.texture === 'number') {
      workflow['11'].inputs.texture_seed = seeds.texture
    }
  }

  return workflow
}
