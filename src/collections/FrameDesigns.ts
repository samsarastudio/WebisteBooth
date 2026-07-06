import type { CollectionConfig } from 'payload'

export const FrameDesigns: CollectionConfig = {
  slug: 'frame-designs',
  admin: {
    useAsTitle: 'designToken',
    group: 'Design Studio',
    defaultColumns: ['designToken', 'designerEmail', 'status', 'lastSavedAt', 'createdAt'],
    description: 'Visitor frame designs saved from /design.',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'designToken',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'designerEmail',
      type: 'email',
      index: true,
      admin: {
        description: 'Visitor email from design studio sign-in.',
      },
    },
    {
      name: 'label',
      type: 'text',
      admin: {
        description: 'Friendly snapshot label for admin.',
      },
    },
    {
      name: 'lastSavedAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        readOnly: true,
      },
    },
    {
      name: 'state',
      type: 'json',
      required: true,
    },
    {
      name: 'previewImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'photoMedia',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Guest sample photo uploaded during design.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Submitted', value: 'submitted' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'lead',
      type: 'relationship',
      relationTo: 'leads',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
