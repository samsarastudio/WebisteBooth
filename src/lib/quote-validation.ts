export type QuoteStepId = 'event' | 'service' | 'package' | 'style' | 'contact' | 'addons'

export type QuoteValidationInput = {
  serviceType: 'frames' | 'stickers' | 'both'
  packageId: string
  styleId: string
  hasDesign: boolean
  helpMeChoose: boolean
  form?: FormData
}

export type QuoteValidationResult = {
  ok: boolean
  sectionErrors: Partial<Record<QuoteStepId, string>>
  fieldErrors: Partial<Record<string, string>>
  firstInvalidStep?: QuoteStepId
  globalError?: string
}

export const QUOTE_ERRORS = {
  package: 'Please choose a package or select “Recommend one for me”.',
  style: 'Please choose a frame style or complete the design studio.',
  name: 'Name is required.',
  email: 'Please provide a valid email address.',
  eventType: 'Please select an event type.',
  eventDate: 'Event date is required.',
  eventCity: 'City is required.',
  postalCode: 'Postal code is required.',
  privacy: 'Please agree to the Privacy Policy to submit your inquiry.',
  network: 'Something went wrong. Please try again.',
} as const

export function wantsFramesService(serviceType: QuoteValidationInput['serviceType']) {
  return serviceType === 'frames' || serviceType === 'both'
}

export function buildQuoteSteps(
  serviceType: QuoteValidationInput['serviceType'],
  hasDesign: boolean,
  helpMeChoose: boolean,
): { id: QuoteStepId; label: string }[] {
  const steps: { id: QuoteStepId; label: string }[] = [
    { id: 'event', label: 'Event details' },
    { id: 'service', label: 'Service' },
  ]

  const wantsFrames = wantsFramesService(serviceType)

  if (wantsFrames && !helpMeChoose) {
    steps.push({ id: 'package', label: 'Package' })
    if (!hasDesign) steps.push({ id: 'style', label: 'Frame style' })
  }

  steps.push({ id: 'contact', label: 'Your details' })

  if (wantsFrames) {
    steps.push({ id: 'addons', label: 'Add-ons' })
  }

  return steps
}

export function validateQuoteEvent(form: FormData): QuoteValidationResult {
  const fieldErrors: Partial<Record<string, string>> = {}
  const eventType = String(form.get('eventType') || '').trim()
  const eventDate = String(form.get('eventDate') || '').trim()
  const eventCity = String(form.get('eventCity') || '').trim()
  const postalCode = String(form.get('postalCode') || '').trim()

  if (!eventType) fieldErrors.eventType = QUOTE_ERRORS.eventType
  if (!eventDate) fieldErrors.eventDate = QUOTE_ERRORS.eventDate
  if (!eventCity) fieldErrors.eventCity = QUOTE_ERRORS.eventCity
  if (!postalCode) fieldErrors.postalCode = QUOTE_ERRORS.postalCode

  const ok = Object.keys(fieldErrors).length === 0
  return {
    ok,
    sectionErrors: ok ? {} : { event: 'Please complete your event details.' },
    fieldErrors,
    firstInvalidStep: ok ? undefined : 'event',
  }
}

export function validateQuoteStep(
  step: QuoteStepId,
  input: QuoteValidationInput,
): QuoteValidationResult {
  const sectionErrors: Partial<Record<QuoteStepId, string>> = {}
  const wantsFrames = wantsFramesService(input.serviceType)

  if (step === 'event' && input.form) {
    return validateQuoteEvent(input.form)
  }

  if (step === 'package' && wantsFrames && !input.helpMeChoose && !input.packageId) {
    sectionErrors.package = QUOTE_ERRORS.package
  }
  if (
    step === 'style' &&
    wantsFrames &&
    !input.helpMeChoose &&
    !input.hasDesign &&
    !input.styleId
  ) {
    sectionErrors.style = QUOTE_ERRORS.style
  }

  const ok = Object.keys(sectionErrors).length === 0
  return {
    ok,
    sectionErrors,
    fieldErrors: {},
    firstInvalidStep: ok ? undefined : (Object.keys(sectionErrors)[0] as QuoteStepId),
  }
}

export function validateQuoteContact(form: FormData): QuoteValidationResult {
  const fieldErrors: Partial<Record<string, string>> = {}
  const name = String(form.get('name') || '').trim()
  const email = String(form.get('email') || '').trim()
  const privacy = String(form.get('privacyConsent') || '').trim()

  if (!name) fieldErrors.name = QUOTE_ERRORS.name
  if (!email || !email.includes('@')) fieldErrors.email = QUOTE_ERRORS.email
  if (privacy !== '1') fieldErrors.privacyConsent = QUOTE_ERRORS.privacy

  const ok = Object.keys(fieldErrors).length === 0
  return {
    ok,
    sectionErrors: ok ? {} : { contact: 'Please complete the required fields below.' },
    fieldErrors,
    firstInvalidStep: ok ? undefined : 'contact',
  }
}

export function validateQuoteAll(input: QuoteValidationInput): QuoteValidationResult {
  const wantsFrames = wantsFramesService(input.serviceType)
  const sectionErrors: Partial<Record<QuoteStepId, string>> = {}
  const fieldErrors: Partial<Record<string, string>> = {}

  if (input.form) {
    const eventResult = validateQuoteEvent(input.form)
    Object.assign(sectionErrors, eventResult.sectionErrors)
    Object.assign(fieldErrors, eventResult.fieldErrors)
  }

  if (wantsFrames && !input.helpMeChoose) {
    if (!input.packageId) sectionErrors.package = QUOTE_ERRORS.package
    if (!input.hasDesign && !input.styleId) sectionErrors.style = QUOTE_ERRORS.style
  }

  let contactResult: QuoteValidationResult = { ok: true, sectionErrors: {}, fieldErrors: {} }
  if (input.form) contactResult = validateQuoteContact(input.form)

  const merged = {
    ...sectionErrors,
    ...contactResult.sectionErrors,
  }

  const mergedFieldErrors = {
    ...fieldErrors,
    ...contactResult.fieldErrors,
  }

  const firstInvalidStep = (
    ['event', 'package', 'style', 'contact'] as QuoteStepId[]
  ).find((s) => merged[s])

  return {
    ok:
      Object.keys(merged).length === 0 &&
      contactResult.ok &&
      Object.keys(mergedFieldErrors).length === 0,
    sectionErrors: merged,
    fieldErrors: mergedFieldErrors,
    firstInvalidStep,
  }
}

export function mapServerQuoteError(error: string): QuoteValidationResult {
  const sectionErrors: Partial<Record<QuoteStepId, string>> = {}
  if (error.includes('package')) sectionErrors.package = error
  else if (error.includes('frame style') || error.includes('design studio'))
    sectionErrors.style = error
  else if (error.includes('event type') || error.includes('event date') || error.includes('City'))
    sectionErrors.event = error
  else if (
    error.includes('Name, email') ||
    error.includes('Privacy Policy') ||
    error.includes('email')
  ) {
    sectionErrors.contact = error
  }

  return {
    ok: false,
    sectionErrors,
    fieldErrors: {},
    firstInvalidStep: Object.keys(sectionErrors)[0] as QuoteStepId | undefined,
    globalError: error,
  }
}
