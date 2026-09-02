'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

import { ProductImage } from '@/components/marketing/ProductImage'
import { brand } from '@/lib/brand'
import {
  MAGNET_BOOK_HREF,
  MAGNET_ENQUIRE_HREF,
  MAGNET_PATH,
  magnetImages,
} from '@/lib/magnet'

export function MagnetHero({
  headline = brand.heroHeadline,
  supporting = brand.heroSupporting,
}: {
  headline?: string
  supporting?: string
}) {
  const reduce = useReducedMotion()

  return (
    <section className="relative overflow-hidden wave-bg">
      <div className="relative z-10 container-wide pt-12 pb-16 md:pt-16 md:pb-24">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
          <div>
            <motion.span
              className="price-chip mb-5"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Custom name plate
            </motion.span>
            <motion.h1
              className="text-[2.4rem] leading-[1.12] sm:text-5xl md:text-[3.35rem] md:leading-[1.08] font-semibold mb-5"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              {headline}
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed mb-8"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {supporting}
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
            >
              <Link href={MAGNET_ENQUIRE_HREF} className="btn-primary justify-center">
                {brand.ctaEnquire} about a custom fridge magnet
                <ArrowRight size={16} />
              </Link>
              <Link href={MAGNET_BOOK_HREF} className="btn-secondary justify-center">
                {brand.ctaBook}
              </Link>
            </motion.div>
            <motion.p
              className="mt-4 text-sm text-text-secondary"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Event packages are quoted.{' '}
              <Link href={MAGNET_PATH} className="underline underline-offset-4 hover:text-text-primary">
                See the magnet
              </Link>
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-2 gap-3 md:gap-4"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative col-span-2 aspect-[16/10] rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-lg)] frame-shell">
              <ProductImage
                src={magnetImages.setup.src}
                alt={magnetImages.setup.alt}
                fill
                priority
                className="object-cover object-center scale-[1.04]"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>
            <div className="relative aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-md)]">
              <ProductImage
                src={magnetImages.hero.src}
                alt={magnetImages.hero.alt}
                fill
                className="object-cover object-center scale-[1.02]"
                sizes="(max-width: 1024px) 50vw, 280px"
              />
            </div>
            <div className="relative aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-md)]">
              <ProductImage
                src={magnetImages.boothStudio.src}
                alt={magnetImages.boothStudio.alt}
                fill
                className="object-cover object-[50%_20%] scale-[1.06]"
                sizes="(max-width: 1024px) 50vw, 280px"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
