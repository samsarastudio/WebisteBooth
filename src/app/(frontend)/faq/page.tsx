import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

import { FaqList } from '@/components/marketing/FaqList'
import { Reveal } from '@/components/marketing/Reveal'
import { brand } from '@/lib/brand'
import { getActiveFaqs } from '@/lib/payload'
import { guardPage } from '@/lib/page-guard'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Common questions about FrameFlix custom photobooth frames and booking.',
}

export default async function FaqPage() {
  await guardPage('faq')
  const faqs = await getActiveFaqs()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="section pb-8">
        <div className="container-wide text-center max-w-2xl mx-auto">
          <Reveal>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4 tracking-wide uppercase">
              FAQ
            </span>
            <h1 className="text-4xl md:text-5xl mb-4">Common Questions</h1>
            <p className="text-text-secondary text-lg leading-relaxed">
              Everything you need to know before booking {brand.fullName} at your event.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-wide max-w-3xl">
          <FaqList faqs={faqs} />
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-wide">
          <Reveal className="card p-10 text-center">
            <h2 className="text-2xl md:text-3xl mb-3">Still Have Questions?</h2>
            <p className="text-text-secondary mb-6">
              We&apos;re happy to chat. Reach out anytime — no pressure, no commitment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-secondary">
                Contact Us
              </Link>
              <Link href="/quote" className="btn-primary">
                Get a Quote
                <Sparkles size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
