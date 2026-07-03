import Link from "next/link";
import { Sparkles, Check, ArrowRight, Star } from "lucide-react";

const packages = [
  {
    name: "Essential",
    price: "$495",
    desc: "Perfect for birthdays and casual gatherings where DIY fits.",
    icon: "📸",
    features: [
      "30 custom 3D-printed frames",
      "Dye-sublimation prints (waterproof, fade-proof)",
      "Custom frame design for your event theme",
      "DIY setup kit with instructions",
      "Online gallery access",
      "Basic prop set included",
    ],
    notIncluded: [
      "On-site attendant",
      "Video clips & GIF frames",
      "Photo booth backdrops",
    ],
    popular: false,
  },
  {
    name: "Premium",
    price: "$795",
    desc: "Our most popular choice — everything you need, handled for you.",
    icon: "✨",
    features: [
      "60 custom 3D-printed frames",
      "Dye-sublimation prints (waterproof, fade-proof)",
      "Custom frame design + QR code insert",
      "On-site attendant (up to 3 hours)",
      "Guest engagement & setup",
      "Online gallery with download links",
      "Premium prop set with themed accessories",
    ],
    notIncluded: [
      "Video clips & GIF frames",
      "Custom backdrop installation",
    ],
    popular: true,
  },
  {
    name: "Signature",
    price: "$1295",
    desc: "The full VIP experience — your guests won't stop talking about it.",
    icon: "💎",
    features: [
      "Unlimited custom 3D-printed frames",
      "Dye-sublimation prints (waterproof, fade-proof)",
      "Custom frame design + gold foil details",
      "On-site attendant (up to 5 hours)",
      "Video clips & GIF frames",
      "Custom backdrop matching your theme",
      "Premium prop set with lighting",
      "Express production (frames shipped 1 week out)",
      "Priority booking & design review",
    ],
    notIncluded: [],
    popular: false,
  },
];

const addOns = [
  { name: "Extra Frames", price: "+$15/frame" },
  { name: "Additional Attend Hour", price: "+$85/hr" },
  { name: "Custom Backdrop", price: "+$200" },
  { name: "Video/GIF Clips (+30)", price: "+$150" },
  { name: "Photo Album (50 pages)", price: "+$180" },
  { name: "Travel Beyond GTA", price: "+$1.5/km" },
];

export default function Packages() {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-24 pb-16 bg-bg-secondary/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 tracking-wide uppercase">Pricing</span>
          <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-serif font-semibold leading-tight mb-6">
            Choose Your Experience
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Three tiers designed for different events and budgets. Every package includes custom design — because your frames should be as unique as your event.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section bg-bg-primary">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`card p-8 relative ${pkg.popular ? "border-accent shadow-md ring-1 ring-accent/20" : ""}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                    <Star size={10} /> Most Popular
                  </div>
                )}
                <div className="text-4xl mb-3">{pkg.icon}</div>
                <h3 className="text-2xl font-serif font-semibold mb-1">{pkg.name}</h3>
                <p className="text-3xl font-bold text-accent mb-2">{pkg.price}</p>
                <p className="text-sm text-text-secondary mb-6">{pkg.desc}</p>

                <div className="space-y-3 mb-8">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">What's Included</h4>
                  {pkg.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <Check size={16} className="text-accent mt-0.5 shrink-0" />
                      <span className="text-sm text-text-secondary">{f}</span>
                    </div>
                  ))}
                  {pkg.notIncluded.length > 0 && (
                    <>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary pt-2">Not Included</h4>
                      {pkg.notIncluded.map((f) => (
                        <div key={f} className="flex items-start gap-2.5">
                          <XIcon size={16} className="text-text-secondary/30 mt-0.5 shrink-0" />
                          <span className="text-sm text-text-secondary/50 line-through">{f}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <Link href="/contact" className={`btn-primary !w-full justify-center ${pkg.popular ? "" : "opacity-80 hover:opacity-100"}`}>
                  Get Started
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="section bg-bg-secondary/60">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-10 text-center">Add-Ons</h2>
          <p className="text-text-secondary text-center mb-8 max-w-lg mx-auto">Enhance any package with these options — mix and match to build your perfect experience.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {addOns.map((a) => (
              <div key={a.name} className="card p-5 flex justify-between items-center">
                <span className="text-sm font-medium">{a.name}</span>
                <span className="text-sm text-accent font-semibold whitespace-nowrap">{a.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section bg-bg-primary">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-12 text-center">How It Works</h2>
          <div className="grid sm:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Tell Us Your Vision", desc: "Share your event details, theme colors, and any visual inspiration." },
              { step: "02", title: "We Design & Print", desc: "Custom frames are 3D-printed and shipped to your venue a week before." },
              { step: "03", title: "Event Day Magic", desc: "Guests pose, get their photos printed on-site, and insert into their frame." },
              { step: "04", title: "Keepsakes Forever", desc: "Every guest leaves with a premium frame that lasts for decades." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 text-accent font-bold text-sm flex items-center justify-center mx-auto mb-3">{s.step}</div>
                <h3 className="font-serif font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-bg-primary to-accent-light" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-5xl font-serif font-semibold mb-4 leading-tight">Ready to Get a Custom Quote?</h2>
          <p className="text-text-secondary text-lg mb-8">No two events are the same — we'll tailor everything to yours.</p>
          <Link href="/contact" className="btn-primary !text-lg !px-10 inline-flex">
            Book Your Event
            <Sparkles size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function XIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
