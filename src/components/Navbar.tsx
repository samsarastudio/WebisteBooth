"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/about", label: "About" },
  { href: "/packages", label: "Packages" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-serif font-semibold tracking-tight group-hover:text-accent transition-colors">
            FrameFlix Studio
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="btn-primary !px-6 !py-2.5 !text-sm">
            Book Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <>
                <path d="M4 6h16M4 12h16M4 18h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-bg-card/90 backdrop-blur-xl">
          <div className="flex flex-col px-6 py-4 gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="py-2.5 nav-link border-b border-border/40"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="btn-primary !px-6 !py-3 !text-center mt-2"
              onClick={() => setOpen(false)}
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
