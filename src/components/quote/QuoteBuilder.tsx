'use client'

import Link from 'next/link'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from 'react'
import { Check, CheckCircle2, Clock, Minus, Plus, Sparkles } from 'lucide-react'

import { ProductImage } from '@/components/marketing/ProductImage'
import { QuoteStepper } from '@/components/quote/QuoteStepper'
import { QuoteSummary } from '@/components/quote/QuoteSummary'
import { SectionError } from '@/components/quote/SectionError'

import type { LeadFormState } from '@/lib/lead-form'
import { formatDisplayLabel } from '@/lib/frame-design/layouts'
import type { FrameStyleData } from '@/lib/brand-images'
import { brand } from '@/lib/brand'
import { calculateEstimate, type PricedAddOn, type PricedPackage } from '@/lib/pricing'
import { retentionHintForPackage } from '@/lib/retention-policy'
import {
  buildQuoteSteps,
  mapServerQuoteError,
  QUOTE_ERRORS,
  validateQuoteAll,
  validateQuoteStep,
  type QuoteStepId,
} from '@/lib/quote-validation'

const initialState: LeadFormState = { ok: false }

async function postLeadForm(form: HTMLFormElement): Promise<LeadFormState> {
  try {
    const res = await fetch('/api/leads', { method: 'POST', body: new FormData(form) })
    const data = (await res.json()) as LeadFormState
    if (!res.ok && data.error) return data
    if (!res.ok) return { ok: false, error: QUOTE_ERRORS.network }
    return data
  } catch {
    return { ok: false, error: QUOTE_ERRORS.network }
  }
}

const eventTypes = [
  'Wedding',
  'Corporate Event',
  'Birthday Party',
  'Graduation',
  'Anniversary',
  'Other',
]

function stepVisible(stepId: QuoteStepId, activeStepId: QuoteStepId) {
  return activeStepId === stepId ? 'block' : 'hidden lg:block'
}

function stepHeading(steps: { id: QuoteStepId; label: string }[], stepId: QuoteStepId, title: string) {
  const idx = steps.findIndex((s) => s.id === stepId)
  const prefix = idx >= 0 ? `${idx + 1}. ` : ''
  return `${prefix}${title}`
}

export function QuoteBuilder({
  packages,
  addons,
  frameStyles,
  initialPackageSlug,
  initialStyleSlug,
  initialService = 'frames',
  initialDesignToken,
  showPricing = false,
}: {
  packages: PricedPackage[]
  addons: PricedAddOn[]
  frameStyles: FrameStyleData[]
  initialPackageSlug?: string
  initialStyleSlug?: string
  initialService?: 'frames' | 'stickers' | 'both'
  initialDesignToken?: string
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
  const [selected, setSelected] = useState<Record<string, number>>({})
  const [state, setState] = useState<LeadFormState>(initialState)
  const [pending, setPending] = useState(false)
  const [sectionErrors, setSectionErrors] = useState<Partial<Record<QuoteStepId, string>>>({})
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({})
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [designLoadError, setDesignLoadError] = useState<string | null>(null)
  const [loadedDesign, setLoadedDesign] = useState<{
    token: string
    previewUrl?: string
    format?: string
    designerEmail?: string
  } | null>(null)
  const [prefillEmail, setPrefillEmail] = useState('')
  const [helpMeChoose, setHelpMeChoose] = useState(false)

  const successRef = useRef<HTMLHeadingElement>(null)
  const eventRef = useRef<HTMLElement>(null)
  const serviceRef = useRef<HTMLElement>(null)
  const packageRef = useRef<HTMLElement>(null)
  const styleRef = useRef<HTMLElement>(null)
  const addonsRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const sectionRefs: Record<QuoteStepId, RefObject<HTMLElement | null>> = {
    event: eventRef,
    service: serviceRef,
    package: packageRef,
    style: styleRef,
    addons: addonsRef,
    contact: contactRef,
  }

  useEffect(() => {
    fetch('/api/design/auth')
      .then((r) => r.json())
      .then((data: { email?: string }) => {
        if (data.email) {
          setPrefillEmail((prev) => prev || data.email || '')
        }
      })
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    if (!initialDesignToken) return
    setDesignLoadError(null)
    fetch(`/api/design/${encodeURIComponent(initialDesignToken)}`)
      .then((r) => r.json())
      .then(
        (data: {
          ok?: boolean
          design?: {
            designToken: string
            previewUrl?: string
            designerEmail?: string
            state?: { format?: string; stylePresetId?: string }
          }
        }) => {
          if (!data.ok || !data.design) {
            setDesignLoadError(
              'We could not load your saved design. Please complete the design studio again.',
            )
            return
          }
          setLoadedDesign({
            token: data.design.designToken,
            previewUrl: data.design.previewUrl,
            format: data.design.state?.format,
            designerEmail: data.design.designerEmail,
          })
          if (data.design.designerEmail) {
            setPrefillEmail(data.design.designerEmail)
          }
          if (data.design.state?.stylePresetId) {
            setStyleId(data.design.state.stylePresetId)
          }
        },
      )
      .catch(() => {
        setDesignLoadError(
          'We could not load your saved design. Please complete the design studio again.',
        )
      })
  }, [initialDesignToken])

  const wantsFrames = serviceType === 'frames' || serviceType === 'both'
  const wantsStickers = serviceType === 'stickers' || serviceType === 'both'
  const frameFormatLabel = formatDisplayLabel(
    loadedDesign?.format === 'original' ? 'original' : '6x4',
  )

  useEffect(() => {
    setCurrentStepIndex(0)
  }, [serviceType, helpMeChoose])

  const hasDesign = Boolean(loadedDesign?.token)

  const steps = useMemo(
    () => buildQuoteSteps(serviceType, hasDesign, helpMeChoose),
    [serviceType, hasDesign, helpMeChoose],
  )

  useEffect(() => {
    if (currentStepIndex >= steps.length) {
      setCurrentStepIndex(Math.max(0, steps.length - 1))
    }
  }, [steps.length, currentStepIndex])

  const validationInput = useCallback(
    (form?: FormData) => ({
      serviceType,
      packageId,
      styleId,
      hasDesign,
      helpMeChoose,
      form,
    }),
    [serviceType, packageId, styleId, hasDesign, helpMeChoose],
  )

  const scrollToStep = useCallback(
    (stepId: QuoteStepId) => {
      const idx = steps.findIndex((s) => s.id === stepId)
      if (idx >= 0) setCurrentStepIndex(idx)
      requestAnimationFrame(() => {
        sectionRefs[stepId]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    },
    [steps, sectionRefs],
  )

  const focusFirstFieldError = useCallback((errors: Partial<Record<string, string>>) => {
    const order = [
      'eventType',
      'eventDate',
      'eventCity',
      'postalCode',
      'name',
      'email',
      'privacyConsent',
    ]
    const first = order.find((k) => errors[k])
    if (!first || !formRef.current) return
    const el = formRef.current.querySelector<HTMLElement>(`[name="${first}"], #${first}`)
    el?.focus()
  }, [])

  function clearStepError(stepId: QuoteStepId) {
    setSectionErrors((prev) => {
      if (!prev[stepId]) return prev
      const next = { ...prev }
      delete next[stepId]
      return next
    })
  }

  function goNext() {
    const step = steps[currentStepIndex]
    if (!step) return
    const formData = formRef.current ? new FormData(formRef.current) : undefined
    const result = validateQuoteStep(step.id, validationInput(formData))
    if (!result.ok) {
      setSectionErrors((prev) => ({ ...prev, ...result.sectionErrors }))
      setFieldErrors((prev) => ({ ...prev, ...result.fieldErrors }))
      scrollToStep(step.id)
      focusFirstFieldError(result.fieldErrors)
      return
    }
    clearStepError(step.id)
    setCurrentStepIndex((i) => Math.min(i + 1, steps.length - 1))
    const next = steps[currentStepIndex + 1]
    if (next) scrollToStep(next.id)
  }

  function goBack() {
    setCurrentStepIndex((i) => Math.max(0, i - 1))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const all = validateQuoteAll(validationInput(new FormData(form)))
    if (!all.ok) {
      setSectionErrors(all.sectionErrors)
      setFieldErrors(all.fieldErrors)
      if (all.firstInvalidStep) scrollToStep(all.firstInvalidStep)
      focusFirstFieldError(all.fieldErrors)
      return
    }

    setPending(true)
    setState({ ok: false })
    setSectionErrors({})
    setFieldErrors({})
    try {
      const result = await postLeadForm(form)
      if (!result.ok && result.error) {
        const mapped = mapServerQuoteError(result.error)
        setSectionErrors(mapped.sectionErrors)
        setState({ ok: false, error: result.error })
        if (mapped.firstInvalidStep) scrollToStep(mapped.firstInvalidStep)
        else scrollToStep('contact')
        focusFirstFieldError(mapped.fieldErrors)
        return
      }
      setState(result)
      if (result.ok) {
        requestAnimationFrame(() => successRef.current?.focus())
      }
    } finally {
      setPending(false)
    }
  }

  const selectedPkg = packages.find((p) => String(p.id) === packageId) || null
  const selectedStyle = frameStyles.find((s) => String(s.id) === styleId) || null

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

  const previewSrc = !wantsFrames
    ? '/brand/stickers-hero.png'
    : selectedStyle?.imagePath || '/brand/style-romance-photo.png'

  const activeStepId = steps[currentStepIndex]?.id ?? 'event'
  const isLastStep = currentStepIndex >= steps.length - 1

  function toggleAddOn(id: string) {
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
        <h2 ref={successRef} tabIndex={-1} className="text-3xl font-serif mb-3 outline-none">
          Thank you!
        </h2>
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
          {wantsFrames && (
            <p>
              <span className="text-text-secondary">Format:</span> {frameFormatLabel}
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
    <div>
      <div aria-live="polite" className="sr-only">
        {Object.values(sectionErrors).join(' ')}
        {state.error}
      </div>

      <QuoteStepper steps={steps} currentIndex={currentStepIndex} />

      <div className="lg:hidden mb-6 space-y-3">
        <QuoteSummary
          compact
          serviceType={serviceType}
          wantsFrames={wantsFrames}
          selectedPkg={selectedPkg}
          selectedStyle={selectedStyle}
          estimateAddOnLines={estimate.addOnLines}
          showPricing={showPricing}
          previewSrc={previewSrc}
          frameFormatLabel={frameFormatLabel}
        />
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
          <input type="hidden" name="intent" value="quote" />
          <input type="hidden" name="serviceType" value={serviceType} />
          <input type="hidden" name="packageId" value={wantsFrames && !helpMeChoose ? packageId : ''} />
          <input type="hidden" name="frameStyleId" value={wantsFrames && !helpMeChoose ? styleId : ''} />
          <input
            type="hidden"
            name="frameFormat"
            value={
              wantsFrames
                ? loadedDesign?.format === 'original'
                  ? 'original'
                  : '6x4'
                : ''
            }
          />
          <input type="hidden" name="designToken" value={loadedDesign?.token || ''} />
          <input
            type="hidden"
            name="selectedAddOns"
            value={JSON.stringify(wantsFrames ? selectedList : [])}
          />
          <input
            type="hidden"
            name="packageRecommendationRequested"
            value={helpMeChoose ? '1' : '0'}
          />
          <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <section ref={eventRef} className={stepVisible('event', activeStepId)}>
            <h2 className="text-2xl font-serif mb-2">
              {stepHeading(steps, 'event', 'Tell us about your event')} <ReqStar />
            </h2>
            <SectionError message={sectionErrors.event} />
            <div className="card p-6 md:p-8 grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1.5" htmlFor="eventType">
                  Event Type <ReqStar />
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  required
                  defaultValue=""
                  className={`field-input ${fieldErrors.eventType ? 'ring-1 ring-red-400' : ''}`}
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
                {fieldErrors.eventType ? (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.eventType}</p>
                ) : null}
              </div>
              <Field
                label="Event Date"
                name="eventDate"
                type="date"
                required
                error={fieldErrors.eventDate}
              />
              <Field label="City" name="eventCity" required error={fieldErrors.eventCity} />
              <Field
                label="Postal Code"
                name="postalCode"
                required
                error={fieldErrors.postalCode}
                placeholder="N2G 1A1"
              />
              <Field label="Guest Count (approx.)" name="guestCount" />
            </div>
          </section>

          <section ref={serviceRef} className={stepVisible('service', activeStepId)}>
            <h2 className="text-2xl font-serif mb-2">
              {stepHeading(steps, 'service', 'What are you interested in?')} <ReqStar />
            </h2>
            <SectionError message={sectionErrors.service} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {(
                [
                  { id: 'frames' as const, label: 'Custom Frames', desc: 'Photo frames for guests' },
                  { id: 'stickers' as const, label: 'Sticker Studio', desc: 'Print & cut stickers' },
                  { id: 'both' as const, label: 'Both', desc: 'Frames + stickers' },
                ] as const
              ).map((opt) => {
                const active = serviceType === opt.id && !helpMeChoose
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setServiceType(opt.id)
                      setHelpMeChoose(false)
                      clearStepError('service')
                    }}
                    className={`card p-4 min-h-[48px] text-left touch-manipulation ${
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
            <button
              type="button"
              onClick={() => {
                setHelpMeChoose(true)
                setPackageId('')
                setStyleId('')
                clearStepError('package')
                clearStepError('style')
              }}
              className={`card p-4 w-full text-left touch-manipulation ${
                helpMeChoose ? 'ring-2 ring-accent/80 border-accent/50' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-serif text-lg">Recommend one for me</span>
                {helpMeChoose && <Check size={18} className="text-accent shrink-0" />}
              </div>
              <p className="text-xs text-text-secondary mt-1">
                Not sure which package fits? We will recommend frames, stickers, or both based on
                your event details.
              </p>
            </button>
          </section>

          {designLoadError ? (
            <section className="card p-5 border-red-300 bg-red-50 dark:bg-red-950/20">
              <p className="text-sm text-red-700 dark:text-red-300 mb-3">{designLoadError}</p>
              <Link href="/design" className="btn-secondary text-sm">
                Open design studio
              </Link>
            </section>
          ) : null}

          {wantsFrames && loadedDesign ? (
            <section className="card p-5 border-accent/30 bg-accent-light/20">
              <h2 className="text-xl font-serif mb-2">Your frame design</h2>
              <p className="text-sm text-text-secondary mb-4">
                We&apos;ll use the design you saved in the studio.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {loadedDesign.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={loadedDesign.previewUrl}
                    alt="Your frame design preview"
                    className="w-32 rounded-lg border border-border shadow-sm"
                  />
                ) : null}
                <Link href={`/design?design=${loadedDesign.token}`} className="btn-secondary text-sm">
                  Edit design
                </Link>
              </div>
            </section>
          ) : null}

          {wantsFrames && !helpMeChoose && (
            <>
              <section ref={packageRef} className={stepVisible('package', activeStepId)}>
                <h2 className="text-2xl font-serif mb-2">
                  {stepHeading(steps, 'package', 'Choose a frame package')} <ReqStar />
                </h2>
                <SectionError message={sectionErrors.package} />
                <p className="text-text-secondary text-sm mb-3">
                  Pick the package that fits your event.
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
                        onClick={() => {
                          setPackageId(String(pkg.id))
                          clearStepError('package')
                        }}
                        className={`card p-5 min-h-[48px] text-left touch-manipulation ${
                          active ? 'ring-2 ring-accent/80 border-accent/50' : ''
                        } ${sectionErrors.package && !active ? 'ring-1 ring-red-400/50' : ''}`}
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
                        {retentionHintForPackage(pkg.slug) ? (
                          <div className="text-[11px] text-text-secondary/90 mt-0.5">
                            {retentionHintForPackage(pkg.slug)}
                          </div>
                        ) : null}
                      </button>
                    )
                  })}
                </div>
              </section>

              {!loadedDesign ? (
                <section ref={styleRef} className={stepVisible('style', activeStepId)}>
                  <h2 className="text-2xl font-serif mb-2">
                    {stepHeading(steps, 'style', 'Choose frame style')} <ReqStar />
                  </h2>
                  <SectionError message={sectionErrors.style} />
                  <p className="text-text-secondary text-sm mb-4">
                    Choose Original or 6×4 landscape in the design studio. Raised 3D-printed
                    accents, or Stickered &amp; Painted for a softer look.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {frameStyles.slice(0, 5).map((style) => {
                      const active = String(style.id) === styleId
                      return (
                        <button
                          key={String(style.id)}
                          type="button"
                          onClick={() => {
                            setStyleId(String(style.id))
                            clearStepError('style')
                          }}
                          className={`card overflow-hidden text-left touch-manipulation ${
                            active ? 'ring-2 ring-accent/80 border-accent/50' : ''
                          }`}
                        >
                          <div className="relative aspect-[6/4] bg-bg-secondary">
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
                            <h3 className="font-serif text-lg">{style.name}</h3>
                            <p className="text-xs text-text-secondary mt-1">{style.tagline}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </section>
              ) : null}

              <section ref={contactRef} className={stepVisible('contact', activeStepId)}>
                <h2 className="text-2xl font-serif mb-2">
                  {stepHeading(steps, 'contact', 'Your details')} <ReqStar />
                </h2>
                <SectionError message={sectionErrors.contact || state.error} />
                <p className="text-text-secondary text-sm mb-6">
                  We&apos;ll email your custom quote within 24 hours.
                </p>
                <div className="card p-6 md:p-8 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Full Name" name="name" required error={fieldErrors.name} />
                    <Field
                      key={prefillEmail || 'quote-email'}
                      label="Email"
                      name="email"
                      type="email"
                      required
                      defaultValue={prefillEmail}
                      error={fieldErrors.email}
                    />
                    <Field
                      label="Phone (optional)"
                      name="phone"
                      type="tel"
                      error={fieldErrors.phone}
                    />
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
                      </Link>
                      . <ReqStar />
                    </span>
                  </label>
                  {fieldErrors.privacyConsent ? (
                    <p className="text-xs text-red-600">{fieldErrors.privacyConsent}</p>
                  ) : null}
                </div>
              </section>

              <section ref={addonsRef} className={stepVisible('addons', activeStepId)}>
                <h2 className="text-2xl font-serif mb-2">
                  {stepHeading(steps, 'addons', 'Add-ons')}
                </h2>
                <p className="text-text-secondary text-sm mb-6">Optional extras for your event.</p>
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
                          onClick={() => toggleAddOn(String(addon.id))}
                          className="flex-1 text-left min-h-[44px]"
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
                              className="min-w-[44px] min-h-[44px] rounded-full border border-border flex items-center justify-center"
                              onClick={() => setQty(String(addon.id), qty - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-medium">{qty}</span>
                            <button
                              type="button"
                              className="min-w-[44px] min-h-[44px] rounded-full border border-border flex items-center justify-center"
                              onClick={() => setQty(String(addon.id), qty + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                {isLastStep ? (
                  <div className="mt-8 space-y-3">
                    <button
                      type="submit"
                      className="btn-primary w-full justify-center"
                      disabled={pending}
                    >
                      {pending ? 'Sending...' : 'Get my quote'}
                      <Sparkles size={16} />
                    </button>
                    <p className="text-xs text-center text-text-secondary">
                      Free quote by email — no payment required.
                    </p>
                  </div>
                ) : null}
              </section>
            </>
          )}

          {(!wantsFrames || helpMeChoose) && (
            <section ref={contactRef} className={stepVisible('contact', activeStepId)}>
              <h2 className="text-2xl font-serif mb-2">
                {stepHeading(steps, 'contact', 'Your details')} <ReqStar />
              </h2>
              <SectionError message={sectionErrors.contact || state.error} />
              <p className="text-text-secondary text-sm mb-6">
                We&apos;ll email your custom quote within 24 hours.
              </p>
              <div className="card p-6 md:p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Full Name" name="name" required error={fieldErrors.name} />
                  <Field
                    key={prefillEmail || 'quote-email-alt'}
                    label="Email"
                    name="email"
                    type="email"
                    required
                    defaultValue={prefillEmail}
                    error={fieldErrors.email}
                  />
                  <Field
                    label="Phone (optional)"
                    name="phone"
                    type="tel"
                    error={fieldErrors.phone}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" htmlFor="message-stickers">
                    Notes for your quote
                  </label>
                  <textarea
                    id="message-stickers"
                    name="message"
                    rows={4}
                    className="field-input resize-y"
                    placeholder="Tell us about sticker sizes, branding, or anything else we should know."
                  />
                </div>

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
                    </Link>
                    . <ReqStar />
                  </span>
                </label>
                {fieldErrors.privacyConsent ? (
                  <p className="text-xs text-red-600">{fieldErrors.privacyConsent}</p>
                ) : null}

                {isLastStep ? (
                  <>
                    <button
                      type="submit"
                      className="btn-primary w-full justify-center"
                      disabled={pending}
                    >
                      {pending ? 'Sending...' : 'Get my quote'}
                      <Sparkles size={16} />
                    </button>
                    <p className="text-xs text-center text-text-secondary">
                      Free quote by email — no payment required.
                    </p>
                  </>
                ) : null}
              </div>
            </section>
          )}

          <div className="lg:hidden sticky bottom-0 z-20 -mx-4 px-4 py-4 bg-bg-primary/95 backdrop-blur border-t border-border flex gap-3">
            {currentStepIndex > 0 ? (
              <button type="button" className="btn-secondary flex-1 justify-center" onClick={goBack}>
                Back
              </button>
            ) : (
              <div className="flex-1" />
            )}
            {!isLastStep ? (
              <button type="button" className="btn-primary flex-1 justify-center" onClick={goNext}>
                Continue
              </button>
            ) : null}
          </div>
        </form>

        <div className="hidden lg:block">
          <QuoteSummary
            serviceType={serviceType}
            wantsFrames={wantsFrames}
            selectedPkg={selectedPkg}
            selectedStyle={selectedStyle}
            estimateAddOnLines={estimate.addOnLines}
            showPricing={showPricing}
            previewSrc={previewSrc}
            frameFormatLabel={frameFormatLabel}
          />
        </div>
      </div>
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
  error,
  defaultValue,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  error?: string
  defaultValue?: string
  placeholder?: string
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
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={`field-input ${error ? 'ring-1 ring-red-400' : ''}`}
      />
      {error ? <p className="text-xs text-red-600 mt-1">{error}</p> : null}
    </div>
  )
}
