import { headers } from 'next/headers'
import config from '@payload-config'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

import { submitLeadFromFormData } from '@/lib/submit-lead'

export const dynamic = 'force-dynamic'

type PayloadArgs = { params: Promise<{ slug?: string[] }> }

const leadsParams = Promise.resolve({ slug: ['leads'] })

function withLeadsSlug(
  handler: (request: Request, args: PayloadArgs) => Promise<Response>,
) {
  return (request: Request, args: PayloadArgs) =>
    handler(request, { ...args, params: leadsParams })
}

export const GET = withLeadsSlug(REST_GET(config))
export const DELETE = withLeadsSlug(REST_DELETE(config))
export const PATCH = withLeadsSlug(REST_PATCH(config))
export const PUT = withLeadsSlug(REST_PUT(config))
export const OPTIONS = withLeadsSlug(REST_OPTIONS(config))

const payloadPost = withLeadsSlug(REST_POST(config))

export async function POST(req: Request, args: PayloadArgs) {
  const contentType = req.headers.get('content-type') || ''
  if (
    contentType.includes('multipart/form-data') ||
    contentType.includes('application/x-www-form-urlencoded')
  ) {
    const formData = await req.formData()
    const headerStore = await headers()
    const result = await submitLeadFromFormData(formData, headerStore)
    return Response.json(result, { status: result.ok ? 200 : 400 })
  }
  return payloadPost(req, args)
}
