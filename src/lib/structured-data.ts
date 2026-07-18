import { brand } from '@/lib/brand'
import type { LocalPageConfig } from '@/lib/local-pages/types'

type SettingsSlice = {
  email: string
  phone?: string
}

export function buildLocalBusinessJsonLd(config: LocalPageConfig, settings: SettingsSlice) {
  const pageUrl = `${brand.siteUrl}/${config.path}`

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${pageUrl}#localbusiness`,
    name: brand.fullName,
    alternateName: brand.name,
    description: config.metaDescription,
    url: pageUrl,
    email: settings.email || brand.email,
    ...(settings.phone ? { telephone: settings.phone } : {}),
    image: `${brand.siteUrl}/brand/style-romance-photo.png`,
    logo: `${brand.siteUrl}/brand/logo.png`,
    areaServed: [
      {
        '@type': 'City',
        name: config.schemaCity,
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: config.schemaRegion,
          containedInPlace: {
            '@type': 'Country',
            name: 'Canada',
          },
        },
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Ontario',
      },
    ],
    parentOrganization: {
      '@type': 'Organization',
      name: brand.parentName,
      url: brand.parentUrl,
    },
    priceRange: '$$',
    knowsAbout: [
      'Photobooth rental',
      'Custom photo frames',
      'Wedding favours',
      'Corporate event activations',
      'Live sticker printing',
    ],
  }
}

export function buildServiceJsonLd(config: LocalPageConfig, settings: SettingsSlice) {
  const pageUrl = `${brand.siteUrl}/${config.path}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    name: config.serviceName,
    description: config.serviceDescription,
    url: pageUrl,
    provider: {
      '@type': 'LocalBusiness',
      name: brand.fullName,
      email: settings.email || brand.email,
      ...(settings.phone ? { telephone: settings.phone } : {}),
      url: brand.siteUrl,
    },
    areaServed: {
      '@type': 'City',
      name: config.schemaCity,
    },
    serviceType: config.serviceName,
    offers: {
      '@type': 'Offer',
      url: `${brand.siteUrl}/quote`,
      availability: 'https://schema.org/InStock',
      priceCurrency: 'CAD',
    },
  }
}

export function buildLocalPageJsonLd(config: LocalPageConfig, settings: SettingsSlice) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildLocalBusinessJsonLd(config, settings),
      buildServiceJsonLd(config, settings),
    ],
  }
}
