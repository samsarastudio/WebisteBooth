export type QuoteStepId = 'service' | 'package' | 'style' | 'addons' | 'contact'

export type QuoteValidationInput = {
  serviceType: 'frames' | 'stickers' | 'both'
  packageId: string
  styleId: string
  hasDesign: boolean
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
  package: 'Please choose a package.',
  style: 'Please choose a frame style or complete the design studio.',
  name: 'Name is required.',
  email: 'Please provide a valid email address.',
  phone: 'Phone is required.',
  eventType: 'Please select an event type.',
  eventDate: 'Event date is required.',
  privacy: 'Please agree to the Privacy Policy to submit your inquiry.',
  network: 'Something went wrong. Please try again.',
} as const

export function wantsFramesService(serviceType: QuoteValidationInput['serviceType']) {
  return serviceType === 'frames' || serviceType === 'both'
}

export function buildQuoteSteps(
  serviceType: QuoteValidationInput['serviceType'],
  hasDesign: boolean,
): { id: QuoteStepId; label: string }[] {
  const steps: { id: QuoteStepId; label: string }[] = [{ id: 'service', label: 'Service' }]
  if (wantsFramesService(serviceType)) {
    steps.push({ id: 'package', label: 'Package' })
    if (!hasDesign) steps.push({ id: 'style', label: 'Frame style' })
    steps.push({ id: 'addons', label: 'Add-ons' })
  }
  steps.push({ id: 'contact', label: 'Your details' })
  return steps
}

export function validateQuoteStep(
  step: QuoteStepId,
  input: QuoteValidationInput,
): QuoteValidationResult {
  const sectionErrors: Partial<Record<QuoteStepId, string>> = {}
  const wantsFrames = wantsFramesService(input.serviceType)

  if (step === 'package' && wantsFrames && !input.packageId) {
    sectionErrors.package = QUOTE_ERRORS.package
  }
  if (step === 'style' && wantsFrames && !input.hasDesign && !input.styleId) {
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
  const phone = String(form.get('phone') || '').trim()
  const eventType = String(form.get('eventType') || '').trim()
  const eventDate = String(form.get('eventDate') || '').trim()
  const privacy = String(form.get('privacyConsent') || '').trim()

  if (!name) fieldErrors.name = QUOTE_ERRORS.name
  if (!email || !email.includes('@')) fieldErrors.email = QUOTE_ERRORS.email
  if (!phone) fieldErrors.phone = QUOTE_ERRORS.phone
  if (!eventType) fieldErrors.eventType = QUOTE_ERRORS.eventType
  if (!eventDate) fieldErrors.eventDate = QUOTE_ERRORS.eventDate
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

  if (wantsFrames) {
    if (!input.packageId) sectionErrors.package = QUOTE_ERRORS.package
    if (!input.hasDesign && !input.styleId) sectionErrors.style = QUOTE_ERRORS.style
  }

  let contactResult: QuoteValidationResult = { ok: true, sectionErrors: {}, fieldErrors: {} }
  if (input.form) contactResult = validateQuoteContact(input.form)

  const merged = {
    ...sectionErrors,
    ...contactResult.sectionErrors,
  }

  const firstInvalidStep = (['package', 'style', 'contact'] as QuoteStepId[]).find(
    (s) => merged[s],
  )

  return {
    ok: Object.keys(merged).length === 0 && contactResult.ok,
    sectionErrors: merged,
    fieldErrors: contactResult.fieldErrors,
    firstInvalidStep,
  }
}

export function mapServerQuoteError(error: string): QuoteValidationResult {
  const sectionErrors: Partial<Record<QuoteStepId, string>> = {}
  if (error.includes('package')) sectionErrors.package = error
  else if (error.includes('frame style') || error.includes('design studio'))
    sectionErrors.style = error
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
