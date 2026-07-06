'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

export function StickyCta() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (pathname === '/quote') return null

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
          <Link
            href="/quote"
            className="btn-primary w-full justify-center shadow-lg pointer-events-auto"
          >
            Get Your Quote
            <Sparkles size={16} />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
