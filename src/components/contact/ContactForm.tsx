'use client'

import { useState, type FormEvent } from 'react'
import { CheckCircle2, Sparkles } from 'lucide-react'

import type { LeadFormState } from '@/lib/lead-form'

const initialState: LeadFormState = { ok: false }

const eventTypes = [
  'Wedding',
  'Corporate Event',
  'Birthday Party',
  'Graduation',
  'Anniversary',
  'Other',
]

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

export function ContactForm() {
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
      <div className="card p-10 text-center">
        <CheckCircle2 className="mx-auto text-accent mb-4" size={48} />
        <h2 className="text-2xl font-serif mb-3">We received your message</h2>
        <p className="text-text-secondary mb-2">
          We&apos;ll get back to you within 24 hours.
        </p>
        {state.inquiryId && (
          <p className="text-sm text-text-secondary mb-6">
            Reference: <span className="font-medium text-text-primary">{state.inquiryId}</span>
          </p>
        )}
        <a href="/quote" className="btn-primary">
          Or build a full quote
          <Sparkles size={16} />
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-5 relative">
      <p className="text-xs text-text-secondary">
        Fields marked <ReqStar /> are required.
      </p>
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
          <select id="eventType" name="eventType" required defaultValue="" className="field-input">
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
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="field-input resize-y"
          placeholder="Tell us about your event..."
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 px-4 py-3 rounded-lg">
          {state.error}
        </p>
      )}

      <button type="submit" className="btn-primary w-full justify-center" disabled={pending}>
        {pending ? 'Sending...' : 'Send Message'}
        <Sparkles size={16} />
      </button>
    </form>
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
