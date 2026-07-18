import Link from 'next/link'

import { BrandLogoLink } from '@/components/BrandLogo'
import { brand } from '@/lib/brand'

import { serviceAreas } from '@/lib/service-areas'

export default function Footer({
  email = brand.email,
  phone = '',
  serviceArea = 'Kitchener, Cambridge, Waterloo, Guelph & beyond',
  links = [],
  showQuote = true,
  googleBusinessUrl = '',
  instagramUrl = '',
  facebookUrl = '',
}: {
  email?: string
  phone?: string
  serviceArea?: string
  links?: { href: string; label: string }[]
  showQuote?: boolean
  googleBusinessUrl?: string
  instagramUrl?: string
  facebookUrl?: string
}) {
  const pages = [{ href: '/', label: 'Home' }, ...links]
  if (showQuote) pages.push({ href: '/quote', label: 'Get a Quote' })
  const phoneDisplay = phone.trim()
  const socialLinks = [
    { href: googleBusinessUrl, label: 'Google Business' },
    { href: instagramUrl, label: 'Instagram' },
    { href: facebookUrl, label: 'Facebook' },
  ].filter((l) => l.href.trim())

  return (
    <footer className="border-t border-border bg-bg-secondary mt-auto">
      <div className="container-wide py-14 grid md:grid-cols-3 gap-10">
        <div>
          <div className="mb-4">
            <BrandLogoLink size="sm" />
          </div>
          <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
            {brand.profileDescription}
          </p>
        </div>

        <div>
          <h4 className="font-medium mb-4 text-sm uppercase tracking-wide text-text-secondary">
            Pages
          </h4>
          <ul className="space-y-2">
            {pages.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="nav-link text-sm">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-4 text-sm uppercase tracking-wide text-text-secondary">
            Contact
          </h4>
          <a href={`mailto:${email}`} className="nav-link text-sm block mb-2">
            {email}
          </a>
          {phoneDisplay ? (
            <a
              href={`tel:${phoneDisplay.replace(/[^\d+]/g, '')}`}
              className="nav-link text-sm block mb-2"
            >
              {phoneDisplay}
            </a>
          ) : null}
          <p className="text-text-secondary text-sm">{serviceArea}</p>
          {socialLinks.length > 0 ? (
            <ul className="mt-3 space-y-1">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="nav-link text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          <ul className="mt-3 space-y-1">
            {serviceAreas.map((area) => (
              <li key={area.href}>
                <Link href={area.href} className="nav-link text-sm">
                  Photo booth — {area.name}
                </Link>
              </li>
            ))}
          </ul>
          {showQuote && (
            <Link href="/quote" className="btn-primary mt-6 !py-2.5 !px-5 text-sm">
              Get a Quote
            </Link>
          )}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-wide py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-text-secondary">
          <div className="text-center sm:text-left">
            <p>© {new Date().getFullYear()} {brand.fullName}. All rights reserved.</p>
            <p className="text-xs mt-1">
              By using this site you agree to our{' '}
              <Link href="/privacy" className="nav-link">
                Privacy Policy
              </Link>
              .
            </p>
            <p className="text-xs mt-1">
              A service by{' '}
              <a
                href={brand.parentUrl}
                className="nav-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {brand.parentName}
              </a>
            </p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center sm:justify-end">
            <Link href="/privacy" className="nav-link text-sm">
              Privacy Policy
            </Link>
            <Link href="/disclaimer" className="nav-link text-sm">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
