import type { CollectionConfig } from 'payload'

export const AddOns: CollectionConfig = {
  slug: 'addons',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'pricingUnit', 'active', 'sortOrder'],
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
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Price in cents per unit',
      },
    },
    {
      name: 'pricingUnit',
      type: 'select',
      required: true,
      defaultValue: 'fixed',
      options: [
        { label: 'Fixed', value: 'fixed' },
        { label: 'Per frame', value: 'per_frame' },
        { label: 'Per 20-pack', value: 'per_pack' },
        { label: 'Per hour', value: 'per_hour' },
        { label: 'Per km', value: 'per_km' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
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
