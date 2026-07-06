import type { CollectionConfig } from 'payload'

export const FrameOrnaments: CollectionConfig = {
  slug: 'frame-ornaments',
  admin: {
    useAsTitle: 'name',
    group: 'Design Studio',
    defaultColumns: ['name', 'category', 'finish', 'kind', 'active'],
    description: 'Decorative assets for the frame configurator.',
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
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'geometric',
      options: [
        { label: 'Corner', value: 'corner' },
        { label: 'Floral', value: 'floral' },
        { label: 'Geometric', value: 'geometric' },
        { label: 'Seasonal', value: 'seasonal' },
      ],
    },
    {
      name: 'finish',
      type: 'select',
      required: true,
      defaultValue: 'raised3d',
      options: [
        { label: 'Raised 3D (single PLA color)', value: 'raised3d' },
        { label: 'Sticker (colorful PNG)', value: 'sticker' },
      ],
    },
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'image',
      options: [
        { label: 'Image asset', value: 'image' },
        { label: 'Built-in shape', value: 'shape' },
      ],
    },
    {
      name: 'assetPath',
      type: 'text',
      admin: {
        description: 'Public path for image ornaments e.g. /brand/motif-banner.png',
        condition: (_, siblingData) => siblingData?.kind === 'image',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.kind === 'image',
      },
    },
    {
      name: 'shapeType',
      type: 'select',
      options: [
        { label: 'Heart', value: 'heart' },
        { label: 'Star', value: 'star' },
        { label: 'Circle', value: 'circle' },
        { label: 'Diamond', value: 'diamond' },
        { label: 'Flourish', value: 'flourish' },
        { label: 'Arc', value: 'arc' },
        { label: 'Tulip', value: 'tulip' },
        { label: 'Dove & letter', value: 'bird-mail' },
        { label: 'Envelope', value: 'envelope' },
        { label: 'Vine scroll', value: 'vine-scroll' },
        { label: 'Corner vine', value: 'vine-corner' },
        { label: 'Floral cluster', value: 'floral-cluster' },
        { label: 'Rose bud', value: 'rose-bud' },
        { label: 'Leaf sprig', value: 'leaf-sprig' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.kind === 'shape',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text' }],
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
