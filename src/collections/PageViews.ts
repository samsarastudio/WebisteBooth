import type { CollectionConfig } from 'payload'

export const PageViews: CollectionConfig = {
  slug: 'page-views',
  admin: {
    useAsTitle: 'path',
    defaultColumns: ['path', 'referrer', 'sessionId', 'createdAt'],
    description: 'First-party page view analytics (anonymous, no PII).',
    group: 'Analytics',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'path',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'referrer',
      type: 'text',
      admin: {
        description: 'External referrer when available (truncated).',
      },
    },
    {
      name: 'sessionId',
      type: 'text',
      index: true,
      admin: {
        description: 'Anonymous session identifier from the browser.',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        description: 'Truncated browser user agent.',
      },
    },
  ],
}
