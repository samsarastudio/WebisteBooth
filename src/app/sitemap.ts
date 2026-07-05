import type { MetadataRoute } from 'next'

import { brand } from '@/lib/brand'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = brand.siteUrl
  const routes = [
    '',
    '/about',
    '/packages',
    '/stickers',
    '/gallery',
    '/faq',
    '/contact',
    '/quote',
    '/privacy',
    '/disclaimer',
  ]

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/quote' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/quote' || route === '/packages' ? 0.9 : 0.7,
  }))
}
