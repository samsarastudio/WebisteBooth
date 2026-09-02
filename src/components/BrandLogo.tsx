import Link from 'next/link'

import { brand } from '@/lib/brand'

/** InMoment mark — polaroid moment with sparkle. */
export function BrandMark({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="im-gold" x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E8D078" />
          <stop offset="0.5" stopColor="#D4B84A" />
          <stop offset="1" stopColor="#B89830" />
        </linearGradient>
        <linearGradient id="im-window" x1="20" y1="14" x2="44" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFDF8" />
          <stop offset="1" stopColor="#F3E8CC" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="#F7F2E8" />
      <circle cx="32" cy="32" r="26" stroke="url(#im-gold)" strokeWidth="1.25" opacity="0.28" />
      <circle cx="32" cy="32" r="20" stroke="url(#im-gold)" strokeWidth="1" opacity="0.16" />
      <rect
        x="17"
        y="11"
        width="30"
        height="40"
        rx="6"
        fill="#FBF7EE"
        stroke="url(#im-gold)"
        strokeWidth="2.75"
      />
      <rect
        x="21"
        y="15"
        width="22"
        height="22"
        rx="3.5"
        fill="url(#im-window)"
        stroke="url(#im-gold)"
        strokeWidth="1.75"
      />
      <circle cx="27.5" cy="24.5" r="2.15" fill="url(#im-gold)" />
      <circle cx="36.5" cy="24.5" r="2.15" fill="url(#im-gold)" />
      <path
        d="M25.5 30.2c2.1 2.6 4.2 3.6 6.5 3.6s4.4-1 6.5-3.6"
        stroke="url(#im-gold)"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <rect x="24" y="43.5" width="16" height="2.2" rx="1.1" fill="url(#im-gold)" opacity="0.75" />
      <path
        d="M50 11.5l1.15 3.15 3.35 1.15-3.35 1.15L50 20.1l-1.15-3.15-3.35-1.15 3.35-1.15L50 11.5z"
        fill="url(#im-gold)"
      />
    </svg>
  )
}

export function BrandLogoLink({
  href = '/',
  onClick,
  size = 'md',
  compact = false,
}: {
  href?: string
  onClick?: () => void
  size?: 'sm' | 'md'
  /** Header use — mark + InMoment wordmark */
  compact?: boolean
}) {
  const markClass = compact
    ? 'w-9 h-9 lg:w-10 lg:h-10'
    : size === 'sm'
      ? 'w-9 h-9'
      : 'w-10 h-10 md:w-11 md:h-11'
  const titleClass = compact
    ? 'text-base lg:text-lg'
    : size === 'sm'
      ? 'text-[1.05rem]'
      : 'text-lg md:text-[1.2rem]'

  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 shrink-0 group min-w-0"
      aria-label={`${brand.parentName} home`}
    >
      <span
        className={`${markClass} shrink-0 rounded-[0.85rem] overflow-hidden shadow-sm ring-1 ring-border/70`}
      >
        <BrandMark className="w-full h-full block" />
      </span>
      <span className={`leading-none ${compact ? '' : 'min-w-0'}`}>
        <span
          className={`font-serif ${titleClass} tracking-tight leading-none group-hover:text-accent transition-colors block`}
        >
          {brand.parentName}
        </span>
        {compact ? (
          <span className="block font-sans text-[0.58rem] lg:text-[0.62rem] font-medium tracking-[0.16em] uppercase text-accent-hover/90 mt-0.5 leading-none">
            {brand.name}
          </span>
        ) : (
          <>
            <span className="block font-sans text-[0.62rem] md:text-[0.68rem] font-medium tracking-[0.18em] uppercase text-accent-hover/90 mt-1 leading-none">
              {brand.name}
            </span>
            <span className="block font-sans text-[0.52rem] md:text-[0.55rem] font-medium tracking-[0.06em] text-text-secondary mt-1 leading-snug">
              Photo Booth &amp; Event Keepsakes
            </span>
          </>
        )}
      </span>
    </Link>
  )
}
