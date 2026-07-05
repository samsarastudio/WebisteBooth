import type { CollectionConfig } from 'payload'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    useAsTitle: 'caption',
    defaultColumns: ['caption', 'eventType', 'featured', 'sortOrder'],
    hidden:
      process.env.DEPLOY_TARGET === 'cloudflare' && process.env.ENABLE_R2 !== 'true',
    description:
      process.env.DEPLOY_TARGET === 'cloudflare' && process.env.ENABLE_R2 !== 'true'
        ? 'Requires R2 storage (paid). The public gallery uses curated brand images until R2 is enabled.'
        : undefined,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'eventType',
      type: 'select',
      defaultValue: 'other',
      options: [
        { label: 'Wedding', value: 'wedding' },
        { label: 'Corporate', value: 'corporate' },
        { label: 'Birthday', value: 'birthday' },
        { label: 'Graduation', value: 'graduation' },
        { label: 'Anniversary', value: 'anniversary' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
