'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { CheckCircle2 } from 'lucide-react'

import type { LeadFormState } from '@/lib/lead-form'
import { MAGNET_BOOK_HREF, magnetColors } from '@/lib/magnet'

const initialState: LeadFormState = { ok: false }

async function postLeadForm(form: HTMLFormElement): Promise<LeadFormState> {
  const res = await fetch('/api/leads', { method: 'POST', body: new FormData(form) })
  return res.json() as Promise<LeadFormState>
}

function ReqStar() {
  return (
    <span className="text-accent font-semibold" aria-hidden="true">
      *
    </span>
  )
}

export function MagnetEnquiryForm({ id = 'enquire' }: { id?: string }) {
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

  if (state.ok) {
    return (
      <div id={id} className="card p-8 md:p-10 text-center scroll-mt-24">
        <CheckCircle2 className="mx-auto text-accent mb-4" size={48} />
        <h2 className="text-2xl font-serif mb-3">We received your enquiry</h2>
        <p className="text-text-secondary mb-2">We&apos;ll get back to you within 24 hours.</p>
        {state.inquiryId ? (
          <p className="text-sm text-text-secondary mb-6">
            Reference: <span className="font-medium text-text-primary">{state.inquiryId}</span>
          </p>
        ) : null}
        <Link href={MAGNET_BOOK_HREF} className="btn-secondary">
          Book the booth for an event
        </Link>
      </div>
    )
  }

  return (
    <form id={id} onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-5 relative scroll-mt-24">
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-accent-hover font-semibold mb-2">
          Custom name plate
        </p>
        <h2 className="text-2xl md:text-3xl font-serif mb-2">Tell us what to print</h2>
        <p className="text-sm text-text-secondary">
          Fields marked <ReqStar /> are required. We reply within 24 hours.
        </p>
      </div>
      <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        <input type="hidden" name="intent" value="custom-frame" />
        <input type="hidden" name="serviceType" value="frames" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full name" name="name" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone" name="phone" type="tel" />
        <Field label="Approx. quantity" name="guestCount" placeholder="e.g. 80" />
        <div>
          <label className="block text-sm font-medium mb-1.5" htmlFor="magnetColor">
            Magnet colour
          </label>
          <select id="magnetColor" name="magnetColor" defaultValue="Mix / not sure" className="field-input">
            {magnetColors.map((c) => (
              <option key={c.id} value={c.label}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <Field label="Event date" name="eventDate" type="date" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" htmlFor="namePlateCopy">
          Name plate text
        </label>
        <textarea
          id="namePlateCopy"
          name="namePlateCopy"
          rows={3}
          className="field-input resize-y"
          placeholder="Names, date, or logo notes for the name plate"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" htmlFor="message">
          Anything else
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className="field-input resize-y"
          placeholder="Venue, guest count, colour mix…"
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-text-secondary cursor-pointer">
        <input
          type="checkbox"
          name="bookPhotobooth"
          value="1"
          className="mt-1 h-4 w-4 rounded border-border accent-accent shrink-0"
        />
        <span>Also book the photobooth for this event</span>
      </label>

      {state.error ? (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 px-4 py-3 rounded-lg">
          {state.error}
        </p>
      ) : null}

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
          and consent to being contacted. <ReqStar />
        </span>
      </label>

      <button type="submit" className="btn-primary w-full justify-center" disabled={pending}>
        {pending ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
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
        placeholder={placeholder}
        className="field-input"
      />
    </div>
  )
}
