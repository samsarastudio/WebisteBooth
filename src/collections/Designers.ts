import type { CollectionConfig } from 'payload'

export const Designers: CollectionConfig = {
  slug: 'designers',
  admin: {
    useAsTitle: 'email',
    group: 'Design Studio',
    defaultColumns: ['email', 'firstSeenAt', 'lastSeenAt'],
    description: 'Visitors who signed in to the frame design studio.',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'firstSeenAt',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        readOnly: true,
      },
    },
    {
      name: 'lastSeenAt',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        readOnly: true,
      },
    },
  ],
}
