import { headers } from 'next/headers'
import type { User } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload'

/** Require a logged-in Payload admin user (owner tool gate). */
export async function requireAdminUser(): Promise<
  { ok: true; user: User } | { ok: false; status: 401; error: string }
> {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    return { ok: false, status: 401, error: 'Sign in at /admin to use Print 3D.' }
  }

  return { ok: true, user: user as User }
}
