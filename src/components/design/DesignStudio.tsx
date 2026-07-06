'use client'

import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

import { DesignEmailGate } from '@/components/design/DesignEmailGate'
import type {
  FrameDesignState,
  FrameOrnamentData,
  FrameStylePreset,
} from '@/lib/frame-design/types'

const FrameConfigurator = dynamic(
  () => import('@/components/design/FrameConfigurator').then((m) => m.FrameConfigurator),
  {
    ssr: false,
    loading: () => (
      <div className="card p-12 text-center text-text-secondary">Loading design studio…</div>
    ),
  },
)

async function fetchDesignState(token: string): Promise<{
  token: string
  design: FrameDesignState
} | null> {
  const res = await fetch(`/api/design/${encodeURIComponent(token)}`)
  const data = (await res.json()) as {
    ok?: boolean
    design?: {
      designToken: string
      state?: FrameDesignState
      photoUrl?: string
    }
  }
  if (!data.ok || !data.design?.state) return null

  let design = data.design.state
  if (data.design.photoUrl) {
    design = { ...design, photoUrl: data.design.photoUrl }
  }

  return { token: data.design.designToken, design }
}

export function DesignStudio({
  ornaments,
  stylePresets,
  initialStyleSlug,
  initialDesignToken,
  initialDesign,
}: {
  ornaments: FrameOrnamentData[]
  stylePresets: FrameStylePreset[]
  initialStyleSlug?: string
  initialDesignToken?: string
  initialDesign?: FrameDesignState
}) {
  const [designerEmail, setDesignerEmail] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)
  const [resumeLoading, setResumeLoading] = useState(false)
  const [resumedToken, setResumedToken] = useState<string | undefined>()
  const [resumedDesign, setResumedDesign] = useState<FrameDesignState | undefined>()

  const resumeDraft = useCallback(async (token: string) => {
    setResumeLoading(true)
    try {
      const loaded = await fetchDesignState(token)
      if (loaded) {
        setResumedToken(loaded.token)
        setResumedDesign(loaded.design)
      }
    } finally {
      setResumeLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch('/api/design/auth')
      .then((r) => r.json())
      .then(async (data: { email?: string; activeDesignToken?: string | null }) => {
        if (data.email) setDesignerEmail(data.email)
        if (!initialDesignToken && data.activeDesignToken) {
          await resumeDraft(data.activeDesignToken)
        }
      })
      .catch(() => undefined)
      .finally(() => setChecking(false))
  }, [initialDesignToken, resumeDraft])

  const handleAuthenticated = useCallback(
    async (email: string, activeDesignToken?: string | null) => {
      setDesignerEmail(email)
      if (!initialDesignToken && activeDesignToken) {
        await resumeDraft(activeDesignToken)
      }
    },
    [initialDesignToken, resumeDraft],
  )

  if (checking || resumeLoading) {
    return (
      <div className="card p-12 text-center text-text-secondary">
        {resumeLoading ? 'Restoring your saved design…' : 'Checking access…'}
      </div>
    )
  }

  if (!designerEmail) {
    return <DesignEmailGate onAuthenticated={handleAuthenticated} />
  }

  const effectiveToken = initialDesignToken || resumedToken
  const effectiveDesign = initialDesign || resumedDesign

  return (
    <FrameConfigurator
      ornaments={ornaments}
      stylePresets={stylePresets}
      initialStyleSlug={initialStyleSlug}
      initialDesignToken={effectiveToken}
      initialDesign={effectiveDesign}
      designerEmail={designerEmail}
    />
  )
}
