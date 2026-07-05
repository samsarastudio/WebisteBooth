import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload:
    process.env.DEPLOY_TARGET === 'cloudflare'
      ? { mimeTypes: ['image/*'] }
      : { staticDir: 'media', mimeTypes: ['image/*'] },
}
