import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

import { GalleryGrid } from '@/components/marketing/GalleryGrid'
import { Reveal } from '@/components/marketing/Reveal'
import { brand } from '@/lib/brand'
import { getGalleryItems } from '@/lib/payload'
import { guardPage } from '@/lib/page-guard'

export const metadata: Metadata = {
  title: 'Gallery',
  description: `Guest keepsake frames and styles from ${brand.fullName}.`,
}

export default async function GalleryPage() {
  const settings = await guardPage('gallery')
  const items = await getGalleryItems()
  const quoteHref = settings.showQuotePage ? '/quote' : '/contact'

  return (
    <div>
      <section className="section pb-8">
        <div className="container-wide text-center max-w-2xl mx-auto">
          <Reveal>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-light text-accent-hover text-sm font-semibold mb-4 tracking-wide uppercase">
              Portfolio
            </span>
            <h1 className="text-4xl md:text-5xl mb-4">Guest keepsakes</h1>
            <p className="text-text-secondary text-lg leading-relaxed mb-4">
              Real frame styles, printed results, and finishes — the keepsakes your guests take
              home from weddings, birthdays, and corporate events across Ontario.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-wide">
          <GalleryGrid items={items} />
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-wide">
          <Reveal className="card p-10 text-center">
            <h2 className="text-2xl md:text-3xl mb-3">Want frames like these at your event?</h2>
            <p className="text-text-secondary mb-6">Request a quote in under two minutes.</p>
            <Link href={quoteHref} className="btn-primary">
              Get a Quote
              <Sparkles size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
