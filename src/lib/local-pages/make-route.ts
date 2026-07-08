import type { Metadata } from 'next'

import { LocalLandingPage } from '@/components/marketing/LocalLandingPage'
import { brand } from '@/lib/brand'
import type { LocalPageConfig } from '@/lib/local-pages/types'
import { getSiteSettings } from '@/lib/payload'
import { buildLocalPageJsonLd } from '@/lib/structured-data'

export function makeLocalPageMetadata(config: LocalPageConfig): Metadata {
  return {
    title: config.metaTitle,
    description: config.metaDescription,
    openGraph: {
      title: config.metaTitle,
      description: config.metaDescription,
      url: `${brand.siteUrl}/${config.path}`,
      siteName: brand.fullName,
      locale: 'en_CA',
      type: 'website',
    },
    alternates: {
      canonical: `${brand.siteUrl}/${config.path}`,
    },
  }
}

export function makeLocalPage(config: LocalPageConfig) {
  return async function LocalPage() {
    const settings = await getSiteSettings()
    const jsonLd = buildLocalPageJsonLd(config, settings)

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LocalLandingPage config={config} settings={settings} />
      </>
    )
  }
}
