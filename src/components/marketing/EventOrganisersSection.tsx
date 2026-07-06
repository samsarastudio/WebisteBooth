import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'

import { ProductImage } from '@/components/marketing/ProductImage'
import { Reveal } from '@/components/marketing/Reveal'

const DEFAULT_BULLETS = [
  'On-site attendant — we handle setup, crowd flow, and teardown',
  'Custom branding and frame design for your client',
  'Multi-venue and multi-day options for larger programs',
]

export function EventOrganisersSection({
  title = 'We would love to be part of your success stories',
  body = 'Partner with FrameFlix for weddings, corporate activations, and milestone events — branded keepsakes your guests share long after the night ends.',
  contactHref = '/contact',
  quoteHref = '/quote?service=both',
}: {
  title?: string
  body?: string
  contactHref?: string
  quoteHref?: string
}) {
  return (
    <section className="section overflow-hidden">
      <div className="container-wide grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <Reveal direction="left">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-light text-accent-hover text-sm font-semibold mb-4 tracking-wide uppercase">
            For event organisers &amp; planners
          </span>
          <h2 className="text-3xl md:text-4xl mb-4">{title}</h2>
          <p className="text-text-secondary leading-relaxed mb-6">{body}</p>
          <ul className="space-y-3 mb-8">
            {DEFAULT_BULLETS.map((line) => (
              <li key={line} className="flex gap-2 items-start text-sm">
                <Check size={16} className="text-accent mt-0.5 shrink-0" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={contactHref} className="btn-primary justify-center">
              Partner with us
              <ArrowRight size={16} />
            </Link>
            <Link href={quoteHref} className="btn-secondary justify-center">
              Request a quote
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.1} direction="right">
          <div className="relative aspect-[4/3] rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-lg)] frame-shell p-2">
            <div className="relative w-full h-full rounded-[1rem] overflow-hidden">
              <ProductImage
                src="/brand/stickered-event-1.png"
                alt="Corporate event keepsake frames"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 520px"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
