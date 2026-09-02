import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { Print3dStudio } from '@/components/print-3d/Print3dStudio'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Print 3D',
  robots: { index: false, follow: false },
}

export default async function Print3dPage() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    redirect('/admin')
  }

  return (
    <div className="section">
      <div className="container-wide py-10 md:py-14">
        <Print3dStudio />
      </div>
    </div>
  )
}
