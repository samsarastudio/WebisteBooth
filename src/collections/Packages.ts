import type { CollectionConfig } from 'payload'

export const Packages: CollectionConfig = {
  slug: 'packages',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'basePrice', 'popular', 'active', 'sortOrder'],
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
      admin: {
        description: 'URL-safe id, e.g. premium',
      },
    },
    {
      name: 'basePrice',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Internal only (cents). Never shown on the public site.',
      },
    },
    {
      name: 'priceRange',
      type: 'text',
      defaultValue: 'Custom quote',
      admin: {
        description: 'Public range only, e.g. $495–$695 or Custom quote',
      },
    },
    {
      name: 'frameSummary',
      type: 'text',
      defaultValue: '60 guest frames',
      admin: {
        description: 'Short frame line for cards, e.g. 120 guest frames',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'icon',
      type: 'text',
      defaultValue: '✨',
      admin: {
        description: 'Emoji shown on package cards',
      },
    },
    {
      name: 'features',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'notIncluded',
      type: 'array',
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'popular',
      type: 'checkbox',
      defaultValue: false,
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
