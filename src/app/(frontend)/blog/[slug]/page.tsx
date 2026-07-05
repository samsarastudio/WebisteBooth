import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Sparkles, Tag, User } from 'lucide-react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { PostRichText } from '@/components/marketing/PostRichText'
import { Reveal } from '@/components/marketing/Reveal'
import { brand } from '@/lib/brand'
import { guardPage } from '@/lib/page-guard'
import { getPostBySlug, getPublishedPosts } from '@/lib/payload'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const { posts } = await getPublishedPosts({ limit: 100 })
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Post Not Found' }

  return {
    title: post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt || undefined,
      images: post.featuredImageUrl ? [{ url: post.featuredImageUrl }] : undefined,
    },
  }
}

const categoryLabels: Record<string, string> = {
  tips: 'Tips & Guides',
  events: 'Weddings & Events',
  studio: 'Behind the Scenes',
  trends: 'Industry Trends',
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPostPage({ params }: Props) {
  await guardPage('blog')
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const date = formatDate(post.publishedAt)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    datePublished: post.publishedAt,
    author: { '@type': 'Organization', name: post.author || brand.fullName },
    publisher: {
      '@type': 'Organization',
      name: brand.fullName,
      logo: { '@type': 'ImageObject', url: `${brand.siteUrl}/brand/logo.png` },
    },
    mainEntityOfPage: `${brand.siteUrl}/blog/${post.slug}`,
    image: post.featuredImageUrl || `${brand.siteUrl}/brand/style-romance-photo.png`,
  }

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="section pb-6">
        <div className="container-wide max-w-3xl">
          <Reveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent mb-8 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>

            <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary mb-4">
              <span className="px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                {categoryLabels[post.category] || post.category}
              </span>
              {date && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} />
                  {date}
                </span>
              )}
              {post.author && (
                <span className="inline-flex items-center gap-1.5">
                  <User size={14} />
                  {post.author}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl mb-5 leading-tight">{post.title}</h1>
            <p className="text-lg text-text-secondary leading-relaxed">{post.excerpt}</p>
          </Reveal>
        </div>
      </section>

      {post.featuredImageUrl && (
        <section className="pb-10">
          <div className="container-wide max-w-4xl">
            <Reveal>
              <div className="relative aspect-[21/9] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-lg)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.featuredImageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <section className="pb-12">
        <div className="container-wide max-w-3xl">
          <Reveal>
            <PostRichText data={post.content as SerializedEditorState} />
          </Reveal>

          {post.tags.length > 0 && (
            <Reveal className="mt-10 pt-8 border-t border-border flex flex-wrap items-center gap-2">
              <Tag size={16} className="text-text-secondary mr-1" />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-bg-secondary text-sm text-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </Reveal>
          )}
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-wide max-w-3xl">
          <Reveal className="card p-8 md:p-10 text-center">
            <h2 className="text-2xl mb-3">Want this at your event?</h2>
            <p className="text-text-secondary mb-6">
              Custom frames, sticker studio, or both — we will send a proposal within 24 hours.
            </p>
            <Link href="/quote" className="btn-primary">
              Get a Quote
              <Sparkles size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </article>
  )
}
