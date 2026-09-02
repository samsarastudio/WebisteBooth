import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { MagnetEnquiryForm } from '@/components/contact/MagnetEnquiryForm'
import { ProductImage } from '@/components/marketing/ProductImage'
import { Reveal } from '@/components/marketing/Reveal'
import { brand } from '@/lib/brand'
import {
  MAGNET_BOOK_HREF,
  magnetFeatures,
  magnetImages,
} from '@/lib/magnet'

export const metadata: Metadata = {
  title: 'Fridge Magnet Frames',
  description: `Custom fridge magnets with a name plate for your event, paired with our DSLR photo booth. ${brand.fullName}.`,
  openGraph: {
    images: [{ url: magnetImages.hero.src }],
  },
}

const gallery = [
  magnetImages.hero,
  magnetImages.lineup,
  magnetImages.nameplate,
  magnetImages.inHand,
  magnetImages.fridge,
  magnetImages.magnetBooth,
  { src: '/brand/magnet-cream.png', alt: 'Cream fridge magnet photo frame' },
  { src: '/brand/magnet-mint.png', alt: 'Mint fridge magnet photo frame' },
  { src: '/brand/magnet-blue.png', alt: 'Baby-blue fridge magnet photo frame' },
]

export default function FridgeMagnetPage() {
  return (
    <div>
      <section className="section pb-8">
        <div className="container-wide grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-12 items-start">
          <Reveal>
            <div className="grid grid-cols-2 gap-3">
              {gallery.map((img, i) => (
                <div
                  key={img.src}
                  className={`relative overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] ${
                    i === 0 ? 'col-span-2 aspect-[16/10]' : 'aspect-[4/3]'
                  }`}
                >
                  <ProductImage
                    src={img.src}
                    alt={img.alt}
                    fill
                    priority={i < 2}
                    className="object-cover scale-[1.03]"
                    sizes={i === 0 ? '(max-width: 1024px) 100vw, 640px' : '(max-width: 1024px) 50vw, 280px'}
                  />
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.06} className="lg:sticky lg:top-24">
            <span className="price-chip mb-4">Custom name plate</span>
            <h1 className="text-4xl md:text-5xl mb-4">Fridge magnet frames</h1>
            <p className="text-text-secondary leading-relaxed mb-5">
              Guests pose at our booth and leave with a fridge magnet. Add your names, date, or logo
              on the name plate. We quote event packages.
            </p>
            <ul className="space-y-2 text-sm mb-6">
              {magnetFeatures.map((f) => (
                <li key={f.title} className="flex gap-2">
                  <span className="text-accent">✦</span>
                  <span>
                    <strong className="text-text-primary">{f.title}.</strong> {f.desc}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <a href="#enquire" className="btn-primary justify-center">
                Enquire about a custom fridge magnet
                <ArrowRight size={16} />
              </a>
              <Link href={MAGNET_BOOK_HREF} className="btn-secondary justify-center">
                Book the booth
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-wide grid lg:grid-cols-2 gap-8 items-center">
          <Reveal direction="left">
            <div className="relative aspect-[4/5] rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-lg)]">
              <ProductImage
                src={magnetImages.boothStudio.src}
                alt={magnetImages.boothStudio.alt}
                fill
                className="object-cover object-[50%_18%]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
          <Reveal delay={0.08} direction="right">
            <p className="text-xs uppercase tracking-[0.16em] text-accent-hover font-semibold mb-3">
              Pairs with our photobooth
            </p>
            <h2 className="text-3xl md:text-4xl mb-4">The booth they pose at</h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              White booth, DSLR, ring light, and an attendant. Guests tap to start, take the print,
              and leave with a magnet instead of a paper strip.
            </p>
            <Link href={MAGNET_BOOK_HREF} className="btn-primary">
              Book the booth
              <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-wide grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
          <Reveal>
            <h2 className="text-3xl mb-3">Custom name plate</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Add your names, date, or a small logo on the name plate. Send the copy and quantity.
              We take it from there.
            </p>
            <p className="text-sm text-text-secondary">
              Hosting an event? We quote packages with attendant and coverage.
            </p>
          </Reveal>
          <MagnetEnquiryForm />
        </div>
      </section>
    </div>
  )
}
