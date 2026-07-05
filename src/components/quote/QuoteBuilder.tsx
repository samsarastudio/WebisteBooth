'use client'

import Link from 'next/link'
import { useMemo, useState, type FormEvent } from 'react'
import { Check, CheckCircle2, Clock, Minus, Plus, Sparkles } from 'lucide-react'

import { ProductImage } from '@/components/marketing/ProductImage'

import type { LeadFormState } from '@/lib/lead-form'
import type { FrameStyleData } from '@/lib/brand-images'
import { brand } from '@/lib/brand'
import { calculateEstimate, type PricedAddOn, type PricedPackage } from '@/lib/pricing'

const initialState: LeadFormState = { ok: false }

async function postLeadForm(form: HTMLFormElement): Promise<LeadFormState> {
  const res = await fetch('/api/leads', { method: 'POST', body: new FormData(form) })
  return res.json() as Promise<LeadFormState>
}

const eventTypes = [
  'Wedding',
  'Corporate Event',
  'Birthday Party',
  'Graduation',
  'Anniversary',
  'Other',
]

const frameFormats = [
  {
    id: 'polaroid',
    name: 'Polaroid style',
    description: 'Classic keepsake shape with space for names at the bottom.',
    note: 'Most popular',
    image: '/brand/style-romance-photo.png',
  },
  {
    id: '4x6',
    name: '4×6 frame',
    description: 'Traditional photo frame size — a premium option for your guests.',
    note: 'Premium size',
    image: '/brand/frame-4x6-sample.png',
  },
] as const

export function QuoteBuilder({
  packages,
  addons,
  frameStyles,
  initialPackageSlug,
  initialStyleSlug,
  initialService = 'frames',
  showPricing = false,
}: {
  packages: PricedPackage[]
  addons: PricedAddOn[]
  frameStyles: FrameStyleData[]
  initialPackageSlug?: string
  initialStyleSlug?: string
  initialService?: 'frames' | 'stickers' | 'both'
  showPricing?: boolean
}) {
  const initialPkg =
    packages.find((p) => p.slug === initialPackageSlug) ||
    packages.find((p) => p.popular) ||
    packages[0] ||
    null

  const initialStyle =
    frameStyles.find((s) => s.slug === initialStyleSlug) || frameStyles[0] || null

  const [serviceType, setServiceType] = useState<'frames' | 'stickers' | 'both'>(initialService)
  const [packageId, setPackageId] = useState<string>(initialPkg ? String(initialPkg.id) : '')
  const [styleId, setStyleId] = useState<string>(initialStyle ? String(initialStyle.id) : '')
  const [frameFormat, setFrameFormat] = useState<'polaroid' | '4x6'>('polaroid')
  const [selected, setSelected] = useState<Record<string, number>>({})
  const [state, setState] = useState<LeadFormState>(initialState)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setState({ ok: false })
    try {
      setState(await postLeadForm(e.currentTarget))
    } finally {
      setPending(false)
    }
  }

  const wantsFrames = serviceType === 'frames' || serviceType === 'both'
  const wantsStickers = serviceType === 'stickers' || serviceType === 'both'

  const selectedPkg = packages.find((p) => String(p.id) === packageId) || null
  const selectedStyle = frameStyles.find((s) => String(s.id) === styleId) || null
  const selectedFormat = frameFormats.find((f) => f.id === frameFormat) || frameFormats[0]

  const selectedList = useMemo(
    () =>
      Object.entries(selected)
        .filter(([, qty]) => qty > 0)
        .map(([id, quantity]) => ({ id, quantity })),
    [selected],
  )

  const estimate = useMemo(
    () => calculateEstimate(selectedPkg, addons, selectedList),
    [selectedPkg, addons, selectedList],
  )

  function toggleAddOn(id: string, unit: string) {
    setSelected((prev) => {
      if (prev[id]) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: 1 }
    })
  }

  function setQty(id: string, quantity: number) {
    setSelected((prev) => {
      if (quantity <= 0) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: quantity }
    })
  }

  if (state.ok && state.inquiryId) {
    return (
      <div className="card p-10 md:p-14 text-center max-w-2xl mx-auto">
        <CheckCircle2 className="mx-auto text-accent mb-4" size={48} />
        <h2 className="text-3xl font-serif mb-3">Thank you!</h2>
        <p className="text-text-secondary mb-2">
          We&apos;ve received your request and will email your custom quote within 24 hours.
        </p>
        <p className="text-sm text-text-secondary mb-6">
          Reference: <span className="font-medium text-text-primary">{state.inquiryId}</span>
        </p>
        <div className="text-left card p-4 mb-6 text-sm space-y-1">
          {selectedPkg && (
            <p>
              <span className="text-text-secondary">Package:</span> {selectedPkg.name}
              {showPricing ? ` (${selectedPkg.priceRange})` : ''}
            </p>
          )}
          {selectedStyle && (
            <p>
              <span className="text-text-secondary">Style:</span> {selectedStyle.name}
            </p>
          )}
          {selectedFormat && (
            <p>
              <span className="text-text-secondary">Format:</span> {selectedFormat.name}
            </p>
          )}
        </div>
        <p className="text-sm text-text-secondary mb-6">
          Questions? Reach us at{' '}
          <a href={`mailto:${brand.email}`} className="text-accent hover:underline">
            {brand.email}
          </a>
        </p>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => window.location.reload()}
        >
          Submit another request
        </button>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
      <div className="space-y-10">
        <section>
          <h2 className="text-2xl font-serif mb-2">
            What are you interested in? <ReqStar />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(
              [
                { id: 'frames' as const, label: 'Custom Frames', desc: 'Photo frames for guests' },
                { id: 'stickers' as const, label: 'Sticker Studio', desc: 'Print & cut stickers' },
                { id: 'both' as const, label: 'Both', desc: 'Frames + stickers' },
              ] as const
            ).map((opt) => {
              const active = serviceType === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setServiceType(opt.id)}
                  className={`card p-4 text-left touch-manipulation ${
                    active ? 'ring-2 ring-accent/80 border-accent/50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-serif text-lg">{opt.label}</span>
                    {active && <Check size={18} className="text-accent shrink-0" />}
                  </div>
                  <p className="text-xs text-text-secondary mt-1">{opt.desc}</p>
                </button>
              )
            })}
          </div>
        </section>

        {wantsFrames && (
        <>
        <section>
          <h2 className="text-2xl font-serif mb-2">
            Choose a frame package <ReqStar />
          </h2>
          <p className="text-text-secondary text-sm mb-3">
            Pick the package that fits your event. We&apos;ll confirm details in your personal quote.
          </p>
          <div className="inline-flex items-center gap-2 hours-badge mb-6">
            <Clock size={12} />
            3 hours of coverage, excluding setup
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {packages.map((pkg) => {
              const active = String(pkg.id) === packageId
              return (
                <button
                  key={String(pkg.id)}
                  type="button"
                  onClick={() => setPackageId(String(pkg.id))}
                  className={`card p-5 text-left touch-manipulation ${
                    active ? 'ring-2 ring-accent/80 border-accent/50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-2xl">{pkg.icon || '✨'}</span>
                    {active && <Check size={18} className="text-accent" />}
                  </div>
                  <div className="font-serif text-lg">{pkg.name}</div>
                  {showPricing && (
                    <div className="text-accent font-semibold text-sm">{pkg.priceRange}</div>
                  )}
                  <div className="text-xs text-text-secondary mt-1">{pkg.frameSummary}</div>
                </button>
              )
            })}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-serif mb-2">
            2. Choose a frame style <ReqStar />
          </h2>
          <p className="text-text-secondary text-sm mb-2">
            Romance, Celebration, Modern, and Garden use <strong className="text-text-primary">raised 3D-printed</strong> accents.
            Prefer a softer look? Choose <strong className="text-text-primary">Stickered &amp; Painted</strong> — decorations are painted or stickered onto the frame.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {frameStyles.slice(0, 5).map((style) => {
              const active = String(style.id) === styleId
              return (
                <button
                  key={String(style.id)}
                  type="button"
                  onClick={() => setStyleId(String(style.id))}
                  className={`card overflow-hidden text-left touch-manipulation ${
                    active ? 'ring-2 ring-accent/80 border-accent/50' : ''
                  }`}
                >
                  <div className="relative aspect-[4/5] bg-bg-secondary">
                    <ProductImage
                      src={style.imagePath}
                      alt={style.sampleMessage}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 40vw"
                    />
                    {active && (
                      <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-accent text-[#1f1c12] flex items-center justify-center shadow-md">
                        <Check size={16} />
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-serif text-lg">{style.name}</h3>
                      {(style.slug === 'stickered-painted' || style.slug === 'hand-painted') && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">
                          Painted
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary mb-2">{style.tagline}</p>
                    <p className="text-sm font-medium mb-3">&ldquo;{style.sampleMessage}&rdquo;</p>
                    <div className="flex flex-wrap gap-2">
                      {style.plaColors.map((c) => (
                        <span
                          key={c.name}
                          className="inline-flex items-center gap-1.5 text-[11px] text-text-secondary"
                          title={c.name}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-border shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-serif mb-2">
            3. Choose a frame format <ReqStar />
          </h2>
          <p className="text-text-secondary text-sm mb-6">
            Polaroid-style is our classic keepsake. 4×6 frames are a premium size and are reflected
            in your quote.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {frameFormats.map((format) => {
              const active = frameFormat === format.id
              return (
                <button
                  key={format.id}
                  type="button"
                  onClick={() => setFrameFormat(format.id)}
                  className={`card overflow-hidden text-left touch-manipulation ${
                    active ? 'ring-2 ring-accent/80 border-accent/50' : ''
                  }`}
                >
                  <div className="relative aspect-[4/5] bg-bg-secondary">
                    <ProductImage
                      src={format.image}
                      alt={format.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 40vw"
                    />
                    {active && (
                      <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-accent text-[#1f1c12] flex items-center justify-center shadow-md">
                        <Check size={16} />
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-serif text-lg">{format.name}</h3>
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">
                        {format.note}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">{format.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-serif mb-2">Add-ons</h2>
          <p className="text-text-secondary text-sm mb-6">
            Optional extras to enhance your event. We&apos;ll include anything you select in your quote.
          </p>
          <div className="space-y-3">
            {addons.map((addon) => {
              const qty = selected[String(addon.id)] || 0
              const active = qty > 0
              const needsQty = addon.pricingUnit !== 'fixed' || addon.slug.includes('pack')
              return (
                <div
                  key={String(addon.id)}
                  className={`card p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${
                    active ? 'ring-1 ring-accent border-accent' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAddOn(String(addon.id), addon.pricingUnit)}
                    className="flex-1 text-left"
                  >
                    <div className="font-medium">{addon.name}</div>
                    {addon.description && (
                      <div className="text-sm text-text-secondary mt-0.5">{addon.description}</div>
                    )}
                  </button>
                  {active && needsQty && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="w-9 h-9 rounded-full border border-border flex items-center justify-center"
                        onClick={() => setQty(String(addon.id), qty - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-medium">{qty}</span>
                      <button
                        type="button"
                        className="w-9 h-9 rounded-full border border-border flex items-center justify-center"
                        onClick={() => setQty(String(addon.id), qty + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                  {active && !needsQty && (
                    <button
                      type="button"
                      className="text-sm text-accent font-medium"
                      onClick={() => toggleAddOn(String(addon.id), addon.pricingUnit)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </section>
        </>
        )}

        {wantsStickers && !wantsFrames && (
          <section className="card p-6">
            <h2 className="text-xl font-serif mb-2">Sticker Studio</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              On-site print-and-cut stickers for your guests — photo stickers, labels, name tags, and
              more. Share your event details below and we&apos;ll tailor a quote.
            </p>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-serif mb-2">Event details</h2>
          <p className="text-text-secondary text-sm mb-2">
            Share a few details and we&apos;ll email your custom quote within 24 hours.
          </p>
          <p className="text-xs text-text-secondary mb-6">
            <ReqStar /> Required fields
          </p>

          <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-5 relative">
            <input type="hidden" name="intent" value="quote" />
            <input type="hidden" name="serviceType" value={serviceType} />
            <input type="hidden" name="packageId" value={wantsFrames ? packageId : ''} />
            <input type="hidden" name="frameStyleId" value={wantsFrames ? styleId : ''} />
            <input type="hidden" name="frameFormat" value={wantsFrames ? frameFormat : ''} />
            <input
              type="hidden"
              name="selectedAddOns"
              value={JSON.stringify(wantsFrames ? selectedList : [])}
            />
            <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Full Name" name="name" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Phone" name="phone" type="tel" required />
              <div>
                <label className="block text-sm font-medium mb-1.5" htmlFor="eventType">
                  Event Type <ReqStar />
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  required
                  defaultValue=""
                  className="field-input"
                >
                  <option value="" disabled>
                    Select type...
                  </option>
                  {eventTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <Field label="Event Date" name="eventDate" type="date" required />
              <Field label="Guest Count" name="guestCount" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="message">
                Custom names / message for frames
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="field-input resize-y"
                placeholder="e.g. Anna & Stephen · With love — Mia"
              />
            </div>

            {state.error && (
              <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 px-4 py-3 rounded-lg">
                {state.error}
              </p>
            )}

            <label className="flex items-start gap-3 text-sm text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                name="privacyConsent"
                value="1"
                required
                className="mt-1 h-4 w-4 rounded border-border accent-accent shrink-0"
              />
              <span>
                I agree to the{' '}
                <Link href="/privacy" className="text-accent hover:underline font-medium">
                  Privacy Policy
                </Link>{' '}
                and consent to being contacted about my inquiry.{' '}
                <span className="text-accent font-semibold" aria-hidden="true">
                  *
                </span>
              </span>
            </label>

            <button type="submit" className="btn-primary w-full justify-center" disabled={pending}>
              {pending ? 'Sending...' : 'Get my quote'}
              <Sparkles size={16} />
            </button>
            <p className="text-xs text-center text-text-secondary">
              Free quote by email — no payment required.
            </p>
          </form>
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 card p-6 space-y-4">
        <div>
          <h3 className="font-serif text-xl mb-2">Your selection</h3>
          <p className="text-xs text-text-secondary">
            A quick summary of what you&apos;ve chosen so far.
          </p>
        </div>

        <div className="relative aspect-[4/5] rounded-[var(--radius-md)] overflow-hidden bg-bg-secondary">
          <ProductImage
            src={
              !wantsFrames
                ? '/brand/stickers-hero.png'
                : frameFormat === '4x6'
                  ? selectedFormat.image
                  : selectedStyle?.imagePath || selectedFormat.image
            }
            alt=""
            fill
            className="object-cover"
            sizes="400px"
          />
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <p className="text-text-secondary text-xs uppercase tracking-wide mb-0.5">Service</p>
            <p className="font-medium">
              {serviceType === 'stickers'
                ? 'Sticker Studio'
                : serviceType === 'both'
                  ? 'Frames + Stickers'
                  : 'Custom Frames'}
            </p>
          </div>
          {wantsFrames && (
            <div>
              <p className="text-text-secondary text-xs uppercase tracking-wide mb-0.5">Package</p>
              <p className="font-medium">
                {selectedPkg?.name || 'Not selected'}
                {showPricing && selectedPkg ? (
                  <span className="text-accent font-normal"> · {selectedPkg.priceRange}</span>
                ) : null}
              </p>
              {selectedPkg && (
                <p className="text-xs text-text-secondary mt-0.5">{selectedPkg.frameSummary}</p>
              )}
            </div>
          )}
          {wantsFrames && selectedStyle && (
            <div>
              <p className="text-text-secondary text-xs uppercase tracking-wide mb-0.5">Style</p>
              <p className="font-medium">{selectedStyle.name}</p>
            </div>
          )}
          {wantsFrames && selectedFormat && (
            <div>
              <p className="text-text-secondary text-xs uppercase tracking-wide mb-0.5">Format</p>
              <p className="font-medium">
                {selectedFormat.name}
                {selectedFormat.id === '4x6' ? (
                  <span className="text-accent font-normal"> · premium size</span>
                ) : null}
              </p>
            </div>
          )}
          {estimate.addOnLines.length > 0 && (
            <div>
              <p className="text-text-secondary text-xs uppercase tracking-wide mb-1">Add-ons</p>
              <ul className="space-y-1">
                {estimate.addOnLines.map((line) => (
                  <li key={String(line.id)} className="text-text-secondary">
                    • {line.name}
                    {line.quantity > 1
                      ? ` × ${line.quantity}${line.pricingUnit === 'per_pack' ? ' packs' : ''}`
                      : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="border-t border-border pt-3 text-sm text-text-secondary">
            Send the form and we&apos;ll follow up within 24 hours.
          </div>
        </div>
      </aside>
    </div>
  )
}

function ReqStar() {
  return (
    <span className="text-accent font-semibold" aria-hidden="true">
      *
    </span>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" htmlFor={name}>
        {label}
        {required ? (
          <>
            {' '}
            <ReqStar />
          </>
        ) : null}
      </label>
      <input id={name} name={name} type={type} required={required} className="field-input" />
    </div>
  )
}
