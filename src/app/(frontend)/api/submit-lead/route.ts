import { headers } from 'next/headers'

import { submitLeadFromFormData } from '@/lib/submit-lead'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const formData = await req.formData()
  const headerStore = await headers()
  const result = await submitLeadFromFormData(formData, headerStore)
  return Response.json(result, { status: result.ok ? 200 : 400 })
}
