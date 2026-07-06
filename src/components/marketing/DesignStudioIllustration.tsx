'use client'

import { motion, useReducedMotion } from 'motion/react'

export function DesignStudioIllustration() {
  const reduce = useReducedMotion()

  const float = (delay: number, y = 6) =>
    reduce
      ? {}
      : {
          animate: { y: [0, -y, 0] },
          transition: {
            duration: 4 + delay,
            repeat: Infinity,
            ease: 'easeInOut' as const,
            delay,
          },
        }

  return (
    <div className="relative w-full max-w-lg mx-auto" aria-hidden>
      <div className="absolute -inset-6 md:-inset-10 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -right-4 w-24 h-24 rounded-full bg-accent-soft/40 blur-2xl pointer-events-none" />

      <motion.div
        className="relative"
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg
          viewBox="0 0 480 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-[0_24px_48px_rgba(42,40,36,0.12)]"
          role="img"
          aria-label="Design studio preview"
        >
          <defs>
            <linearGradient id="ds-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e8d078" />
              <stop offset="50%" stopColor="#d4b84a" />
              <stop offset="100%" stopColor="#c4a83a" />
            </linearGradient>
            <linearGradient id="ds-frame-bg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#faf7ef" />
              <stop offset="100%" stopColor="#f0ebe0" />
            </linearGradient>
            <linearGradient id="ds-photo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d8d2c8" />
              <stop offset="100%" stopColor="#b8b0a4" />
            </linearGradient>
            <filter id="ds-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* App window */}
          <rect x="24" y="20" width="432" height="380" rx="20" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="1.5" />
          <rect x="24" y="20" width="432" height="44" rx="20" fill="var(--bg-secondary)" />
          <rect x="24" y="52" width="432" height="12" fill="var(--bg-secondary)" />
          <circle cx="48" cy="42" r="5" fill="#e8a0a0" opacity="0.7" />
          <circle cx="66" cy="42" r="5" fill="#e8d078" opacity="0.7" />
          <circle cx="84" cy="42" r="5" fill="#a8d4a0" opacity="0.7" />
          <text x="240" y="46" textAnchor="middle" fill="var(--text-secondary)" fontSize="11" fontFamily="system-ui,sans-serif" fontWeight="500">
            FrameFlix Design Studio
          </text>

          {/* Left sidebar */}
          <rect x="40" y="76" width="88" height="308" rx="12" fill="var(--bg-secondary)" opacity="0.6" />
          <text x="52" y="98" fill="var(--text-secondary)" fontSize="8" fontFamily="system-ui,sans-serif" fontWeight="600" letterSpacing="0.08em">
            SIZE
          </text>
          <rect x="48" y="106" width="72" height="28" rx="8" fill="url(#ds-gold)" opacity="0.25" stroke="url(#ds-gold)" strokeWidth="1.5" />
          <text x="84" y="124" textAnchor="middle" fill="#8a7a30" fontSize="9" fontFamily="system-ui,sans-serif" fontWeight="600">
            Original
          </text>
          <rect x="48" y="140" width="72" height="28" rx="8" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="1" />
          <text x="84" y="158" textAnchor="middle" fill="var(--text-secondary)" fontSize="8" fontFamily="system-ui,sans-serif">
            6×4
          </text>

          <text x="52" y="188" fill="var(--text-secondary)" fontSize="8" fontFamily="system-ui,sans-serif" fontWeight="600" letterSpacing="0.08em">
            PALETTE
          </text>
          {['#f5f0e6', '#d4b84a', '#8b7355', '#2a2824'].map((c, i) => (
            <circle key={c} cx={56 + i * 18} cy={204} r="7" fill={c} stroke="var(--border)" strokeWidth="1" />
          ))}

          {/* Toolbar */}
          <rect x="140" y="76" width="300" height="36" rx="10" fill="var(--bg-secondary)" opacity="0.5" />
          {['Photo', 'Style', 'Colors', 'Text', 'Decor'].map((label, i) => (
            <g key={label}>
              <rect
                x={148 + i * 56}
                y="82"
                width="48"
                height="24"
                rx="6"
                fill={i === 2 ? 'url(#ds-gold)' : 'transparent'}
                opacity={i === 2 ? 0.35 : 1}
              />
              <text
                x={172 + i * 56}
                y="98"
                textAnchor="middle"
                fill={i === 2 ? '#6b5a20' : 'var(--text-secondary)'}
                fontSize="8"
                fontFamily="system-ui,sans-serif"
                fontWeight={i === 2 ? 600 : 400}
              >
                {label}
              </text>
            </g>
          ))}

          {/* Canvas / frame preview */}
          <rect x="148" y="124" width="284" height="248" rx="14" fill="var(--bg-primary)" stroke="var(--border)" strokeWidth="1" />

          {/* Keepsake frame */}
          <rect x="188" y="148" width="204" height="204" rx="6" fill="url(#ds-frame-bg)" stroke="url(#ds-gold)" strokeWidth="3" />
          {/* Corner ornaments */}
          <path d="M196 156 Q196 148 204 148" stroke="url(#ds-gold)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M376 156 Q376 148 368 148" stroke="url(#ds-gold)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M196 344 Q196 352 204 352" stroke="url(#ds-gold)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M376 344 Q376 352 368 352" stroke="url(#ds-gold)" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Photo slot */}
          <rect x="210" y="170" width="160" height="140" rx="4" fill="url(#ds-photo)" />
          <circle cx="290" cy="230" r="22" fill="none" stroke="white" strokeWidth="2" opacity="0.5" />
          <path d="M278 242 L290 228 L302 238 L310 230 L318 242" stroke="white" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="290" y="268" textAnchor="middle" fill="white" fontSize="9" fontFamily="system-ui,sans-serif" opacity="0.65">
            Your photo
          </text>

          {/* Caption */}
          <text x="290" y="332" textAnchor="middle" fill="url(#ds-gold)" fontSize="14" fontFamily="Georgia,serif" fontStyle="italic" filter="url(#ds-glow)">
            Anna &amp; Stephen
          </text>

          {/* Floating decor - tulip */}
          <motion.g {...float(0, 5)}>
            <ellipse cx="172" cy="200" rx="8" ry="12" fill="#d4a0a8" opacity="0.85" />
            <path d="M172 212 L172 228" stroke="#6b8f5a" strokeWidth="2" strokeLinecap="round" />
            <path d="M168 220 Q172 216 176 220" stroke="#6b8f5a" strokeWidth="1.5" fill="none" />
          </motion.g>

          {/* Floating dove */}
          <motion.g {...float(0.8, 4)}>
            <path
              d="M400 175 Q408 168 416 175 Q412 182 408 178 Q404 182 400 175"
              fill="var(--bg-card)"
              stroke="url(#ds-gold)"
              strokeWidth="1.2"
            />
            <path d="M404 178 L398 182 M412 178 L418 182" stroke="url(#ds-gold)" strokeWidth="1" strokeLinecap="round" />
          </motion.g>

          {/* Sparkle accents */}
          <motion.g {...float(1.2, 3)}>
            <path d="M430 120 L432 126 L438 128 L432 130 L430 136 L428 130 L422 128 L428 126 Z" fill="url(#ds-gold)" opacity="0.8" />
          </motion.g>
          <motion.g {...float(0.4, 4)}>
            <path d="M158 300 L159 304 L163 305 L159 306 L158 310 L157 306 L153 305 L157 304 Z" fill="url(#ds-gold)" opacity="0.6" />
          </motion.g>

          {/* Saved badge */}
          <rect x="320" y="88" width="108" height="26" rx="13" fill="var(--accent-light)" stroke="var(--accent)" strokeWidth="1" opacity="0.95" />
          <circle cx="334" cy="101" r="4" fill="#6bcf7f" />
          <text x="348" y="105" fill="var(--accent-hover)" fontSize="9" fontFamily="system-ui,sans-serif" fontWeight="600">
            Draft saved
          </text>
        </svg>

        {/* Floating feature chips */}
        <motion.div
          className="absolute -left-2 md:-left-6 top-[28%] card px-3 py-2 text-xs font-medium shadow-md border-accent-soft/50"
          {...float(0.2, 5)}
        >
          <span className="text-accent">✦</span> Live preview
        </motion.div>
        <motion.div
          className="absolute -right-1 md:-right-4 bottom-[22%] card px-3 py-2 text-xs font-medium shadow-md border-accent-soft/50"
          {...float(0.6, 4)}
        >
          Auto-saved <span className="text-accent">↻</span>
        </motion.div>
      </motion.div>
    </div>
  )
}
