import type { CollectionConfig } from 'payload'

export const FrameStyles: CollectionConfig = {
  slug: 'frame-styles',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'active', 'sortOrder'],
    description: 'Frame styles shown on the website (up to 5 active).',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'sampleMessage',
      type: 'text',
      required: true,
      admin: {
        description: 'Example personalized text shown on the sample frame',
      },
    },
    {
      name: 'imagePath',
      type: 'text',
      required: true,
      admin: {
        description: 'Public path e.g. /brand/style-romance.png',
      },
    },
    {
      name: 'plaColors',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
      labels: {
        singular: 'Color',
        plural: 'Colors (max 4)',
      },
      admin: {
        description: 'Customer-facing color names (do not include material jargon). Max 4.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g. Pastel Yellow',
          },
        },
        {
          name: 'hex',
          type: 'text',
          required: true,
          admin: {
            description: 'Approximate swatch hex, e.g. #E8D36A',
          },
        },
        {
          name: 'role',
          type: 'select',
          required: true,
          defaultValue: 'accent',
          options: [
            { label: 'Base', value: 'base' },
            { label: 'Accent', value: 'accent' },
            { label: 'Text', value: 'text' },
            { label: 'Detail', value: 'detail' },
          ],
        },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
