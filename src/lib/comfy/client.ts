import type { ComfyJobStatus, ComfyOutputFile, ComfyUploadResult, ComfyWorkflow } from './types'

const DEFAULT_BASE = 'https://cloud.comfy.org'

export class ComfyCloudError extends Error {
  status: number

  constructor(message: string, status = 500) {
    super(message)
    this.name = 'ComfyCloudError'
    this.status = status
  }
}

function getConfig() {
  const apiKey = process.env.COMFY_CLOUD_API_KEY?.trim()
  if (!apiKey) {
    throw new ComfyCloudError(
      'COMFY_CLOUD_API_KEY is not configured. Create a key at platform.comfy.org.',
      503,
    )
  }
  const baseUrl = (process.env.COMFY_CLOUD_BASE_URL?.trim() || DEFAULT_BASE).replace(/\/$/, '')
  return { apiKey, baseUrl }
}

function authHeaders(apiKey: string, json = false): HeadersInit {
  const headers: Record<string, string> = { 'X-API-Key': apiKey }
  if (json) headers['Content-Type'] = 'application/json'
  return headers
}

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string; message?: string; detail?: string }
    return data.error || data.message || data.detail || `Comfy Cloud HTTP ${res.status}`
  } catch {
    const text = await res.text().catch(() => '')
    return text.slice(0, 300) || `Comfy Cloud HTTP ${res.status}`
  }
}

/** Upload an image for use as a LoadImage input. */
export async function uploadImage(
  buffer: Buffer,
  filename: string,
  mimeType = 'image/png',
): Promise<ComfyUploadResult> {
  const { apiKey, baseUrl } = getConfig()
  const form = new FormData()
  form.append('image', new Blob([new Uint8Array(buffer)], { type: mimeType }), filename)
  form.append('type', 'input')
  form.append('overwrite', 'true')

  const res = await fetch(`${baseUrl}/api/upload/image`, {
    method: 'POST',
    headers: { 'X-API-Key': apiKey },
    body: form,
  })

  if (!res.ok) {
    throw new ComfyCloudError(await readErrorMessage(res), res.status)
  }

  const data = (await res.json()) as ComfyUploadResult & { name?: string }
  if (!data.name) {
    throw new ComfyCloudError('Comfy Cloud upload did not return a filename.')
  }
  return data
}

/** Submit an API-format workflow. Includes Partner Node auth in extra_data. */
export async function submitPrompt(workflow: ComfyWorkflow): Promise<string> {
  const { apiKey, baseUrl } = getConfig()

  const res = await fetch(`${baseUrl}/api/prompt`, {
    method: 'POST',
    headers: authHeaders(apiKey, true),
    body: JSON.stringify({
      prompt: workflow,
      extra_data: {
        api_key_comfy_org: apiKey,
      },
    }),
  })

  if (!res.ok) {
    throw new ComfyCloudError(await readErrorMessage(res), res.status)
  }

  const data = (await res.json()) as {
    prompt_id?: string
    error?: string
    node_errors?: unknown
  }

  if (data.error) {
    throw new ComfyCloudError(
      typeof data.error === 'string' ? data.error : 'Workflow validation failed.',
      400,
    )
  }

  if (!data.prompt_id) {
    throw new ComfyCloudError('Comfy Cloud did not return a prompt_id.')
  }

  return data.prompt_id
}

/** Poll job status. Falls back to /api/history/{id} if job status endpoint is unavailable. */
export async function getJobStatus(promptId: string): Promise<ComfyJobStatus> {
  const { apiKey, baseUrl } = getConfig()

  const statusRes = await fetch(`${baseUrl}/api/job/${promptId}/status`, {
    headers: authHeaders(apiKey),
  })

  if (statusRes.ok) {
    const data = (await statusRes.json()) as ComfyJobStatus & {
      status?: string | { completed?: boolean; status_str?: string; messages?: unknown[] }
      outputs?: ComfyJobStatus['outputs']
    }
    return normalizeJobStatus(data, promptId)
  }

  // Fallback: classic history endpoint (compatible with OSS-style Cloud APIs)
  const histRes = await fetch(`${baseUrl}/api/history/${promptId}`, {
    headers: authHeaders(apiKey),
  })

  if (histRes.status === 404) {
    return { status: 'running', completed: false }
  }

  if (!histRes.ok) {
    throw new ComfyCloudError(await readErrorMessage(histRes), histRes.status)
  }

  const history = (await histRes.json()) as Record<
    string,
    {
      status?: { completed?: boolean; status_str?: string; messages?: unknown[] }
      outputs?: ComfyJobStatus['outputs']
    }
  >

  const entry = history[promptId]
  if (!entry) {
    return { status: 'running', completed: false }
  }

  return normalizeJobStatus(
    {
      status: entry.status?.status_str || (entry.status?.completed ? 'completed' : 'running'),
      completed: entry.status?.completed,
      outputs: entry.outputs,
      error: extractHistoryError(entry.status?.messages),
    },
    promptId,
  )
}

function extractHistoryError(messages: unknown[] | undefined): string | null {
  if (!Array.isArray(messages)) return null
  for (const msg of messages) {
    if (Array.isArray(msg) && msg[0] === 'execution_error') {
      const detail = msg[1] as { exception_message?: string } | undefined
      return detail?.exception_message || 'Comfy workflow execution failed.'
    }
  }
  return null
}

function normalizeJobStatus(
  data: {
    status?: string | { completed?: boolean; status_str?: string; messages?: unknown[] }
    completed?: boolean
    error?: string | null
    outputs?: ComfyJobStatus['outputs']
  },
  _promptId: string,
): ComfyJobStatus {
  let statusStr = 'running'
  let completed = false
  let error: string | null = data.error ?? null

  if (typeof data.status === 'string') {
    statusStr = data.status.toLowerCase()
    completed = ['completed', 'success', 'succeeded', 'done'].includes(statusStr)
    if (['failed', 'error', 'cancelled', 'canceled'].includes(statusStr)) {
      error = error || `Job ${statusStr}`
    }
  } else if (data.status && typeof data.status === 'object') {
    const st = data.status
    statusStr = (st.status_str || '').toLowerCase() || (st.completed ? 'completed' : 'running')
    completed = Boolean(st.completed) || ['completed', 'success', 'succeeded'].includes(statusStr)
    error = error || extractHistoryError(st.messages)
  }

  if (data.completed) completed = true

  return {
    status: statusStr,
    completed,
    error,
    outputs: data.outputs,
  }
}

/** Download an output file from Comfy Cloud (follows redirects to signed URLs). */
export async function downloadViewFile(file: ComfyOutputFile): Promise<Buffer> {
  const { apiKey, baseUrl } = getConfig()
  const params = new URLSearchParams({
    filename: file.filename,
    type: file.type || 'output',
  })
  if (file.subfolder) params.set('subfolder', file.subfolder)

  const res = await fetch(`${baseUrl}/api/view?${params}`, {
    headers: authHeaders(apiKey),
    redirect: 'follow',
  })

  if (!res.ok) {
    throw new ComfyCloudError(await readErrorMessage(res), res.status)
  }

  return Buffer.from(await res.arrayBuffer())
}

/** Collect downloadable 3D files from a job's outputs object. */
export function collectOutputFiles(outputs: ComfyJobStatus['outputs']): {
  glb: ComfyOutputFile[]
  stl: ComfyOutputFile[]
  other: ComfyOutputFile[]
} {
  const glb: ComfyOutputFile[] = []
  const stl: ComfyOutputFile[] = []
  const other: ComfyOutputFile[] = []

  if (!outputs) return { glb, stl, other }

  const pushFile = (file: ComfyOutputFile) => {
    const name = file.filename.toLowerCase()
    if (name.endsWith('.glb') || name.endsWith('.gltf')) glb.push(file)
    else if (name.endsWith('.stl')) stl.push(file)
    else other.push(file)
  }

  for (const nodeOut of Object.values(outputs)) {
    if (!nodeOut || typeof nodeOut !== 'object') continue
    for (const key of Object.keys(nodeOut)) {
      const value = nodeOut[key]
      if (!Array.isArray(value)) continue
      for (const item of value) {
        if (item && typeof item === 'object' && 'filename' in item && typeof item.filename === 'string') {
          pushFile(item as ComfyOutputFile)
        }
      }
    }
  }

  return { glb, stl, other }
}
