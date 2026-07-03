"use client";

import Link from "next/link";
import { Plus, Minus, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "What exactly is a FrameFlix photobooth?",
    a: "Unlike traditional photobooths that print strips on the spot, we pre-design and 3D-print custom frames for your event. At your event, guests pose for photos that are dye-sublimation printed and inserted into their personalized frame — creating a premium keepsake they'll actually keep.",
  },
  {
    q: "How long before my event do I need to book?",
    a: "We recommend booking at least 2-3 months in advance for weddings and peak season events. For corporate events and birthdays, 4-6 weeks usually works. We do accommodate rush requests — just call us!",
  },
  {
    q: "What's the difference between dye-sublimation and regular printing?",
    a: "Dye-sublimation prints are waterproof, fade-proof, tear-proof, and have a glossy professional finish. Regular inkjet prints fade within months, can smear when wet, and feel cheap to the touch. Ours will still look brand new in 20 years.",
  },
  {
    q: "Can I customize the frame design?",
    a: "Absolutely! Every frame is designed specifically for your event. Share your theme colors, logo, monogram, or any visual reference — we'll create a custom design and send you a proof before printing.",
  },
  {
    q: "How many guests can use the photobooth?",
    a: "There's no limit! All packages include unlimited shots. Whether you have 30 or 500 guests, the booth keeps running throughout your event coverage hours.",
  },
  {
    q: "Do you travel outside of the GTA?",
    a: "Yes! While we're based in Toronto and serve the Greater Toronto Area as our primary region, we regularly travel across Ontario and beyond. Travel fees depend on your location — just ask for details.",
  },
  {
    q: "What happens if equipment fails at my event?",
    a: "We bring backup equipment for every event. Our setup includes redundant cameras, printers, and power supplies so that even in the unlikely event of a hardware issue, there's zero disruption to your party.",
  },
  {
    q: "Can I see examples of actual frames before booking?",
    a: "Of course! Check out our gallery for real event photos, or email us at hello@frameflixstudio.com and we'll send sample designs based on your event theme.",
  },
  {
    q: "Do you provide an attendant at the event?",
    a: "Premium and Signature packages include a dedicated attendant who manages setup, operates the booth, engages with guests, troubleshoots any issues, and handles teardown. Essential package is drop-off only — the host operates it.",
  },
  {
    q: "How far in advance are frames pre-printed?",
    a: "Frames are typically produced 1-2 weeks before your event to ensure quality and accuracy. We ship them to your venue or provide pickup options. Every frame arrives in protective packaging.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-24 pb-16 bg-bg-secondary/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 tracking-wide uppercase">FAQ</span>
          <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-serif font-semibold leading-tight mb-6">
            Common Questions
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Everything you need to know before booking FrameFlix Studio at your event.
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="section bg-bg-primary">
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-border last:border-b-0">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full py-5 flex items-center justify-between gap-4 text-left"
              >
                <span className="text-base font-semibold">{faq.q}</span>
                {openIndex === i ? (
                  <Minus size={18} className="text-accent shrink-0" />
                ) : (
                  <Plus size={18} className="text-text-secondary shrink-0" />
                )}
              </button>
              {openIndex === i && (
                <div className="pb-5 animate-fade-in">
                  <p className="text-text-secondary text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Still have questions CTA */}
      <section className="section bg-bg-secondary/60">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">Still Have Questions?</h2>
          <p className="text-text-secondary text-lg mb-8">We're happy to chat. Reach out anytime — no pressure, no commitment.</p>
          <Link href="/contact" className="btn-primary !text-lg !px-10 inline-flex">
            Contact Us
            <CheckCircle2 size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
