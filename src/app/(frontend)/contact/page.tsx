import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, Mail, MapPin, Phone, Sparkles } from 'lucide-react'

import { ContactForm } from '@/components/contact/ContactForm'
import { Reveal } from '@/components/marketing/Reveal'
import { brand } from '@/lib/brand'
import { guardPage } from '@/lib/page-guard'
import { serviceAreas } from '@/lib/service-areas'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Contact ${brand.fullName} for custom photobooth proposals in Kitchener, Cambridge, Waterloo, Guelph, and beyond.`,
}

export default async function ContactPage() {
  const settings = await guardPage('contact')
  const phone = settings.phone?.trim()

  return (
    <div>
      <section className="section pb-8">
        <div className="container-wide text-center max-w-2xl mx-auto">
          <Reveal>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4 tracking-wide uppercase">
              Get In Touch
            </span>
            <h1 className="text-4xl md:text-5xl mb-4">Let&apos;s Plan Your Event</h1>
            <p className="text-text-secondary text-lg leading-relaxed">
                Want a full package quote?{' '}
              <Link href="/quote" className="text-accent underline-offset-2 hover:underline">
                Start here
              </Link>
              , or send us a quick message below.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-wide grid lg:grid-cols-[1fr_340px] gap-8 items-start">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1} className="space-y-4">
            <div className="card p-6 space-y-5">
              <h2 className="font-serif text-xl">Contact Info</h2>
              <div className="flex gap-3 text-sm">
                <Mail size={18} className="text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Email us anytime</p>
                  <a href={`mailto:${settings.email}`} className="text-text-secondary hover:text-accent">
                    {settings.email}
                  </a>
                </div>
              </div>
              {phone ? (
                <div className="flex gap-3 text-sm">
                  <Phone size={18} className="text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Call or text</p>
                    <a
                      href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                      className="text-text-secondary hover:text-accent"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
              ) : null}
              <div className="flex gap-3 text-sm">
                <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">We host in</p>
                  <p className="text-text-secondary">{settings.serviceArea}</p>
                  <ul className="mt-2 space-y-1">
                    {serviceAreas.map((area) => (
                      <li key={area.href}>
                        <Link href={area.href} className="text-text-secondary hover:text-accent">
                          Photo booth — {area.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-accent" />
                <h3 className="font-medium">Response Time</h3>
              </div>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>Proposals within 24 hours</li>
                <li>Weekday replies within 2 hours</li>
              </ul>
            </div>

            <div className="card p-6 bg-accent-light border-accent/20">
              <p className="text-sm leading-relaxed">
                <strong>Pro Tip:</strong> Book 2–3 months ahead for weddings and peak season. We love
                last-minute requests too — email us your date and we&apos;ll see what we can do.
              </p>
            </div>

            <Link href="/quote" className="btn-primary w-full justify-center">
              Build Full Quote
              <Sparkles size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
