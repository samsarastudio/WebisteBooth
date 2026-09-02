import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { MagnetHero } from '@/components/marketing/MagnetHero'
import { MagnetEnquiryForm } from '@/components/contact/MagnetEnquiryForm'
import { ProductImage } from '@/components/marketing/ProductImage'
import { Reveal, Stagger, StaggerItem } from '@/components/marketing/Reveal'
import { brand } from '@/lib/brand'
import {
  MAGNET_BOOK_HREF,
  MAGNET_ENQUIRE_HREF,
  MAGNET_PATH,
  magnetFeatures,
  magnetImages,
} from '@/lib/magnet'
import { getSiteSettings } from '@/lib/payload'

const TRUST = [
  { label: 'Custom name plate' },
  { label: 'DSLR photobooth' },
  { label: 'Instant prints' },
  { label: 'QR share' },
  { label: 'Online gallery' },
]

const STEPS = [
  {
    step: '01',
    title: 'Pose at the booth',
    desc: 'Our DSLR booth, ring light, and attendant. Guests tap to start.',
  },
  {
    step: '02',
    title: 'Instant print',
    desc: 'The photo is ready in minutes and slides into the magnet.',
  },
  {
    step: '03',
    title: 'Home on the fridge',
    desc: 'Your name plate is on the front. They take it home and put it up.',
  },
]

export default async function HomePage() {
  const settings = await getSiteSettings()
  const quoteHref = settings.showQuotePage ? MAGNET_BOOK_HREF : '/contact'

  return (
    <div>
      <MagnetHero />

      <section className="border-y border-border bg-bg-secondary/60">
        <div className="container-wide py-5">
          <Stagger className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {TRUST.map((item) => (
              <StaggerItem
                key={item.label}
                className="card px-3 py-3 flex items-center justify-center text-sm font-medium text-center"
              >
                {item.label}
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section overflow-hidden">
        <div className="container-wide grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Reveal direction="left">
            <div className="relative aspect-[4/3] rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-lg)]">
              <ProductImage
                src={magnetImages.nameplate.src}
                alt={magnetImages.nameplate.alt}
                fill
                unoptimized
                className="object-cover object-center scale-[1.04]"
                sizes="(max-width: 1024px) 100vw, 540px"
              />
            </div>
          </Reveal>
          <Reveal delay={0.08} direction="right">
            <span className="price-chip mb-4">Custom fridge magnets</span>
            <h2 className="text-3xl md:text-4xl mb-4">A photo they actually keep</h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              Pastel fridge magnets with a name plate for your event. Guests pose, print, and leave
              with something that stays on the fridge. We quote packages for weddings, parties, and
              corporate nights.
            </p>
            <ul className="space-y-3 text-sm mb-8">
              {[
                'Name plate for your event, names, or logo',
                'Instant print from our photobooth',
                'Blush, cream, mint, and blue',
              ].map((line) => (
                <li key={line} className="flex gap-2 items-start">
                  <span className="text-accent mt-0.5">✦</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <Link href={MAGNET_ENQUIRE_HREF} className="btn-primary">
              Enquire about a custom fridge magnet
              <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-wide">
          <Reveal className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl mb-3">The setup</h2>
            <p className="text-text-secondary max-w-lg mx-auto">
              The booth they pose at. The magnet they leave with.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-4">
            {[magnetImages.boothStudio, magnetImages.boothEvent, magnetImages.instantPrint].map(
              (img) => (
                <Reveal key={img.src} className="relative aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-md)]">
                  <ProductImage
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Reveal>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="section bg-bg-secondary/50">
        <div className="container-wide">
          <Reveal className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl mb-3">How it works</h2>
            <p className="text-text-secondary">Three beats. Then they keep it.</p>
          </Reveal>
          <Stagger className="grid md:grid-cols-3 gap-5">
            {STEPS.map((item) => (
              <StaggerItem key={item.step} className="card p-7 md:p-8">
                <div className="text-accent text-sm font-semibold tracking-widest mb-3">{item.step}</div>
                <h3 className="text-xl mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="text-center mt-10">
            <Link href={MAGNET_ENQUIRE_HREF} className="btn-primary">
              {brand.ctaEnquire}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide grid lg:grid-cols-2 gap-8 items-start">
          <Reveal>
            <div className="relative aspect-[16/10] rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-lg)] mb-6">
              <ProductImage
                src={magnetImages.magnetBooth.src}
                alt={magnetImages.magnetBooth.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>
            <h2 className="text-3xl mb-3">Tried at live events</h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              Guests lined up for the magnet. We brought the booth, the prints, and the name plates.
              That is the product we lead with now.
            </p>
            <div className="flex flex-wrap gap-2">
              {magnetFeatures.slice(0, 4).map((f) => (
                <span key={f.title} className="price-chip !normal-case !tracking-normal !font-medium">
                  {f.title}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <MagnetEnquiryForm />
          </Reveal>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-wide grid md:grid-cols-2 gap-5">
          <Reveal className="card p-8 md:p-10">
            <p className="text-xs uppercase tracking-[0.16em] text-accent-hover font-semibold mb-3">
              Events
            </p>
            <h2 className="text-2xl md:text-3xl mb-3">Hosting an event?</h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              Attendant, coverage, and fridge magnets for your guests. We send a custom quote.
            </p>
            <Link href={quoteHref} className="btn-primary">
              {brand.ctaBook}
              <ArrowRight size={16} />
            </Link>
          </Reveal>
          <Reveal delay={0.08} className="relative min-h-[260px] rounded-[var(--radius-lg)] overflow-hidden">
            <ProductImage
              src={magnetImages.fridge.src}
              alt={magnetImages.fridge.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </Reveal>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-wide">
          <Reveal className="card p-8 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl mb-4">Ready for the fridge?</h2>
            <p className="text-text-secondary mb-8 max-w-lg mx-auto">
              Custom name plate, fridge magnets, our booth. Send an enquiry. We reply within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={MAGNET_ENQUIRE_HREF} className="btn-primary">
                {brand.ctaEnquire}
                <ArrowRight size={16} />
              </Link>
              <Link href={MAGNET_PATH} className="btn-secondary">
                See the magnet
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
