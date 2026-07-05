import type { CollectionConfig } from 'payload'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    useAsTitle: 'caption',
    defaultColumns: ['caption', 'eventType', 'featured', 'sortOrder'],
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
