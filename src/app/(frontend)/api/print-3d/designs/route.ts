import { requireAdminUser, listPrintDesigns } from '@/lib/comfy'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const auth = await requireAdminUser()
  if (!auth.ok) {
    return Response.json({ ok: false, error: auth.error }, { status: auth.status })
  }

  const url = new URL(req.url)
  const page = Math.max(1, Number(url.searchParams.get('page') || '1') || 1)
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') || '24') || 24))

  try {
    const result = await listPrintDesigns({ page, limit })
    return Response.json({ ok: true, ...result })
  } catch (err) {
    console.error('print-3d designs list failed:', err)
    return Response.json({ ok: false, error: 'Could not load designs.' }, { status: 500 })
  }
}
