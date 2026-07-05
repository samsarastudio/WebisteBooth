import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

import { BlogCard } from '@/components/marketing/BlogCard'
import { Reveal } from '@/components/marketing/Reveal'
import { brand } from '@/lib/brand'
import { guardPage } from '@/lib/page-guard'
import { getPublishedPosts } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Blog',
  description: `Tips, guides, and ideas for weddings and events — from ${brand.fullName}.`,
}

export default async function BlogPage() {
  await guardPage('blog')
  const { posts } = await getPublishedPosts({ limit: 24 })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${brand.fullName} Blog`,
    url: `${brand.siteUrl}/blog`,
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `${brand.siteUrl}/blog/${post.slug}`,
      datePublished: post.publishedAt,
      author: { '@type': 'Organization', name: post.author || brand.fullName },
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
              Blog
            </span>
            <h1 className="text-4xl md:text-5xl mb-4">Ideas for unforgettable events</h1>
            <p className="text-text-secondary text-lg leading-relaxed">
              Planning tips, keepsake inspiration, and behind-the-scenes looks at how we craft
              guest souvenirs your people will actually keep.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-wide">
          {posts.length === 0 ? (
            <Reveal className="card p-10 text-center text-text-secondary">
              New articles coming soon. Check back or{' '}
              <Link href="/contact" className="text-accent hover:underline">
                get in touch
              </Link>{' '}
              for event planning help.
            </Reveal>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <Reveal key={String(post.id)} delay={i * 0.05} className="relative">
                  <BlogCard post={post} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-wide">
          <Reveal className="card p-10 text-center">
            <h2 className="text-2xl md:text-3xl mb-3">Ready to plan your event?</h2>
            <p className="text-text-secondary mb-6 max-w-lg mx-auto">
              Put these ideas into action — get a custom proposal for frames, stickers, or both.
            </p>
            <Link href="/quote" className="btn-primary">
              Get a Quote
              <Sparkles size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
