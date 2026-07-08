import Link from 'next/link'
import { Sparkles } from 'lucide-react'

import { DualHero } from '@/components/marketing/DualHero'
import { brand } from '@/lib/brand'
import { DesignStudioSection } from '@/components/marketing/DesignStudioSection'
import { EventOrganisersSection } from '@/components/marketing/EventOrganisersSection'
import { PackageCards } from '@/components/marketing/PackageCards'
import { BlogCardCompact } from '@/components/marketing/BlogCard'
import { ProductImage } from '@/components/marketing/ProductImage'
import { Reveal, Stagger, StaggerItem } from '@/components/marketing/Reveal'
import { StyleSlider } from '@/components/marketing/StyleSlider'
import { brandImages, gallerySamples } from '@/lib/brand-images'
import {
  getActiveFrameStyles,
  getActivePackages,
  getGalleryItems,
  getPublishedPosts,
  getSiteSettings,
} from '@/lib/payload'

export default async function HomePage() {
  const [settings, packages, gallery, frameStyles, blogData] = await Promise.all([
    getSiteSettings(),
    getActivePackages(),
    getGalleryItems({ limit: 6 }),
    getActiveFrameStyles(),
    getPublishedPosts({ limit: 3 }),
  ])

  const previewImages =
    gallery.length > 0
      ? gallery
          .filter((item) => item.imageUrl)
          .map((item) => ({
            id: item.id,
            imageUrl: item.imageUrl as string,
          }))
      : gallerySamples.slice(0, 6).map((img, i) => ({
          id: i,
          imageUrl: img.src,
        }))

  const quoteHref = settings.showQuotePage ? '/quote?service=frames' : '/contact'
  const stickersQuoteHref = settings.showQuotePage ? '/quote?service=stickers' : '/contact'
  const designHref = settings.showDesignPage ? '/design' : quoteHref

  return (
    <div>
      <DualHero
        headline={settings.heroTitle || undefined}
        supporting={settings.heroSubtitle || undefined}
        designHref={designHref}
        showDesign={settings.showDesignPage}
        quoteFramesHref={settings.showQuotePage ? '/quote?service=frames' : '/contact'}
        quoteStickersHref={
          settings.showStickersPage
            ? stickersQuoteHref
            : settings.showQuotePage
              ? '/quote?service=stickers'
              : '/contact'
        }
      />
      {settings.showTrustBar && settings.trustBadges.length > 0 && (
        <section className="border-y border-border bg-bg-secondary/70 backdrop-blur-sm">
          <div className="container-wide py-5">
            <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {settings.trustBadges.map((item) => (
                <StaggerItem
                  key={item.label}
                  className="card px-3 py-3 flex items-center justify-center gap-2 text-sm font-medium text-center"
                >
                  <span aria-hidden>{item.icon}</span>
                  <span>{item.label}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {settings.showStylesSection && frameStyles.length > 0 && (
        <section className="section overflow-hidden">
          <div className="container-wide">
            <Reveal className="text-center mb-10 md:mb-12">
              <h2 className="text-3xl md:text-4xl mb-3">Frame styles</h2>
              <p className="text-text-secondary max-w-lg mx-auto mb-4">
                Beautiful styles your guests will love — personalized with names and messages for
                your celebration.
              </p>
            </Reveal>
            <StyleSlider
              styles={frameStyles}
              showQuote={settings.showQuotePage}
              showDesign={settings.showDesignPage}
            />
          </div>
        </section>
      )}

      {settings.showDesignPage && (
        <DesignStudioSection
          designHref="/design"
          quoteHref={settings.showQuotePage ? '/quote?service=frames' : '/contact'}
        />
      )}

      {settings.showProductStory && (
        <section className="section bg-bg-secondary/40 overflow-hidden">
          <div className="container-wide grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <Reveal direction="left">
              <div className="relative aspect-square rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-lg)] frame-shell p-2">
                <div className="relative w-full h-full rounded-[1.2rem] overflow-hidden">
                  <ProductImage
                    src="/brand/style-romance-photo.png"
                    alt="Guest keepsake frame — Anna & Stephen"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 560px"
                  />
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1} direction="right">
              <h2 className="text-3xl md:text-4xl mb-4">A gift your guests take home</h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                Every guest leaves with their photo in a personalized frame — a souvenir they&apos;ll
                actually keep long after the party.
              </p>
              <ul className="space-y-3 text-sm">
                {[
                  'Their photo in a custom frame',
                  'Personalized with your names or message',
                  'Premium prints that last',
                  '3 hours of coverage, with setup handled for you',
                ].map((line) => (
                  <li key={line} className="flex gap-2 items-start">
                    <span className="text-accent mt-0.5">✦</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      )}

      {settings.showHowItWorks && (
        <section className="section">
          <div className="container-wide">
            <Reveal className="text-center mb-10 md:mb-14">
              <h2 className="text-3xl md:text-4xl mb-3">How It Works</h2>
              <p className="text-text-secondary">Three simple steps to unforgettable memories</p>
            </Reveal>
            <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
              {[
                {
                  step: '01',
                  icon: '📋',
                  title: 'You host',
                  desc: 'Pick a style and share your names. We prepare guest-ready frames.',
                },
                {
                  step: '02',
                  icon: '📸',
                  title: 'Guests pose',
                  desc: 'They take photos during your event coverage.',
                },
                {
                  step: '03',
                  icon: '🎁',
                  title: 'They keep it',
                  desc: 'Each guest leaves with their photo in a personalized frame.',
                },
              ].map((item) => (
                <StaggerItem key={item.step} className="card p-7 md:p-8 text-center">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div className="text-accent text-sm font-semibold tracking-widest mb-2">
                    {item.step}
                  </div>
                  <h3 className="text-xl mb-2">{item.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {settings.showPackagesSection && (
        <section className="section bg-bg-secondary/50">
          <div className="container-wide">
            <Reveal className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl mb-3">Packages</h2>
              <p className="text-text-secondary max-w-xl mx-auto">
                Flexible packages for every celebration. Request a quote and we&apos;ll tailor
                everything to your event.
              </p>
            </Reveal>
            <PackageCards
              packages={packages}
              ctaHref={quoteHref}
              showFrameCounts={settings.showFrameCountOnHome}
              showPricing={settings.showPricing}
            />
          </div>
        </section>
      )}

      {settings.showEventOrganisersSection && (
        <EventOrganisersSection
          title={settings.eventOrganisersTitle}
          body={settings.eventOrganisersBody}
          contactHref="/contact"
          quoteHref={settings.showQuotePage ? '/quote?service=both' : '/contact'}
        />
      )}

      {settings.showLifestyleBanner && (
        <section className="section pt-0">
          <div className="container-wide">
            <Reveal direction="scale">
              <div className="relative overflow-hidden rounded-[var(--radius-xl)] min-h-[300px] md:min-h-[400px] flex items-end">
                <ProductImage
                  src="/brand/style-celebration-photo.png"
                  alt="Guest keepsake — With love — Mia"
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="relative z-10 p-6 md:p-10 text-white max-w-xl">
                  <h2 className="text-2xl md:text-4xl mb-3 text-white">
                    The souvenir your guests take home
                  </h2>
                  <p className="text-white/90 text-sm md:text-base mb-5">
                    Their photo. Your names. A frame they&apos;ll keep.
                  </p>
                  <Link href={quoteHref} className="btn-primary">
                    Build Your Quote
                    <Sparkles size={16} />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {settings.showBlogPreview && settings.showBlogPage && blogData.posts.length > 0 && (
        <section className="section">
          <div className="container-wide">
            <Reveal className="text-center mb-8 md:mb-10">
              <h2 className="text-3xl md:text-4xl mb-3">From the blog</h2>
              <p className="text-text-secondary">
                Planning tips and keepsake inspiration for your next celebration.
              </p>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-4">
              {blogData.posts.map((post, i) => (
                <Reveal key={String(post.id)} delay={i * 0.06}>
                  <BlogCardCompact post={post} />
                </Reveal>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/blog" className="btn-secondary">
                Read All Articles
              </Link>
            </div>
          </div>
        </section>
      )}

      {settings.showGalleryPreview && (
        <section className="section bg-bg-secondary/40">
          <div className="container-wide">
            <Reveal className="text-center mb-8 md:mb-10">
              <h2 className="text-3xl md:text-4xl mb-3">Gallery</h2>
              <p className="text-text-secondary">Guest keepsakes from real celebrations.</p>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
              {previewImages.map((item, i) => (
                <Reveal
                  key={String(item.id)}
                  delay={i * 0.05}
                  className="relative aspect-square rounded-[var(--radius-md)] overflow-hidden"
                >
                <ProductImage
                  src={item.imageUrl || brandImages.romance.src}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                </Reveal>
              ))}
            </div>
            {settings.showGalleryPage && (
              <div className="text-center mt-8 md:mt-10">
                <Link href="/gallery" className="btn-secondary">
                  View Full Gallery
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {settings.showTestimonials && settings.testimonials.length > 0 && (
        <section className="section">
          <div className="container-wide">
            <Reveal className="text-center mb-10 md:mb-12">
              <h2 className="text-3xl md:text-4xl">Kind Words</h2>
            </Reveal>
            <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {settings.testimonials.map((t) => (
                <StaggerItem key={t.author} className="card p-7 md:p-8">
                  <p className="text-text-secondary leading-relaxed mb-6 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <p className="font-medium text-sm">— {t.author}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {settings.showFinalCta && (
        <section className="section pt-0">
          <div className="container-wide">
            <Reveal className="card p-8 md:p-14 text-center relative overflow-hidden">
              <div className="absolute inset-0 motif-overlay opacity-30" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl mb-4">
                  Try the design studio — it&apos;s free
                </h2>
                <p className="text-text-secondary mb-3 max-w-xl mx-auto">
                  Preview colours, captions, and ornaments before you book. Save your draft and
                  continue to a quote when you&apos;re ready.
                </p>
                <p className="text-sm font-medium text-accent-hover mb-8">
                  3 hours of coverage · Essential: 3 months online · Premium: up to 1 year
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {settings.showDesignPage ? (
                    <Link href="/design" className="btn-primary">
                      {brand.ctaDesign}
                      <Sparkles size={16} />
                    </Link>
                  ) : null}
                  <Link href={quoteHref} className={settings.showDesignPage ? 'btn-secondary' : 'btn-primary'}>
                    Get a Quote
                    <Sparkles size={16} />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </div>
  )
}
