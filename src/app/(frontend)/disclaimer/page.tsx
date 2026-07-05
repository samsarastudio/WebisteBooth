import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/marketing/Reveal'
import { brand } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: `Disclaimer for ${brand.fullName} — estimates, materials, online photos, and service limitations.`,
}

export default function DisclaimerPage() {
  return (
    <div>
      <section className="section pb-8">
        <div className="container-wide max-w-3xl mx-auto">
          <Reveal>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-light text-accent-hover text-sm font-semibold mb-4 tracking-wide uppercase">
              Legal
            </span>
            <h1 className="text-4xl md:text-5xl mb-3">Disclaimer</h1>
            <p className="text-text-secondary text-sm mb-10">Last updated: July 3, 2026</p>
          </Reveal>

          <Reveal delay={0.05} className="space-y-8 text-text-secondary leading-relaxed">
            <section>
              <h2 className="text-xl font-serif text-text-primary mb-3">1. General</h2>
              <p>
                The information on the {brand.fullName} website is provided for general information
                and marketing purposes. By using this site or requesting a quote, you acknowledge
                this Disclaimer and our{' '}
                <Link href="/privacy" className="text-accent hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-text-primary mb-3">2. Quotes & estimates</h2>
              <p>
                Package prices, add-ons, and totals shown on this website (including the quote
                builder) are <strong className="text-text-primary">estimates only</strong>. Final
                pricing may change based on event date, location, travel, design complexity, guest
                count, rush production, or other factors confirmed in a written proposal or
                agreement. Submitting a quote request does not create a binding contract until we
                issue and you accept a formal proposal (or other written confirmation).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-text-primary mb-3">3. Materials (PLA)</h2>
              <p>
                FrameFlix custom frames are produced using{' '}
                <strong className="text-text-primary">PLA (polylactic acid)</strong> 3D-printing
                material for the frame body and decorative elements, with dye-sublimation printed
                photo inserts. PLA is a widely used thermoplastic for additive manufacturing.
              </p>
              <p className="mt-3">
                While we design frames to be durable keepsakes under normal indoor display
                conditions, PLA and printed components may be affected by heat, prolonged direct
                sunlight, moisture, impact, or improper storage. Colors, finish, and fine details
                may vary slightly between production batches and on-screen previews. FrameFlix is
                not liable for damage caused by misuse, extreme environments, or modifications made
                by third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-text-primary mb-3">4. Coverage hours</h2>
              <p>
                Unless otherwise stated in your proposal, packages include{' '}
                <strong className="text-text-primary">three (3) hours of coverage, excluding
                setup and teardown time</strong>. Setup and teardown are performed outside the
                coverage window. Additional hours may be available as an add-on, subject to
                availability.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-text-primary mb-3">5. Photo frames & allotments</h2>
              <p>
                Base packages include <strong className="text-text-primary">sixty (60) custom
                photo frames</strong> unless your written proposal states otherwise. Additional
                frames may be purchased in <strong className="text-text-primary">20-packs</strong>.
                Unlimited digital shots during coverage do not mean unlimited physical frames.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-text-primary mb-3">6. Online photos</h2>
              <p>
                When online digital photos are included, access is provided for approximately{' '}
                <strong className="text-text-primary">three (3) months</strong> from the event date,
                after which access may expire and files may be removed. FrameFlix is not responsible
                for loss of digital files after the access period. Guests and hosts should download
                photos they wish to retain before expiry.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-text-primary mb-3">7. Designs & personalization</h2>
              <p>
                Custom names, messages, and motifs are produced from information you provide. You
                are responsible for the accuracy of spelling and content. Approvals of proofs (when
                provided) constitute acceptance of the design. FrameFlix reserves the right to
                decline content that is unlawful, offensive, or infringes third-party rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-text-primary mb-3">8. Service limitations</h2>
              <p>
                Event services depend on venue access, power, space, and safe operating conditions.
                We bring backup equipment where practical, but we are not liable for delays or
                interruptions caused by venue restrictions, weather, force majeure, or circumstances
                beyond our reasonable control. Liability, if any, is limited to fees paid for the
                affected services, to the maximum extent permitted by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-text-primary mb-3">9. Website content</h2>
              <p>
                Images, sample messages, and style previews on this website are for{' '}
                <strong className="text-text-primary">illustrative purposes only</strong>. Real
                sample images can be provided when you request a quote. Our custom design and
                generation capabilities go far beyond what is shown online. Actual products and
                event setups may differ. We strive for accuracy but do not warrant that all website
                content is complete, current, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-text-primary mb-3">10. Governing law</h2>
              <p>
                This Disclaimer is governed by the laws of the Province of Ontario and the
                applicable laws of Canada, without regard to conflict-of-law principles. Any disputes
                shall be subject to the courts of Ontario, unless otherwise required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-text-primary mb-3">11. Contact</h2>
              <p>
                Questions about this Disclaimer? Contact{' '}
                <a href={`mailto:${brand.email}`} className="text-accent hover:underline">
                  {brand.email}
                </a>
                .
              </p>
              <p className="mt-6">
                See also our{' '}
                <Link href="/privacy" className="text-accent hover:underline">
                  Privacy Policy
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
