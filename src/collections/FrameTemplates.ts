import type { CollectionConfig } from 'payload'

export const FrameTemplates: CollectionConfig = {
  slug: 'frame-templates',
  admin: {
    useAsTitle: 'name',
    group: 'Design Studio',
    defaultColumns: ['name', 'format', 'active', 'sortOrder'],
    description: 'Canvas layouts for the frame configurator (photo slot, caption zone).',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
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
      name: 'format',
      type: 'select',
      required: true,
      defaultValue: '6x4',
      options: [
        { label: '6×4 landscape', value: '6x4' },
        { label: 'Original keepsake', value: 'original' },
      ],
    },
    {
      name: 'canvasWidth',
      type: 'number',
      required: true,
      defaultValue: 400,
    },
    {
      name: 'canvasHeight',
      type: 'number',
      required: true,
      defaultValue: 500,
    },
    {
      name: 'photoSlot',
      type: 'group',
      fields: [
        { name: 'x', type: 'number', required: true, defaultValue: 40 },
        { name: 'y', type: 'number', required: true, defaultValue: 40 },
        { name: 'width', type: 'number', required: true, defaultValue: 320 },
        { name: 'height', type: 'number', required: true, defaultValue: 320 },
      ],
    },
    {
      name: 'captionZone',
      type: 'group',
      admin: {
        description: 'Optional bottom caption text area.',
      },
      fields: [
        { name: 'x', type: 'number', defaultValue: 40 },
        { name: 'y', type: 'number', defaultValue: 380 },
        { name: 'width', type: 'number', defaultValue: 320 },
        { name: 'height', type: 'number', defaultValue: 80 },
      ],
    },
    {
      name: 'borderRadius',
      type: 'number',
      defaultValue: 8,
    },
    {
      name: 'borderImagePath',
      type: 'text',
      admin: {
        description: 'Optional PNG overlay path e.g. /brand/style-romance.png',
      },
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
