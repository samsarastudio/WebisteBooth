import { Resend } from 'resend'

import { brand } from '@/lib/brand'

const studioEmail = brand.email
const fromAddress = process.env.RESEND_FROM_EMAIL || `${brand.name} <onboarding@resend.dev>`

export async function sendDesignerLoginEmail(email: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log('Designer login email skipped — missing RESEND_API_KEY:', email)
    return
  }

  const resend = new Resend(apiKey)
  const designUrl = `${brand.siteUrl}/design`

  try {
    await resend.emails.send({
      from: fromAddress,
      to: email,
      replyTo: studioEmail,
      subject: `Your ${brand.name} design studio access`,
      text: `
Hi,

You're signed in to the ${brand.fullName} design studio.

Open the studio anytime to continue designing your custom frame:
${designUrl}

When you save, we'll email you a personal link to recreate your design later.

— ${brand.fullName}
`.trim(),
    })
  } catch (err) {
    console.error('Designer login email failed:', email, err)
  }
}

export async function sendDesignSnapshotEmail(input: {
  email: string
  designToken: string
  designUrl: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log('Design snapshot email skipped — missing RESEND_API_KEY:', input.designToken)
    return
  }

  const resend = new Resend(apiKey)

  try {
    await resend.emails.send({
      from: fromAddress,
      to: input.email,
      replyTo: studioEmail,
      subject: `Your ${brand.name} frame design snapshot`,
      text: `
Hi,

Your custom frame design has been saved as a snapshot.

Reopen and edit it anytime:
${input.designUrl}

Reference: ${input.designToken}

We saved your colors, text, decorations, and photo so you can pick up exactly where you left off.

— ${brand.fullName}
`.trim(),
    })
  } catch (err) {
    console.error('Design snapshot email failed:', input.designToken, err)
  }
}
