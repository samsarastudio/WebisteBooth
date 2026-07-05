import { headers } from 'next/headers'

import { submitPostFromBot, type BotPostInput } from '@/lib/submit-post'

export const dynamic = 'force-dynamic'

/**
 * OpenClaw bot endpoint — push blog posts from automation.
 *
 * POST /api/bot/posts
 * Authorization: Bearer <OPENCLAW_API_KEY>
 */
export async function POST(req: Request) {
  let body: BotPostInput
  try {
    body = (await req.json()) as BotPostInput
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 })
  }

  const headerStore = await headers()
  const ip =
    headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headerStore.get('x-real-ip') ||
    'unknown'

  const authHeader = req.headers.get('authorization')
  const result = await submitPostFromBot(body, { authHeader, ip })

  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: result.status })
  }

  return Response.json(result)
}
