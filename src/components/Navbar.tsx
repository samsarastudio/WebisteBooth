'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { BrandLogoLink } from '@/components/BrandLogo'

export default function Navbar({
  links,
  showQuote = true,
}: {
  links: { href: string; label: string }[]
  showQuote?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 glass transition-shadow duration-300 ${
        scrolled || open ? 'shadow-sm' : ''
      }`}
    >
      <nav className="container-wide flex items-center justify-between h-16 md:h-[72px]">
        <BrandLogoLink onClick={() => setOpen(false)} />

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">
              {l.label}
            </Link>
          ))}
          {showQuote && (
            <Link href="/quote" className="btn-primary !py-2.5 !px-5 !min-h-0 text-sm">
              Get a Quote
            </Link>
          )}
        </div>

        <button
          type="button"
          className="md:hidden p-2.5 -mr-1 text-text-primary rounded-full hover:bg-accent-light/60 touch-manipulation"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden border-t border-border bg-bg-card/95 backdrop-blur-xl"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container-wide py-4 flex flex-col gap-1 pb-[calc(1rem+var(--safe-bottom))]">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={reduce ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <Link
                    href={l.href}
                    className="nav-link block py-3.5 text-base"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              {showQuote && (
                <Link
                  href="/quote"
                  className="btn-primary justify-center mt-2"
                  onClick={() => setOpen(false)}
                >
                  Get a Quote
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
