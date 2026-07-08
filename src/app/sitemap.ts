import type { MetadataRoute } from 'next'

import { brand } from '@/lib/brand'
import { allLocalPagePaths } from '@/lib/local-pages'
import { getPublishedPostSlugs } from '@/lib/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = brand.siteUrl
  const routes = [
    '',
    '/about',
    '/packages',
    '/stickers',
    '/gallery',
    '/blog',
    '/faq',
    '/contact',
    '/quote',
    '/design',
    '/privacy',
    '/disclaimer',
    ...allLocalPagePaths.map((path) => `/${path}`),
  ]

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency:
      route === '' || route === '/quote' || route === '/design' || route === '/blog'
        ? 'weekly'
        : 'monthly',
    priority:
      route === ''
        ? 1
        : route.startsWith('/photo-booth-') ||
            route === '/quote' ||
            route === '/design' ||
            route === '/packages'
          ? 0.9
          : 0.75,
  }))

  const postSlugs = await getPublishedPostSlugs()
  const postEntries: MetadataRoute.Sitemap = postSlugs.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticEntries, ...postEntries]
}
