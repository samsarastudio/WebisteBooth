import { ComfyCloudError, requireAdminUser, refreshPrintJob } from '@/lib/comfy'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const auth = await requireAdminUser()
  if (!auth.ok) {
    return Response.json({ ok: false, error: auth.error }, { status: auth.status })
  }

  const designToken = new URL(req.url).searchParams.get('designToken')?.trim()
  if (!designToken) {
    return Response.json({ ok: false, error: 'designToken is required.' }, { status: 400 })
  }

  try {
    const design = await refreshPrintJob(designToken)
    return Response.json({ ok: true, design })
  } catch (err) {
    if (err instanceof ComfyCloudError) {
      return Response.json({ ok: false, error: err.message }, { status: err.status })
    }
    console.error('print-3d status failed:', err)
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : 'Status check failed.' },
      { status: 500 },
    )
  }
}
