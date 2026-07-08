import Link from 'next/link'

import { brand } from '@/lib/brand'

/** FrameFlix mark — polaroid frame with moment ring accent. */
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
        <linearGradient id="ff-gold" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E8D078" />
          <stop offset="0.5" stopColor="#D4B84A" />
          <stop offset="1" stopColor="#B89830" />
        </linearGradient>
        <linearGradient id="ff-cream" x1="12" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFEFB" />
          <stop offset="1" stopColor="#F3EDE0" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="#F7F2E8" />
      <circle cx="32" cy="32" r="26" stroke="url(#ff-gold)" strokeWidth="1.5" opacity="0.35" />
      <circle cx="32" cy="32" r="20" stroke="url(#ff-gold)" strokeWidth="1" opacity="0.2" />
      <rect
        x="14"
        y="12"
        width="36"
        height="42"
        rx="5"
        fill="url(#ff-cream)"
        stroke="url(#ff-gold)"
        strokeWidth="2.5"
      />
      <rect x="18" y="16" width="28" height="24" rx="2.5" fill="#EBE4D4" stroke="url(#ff-gold)" strokeWidth="1.5" />
      <circle cx="26" cy="26" r="3.5" fill="url(#ff-gold)" opacity="0.85" />
      <circle cx="38" cy="26" r="3.5" fill="url(#ff-gold)" opacity="0.85" />
      <path
        d="M24 32c2.5 3 4.5 4 8 4s5.5-1 8-4"
        stroke="url(#ff-gold)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="22" y="44" width="20" height="2.5" rx="1.25" fill="url(#ff-gold)" opacity="0.7" />
      <circle cx="48" cy="16" r="4" fill="url(#ff-gold)" />
      <circle cx="48" cy="16" r="1.5" fill="#F7F2E8" />
    </svg>
  )
}

export function BrandLogoLink({
  href = '/',
  onClick,
  size = 'md',
}: {
  href?: string
  onClick?: () => void
  size?: 'sm' | 'md'
}) {
  const markClass = size === 'sm' ? 'w-9 h-9' : 'w-10 h-10 md:w-11 md:h-11'
  const titleClass = size === 'sm' ? 'text-[1.05rem]' : 'text-lg md:text-[1.2rem]'

  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 shrink-0 group"
      aria-label={`${brand.fullName} home`}
    >
      <span
        className={`${markClass} shrink-0 rounded-[0.85rem] overflow-hidden shadow-sm ring-1 ring-border/70`}
      >
        <BrandMark className="w-full h-full block" />
      </span>
      <span className={`font-serif ${titleClass} tracking-tight leading-tight group-hover:text-accent transition-colors`}>
        {brand.name}
        <span className="block font-sans text-[0.58rem] md:text-[0.62rem] font-medium tracking-[0.08em] text-text-secondary mt-0.5">
          by{' '}
          <span className="text-text-primary/80 tracking-normal font-semibold">{brand.parentName}</span>
        </span>
      </span>
    </Link>
  )
}
