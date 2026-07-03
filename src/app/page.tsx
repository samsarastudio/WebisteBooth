import Link from "next/link";
import { Camera, Sparkles, Gift } from "lucide-react";

const packages = [
  { name: "Essential", price: "$495", items: ["30 custom frames", "Dye-sublimation prints", "2-hour coverage", "Digital gallery"], popular: false },
  { name: "Premium", price: "$795", items: ["60 custom frames", "Dye-sublimation prints", "4-hour coverage", "Digital gallery", "On-site attendant"], popular: true },
  { name: "Signature", price: "$1,295", items: ["Unlimited frames", "Premium dye-sub prints", "Full-day coverage", "Digital gallery + USB drive", "Dedicated attendant", "Custom frame designs"], popular: false },
];

const testimonials = [
  { text: "The best decision we made for our wedding! Every guest took home a custom frame they still display.", author: "Sarah & Mike" },
  { text: "Professional, fun, and the prints were absolutely stunning. Our team loved it!", author: "TechCorp Inc." },
  { text: "My daughter's birthday frames are gorgeous — she hasn't taken them off the fridge since.", author: "Jessica T." },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Warm gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-accent-light to-bg-secondary opacity-50" />

        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c4956a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <div className="animate-fade-in">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 tracking-wide uppercase">
              Custom Photobooth Experiences
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif font-semibold leading-tight mb-6 animate-slide-up delay-100" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
            Souvenirs Your Guests Will<br className="hidden sm:block" /> <span className="text-gradient italic">Actually Keep</span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up delay-200" style={{ animationDelay: "250ms", animationFillMode: "both" }}>
            Custom 3D-printed frames with dye-sublimation prints that last forever. Weddings, corporate events, birthdays, and more.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-300" style={{ animationDelay: "350ms", animationFillMode: "both" }}>
            <Link href="/contact" className="btn-primary">
              Book Your Event
              <Sparkles size={16} />
            </Link>
            <Link href="/gallery" className="btn-secondary">
              View Gallery
              <Camera size={16} />
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
      </section>

      {/* Trust bar */}
      <section className="border-y border-border bg-bg-card/80">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-text-secondary font-medium">
          {[
            { icon: "📸", label: "Custom Designs" },
            { icon: "✅", label: "Premium Quality" },
            { icon: "🎁", label: "Free Setup" },
            { icon: "♾️", label: "Unlimited Shots" },
          ].map((item) => (
            <span key={item.label} className="flex items-center gap-2">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </span>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="section bg-bg-primary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">How It Works</h2>
            <p className="text-text-secondary max-w-xl mx-auto">Three simple steps to unforgettable memories</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: "📋", title: "You Book", desc: "Share your event details — date, theme, guest count. We handle the rest." },
              { step: "02", icon: "🖨️", title: "We Create", desc: "Custom frames designed for your occasion, pre-printed before the event." },
              { step: "03", icon: "🎁", title: "They Remember", desc: "Guests take home a keepsake frame they'll display long after the party ends." },
            ].map((item) => (
              <div key={item.step} className="card p-8 text-center">
                <span className="text-4xl mb-5 block">{item.icon}</span>
                <span className="text-xs font-bold tracking-widest uppercase text-accent/70 mb-2">{item.step}</span>
                <h3 className="text-xl font-serif font-semibold mb-3">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why FrameFlix */}
      <section className="section bg-bg-secondary/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">Why FrameFlix</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "💧", title: "Waterproof Prints", desc: "Won't fade, peel, or crinkle — ever." },
              { icon: "🧲", title: "Magnet Ready", desc: "Every frame comes with a fridge magnet backing." },
              { icon: "🎨", title: "Custom 3D Frames", desc: "Designed specifically for your event's theme." },
              { icon: "♾️", title: "Unlimited Shots", desc: "No per-photo charges. Go wild." },
            ].map((item) => (
              <div key={item.title} className="card p-6">
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="section bg-bg-primary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">Packages</h2>
            <p className="text-text-secondary max-w-xl mx-auto">Choose the perfect package for your event. All include setup and teardown.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`card p-8 relative flex flex-col ${pkg.popular ? "ring-2 ring-accent" : ""}`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-medium px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-serif font-semibold mb-1">{pkg.name}</h3>
                <p className="text-3xl font-bold text-accent mb-6">{pkg.price}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                      <span className="text-accent mt-0.5 shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className={`btn-primary w-full justify-center !text-base`}>
                  Get Proposal
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="section bg-bg-secondary/60">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">Gallery</h2>
          <p className="text-text-secondary max-w-xl mx-auto mb-10">Real events, real frames, real memories.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="gallery-item bg-bg-card border border-border overflow-hidden aspect-[3/4] flex items-center justify-center">
                <span className="text-text-secondary text-sm">{i % 3 === 0 ? "📸" : i % 2 === 0 ? "🖼️" : "✨"}</span>
              </div>
            ))}
          </div>

          <Link href="/gallery" className="btn-primary mt-10 mx-auto">
            View Full Gallery
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-bg-primary">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-14">Kind Words</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.author} className="card p-8 text-left">
                <p className="text-text-secondary leading-relaxed mb-6 italic">"{t.text}"</p>
                <span className="font-semibold text-sm">{t.author}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-bg-primary to-accent-light" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-5xl font-serif font-semibold mb-4 leading-tight">
            Ready to Make Your Event Unforgettable?
          </h2>
          <p className="text-text-secondary text-lg mb-8">Get a custom proposal within 24 hours.</p>
          <Link href="/contact" className="btn-primary !text-lg !px-10">
            Get Your Proposal
            <Sparkles size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
