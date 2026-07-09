'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, Frame, Sparkles } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

import { ProductImage } from '@/components/marketing/ProductImage'
import { brand } from '@/lib/brand'
import { frameOffering, stickerOffering } from '@/lib/offerings'

export function DualHero({
  headline = brand.heroHeadline,
  supporting = brand.heroSupporting,
  designHref = '/design',
  quoteFramesHref = '/quote?service=frames',
  quoteStickersHref = '/quote?service=stickers',
  showDesign = true,
}: {
  headline?: string
  supporting?: string
  designHref?: string
  quoteFramesHref?: string
  quoteStickersHref?: string
  showDesign?: boolean
}) {
  const reduce = useReducedMotion()

  return (
    <section className="relative min-h-[calc(100svh-4rem)] md:min-h-[calc(100svh-4.5rem)] flex flex-col justify-start overflow-hidden wave-bg">
      <div className="absolute inset-0 motif-overlay animate-wave opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/50 via-transparent to-bg-primary" />

      <div className="relative z-10 container-wide py-16 md:py-20 w-full">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-accent-light text-accent-hover text-sm font-semibold mb-5 tracking-wide uppercase"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {brand.displayName}
          </motion.span>
          <motion.h1
            className="text-[2.35rem] leading-[1.2] sm:text-5xl sm:leading-[1.18] md:text-6xl md:leading-[1.15] font-semibold mb-5 pb-1"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            {headline}
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed mb-8"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {supporting}
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
          >
            {showDesign ? (
              <Link href={designHref} className="btn-primary justify-center">
                {brand.ctaDesign}
                <Sparkles size={16} />
              </Link>
            ) : null}
            <Link href={quoteFramesHref} className={showDesign ? 'btn-secondary justify-center' : 'btn-primary justify-center'}>
              Get a Quote
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-7 max-w-5xl mx-auto">
          <OfferingCard
            icon={<Frame className="text-accent" size={22} />}
            eyebrow={frameOffering.eyebrow}
            title={frameOffering.headline}
            summary={frameOffering.summary}
            highlights={frameOffering.highlights}
            image="/brand/style-romance-photo.png"
            primaryHref={showDesign ? designHref : quoteFramesHref}
            secondaryHref="/packages"
            primaryLabel={showDesign ? brand.ctaDesign : 'Get a Quote'}
            secondaryLabel="See packages"
            delay={0.15}
          />
          <OfferingCard
            icon={<Sparkles className="text-accent" size={22} />}
            eyebrow={stickerOffering.eyebrow}
            title={stickerOffering.headline}
            summary={stickerOffering.summary}
            highlights={stickerOffering.highlights}
            image="/brand/stickers-hero.png"
            primaryHref={quoteStickersHref}
            secondaryHref="/stickers"
            primaryLabel="Get a sticker quote"
            secondaryLabel="Learn more"
            delay={0.22}
          />
        </div>
      </div>
    </section>
  )
}

function OfferingCard({
  icon,
  eyebrow,
  title,
  summary,
  highlights,
  image,
  primaryHref,
  secondaryHref,
  primaryLabel,
  secondaryLabel,
  delay,
}: {
  icon: ReactNode
  eyebrow: string
  title: string
  summary: string
  highlights: string[]
  image: string
  primaryHref: string
  secondaryHref: string
  primaryLabel: string
  secondaryLabel: string
  delay: number
}) {
  const reduce = useReducedMotion()

  return (
    <motion.article
      className="card overflow-hidden flex flex-col group"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-bg-secondary">
        <ProductImage
          src={image}
          alt=""
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <span className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-card/90 backdrop-blur text-xs font-semibold uppercase tracking-wide">
          {icon}
          {eyebrow}
        </span>
      </div>
      <div className="p-6 md:p-7 flex flex-col flex-1">
        <h2 className="text-2xl font-serif mb-2">{title}</h2>
        <p className="text-sm text-text-secondary leading-relaxed mb-4">{summary}</p>
        <ul className="grid grid-cols-2 gap-2 mb-6 text-xs text-text-secondary">
          {highlights.map((h) => (
            <li key={h} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              {h}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-col sm:flex-row gap-2">
          <Link href={primaryHref} className="btn-primary justify-center flex-1 !py-2.5 !min-h-0 text-sm">
            {primaryLabel}
            <ArrowRight size={14} />
          </Link>
          <Link
            href={secondaryHref}
            className="btn-secondary justify-center flex-1 !py-2.5 !min-h-0 text-sm"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
