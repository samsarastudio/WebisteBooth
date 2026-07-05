import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import type { Post } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload'
import {
  parseSimpleMarkdownToLexical,
  slugifyTitle,
} from '@/lib/lexical-content'
import { rateLimit } from '@/lib/rate-limit'

export type BotPostInput = {
  title: string
  slug?: string
  excerpt?: string
  /** Plain markdown-ish text (## headings, - lists, blank lines). */
  content?: string
  /** Pre-built Lexical JSON — used when content is omitted. */
  contentLexical?: SerializedEditorState
  status?: 'draft' | 'published'
  publishedAt?: string
  category?: 'tips' | 'events' | 'studio' | 'trends'
  tags?: string[]
  author?: string
  metaDescription?: string
}

export type BotPostResult =
  | { ok: true; id: string | number; slug: string; action: 'created' | 'updated' }
  | { ok: false; error: string; status: number }

function excerptFromContent(content: string, max = 160): string {
  const plain = content
    .replace(/^#{1,3}\s+/gm, '')
    .replace(/^-\s+/gm, '')
    .replace(/\n+/g, ' ')
    .trim()
  if (plain.length <= max) return plain
  return `${plain.slice(0, max - 1).trim()}…`
}

function verifyBotAuth(authHeader: string | null): boolean {
  const key = process.env.OPENCLAW_API_KEY
  if (!key) return false
  if (!authHeader?.startsWith('Bearer ')) return false
  return authHeader.slice(7) === key
}

export async function submitPostFromBot(
  body: BotPostInput,
  options: { authHeader: string | null; ip: string },
): Promise<BotPostResult> {
  if (!process.env.OPENCLAW_API_KEY) {
    return { ok: false, error: 'Bot API is not configured.', status: 503 }
  }

  if (!verifyBotAuth(options.authHeader)) {
    return { ok: false, error: 'Unauthorized.', status: 401 }
  }

  const limited = rateLimit(`bot-post:${options.ip}`, 10, 60_000)
  if (!limited.ok) {
    return { ok: false, error: 'Rate limit exceeded. Try again in a minute.', status: 429 }
  }

  const title = body.title?.trim()
  if (!title) {
    return { ok: false, error: 'title is required.', status: 400 }
  }

  const slug = (body.slug?.trim() || slugifyTitle(title)).replace(/^\/+|\/+$/g, '')
  if (!slug) {
    return { ok: false, error: 'Could not derive a valid slug.', status: 400 }
  }

  let contentLexical: SerializedEditorState
  if (body.contentLexical?.root) {
    contentLexical = body.contentLexical
  } else if (body.content?.trim()) {
    contentLexical = parseSimpleMarkdownToLexical(body.content)
  } else {
    return { ok: false, error: 'content or contentLexical is required.', status: 400 }
  }

  const status: 'draft' | 'published' = body.status === 'draft' ? 'draft' : 'published'
  const publishedAt =
    body.publishedAt?.trim() ||
    (status === 'published' ? new Date().toISOString() : undefined)

  const excerpt =
    body.excerpt?.trim() ||
    excerptFromContent(body.content || title)

  const category = body.category || 'tips'
  const validCategories = ['tips', 'events', 'studio', 'trends']
  if (!validCategories.includes(category)) {
    return { ok: false, error: 'Invalid category.', status: 400 }
  }

  const postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'> = {
    title,
    slug,
    excerpt,
    content: contentLexical as Post['content'],
    status,
    publishedAt,
    category,
    tags: (body.tags || []).map((tag) => ({ tag: tag.trim() })).filter((t) => t.tag),
    author: body.author?.trim() || 'FrameFlix Team',
    metaDescription: body.metaDescription?.trim() || excerpt.slice(0, 160),
    source: 'openclaw',
  }

  try {
    const payload = await getPayloadClient()

    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })

    if (existing.totalDocs > 0) {
      const id = existing.docs[0].id
      await payload.update({
        collection: 'posts',
        id,
        data: postData,
      })
      return { ok: true, id, slug, action: 'updated' }
    }

    const created = await payload.create({
      collection: 'posts',
      data: postData,
    })
    return { ok: true, id: created.id, slug, action: 'created' }
  } catch (err) {
    console.error('OpenClaw post submit failed:', err)
    return { ok: false, error: 'Failed to save post.', status: 500 }
  }
}
