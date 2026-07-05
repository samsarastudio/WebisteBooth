import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'eventType', 'eventDate', 'estimatedTotal', 'status', 'createdAt'],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'serviceType',
      type: 'select',
      defaultValue: 'frames',
      options: [
        { label: 'Custom Frames', value: 'frames' },
        { label: 'Sticker Studio', value: 'stickers' },
        { label: 'Both', value: 'both' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'eventType',
      type: 'text',
      required: true,
    },
    {
      name: 'eventDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'guestCount',
      type: 'text',
    },
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'package',
      type: 'relationship',
      relationTo: 'packages',
    },
    {
      name: 'packageName',
      type: 'text',
      admin: {
        description: 'Snapshot of package name at submit time',
      },
    },
    {
      name: 'frameStyle',
      type: 'relationship',
      relationTo: 'frame-styles',
    },
    {
      name: 'frameStyleName',
      type: 'text',
      admin: {
        description: 'Snapshot of frame style at submit time',
      },
    },
    {
      name: 'frameStyleColors',
      type: 'text',
      admin: {
        description: 'Frame color list snapshot',
      },
    },
    {
      name: 'frameFormat',
      type: 'select',
      options: [
        { label: 'Polaroid style', value: 'polaroid' },
        { label: '4×6 frame', value: '4x6' },
      ],
      admin: {
        description: 'Polaroid (classic) or 4×6 (premium size)',
      },
    },
    {
      name: 'frameFormatLabel',
      type: 'text',
      admin: {
        description: 'Snapshot label for emails',
      },
    },
    {
      name: 'packagePrice',
      type: 'number',
      admin: {
        description: 'Package base price in cents at submit time',
      },
    },
    {
      name: 'selectedAddOns',
      type: 'array',
      fields: [
        {
          name: 'addonId',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
        {
          name: 'pricingUnit',
          type: 'text',
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          defaultValue: 1,
          min: 1,
        },
        {
          name: 'lineTotal',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'estimatedTotal',
      type: 'number',
      required: true,
      admin: {
        description: 'Total estimate in cents',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Booked', value: 'booked' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'inquiryId',
      type: 'text',
      unique: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
}
