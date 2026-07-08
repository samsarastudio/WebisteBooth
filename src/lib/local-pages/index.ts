import { cityPages } from '@/lib/local-pages/cities'
import { eventPages } from '@/lib/local-pages/events'
import type { LocalPageConfig } from '@/lib/local-pages/types'

export const allLocalPages: LocalPageConfig[] = [...cityPages, ...eventPages]

export function getLocalPage(path: string): LocalPageConfig | undefined {
  return allLocalPages.find((p) => p.path === path)
}

export const allLocalPagePaths = allLocalPages.map((p) => p.path)
