import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

import { IllustrativeDisclaimer } from '@/components/marketing/IllustrativeDisclaimer'
import { ProductImage } from '@/components/marketing/ProductImage'
import { Reveal, Stagger, StaggerItem } from '@/components/marketing/Reveal'
import { stickerOffering } from '@/lib/offerings'
import { guardPage } from '@/lib/page-guard'

export const metadata: Metadata = {
  title: 'Sticker Studio',
  description:
    'On-site custom sticker experiences — print and cut vibrant photo stickers, labels, and favors for your guests.',
}

export default async function StickersPage() {
  const settings = await guardPage('stickers')
  const quoteHref = settings.showQuotePage ? '/quote?service=stickers' : '/contact'

  return (
    <div>
      <section className="section pb-8 relative overflow-hidden">
        <div className="absolute inset-0 motif-overlay opacity-20" />
        <div className="container-wide relative z-10 grid lg:grid-cols-2 gap-10 items-center">
          <Reveal>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-light text-accent-hover text-sm font-semibold mb-4 tracking-wide uppercase">
              {stickerOffering.eyebrow}
            </span>
            <h1 className="text-4xl md:text-5xl mb-4">{stickerOffering.headline}</h1>
            <p className="text-text-secondary text-lg leading-relaxed mb-6">
              Bring a live sticker experience to your event. Guests walk away with custom photo
              stickers, labels, and favors — printed and cut on the spot in vivid color.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={quoteHref} className="btn-primary justify-center">
                Get a sticker quote
                <Sparkles size={16} />
              </Link>
              <Link href="/packages" className="btn-secondary justify-center">
                Explore frames
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1} direction="scale">
            <div className="frame-shell p-2">
              <div className="relative aspect-[4/3] rounded-[1rem] overflow-hidden">
                <ProductImage
                  src="/brand/stickers-hero.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
            <IllustrativeDisclaimer className="mt-4" />
          </Reveal>
        </div>
      </section>

      <section className="section bg-bg-secondary/50">
        <div className="container-wide">
          <Reveal className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl mb-3">Why guests love it</h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              A playful favor that feels personal — stickers they can wear, share, and keep.
            </p>
          </Reveal>
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stickerOffering.features.map((f) => (
              <StaggerItem key={f.title} className="card p-6">
                <h3 className="font-serif text-xl mb-2">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section">
        <div className="container-wide max-w-3xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl mb-4">Perfect for any celebration</h2>
            <p className="text-text-secondary leading-relaxed mb-8">
              Weddings, birthdays, corporate events, graduations, and brand activations. Pair with
              our custom frames for a full guest-favor experience — or book stickers on their own.
            </p>
            <Link href={quoteHref} className="btn-primary">
              Request a quote
              <Sparkles size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
