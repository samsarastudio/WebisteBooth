import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/marketing/Reveal'
import { brand } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${brand.fullName} — how we collect, use, and protect your information.`,
}

export default function PrivacyPage() {
  return (
    <div>
      <section className="section pb-8">
        <div className="container-wide max-w-3xl mx-auto">
          <Reveal>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-light text-accent-hover text-sm font-semibold mb-4 tracking-wide uppercase">
              Legal
            </span>
            <h1 className="text-4xl md:text-5xl mb-3">Privacy Policy</h1>
            <p className="text-text-secondary text-sm mb-10">Last updated: July 5, 2026</p>
          </Reveal>

          <Reveal delay={0.05} className="prose-legal space-y-8 text-text-secondary leading-relaxed">
            <section>
              <h2 className="text-xl font-serif text-text-primary mb-3">1. Who we are</h2>
              <p>
                {brand.fullName} (“{brand.name},” “we,” “us,” or “our”) is a photobooth service
                operated by {brand.parentName}. We provide custom photobooth experiences and
                3D-printed keepsake frames for events. This Privacy Policy explains how we collect,
                use, disclose, and safeguard information when you visit our website, submit a quote
                request, or communicate with us.
              </p>
              <p className="mt-3">
                Contact:{' '}
                <a href={`mailto:${brand.email}`} className="text-accent hover:underline">
                  {brand.email}
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-text-primary mb-3">2. Information we collect</h2>
              <p className="mb-3">We may collect:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-text-primary">Contact details</strong> — name, email
                  address, phone number
                </li>
                <li>
                  <strong className="text-text-primary">Event details</strong> — event type, date,
                  guest count, venue notes, and messages you provide
                </li>
                <li>
                  <strong className="text-text-primary">Quote preferences</strong> — selected package,
                  frame style, add-ons, and estimated totals
                </li>
                <li>
                  <strong className="text-text-primary">Technical data</strong> — IP address, browser
                  type, and basic usage data needed to operate and secure the site
                </li>
              </ul>
              <p className="mt-3">
                We do not knowingly collect personal information from children under 13. If you
                believe we have, please contact us so we can delete it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-text-primary mb-3">3. How we use your information</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Respond to quote requests and inquiries</li>
                <li>Prepare proposals, designs, and event logistics</li>
                <li>Provide online photo gallery access related to your event</li>
                <li>Improve our website, services, and customer experience</li>
                <li>Comply with legal obligations and protect our rights</li>
              </ul>
              <p className="mt-3">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-text-primary mb-3">4. Online photos & galleries</h2>
              <p>
                When we provide digital photos from your event, access is typically available for{' '}
                <strong className="text-text-primary">three (3) months</strong> from the event date,
                unless otherwise agreed in writing. After expiry, gallery links may be disabled and
                files may be deleted from our systems. Please download any photos you wish to keep
                before access expires.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-text-primary mb-3">5. Sharing of information</h2>
              <p className="mb-3">We may share information with:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Service providers who help us operate the site, send email, or host data (under
                  appropriate confidentiality obligations)
                </li>
                <li>Professional advisors or authorities when required by law</li>
                <li>Successors in the event of a business transfer, with notice where required</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-serif text-text-primary mb-3">6. Data retention & security</h2>
              <p>
                We retain inquiry and booking information as long as needed to provide services,
                resolve disputes, and meet legal or accounting requirements. We use reasonable
                administrative and technical measures to protect information; no method of
                transmission or storage is completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-text-primary mb-3">7. Your choices</h2>
              <p>
                You may request access to, correction of, or deletion of personal information we
                hold about you, subject to applicable law. Email us at{' '}
                <a href={`mailto:${brand.email}`} className="text-accent hover:underline">
                  {brand.email}
                </a>
                . You may also unsubscribe from marketing emails using the link in those messages
                (service-related messages may still be sent).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-text-primary mb-3">8. Cookies, analytics & consent</h2>
              <p className="mb-3">
                Our site uses essential cookies and similar technologies to operate the service and
                remember your preferences. You can control cookies through your browser settings;
                disabling some cookies may affect site functionality.
              </p>
              <p className="mb-3">
                We also collect <strong className="text-text-primary">first-party analytics</strong>{' '}
                to understand which pages are visited and improve the site. This includes the page
                path, an anonymous session identifier stored in your browser, and optionally a
                truncated referrer or browser type. We do not use third-party ad trackers, do not
                sell this data, and do not use it to profile you for advertising.
              </p>
              <p className="mb-3">
                By continuing to use this website after seeing our notice, you agree to this
                analytics use as described here. When you submit a quote or contact form, you must
                check a separate consent box allowing us to store your contact details and respond
                to your inquiry.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-text-primary mb-3">9. Materials & product information</h2>
              <p>
                For transparency regarding our physical products: {brand.name} custom frames are
                manufactured using <strong className="text-text-primary">PLA (polylactic acid)</strong>
                , a commonly used 3D-printing material, together with dye-sublimation printed photo
                inserts. Material details are provided here for disclosure purposes and may also
                appear in our Disclaimer. Product appearance and durability can vary with use,
                storage, and environmental conditions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-text-primary mb-3">10. Changes to this policy</h2>
              <p>
                We may update this Privacy Policy from time to time. The “Last updated” date at the
                top will change when we do. Continued use of the site after updates constitutes
                acceptance of the revised policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-text-primary mb-3">11. Contact</h2>
              <p>
                Questions about this Privacy Policy? Contact {brand.fullName} at{' '}
                <a href={`mailto:${brand.email}`} className="text-accent hover:underline">
                  {brand.email}
                </a>
                .
              </p>
              <p className="mt-6">
                See also our{' '}
                <Link href="/disclaimer" className="text-accent hover:underline">
                  Disclaimer
                </Link>
                .
              </p>
            </section>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
