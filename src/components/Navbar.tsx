'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { BrandLogoLink } from '@/components/BrandLogo'
import { brand } from '@/lib/brand'

export default function Navbar({
  links,
  showQuote = true,
  showDesign = true,
}: {
  links: { href: string; label: string }[]
  showQuote?: boolean
  showDesign?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reduce = useReducedMotion()

  const desktopLinks = useMemo(
    () => (showDesign ? links.filter((l) => l.href !== '/design') : links),
    [links, showDesign],
  )

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
      <nav className="container-wide flex items-center justify-between gap-3 min-h-16 lg:min-h-[72px] py-2">
        <BrandLogoLink compact onClick={() => setOpen(false)} />

        <div className="hidden lg:flex items-center justify-end gap-3 xl:gap-5 min-w-0 flex-1">
          <div className="flex items-center gap-3 xl:gap-4 min-w-0">
            {desktopLinks.map((l) => (
              <Link key={l.href} href={l.href} className="nav-link whitespace-nowrap shrink-0">
                {l.label === 'Design Studio' ? 'Design' : l.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 xl:gap-3 shrink-0">
            {showDesign ? (
              <Link
                href="/design"
                className="btn-primary !py-2 !px-4 xl:!px-5 !min-h-0 text-sm whitespace-nowrap"
              >
                <span className="hidden xl:inline">{brand.ctaDesign}</span>
                <span className="xl:hidden">Design free</span>
              </Link>
            ) : showQuote ? (
              <Link href="/quote" className="btn-primary !py-2 !px-4 !min-h-0 text-sm whitespace-nowrap">
                Get a Quote
              </Link>
            ) : null}
            {showQuote ? (
              <Link href="/quote" className="nav-link text-sm font-medium whitespace-nowrap">
                Quote
              </Link>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          className="lg:hidden p-2.5 -mr-1 text-text-primary rounded-full hover:bg-accent-light/60 touch-manipulation shrink-0"
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
            className="lg:hidden border-t border-border bg-bg-card/95 backdrop-blur-xl"
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
              {showDesign ? (
                <Link
                  href="/design"
                  className="btn-primary justify-center mt-2"
                  onClick={() => setOpen(false)}
                >
                  {brand.ctaDesign}
                </Link>
              ) : showQuote ? (
                <Link
                  href="/quote"
                  className="btn-primary justify-center mt-2"
                  onClick={() => setOpen(false)}
                >
                  Get a Quote
                </Link>
              ) : null}
              {showDesign && showQuote ? (
                <Link
                  href="/quote"
                  className="btn-secondary justify-center mt-2"
                  onClick={() => setOpen(false)}
                >
                  Get a Quote
                </Link>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
