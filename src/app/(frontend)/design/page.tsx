import type { Metadata } from 'next'

import { DesignStudio } from '@/components/design/DesignStudio'
import { Reveal } from '@/components/marketing/Reveal'
import { getDesignCatalog } from '@/lib/frame-design/catalog'
import { getFrameDesignByToken } from '@/lib/frame-design/save-design'
import type { FrameDesignState } from '@/lib/frame-design/types'
import { guardPage } from '@/lib/page-guard'

export const metadata: Metadata = {
  title: 'Design Your Frame',
  description:
    'Upload a photo, customize your FrameFlix keepsake frame — colors, text, and decorations — then continue to your free quote.',
}

type Props = {
  searchParams: Promise<{ style?: string; design?: string; id?: string }>
}

export default async function DesignPage({ searchParams }: Props) {
  await guardPage('design')
  const params = await searchParams
  const catalog = await getDesignCatalog()

  let initialDesign: FrameDesignState | undefined
  const token = params.design || params.id
  if (token) {
    const saved = await getFrameDesignByToken(token)
    if (saved?.state && typeof saved.state === 'object') {
      initialDesign = saved.state as FrameDesignState
      const photoUrl =
        saved.photoMedia && typeof saved.photoMedia === 'object' && saved.photoMedia.url
          ? saved.photoMedia.url
          : undefined
      if (photoUrl) initialDesign = { ...initialDesign, photoUrl }
    }
  }

  return (
    <div>
      <section className="section pb-8">
        <div className="container-wide text-center max-w-2xl mx-auto">
          <Reveal>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-light text-accent-hover text-sm font-semibold mb-4 tracking-wide uppercase">
              Design studio
            </span>
            <h1 className="text-4xl md:text-5xl mb-4">Design your frame</h1>
            <p className="text-text-secondary text-lg leading-relaxed">
              Sign in with your email, upload a sample photo, pick colors and decorations, and see a
              live preview. When you&apos;re happy, we save a snapshot and email you a link to
              recreate it anytime.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-wide">
          <DesignStudio
            ornaments={catalog.ornaments}
            stylePresets={catalog.stylePresets}
            initialStyleSlug={params.style}
            initialDesignToken={token}
            initialDesign={initialDesign}
          />
        </div>
      </section>
    </div>
  )
}
