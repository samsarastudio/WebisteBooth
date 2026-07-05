import { Resend } from 'resend'

type LeadEmailPayload = {
  inquiryId: string
  name: string
  email: string
  phone?: string | null
  eventType: string
  eventDate: string
  guestCount?: string | null
  message?: string | null
  serviceLabel?: string | null
  packageName?: string | null
  priceRange?: string | null
  frameSummary?: string | null
  frameStyleName?: string | null
  frameStyleColors?: string | null
  frameFormatLabel?: string | null
  addOnLines: {
    name: string
    quantity: number
    pricingUnit?: string | null
  }[]
}

import { brand } from '@/lib/brand'

const studioEmail = brand.email
const studioPhone = process.env.LEAD_NOTIFY_PHONE || '(416) 555-1234'
const fromAddress = process.env.RESEND_FROM_EMAIL || `${brand.name} <onboarding@resend.dev>`

function preferencesBlock(lead: LeadEmailPayload, includePricing = false) {
  const lines = lead.addOnLines
    .map(
      (line) =>
        `• ${line.name}${line.quantity > 1 ? ` × ${line.quantity}` : ''}${
          line.pricingUnit === 'per_pack' ? ' pack(s)' : ''
        }`,
    )
    .join('\n')

  const packageLine = includePricing
    ? `Package: ${lead.packageName || '—'} (${lead.priceRange || 'Custom quote'})`
    : `Package: ${lead.packageName || '—'}`

  return `
Service: ${lead.serviceLabel || '—'}
${packageLine}
Frames: ${lead.frameSummary || '—'}
Style: ${lead.frameStyleName || '—'}
Format: ${lead.frameFormatLabel || '—'}
Colors: ${lead.frameStyleColors || '—'}
Add-ons:
${lines || '• None selected'}

Event: ${lead.eventType}
Date: ${lead.eventDate}
Guests: ${lead.guestCount || '—'}

Message:
${lead.message || '—'}
`.trim()
}

export async function sendLeadEmails(lead: LeadEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log('Lead emails skipped — missing RESEND_API_KEY:', lead)
    return
  }

  const resend = new Resend(apiKey)
  const prefsInternal = preferencesBlock(lead, true)
  const prefsCustomer = preferencesBlock(lead, false)

  // Notify the business (lead)
  await resend.emails.send({
    from: fromAddress,
    to: studioEmail,
    replyTo: lead.email,
    subject: `New lead: ${lead.name} — ${lead.eventType} (${lead.inquiryId})`,
    text: `
New ${brand.fullName} quote request (lead)

Inquiry ID: ${lead.inquiryId}
Name: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone || '—'}

${prefsInternal}

Reply to this email to reach the lead directly.
`.trim(),
  })

  // Auto-reply to the lead with preferences + how to reach us
  await resend.emails.send({
    from: fromAddress,
    to: lead.email,
    replyTo: studioEmail,
    subject: `We received your ${brand.name} quote request (${lead.inquiryId})`,
    text: `
Hi ${lead.name},

Thanks for requesting a quote from ${brand.fullName}.

We received your request and will email your custom quote within 24 hours.

Reference: ${lead.inquiryId}

What you selected:
${prefsCustomer}

Questions in the meantime? Reach out anytime:
Email: ${studioEmail}
Phone: ${studioPhone}

We look forward to helping you give your guests a keepsake they'll love.

— ${brand.fullName}
`.trim(),
  })
}

/** Alias for older imports */
export const sendLeadNotification = sendLeadEmails

export async function sendLeadResponseEmail(input: {
  inquiryId: string
  name: string
  email: string
  message: string
  intent: 'quote' | 'contact'
}) {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log('Lead response email skipped — missing RESEND_API_KEY:', input.inquiryId)
    return
  }

  const resend = new Resend(apiKey)
  const subjectPrefix =
    input.intent === 'quote' ? 'Your FrameFlix quote' : 'Re: your FrameFlix inquiry'

  await resend.emails.send({
    from: fromAddress,
    to: input.email,
    replyTo: studioEmail,
    subject: `${subjectPrefix} (${input.inquiryId})`,
    text: `
Hi ${input.name},

${input.message}

Reference: ${input.inquiryId}

Questions? Reply to this email or call us at ${studioPhone}.

— ${brand.fullName}
`.trim(),
  })
}
