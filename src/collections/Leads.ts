import type { CollectionConfig } from 'payload'

import { leadResponseAfterChange } from './hooks/lead-response'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    group: 'Inquiries',
    description: 'All quote and contact requests. Filter Status = New for your inbox.',
    defaultColumns: [
      'inquiryId',
      'intent',
      'name',
      'eventType',
      'eventDate',
      'status',
      'createdAt',
    ],
  },
  defaultSort: '-createdAt',
  hooks: {
    afterChange: [leadResponseAfterChange],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'intent',
      type: 'select',
      defaultValue: 'contact',
      options: [
        { label: 'Quote request', value: 'quote' },
        { label: 'Contact message', value: 'contact' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
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
      required: false,
      admin: {
        description: 'Optional — we follow up by email for quote requests.',
      },
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
      name: 'eventCity',
      type: 'text',
      admin: {
        description: 'City where the event will take place',
      },
    },
    {
      name: 'postalCode',
      type: 'text',
      admin: {
        description: 'Postal code for travel and logistics',
      },
    },
    {
      name: 'packageRecommendationRequested',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Customer asked us to recommend a package',
      },
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
        { label: '6×4 landscape frame', value: '6x4' },
        { label: 'Original keepsake frame', value: 'original' },
      ],
      defaultValue: '6x4',
      admin: {
        description: 'Keepsake frame size at time of order',
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
      type: 'collapsible',
      label: 'Frame design',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'frameDesign',
          type: 'relationship',
          relationTo: 'frame-designs',
          admin: {
            description: 'Linked design from /design configurator.',
          },
        },
        {
          name: 'frameConfig',
          type: 'json',
          admin: {
            description: 'Snapshot of configurator state at submit time.',
          },
        },
        {
          name: 'designPreview',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Preview PNG from the configurator.',
          },
        },
      ],
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
      type: 'collapsible',
      label: 'Send reply',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'responseMessage',
          type: 'textarea',
          admin: {
            description: 'Write your reply to the customer. Check “Send response” and save to email them.',
          },
        },
        {
          name: 'sendResponse',
          type: 'checkbox',
          defaultValue: false,
          label: 'Send response email on save',
        },
        {
          name: 'lastRespondedAt',
          type: 'date',
          admin: {
            readOnly: true,
            date: { pickerAppearance: 'dayAndTime' },
          },
        },
        {
          name: 'lastResponsePreview',
          type: 'textarea',
          admin: {
            readOnly: true,
            description: 'Last message sent to the customer.',
          },
        },
      ],
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
        description: 'Internal notes (not emailed to the customer).',
      },
    },
    {
      name: 'privacyConsentAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
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
