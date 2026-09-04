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
  style: 'Please choose a magnet colour.',
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
    if (!hasDesign) steps.push({ id: 'style', label: 'Magnet colour' })
  }

  steps.push({ id: 'contact', label: 'Your details' })

  if (wantsFrames && !helpMeChoose) {
    steps.push({ id: 'addons', label: 'Add-ons' })
  }

  return steps
}

export function validateQuoteEvent(form: FormData): QuoteValidationResult {
  void form
  return { ok: true, sectionErrors: {}, fieldErrors: {} }
}

export function validateQuoteStep(
  step: QuoteStepId,
  input: QuoteValidationInput,
): QuoteValidationResult {
  if (step === 'event' && input.form) {
    return validateQuoteEvent(input.form)
  }

  return {
    ok: true,
    sectionErrors: {},
    fieldErrors: {},
  }
}

export function validateQuoteContact(form: FormData): QuoteValidationResult {
  const fieldErrors: Partial<Record<string, string>> = {}
  const email = String(form.get('email') || '').trim()
  const privacy = String(form.get('privacyConsent') || '').trim()

  if (email && !email.includes('@')) fieldErrors.email = QUOTE_ERRORS.email
  if (privacy !== '1') fieldErrors.privacyConsent = QUOTE_ERRORS.privacy

  const ok = Object.keys(fieldErrors).length === 0
  return {
    ok,
    sectionErrors: ok ? {} : { contact: 'Please complete the required consent below.' },
    fieldErrors,
    firstInvalidStep: ok ? undefined : 'contact',
  }
}

export function validateQuoteAll(input: QuoteValidationInput): QuoteValidationResult {
  const fieldErrors: Partial<Record<string, string>> = {}

  let contactResult: QuoteValidationResult = { ok: true, sectionErrors: {}, fieldErrors: {} }
  if (input.form) contactResult = validateQuoteContact(input.form)

  Object.assign(fieldErrors, contactResult.fieldErrors)

  return {
    ok: contactResult.ok,
    sectionErrors: contactResult.sectionErrors,
    fieldErrors,
    firstInvalidStep: contactResult.firstInvalidStep,
  }
}

export function mapServerQuoteError(error: string): QuoteValidationResult {
  const sectionErrors: Partial<Record<QuoteStepId, string>> = {}
  if (error.includes('package')) sectionErrors.package = error
  else if (
    error.includes('frame style') ||
    error.includes('magnet colour') ||
    error.includes('design studio')
  )
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
