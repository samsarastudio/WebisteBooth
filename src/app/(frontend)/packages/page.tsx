import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Sparkles } from 'lucide-react'

import { magnetImages } from '@/lib/magnet'
import { getActiveAddOns, getActivePackages } from '@/lib/payload'
import { PackageCards } from '@/components/marketing/PackageCards'
import { EventOrganisersSection } from '@/components/marketing/EventOrganisersSection'
import { Reveal, Stagger, StaggerItem } from '@/components/marketing/Reveal'
import { guardPage } from '@/lib/page-guard'

export const metadata: Metadata = {
  title: 'Event Packages',
  description:
    'Book the FrameFlix photo booth with custom fridge magnets and a name plate for your event. Attendant included. Packages are quoted.',
}

export default async function PackagesPage() {
  const settings = await guardPage('packages')
  const [packages, addons] = await Promise.all([getActivePackages(), getActiveAddOns()])

  return (
    <div>
      <section className="section pb-8 relative overflow-hidden">
        <div className="absolute inset-0 motif-overlay opacity-25" />
        <div className="container-wide text-center max-w-3xl mx-auto relative z-10">
          <Reveal>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-light text-accent-hover text-sm font-semibold mb-4 tracking-wide uppercase">
              Event packages
            </span>
            <h1 className="text-4xl md:text-5xl mb-4">Book the booth</h1>
            <p className="text-text-secondary text-lg leading-relaxed mb-5">
              Guests leave with a fridge magnet, your name plate, and an instant print from our booth.
              We quote packages with an attendant and coverage.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="hours-badge">
                <Clock size={14} />
                Quote within 24 hours
              </span>
              <span className="hours-badge">Attendant included</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="container-wide">
          <PackageCards packages={packages} showPricing={settings.showPricing} />
        </div>
      </section>

      {settings.showEventOrganisersSection && (
        <EventOrganisersSection
          title={settings.eventOrganisersTitle}
          body={settings.eventOrganisersBody}
          contactHref="/contact"
          quoteHref={settings.showQuotePage ? '/quote?service=both' : '/contact'}
        />
      )}

      <section className="section bg-bg-secondary/50">
        <div className="container-wide grid lg:grid-cols-2 gap-8 items-center">
          <Reveal direction="left">
            <div className="relative aspect-[4/3] rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-lg)]">
              <Image
                src={magnetImages.setup.src}
                alt={magnetImages.setup.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1} direction="right">
            <h2 className="text-3xl md:text-4xl mb-4">What “3 hours excluding setup” means</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Your guests get a full <strong className="text-text-primary">3 hours of booth time</strong>.
              Arrival, setup, and teardown sit outside that window, so you never lose coverage to
              logistics.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Every package includes an attendant so you can enjoy the party.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <Reveal className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl mb-3">Add-Ons</h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Optional extras to make your event even more special. Add them when you request a quote.
            </p>
          </Reveal>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {addons.map((a) => (
              <StaggerItem key={String(a.id)} className="card p-5">
                <p className="font-medium">{a.name}</p>
                {a.description && (
                  <p className="text-sm text-text-secondary mt-1">{a.description}</p>
                )}
              </StaggerItem>
            ))}
          </Stagger>
          <div className="text-center mt-10">
            <Link href="/quote" className="btn-primary">
              Request a quote
              <Sparkles size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
