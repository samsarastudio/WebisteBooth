import Link from 'next/link'
import { ArrowRight, Check, MapPin, Sparkles } from 'lucide-react'

import { ContactForm } from '@/components/contact/ContactForm'
import { ProductImage } from '@/components/marketing/ProductImage'
import { Reveal } from '@/components/marketing/Reveal'
import { brand } from '@/lib/brand'
import type { LocalPageConfig } from '@/lib/local-pages/types'
import type { SiteSettingsData } from '@/lib/payload'

export function LocalLandingPage({
  config,
  settings,
}: {
  config: LocalPageConfig
  settings: SiteSettingsData
}) {
  const designHref = settings.showDesignPage ? '/design' : '/contact'
  const quoteHref = settings.showQuotePage ? '/quote' : '/contact'

  return (
    <div>
      {/* Hero */}
      <section className="section pb-10">
        <div className="container-wide max-w-3xl mx-auto text-center">
          <Reveal>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-light text-accent-hover text-sm font-semibold mb-4 tracking-wide uppercase">
              {brand.displayName}
            </span>
            <h1 className="text-4xl md:text-5xl mb-5 leading-tight">{config.h1}</h1>
            <p className="text-text-secondary text-lg leading-relaxed mb-8">{config.intro}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {settings.showDesignPage ? (
                <Link href={designHref} className="btn-primary justify-center">
                  {brand.ctaDesign}
                  <Sparkles size={16} />
                </Link>
              ) : null}
              <Link
                href={quoteHref}
                className={settings.showDesignPage ? 'btn-secondary justify-center' : 'btn-primary justify-center'}
              >
                Get a Quote
                <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Photos with SEO captions */}
      <section className="pb-16">
        <div className="container-wide space-y-10">
          {config.photos.map((photo, i) => (
            <Reveal key={photo.src} delay={i * 0.06}>
              <figure className="grid md:grid-cols-2 gap-6 items-center card overflow-hidden p-0">
                <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[280px] bg-bg-secondary">
                  <ProductImage
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <figcaption className="p-6 md:p-8 text-sm text-text-secondary leading-relaxed">
                  {photo.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Frame & sticker options */}
      <section className="section bg-bg-secondary/40 pt-0">
        <div className="container-wide grid lg:grid-cols-2 gap-10">
          <Reveal>
            <h2 className="text-2xl md:text-3xl mb-6">Keepsake frame options</h2>
            <ul className="space-y-5">
              {config.frameOptions.map((item) => (
                <li key={item.title} className="card p-5">
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-2xl md:text-3xl mb-6">Sticker studio options</h2>
            <ul className="space-y-5">
              {config.stickerOptions.map((item) => (
                <li key={item.title} className="card p-5">
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
                </li>
              ))}
            </ul>
            {settings.showStickersPage ? (
              <Link href="/stickers" className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-accent hover:underline">
                Learn more about stickers
                <ArrowRight size={14} />
              </Link>
            ) : null}
          </Reveal>
        </div>
      </section>

      {/* Event types */}
      <section className="section pt-0">
        <div className="container-wide">
          <Reveal className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl mb-3">Events we serve</h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Founder-led planning for celebrations across the Region — tell us your date and venue.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-5">
            {config.eventTypes.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05} className="card p-6">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Setup & delivery */}
      <section className="section bg-bg-secondary/40 pt-0">
        <div className="container-wide">
          <Reveal className="mb-10">
            <h2 className="text-3xl md:text-4xl mb-3">How setup & delivery work</h2>
            <p className="text-text-secondary max-w-2xl">
              Every booking includes an on-site attendant — setup and teardown sit outside your 3
              hours of active booth coverage.
            </p>
          </Reveal>
          <ol className="grid md:grid-cols-2 gap-5">
            {config.setupSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.05} className="card p-6 flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-light text-accent-hover text-sm font-bold">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Nearby areas */}
      <section className="section pt-0">
        <div className="container-wide grid lg:grid-cols-2 gap-10 items-start">
          <Reveal>
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={22} className="text-accent" />
              <h2 className="text-2xl md:text-3xl">Areas we serve nearby</h2>
            </div>
            <ul className="space-y-2 text-text-secondary">
              {config.nearbyAreas.map((area) => (
                <li key={area} className="flex items-start gap-2">
                  <Check size={16} className="text-accent shrink-0 mt-0.5" />
                  {area}
                </li>
              ))}
            </ul>
          </Reveal>

          {config.invitationCity ? (
            <Reveal delay={0.08} className="card p-8 bg-accent-light/30 border-accent/20">
              <p className="text-text-secondary leading-relaxed">
                Planning an event in {config.invitationCity}? We would love for yours to be one of
                the first FrameFlix celebrations in the region.
              </p>
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* FAQs */}
      <section className="section bg-bg-secondary/40 pt-0">
        <div className="container-wide max-w-3xl">
          <Reveal className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl">Frequently asked questions</h2>
          </Reveal>
          <div className="space-y-4">
            {config.faqs.map((faq, i) => (
              <Reveal key={faq.question} delay={i * 0.04} className="card p-6">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{faq.answer}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Design Studio CTA */}
      {settings.showDesignPage ? (
        <section className="section pt-0">
          <div className="container-wide">
            <Reveal className="card p-10 md:p-14 text-center">
              <h2 className="text-3xl mb-3">Preview your frame before you book</h2>
              <p className="text-text-secondary mb-8 max-w-xl mx-auto">
                Colours, captions, ornaments, and saved drafts — free in our Design Studio. No
                commitment until you request a quote.
              </p>
              <Link href={designHref} className="btn-primary">
                {brand.ctaDesign}
                <Sparkles size={16} />
              </Link>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Quote form */}
      {settings.showContactPage ? (
        <section className="section pt-0" id="inquiry">
          <div className="container-wide grid lg:grid-cols-[1fr_320px] gap-8 items-start">
            <Reveal>
              <h2 className="text-2xl md:text-3xl mb-2">Request a quote</h2>
              <p className="text-text-secondary mb-6">
                Email us your date, venue, and guest count — we respond within 24 hours.
              </p>
              <ContactForm />
            </Reveal>
            <Reveal delay={0.1} className="card p-6 space-y-4 text-sm">
              <h3 className="font-serif text-lg">Prefer the full quote builder?</h3>
              <p className="text-text-secondary leading-relaxed">
                Choose a package, frame style, and add-ons step-by-step — or start in the Design
                Studio and bring your saved draft.
              </p>
              {settings.showQuotePage ? (
                <Link href={quoteHref} className="btn-secondary w-full justify-center">
                  Open quote builder
                </Link>
              ) : null}
              {settings.showDesignPage ? (
                <Link href={designHref} className="btn-primary w-full justify-center">
                  {brand.ctaDesign}
                </Link>
              ) : null}
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Related pages */}
      {config.relatedPages.length > 0 ? (
        <section className="section pt-0 pb-20">
          <div className="container-wide text-center">
            <Reveal>
              <h2 className="text-2xl mb-6">Explore more</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {config.relatedPages.map((link) => (
                  <Link key={link.href} href={link.href} className="btn-secondary">
                    {link.label}
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}
    </div>
  )
}
