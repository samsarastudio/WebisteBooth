import Link from 'next/link'
import { ArrowRight, Check, Palette, Sparkles, Upload, Wand2 } from 'lucide-react'

import { DesignStudioIllustration } from '@/components/marketing/DesignStudioIllustration'
import { Reveal, Stagger, StaggerItem } from '@/components/marketing/Reveal'
import { brand } from '@/lib/brand'

const STEPS = [
  {
    icon: Upload,
    title: 'Drop in a sample photo',
    desc: 'See your frame with a real image — not a generic placeholder.',
  },
  {
    icon: Palette,
    title: 'Curate your palette',
    desc: 'Ten designer color stories, frame bases, text, and raised ornaments.',
  },
  {
    icon: Wand2,
    title: 'Preview & save',
    desc: 'Your draft auto-saves to your email. Continue to quote when you love it.',
  },
] as const

export function DesignStudioSection({
  designHref = '/design',
  quoteHref = '/quote?service=frames',
}: {
  designHref?: string
  quoteHref?: string
}) {
  return (
    <section className="section overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-light/30 via-transparent to-bg-secondary/50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[min(520px,80vw)] h-[min(520px,80vw)] rounded-full bg-accent/8 blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />

      <div className="container-wide relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal direction="left" className="order-2 lg:order-1">
            <DesignStudioIllustration />
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-light text-accent-hover text-sm font-semibold mb-4 tracking-wide uppercase">
                <Sparkles size={14} aria-hidden />
                Free design studio
              </span>
              <h2 className="text-3xl md:text-[2.6rem] md:leading-tight mb-4">
                Design your frame{' '}
                <span className="text-gradient italic">before</span> you book
              </h2>
              <p className="text-text-secondary leading-relaxed mb-6 max-w-lg">
                Play with layouts, colors, and captions in our live studio — the same preview we use
                for your event. No commitment until you&apos;re ready for a quote.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <ul className="space-y-2.5 mb-8">
                {[
                  'Original keepsake or 6×4 landscape — switch anytime',
                  'Raised 3D florals, doves, and celebration ornaments',
                  'Caption locked print-safe — your names, perfectly placed',
                  'Sign in once — we save your draft and email you a link',
                ].map((line) => (
                  <li key={line} className="flex gap-2.5 items-start text-sm">
                    <Check size={16} className="text-accent mt-0.5 shrink-0" strokeWidth={2.5} />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link href={designHref} className="btn-primary justify-center">
                  {brand.ctaDesign}
                  <ArrowRight size={16} />
                </Link>
                <Link href={quoteHref} className="btn-secondary justify-center">
                  Skip to quote
                </Link>
              </div>
            </Reveal>

            <Stagger className="grid sm:grid-cols-3 gap-3">
              {STEPS.map((step) => (
                <StaggerItem
                  key={step.title}
                  className="card p-4 border-accent-soft/40 bg-bg-card/90"
                >
                  <step.icon size={18} className="text-accent mb-2" strokeWidth={2} aria-hidden />
                  <p className="text-sm font-semibold mb-1 leading-snug">{step.title}</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{step.desc}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  )
}
