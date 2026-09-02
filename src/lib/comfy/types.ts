export type ComfyWorkflowNode = {
  inputs: Record<string, unknown>
  class_type: string
  _meta?: { title?: string }
}

export type ComfyWorkflow = Record<string, ComfyWorkflowNode>

export type ComfyUploadResult = {
  name: string
  subfolder?: string
  type?: string
}

export type ComfyOutputFile = {
  filename: string
  subfolder?: string
  type?: string
}

export type ComfyJobStatus = {
  status?: string
  completed?: boolean
  error?: string | null
  outputs?: Record<
    string,
    {
      images?: ComfyOutputFile[]
      files?: ComfyOutputFile[]
      glb?: ComfyOutputFile[]
      mesh?: ComfyOutputFile[]
      [key: string]: unknown
    }
  >
}

export type PrintModelStatus = 'idle' | 'queued' | 'running' | 'ready' | 'error'
