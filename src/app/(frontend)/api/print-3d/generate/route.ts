import {
  ComfyCloudError,
  requireAdminUser,
  startModularPrintGeneration,
  startTripoPreviewGeneration,
} from '@/lib/comfy'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const auth = await requireAdminUser()
  if (!auth.ok) {
    return Response.json({ ok: false, error: auth.error }, { status: auth.status })
  }

  let body: { designToken?: string; mode?: string }
  try {
    body = (await req.json()) as { designToken?: string; mode?: string }
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 })
  }

  const designToken = body.designToken?.trim()
  if (!designToken) {
    return Response.json({ ok: false, error: 'designToken is required.' }, { status: 400 })
  }

  const mode = body.mode === 'tripo' ? 'tripo' : 'modular'

  try {
    const result =
      mode === 'tripo'
        ? await startTripoPreviewGeneration(designToken)
        : await startModularPrintGeneration(designToken)
    return Response.json({ ok: true, ...result })
  } catch (err) {
    if (err instanceof ComfyCloudError) {
      return Response.json({ ok: false, error: err.message }, { status: err.status })
    }
    console.error('print-3d generate failed:', err)
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : 'Generation failed.' },
      { status: 500 },
    )
  }
}
