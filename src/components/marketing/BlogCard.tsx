import Link from 'next/link'
import { ArrowRight, Calendar, User } from 'lucide-react'

import type { BlogPostSummary } from '@/lib/payload'

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

export function BlogCard({ post }: { post: BlogPostSummary }) {
  const date = formatDate(post.publishedAt)

  return (
    <article className="card overflow-hidden flex flex-col h-full group">
      {post.featuredImageUrl ? (
        <div className="relative aspect-[16/9] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.featuredImageUrl}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-gradient-to-br from-accent/10 via-accent-light/40 to-bg-secondary flex items-center justify-center">
          <span className="text-4xl" aria-hidden>
            📸
          </span>
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary mb-3">
          <span className="px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
            {categoryLabels[post.category] || post.category}
          </span>
          {date && (
            <span className="inline-flex items-center gap-1">
              <Calendar size={12} />
              {date}
            </span>
          )}
        </div>
        <h2 className="text-xl mb-2 leading-snug group-hover:text-accent transition-colors">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 relative">
            {post.title}
          </Link>
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-4 flex-1">{post.excerpt}</p>
        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          {post.author && (
            <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary">
              <User size={12} />
              {post.author}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-sm font-medium text-accent group-hover:gap-2 transition-all">
            Read more
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </article>
  )
}

export function BlogCardCompact({ post }: { post: BlogPostSummary }) {
  const date = formatDate(post.publishedAt)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card p-5 flex flex-col gap-2 hover:border-accent/30 transition-colors group"
    >
      <span className="text-xs font-medium text-accent uppercase tracking-wide">
        {categoryLabels[post.category] || post.category}
      </span>
      <h3 className="text-lg leading-snug group-hover:text-accent transition-colors">
        {post.title}
      </h3>
      {date && <span className="text-xs text-text-secondary">{date}</span>}
    </Link>
  )
}
