import { notFound } from 'next/navigation'

import { requirePage, type PageKey } from '@/lib/visibility'

export async function guardPage(page: PageKey) {
  const { settings, enabled } = await requirePage(page)
  if (!enabled) notFound()
  return settings
}
