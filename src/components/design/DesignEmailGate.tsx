'use client'

import { useEffect, useState } from 'react'
import { Loader2, Mail, X } from 'lucide-react'

export type DesignEmailGatePurpose = 'save' | 'quote' | 'email-preview'

const purposeCopy: Record<
  DesignEmailGatePurpose,
  { title: string; body: string; submit: string }
> = {
  save: {
    title: 'Save your design',
    body: 'Enter your email to save this design to your account. We will email you a link so you can pick up where you left off.',
    submit: 'Save design',
  },
  quote: {
    title: 'Continue to quote',
    body: 'Enter your email to save your design and continue to a custom quote. Your work is saved automatically after sign-in.',
    submit: 'Save & continue',
  },
  'email-preview': {
    title: 'Email my preview',
    body: 'Enter your email and we will send you a link to recreate this design anytime.',
    submit: 'Send preview link',
  },
}

export function DesignEmailGate({
  open = true,
  onClose,
  onAuthenticated,
  purpose = 'quote',
}: {
  open?: boolean
  onClose?: () => void
  onAuthenticated: (email: string, activeDesignToken?: string | null) => void | Promise<void>
  purpose?: DesignEmailGatePurpose
}) {
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setError(null)
      setPending(false)
    }
  }, [open])

  if (!open) return null

  const copy = purposeCopy[purpose]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError(null)
    try {
      const res = await fetch('/api/design/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = (await res.json()) as {
        ok?: boolean
        email?: string
        activeDesignToken?: string | null
        error?: string
      }
      if (!res.ok || !data.ok || !data.email) {
        setError(data.error || 'Could not sign in. Please try again.')
        return
      }
      await onAuthenticated(data.email, data.activeDesignToken)
    } catch {
      setError('Could not sign in. Please try again.')
    } finally {
      setPending(false)
    }
  }

  const panel = (
    <div className="card p-8 md:p-10 max-w-md w-full text-center relative">
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md text-text-secondary hover:text-text-primary"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      ) : null}
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-light text-accent mb-4">
        <Mail size={22} />
      </div>
      <h2 className="font-serif text-2xl mb-2">{copy.title}</h2>
      <p className="text-sm text-text-secondary mb-6 leading-relaxed">{copy.body}</p>
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            className="field-input mt-1.5"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        {error ? (
          <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
            {error}
          </p>
        ) : null}
        <button type="submit" disabled={pending} className="btn-primary w-full justify-center">
          {pending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Continuing…
            </>
          ) : (
            copy.submit
          )}
        </button>
      </form>
    </div>
  )

  if (onClose) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="design-email-gate-title"
      >
        {panel}
      </div>
    )
  }

  return panel
}
