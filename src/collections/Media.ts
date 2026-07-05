import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    hidden:
      process.env.DEPLOY_TARGET === 'cloudflare' && process.env.ENABLE_R2 !== 'true',
    description:
      process.env.DEPLOY_TARGET === 'cloudflare' && process.env.ENABLE_R2 !== 'true'
        ? 'Requires R2 storage (paid). Marketing images live in /public/brand until R2 is enabled.'
        : undefined,
  },
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
