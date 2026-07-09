import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'

import '../globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { StickyCta } from '@/components/marketing/StickyCta'
import { ConsentBanner } from '@/components/marketing/ConsentBanner'
import { SiteAnalytics } from '@/components/marketing/SiteAnalytics'
import { getSiteSettings } from '@/lib/payload'
import { pageTitle, brand } from '@/lib/brand'
import { navLinks } from '@/lib/visibility'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const siteUrl = brand.siteUrl

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: pageTitle(),
    template: `%s | ${brand.name}`,
  },
  description: brand.profileDescription,
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: brand.displayName,
    title: pageTitle(),
    description: brand.profileDescription,
    images: [{ url: '/brand/style-romance-photo.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle(),
    description: brand.profileDescription,
    images: ['/brand/style-romance-photo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: '/brand/logo.png', type: 'image/png', sizes: '512x512' }],
    apple: [{ url: '/brand/logo.png', sizes: '180x180' }],
  },
}

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()
  const links = navLinks(settings)

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.fullName,
    alternateName: brand.name,
    url: brand.siteUrl,
    logo: `${brand.siteUrl}/brand/logo.png`,
    email: settings.email || brand.email,
    parentOrganization: {
      '@type': 'Organization',
      name: brand.parentName,
      url: brand.parentUrl,
    },
  }

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Navbar
          links={links}
          showQuote={settings.showQuotePage}
          showDesign={settings.showDesignPage}
        />
        <main className="flex-1 pt-16 lg:pt-[72px] pb-[calc(4.5rem+var(--safe-bottom))] lg:pb-0">
          {children}
        </main>
        <Footer
          email={settings.email}
          serviceArea={settings.serviceArea}
          links={links}
          showQuote={settings.showQuotePage}
        />
        {settings.showQuotePage || settings.showDesignPage ? (
          <StickyCta showDesign={settings.showDesignPage} />
        ) : null}
        <ConsentBanner />
        <SiteAnalytics />
      </body>
    </html>
  )
}
