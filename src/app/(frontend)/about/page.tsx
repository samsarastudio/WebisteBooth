import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Lightbulb, Sparkles, Target } from 'lucide-react'

import { Reveal } from '@/components/marketing/Reveal'
import { brand } from '@/lib/brand'
import { guardPage } from '@/lib/page-guard'

export const metadata: Metadata = {
  title: 'About',
  description: `${brand.fullName} — custom photobooth keepsake frames and on-site stickers for your guests.`,
}

const values = [
  {
    icon: Lightbulb,
    title: 'A better keepsake',
    desc: 'Paper strips fade and get tossed. We built FrameFlix around a simple idea: guests should leave with something they actually want to display.',
  },
  {
    icon: Target,
    title: 'Founder-led from day one',
    desc: 'FrameFlix is personally managed — you work directly with us on design, details, and delivery. No hand-offs, no call-center runaround.',
  },
  {
    icon: Heart,
    title: 'Craft over hype',
    desc: 'Translucent 3D-printed frames, raised custom details, and dye-sublimation prints. We care about the finish as much as the fun.',
  },
  {
    icon: Sparkles,
    title: 'Locally operated',
    desc: 'Based in the Waterloo Region and serving Kitchener, Waterloo, Cambridge, Guelph, and beyond — with a team invested in every celebration we host.',
  },
]

export default async function AboutPage() {
  const settings = await guardPage('about')
  const quoteHref = settings.showQuotePage ? '/quote' : '/contact'

  return (
    <div>
      <section className="section pb-10">
        <div className="container-wide text-center max-w-3xl mx-auto">
          <Reveal>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-light text-accent-hover text-sm font-semibold mb-4 tracking-wide uppercase">
              About FrameFlix
            </span>
            <h1 className="text-4xl md:text-5xl mb-4">Souvenirs for your guests</h1>
            <p className="text-text-secondary text-lg leading-relaxed">
              FrameFlix is a locally operated studio helping hosts give every guest a keepsake — their
              photo, in a personalized frame they&apos;ll actually keep. We bring an attendant to every
              event so you can enjoy the party.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-wide grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="relative aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-lg)] frame-shell p-2">
              <div className="relative w-full h-full rounded-[1rem] overflow-hidden">
                <Image
                  src="/brand/stickered-wedding-1.png"
                  alt="Custom FrameFlix guest keepsake frame at a wedding"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl mb-4">Why we started</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                Great events already have the food, the music, and the people. What they often lack
                is a souvenir guests will still have on their fridge a year later.
              </p>
              <p>
                Traditional photobooth strips fade, get crumpled, or disappear into a camera roll.
                We wanted something different: a translucent, personalized frame with a premium
                print — designed for your theme, ready for your guests.
              </p>
              <p>
                FrameFlix is founder-led and personally managed. Every booking gets close
                collaboration, careful design, and a team that treats your celebration like it
                matters — because it does.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-bg-secondary/40">
        <div className="container-wide">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl">What we believe</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08} className="card p-8">
                <v.icon className="text-accent mb-4" size={28} />
                <h3 className="text-xl mb-2">{v.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{v.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-wide">
          <Reveal className="card p-10 md:p-14 text-center">
            <h2 className="text-3xl mb-3">Plan your celebration with us</h2>
            <p className="text-text-secondary mb-8 max-w-xl mx-auto">
              We&apos;d love to bring FrameFlix to your event. Get a custom proposal within 24 hours.
            </p>
            <Link href={quoteHref} className="btn-primary">
              Get In Touch
              <Sparkles size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
