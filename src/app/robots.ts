import type { MetadataRoute } from 'next'

import { brand } from '@/lib/brand'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = brand.siteUrl
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/print-3d'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
