import Link from "next/link";
import { Heart, Camera, Award, Users } from "lucide-react";

const milestones = [
  { year: "2018", text: "Started as a side hustle — one custom frame at a time." },
  { year: "2020", text: "Launched FrameFlix Studio with our signature dye-sub + 3D frame process." },
  { year: "2023", text: "Surpassed 500 events served across Ontario and beyond." },
  { year: "2026", text: "Expanded packaging options and dedicated attendant service." },
];

const values = [
  { icon: <Heart size={24} />, title: "Quality First", desc: "Every frame is 3D-printed with premium materials. No cardboard, no stickers — just real keepsakes your guests will keep for years." },
  { icon: <Camera size={24} />, title: "Experience Matters", desc: "Our attendants don't just run a booth. They engage the crowd, guide poses, and make sure everyone feels included in the fun." },
  { icon: <Award size={24} />, title: "Built to Last", desc: "Dye-sublimation prints are waterproof, fade-proof, and tear-proof. These aren't photos — they're heirlooms." },
  { icon: <Users size={24} />, title: "People Over Profit", desc: "We turn down events when we think the frame concept isn't right. Your satisfaction > our convenience, every time." },
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-24 pb-16 bg-bg-secondary/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 tracking-wide uppercase">Our Story</span>
          <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-serif font-semibold leading-tight mb-6">
            Not Your Average Photobooth
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            FrameFlix Studio was born from a simple idea: every event deserves a gift that lasts longer than the party.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section bg-bg-primary">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-semibold mb-6">How It All Started</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                We noticed a pattern at weddings, corporate events, and birthday parties across Ontario: great food, good music — but guests went home with nothing to show for it.
              </p>
              <p className="text-text-secondary leading-relaxed mb-4">
                Traditional photobooth strips fade, get thrown away, or end up lost in a phone's camera roll. We wanted something different: a frame your guest would actually hang on their fridge, display on their desk, pass down to their kids.
              </p>
              <p className="text-text-secondary leading-relaxed">
                That vision became FrameFlix Studio — custom 3D-printed frames with dye-sublimation prints that are waterproof, fade-proof, and built to last forever. No cardboard cutouts, no stickers — just premium keepsakes your guests will actually keep.
              </p>
            </div>
            <div className="card p-8 text-center">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-xl font-serif font-semibold mb-2">The Numbers</h3>
              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <p className="text-3xl font-bold text-accent">500+</p>
                  <p className="text-sm text-text-secondary">Events Served</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent">15K+</p>
                  <p className="text-sm text-text-secondary">Frames Created</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent">98%</p>
                  <p className="text-sm text-text-secondary">Return Rate</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent">100%</p>
                  <p className="text-sm text-text-secondary">Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="section bg-bg-secondary/60">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-14 text-center">Our Journey</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-6 mb-10 relative">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shrink-0 z-10">
                  <span className="text-white font-bold text-sm">{m.year.slice(-2)}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-accent tracking-widest uppercase">{m.year}</span>
                  <p className="text-text-secondary leading-relaxed mt-1">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-bg-primary">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-14 text-center">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="card p-8">
                <div className="text-accent mb-4">{v.icon}</div>
                <h3 className="text-xl font-serif font-semibold mb-3">{v.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-bg-primary to-accent-light" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-5xl font-serif font-semibold mb-4 leading-tight">
            Let's Make Your Event Special
          </h2>
          <p className="text-text-secondary text-lg mb-8">Get a custom proposal within 24 hours.</p>
          <Link href="/contact" className="btn-primary !text-lg !px-10 inline-flex">
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
