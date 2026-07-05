'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

import { ProductImage } from '@/components/marketing/ProductImage'
import type { FrameStyleData } from '@/lib/brand-images'
import { variationsForStyle } from '@/lib/brand-images'

export function StyleSlider({
  styles,
  showQuote = true,
}: {
  styles: FrameStyleData[]
  showQuote?: boolean
}) {
  const [styleIndex, setStyleIndex] = useState(0)
  const [varIndex, setVarIndex] = useState(0)
  const reduce = useReducedMotion()

  const style = styles[styleIndex]
  const variations = style
    ? variationsForStyle(style.slug, style.imagePath, style.sampleMessage)
    : []
  const current = variations[varIndex] ?? variations[0]

  useEffect(() => {
    setVarIndex(0)
  }, [styleIndex])

  useEffect(() => {
    if (reduce || variations.length < 2) return
    const id = window.setInterval(() => {
      setVarIndex((i) => (i + 1) % variations.length)
    }, 3000)
    return () => window.clearInterval(id)
  }, [reduce, variations.length, styleIndex])

  if (!style || !current) return null

  const prevStyle = () => setStyleIndex((i) => (i - 1 + styles.length) % styles.length)
  const nextStyle = () => setStyleIndex((i) => (i + 1) % styles.length)

  return (
    <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-center">
      <div className="relative">
        <div className="frame-shell p-2 sm:p-3 max-w-md mx-auto lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem] bg-[#f3efe6]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${style.slug}-${current.src}`}
                className="absolute inset-0"
                initial={reduce ? false : { opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35 }}
              >
                <ProductImage
                  src={current.src}
                  alt={`${style.name} — ${current.caption}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 90vw, 520px"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {variations.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {variations.map((v, i) => (
              <button
                key={v.src}
                type="button"
                onClick={() => setVarIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === varIndex ? 'w-6 bg-accent' : 'w-2 bg-border'
                }`}
                aria-label={`Variation ${i + 1}`}
              />
            ))}
          </div>
        )}

        <p className="text-center text-sm font-medium mt-3 text-text-primary">
          {current.caption}
        </p>
        <p className="text-center text-xs text-text-secondary mt-1">
          A souvenir for your guests
        </p>
      </div>

      <div className="text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
          <button
            type="button"
            onClick={prevStyle}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
            aria-label="Previous style"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            {styleIndex + 1} / {styles.length}
          </span>
          <button
            type="button"
            onClick={nextStyle}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
            aria-label="Next style"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <h3 className="text-3xl md:text-4xl font-serif mb-2">{style.name}</h3>
        <p className="text-accent font-medium text-sm mb-3">{style.tagline}</p>
        <p className="text-text-secondary mb-2 max-w-md mx-auto lg:mx-0">
          {style.description}
        </p>
        {(style.slug === 'stickered-painted' || style.slug === 'hand-painted') && (
          <p className="text-xs text-text-secondary mb-3 max-w-md mx-auto lg:mx-0">
            Not raised 3D print — a painted or sticker finish on the frame surface.
          </p>
        )}
        <p className="text-lg font-medium mb-5">&ldquo;{style.sampleMessage}&rdquo;</p>

        <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
          {style.plaColors.map((c) => (
            <span
              key={c.name}
              className="inline-flex items-center gap-1.5 text-xs card px-2.5 py-1"
            >
              <span
                className="w-3 h-3 rounded-full border border-border"
                style={{ backgroundColor: c.hex }}
              />
              {c.name}
            </span>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 justify-center lg:justify-start scrollbar-none">
          {styles.map((s, i) => (
            <button
              key={String(s.id)}
              type="button"
              onClick={() => setStyleIndex(i)}
              className={`relative shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                i === styleIndex ? 'border-accent' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
              aria-label={s.name}
            >
              <ProductImage
                src={s.imagePath}
                alt={s.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>

        {showQuote && (
          <Link
            href={`/quote?style=${style.slug}`}
            className="btn-primary mt-6 w-full sm:w-auto justify-center"
          >
            Choose this style
            <Sparkles size={16} />
          </Link>
        )}
      </div>
    </div>
  )
}
