'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { ProductImage } from '@/components/marketing/ProductImage'

const cards = [
  {
    src: '/brand/magnet-hero-pink.png',
    alt: 'Blush pink fridge magnet photo frame',
    label: 'Blush pink',
  },
  {
    src: '/brand/magnet-cream.png',
    alt: 'Cream fridge magnet photo frame',
    label: 'Cream',
  },
  {
    src: '/brand/magnet-mint.png',
    alt: 'Mint fridge magnet photo frame',
    label: 'Mint',
  },
  {
    src: '/brand/magnet-blue.png',
    alt: 'Baby-blue fridge magnet photo frame',
    label: 'Baby blue',
  },
]

export function HeroCards() {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % cards.length)
    }, 3400)
    return () => window.clearInterval(id)
  }, [reduce])

  return (
    <div className="relative mx-auto w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[460px]">
      <div className="relative aspect-[4/3] w-full [perspective:1200px]">
        {cards.map((card, i) => {
          const offset = (i - active + cards.length) % cards.length
          const isFront = offset === 0
          const x = reduce ? 0 : offset === 0 ? 0 : offset === 1 ? 22 : -22
          const y = reduce ? 0 : offset === 0 ? 0 : offset === 1 ? 10 : 12
          const rotate = reduce ? 0 : offset === 0 ? 0 : offset === 1 ? 5 : -5
          const scale = offset === 0 ? 1 : offset === 1 ? 0.96 : 0.94
          const z = 30 - offset * 10
          const opacity = offset === 0 ? 1 : 0.92

          return (
            <motion.button
              key={card.src}
              type="button"
              onClick={() => setActive(i)}
              className="crisp-card absolute inset-0 origin-center touch-manipulation"
              style={{ zIndex: z }}
              animate={{ x, y, rotate, scale, opacity }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              aria-label={`Show ${card.label} magnet`}
              aria-pressed={isFront}
            >
              <div
                className={`frame-shell crisp-frame h-full p-1.5 sm:p-2 ${
                  isFront ? 'ring-1 ring-black/5' : ''
                }`}
              >
                <div className="relative h-full w-full overflow-hidden rounded-[0.95rem] bg-white">
                  <ProductImage
                    src={card.src}
                    alt={card.alt}
                    fill
                    priority={i === 0}
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 520px"
                  />
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 card px-3 py-2 text-xs font-medium shadow-md whitespace-nowrap">
        Souvenirs for your guests
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {cards.map((card, i) => (
          <button
            key={card.src}
            type="button"
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all ${
              i === active ? 'w-6 bg-accent' : 'w-2 bg-border hover:bg-accent/50'
            }`}
            aria-label={`Show ${card.label}`}
          />
        ))}
      </div>
    </div>
  )
}
