'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

import { brand } from '@/lib/brand'
import { MAGNET_BOOK_HREF, MAGNET_ENQUIRE_HREF } from '@/lib/magnet'

export function StickyCta({ showQuote = true }: { showQuote?: boolean; showDesign?: boolean }) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (pathname === '/quote' || pathname === '/design') return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 z-40 px-4 md:hidden pointer-events-none"
          style={{ bottom: 'calc(12px + var(--safe-bottom))' }}
          initial={reduce ? false : { y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        >
          <div className="flex gap-2 pointer-events-auto">
            <Link href={MAGNET_ENQUIRE_HREF} className="btn-primary flex-1 justify-center !py-3 !min-h-0 text-sm">
              {brand.ctaEnquire}
            </Link>
            {showQuote ? (
              <Link href={MAGNET_BOOK_HREF} className="btn-secondary flex-1 justify-center !py-3 !min-h-0 text-sm">
                {brand.ctaBook}
              </Link>
            ) : null}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
