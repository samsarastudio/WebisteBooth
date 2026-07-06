'use client'

import { useState } from 'react'
import { Loader2, Mail } from 'lucide-react'

export function DesignEmailGate({
  onAuthenticated,
}: {
  onAuthenticated: (email: string, activeDesignToken?: string | null) => void | Promise<void>
}) {
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <div className="card p-8 md:p-10 max-w-md mx-auto text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-light text-accent mb-4">
        <Mail size={22} />
      </div>
      <h2 className="font-serif text-2xl mb-2">Sign in to design</h2>
      <p className="text-sm text-text-secondary mb-6 leading-relaxed">
        Enter your email to open the studio. Your work is saved automatically so you can pick up
        where you left off.
      </p>
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
            'Continue to design studio'
          )}
        </button>
      </form>
    </div>
  )
}
