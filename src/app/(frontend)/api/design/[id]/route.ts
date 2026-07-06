import { getFrameDesignByToken } from '@/lib/frame-design/save-design'

export const dynamic = 'force-dynamic'

function mediaUrl(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') return undefined
  const url = (value as { url?: string }).url
  return typeof url === 'string' ? url : undefined
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params
  const design = await getFrameDesignByToken(id)

  if (!design) {
    return Response.json({ ok: false, error: 'Design not found.' }, { status: 404 })
  }

  const photoUrl = mediaUrl(design.photoMedia)
  const previewUrl = mediaUrl(design.previewImage)

  return Response.json({
    ok: true,
    design: {
      designToken: design.designToken,
      state: design.state,
      status: design.status,
      designerEmail: design.designerEmail || undefined,
      photoUrl,
      previewUrl,
    },
  })
}
