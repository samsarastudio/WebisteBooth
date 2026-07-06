import type { OrnamentShapeType } from '@/lib/frame-design/types'

export function OrnamentShapeArt({
  shapeType,
  className = 'w-10 h-10 mx-auto mb-1',
  fill = 'currentColor',
}: {
  shapeType?: OrnamentShapeType
  className?: string
  fill?: string
}) {
  const common = { className, viewBox: '0 0 40 40', fill, xmlns: 'http://www.w3.org/2000/svg' }

  switch (shapeType) {
    case 'heart':
      return (
        <svg {...common}>
          <path d="M20 34s-10-6.5-10-14a5.5 5.5 0 0 1 10-3 5.5 5.5 0 0 1 10 3c0 7.5-10 14-10 14z" />
        </svg>
      )
    case 'star':
      return (
        <svg {...common}>
          <path d="M20 4l4.2 12.9H38l-10.5 7.6 4 12.9L20 29.8 8.5 37.4l4-12.9L2 16.9h13.8z" />
        </svg>
      )
    case 'circle':
      return (
        <svg {...common}>
          <circle cx="20" cy="20" r="14" />
        </svg>
      )
    case 'diamond':
      return (
        <svg {...common}>
          <path d="M20 6 34 20 20 34 6 20z" />
        </svg>
      )
    case 'flourish':
      return (
        <svg {...common}>
          <path d="M8 28c6-10 18-10 24 0M10 22c4-6 16-6 20 0M12 16c2-4 14-4 16 0" stroke={fill} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </svg>
      )
    case 'arc':
      return (
        <svg {...common}>
          <path d="M6 28a14 14 0 0 1 28 0" stroke={fill} strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      )
    case 'tulip':
      return (
        <svg {...common}>
          <rect x="18.5" y="18" width="3" height="16" rx="1.5" />
          <ellipse cx="14" cy="24" rx="5" ry="3" transform="rotate(-35 14 24)" />
          <ellipse cx="26" cy="24" rx="5" ry="3" transform="rotate(35 26 24)" />
          <ellipse cx="20" cy="12" rx="7" ry="9" />
        </svg>
      )
    case 'bird-mail':
      return (
        <svg {...common}>
          <ellipse cx="14" cy="22" rx="9" ry="5.5" />
          <ellipse cx="8" cy="20" rx="6" ry="4" transform="rotate(-18 8 20)" />
          <rect x="22" y="15" width="11" height="7" rx="1" />
          <path d="M8 24c-4-2-6-1-8 2" stroke={fill} strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      )
    case 'envelope':
      return (
        <svg {...common}>
          <rect x="8" y="12" width="24" height="16" rx="1.5" />
          <path d="M8 14l12 9 12-9" stroke={fill} strokeWidth="1.5" fill="none" />
        </svg>
      )
    case 'vine-scroll':
      return (
        <svg {...common}>
          <path
            d="M6 32c8-14 20-16 28-6 2 2.5 2 6-1 8-3 2.5-7 1.5-8-2"
            stroke={fill}
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="11" cy="24" rx="4" ry="2.5" transform="rotate(-30 11 24)" />
          <ellipse cx="24" cy="16" rx="4" ry="2.5" transform="rotate(20 24 16)" />
          <ellipse cx="30" cy="28" rx="4" ry="2.5" transform="rotate(-10 30 28)" />
        </svg>
      )
    case 'vine-corner':
      return (
        <svg {...common}>
          <path d="M6 34V14c0-4 4-8 10-8" stroke={fill} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M6 34h18c4 0 8-3 8-8" stroke={fill} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <ellipse cx="12" cy="20" rx="4" ry="2.5" transform="rotate(-40 12 20)" />
          <ellipse cx="22" cy="30" rx="4" ry="2.5" transform="rotate(10 22 30)" />
        </svg>
      )
    case 'floral-cluster':
      return (
        <svg {...common}>
          <circle cx="14" cy="14" r="4.5" />
          <circle cx="26" cy="14" r="4.5" />
          <circle cx="20" cy="24" r="4.5" />
          <rect x="19" y="24" width="2" height="10" rx="1" />
        </svg>
      )
    case 'rose-bud':
      return (
        <svg {...common}>
          <path d="M20 34V18M20 18c-5-1-8 2-7 7 1 4 6 5 7 0 1 5 6 4 7-1 1-5-2-8-7-7z" />
          <ellipse cx="20" cy="14" rx="6" ry="7" />
        </svg>
      )
    case 'leaf-sprig':
      return (
        <svg {...common}>
          <rect x="19" y="10" width="2.5" height="22" rx="1.2" />
          <ellipse cx="14" cy="18" rx="6" ry="3" transform="rotate(-40 14 18)" />
          <ellipse cx="26" cy="24" rx="6" ry="3" transform="rotate(40 26 24)" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="20" cy="20" r="10" opacity="0.35" />
        </svg>
      )
  }
}
