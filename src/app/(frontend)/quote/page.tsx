import type { Metadata } from 'next'

import { QuoteBuilder } from '@/components/quote/QuoteBuilder'
import { Reveal } from '@/components/marketing/Reveal'
import { getActiveAddOns, getActiveFrameStyles, getActivePackages } from '@/lib/payload'
import { guardPage } from '@/lib/page-guard'

export const metadata: Metadata = {
  title: 'Get a Quote',
  description:
    'Build a custom FrameFlix quote — pick a package, choose one of 4 frame styles, add-ons, and get a proposal within 24 hours.',
}

type Props = {
  searchParams: Promise<{ package?: string; style?: string; service?: string }>
}

export default async function QuotePage({ searchParams }: Props) {
  const settings = await guardPage('quote')
  const params = await searchParams
  const service =
    params.service === 'stickers' || params.service === 'both' ? params.service : 'frames'
  const [packages, addons, frameStyles] = await Promise.all([
    getActivePackages(),
    getActiveAddOns(),
    getActiveFrameStyles(),
  ])

  return (
    <div>
      <section className="section pb-8">
        <div className="container-wide text-center max-w-2xl mx-auto">
          <Reveal>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-light text-accent-hover text-sm font-semibold mb-4 tracking-wide uppercase">
              Free quote
            </span>
            <h1 className="text-4xl md:text-5xl mb-4">
              {service === 'stickers' ? 'Plan your sticker experience' : 'Plan your guest keepsakes'}
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed">
              {service === 'stickers'
                ? "Tell us about your event and sticker ideas. We'll send a personal quote within 24 hours."
                : "Choose frames, stickers, or both — then share your event details. We'll send a personal quote within 24 hours."}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-wide">
          <QuoteBuilder
            packages={packages}
            addons={addons}
            frameStyles={frameStyles}
            initialPackageSlug={params.package}
            initialStyleSlug={params.style}
            initialService={service}
            showPricing={settings.showPricing}
          />
        </div>
      </section>
    </div>
  )
}
