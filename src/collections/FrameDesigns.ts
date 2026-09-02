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
    {
      name: 'printModelStatus',
      type: 'select',
      defaultValue: 'idle',
      options: [
        { label: 'Idle', value: 'idle' },
        { label: 'Queued', value: 'queued' },
        { label: 'Running', value: 'running' },
        { label: 'Ready', value: 'ready' },
        { label: 'Error', value: 'error' },
      ],
      admin: {
        description: 'Owner Print 3D (Comfy Cloud) job status.',
        position: 'sidebar',
      },
    },
    {
      name: 'printComfyPromptId',
      type: 'text',
      admin: {
        description: 'Comfy Cloud prompt / job id.',
        readOnly: true,
      },
    },
    {
      name: 'printModelError',
      type: 'textarea',
      admin: {
        description: 'Last print generation error message.',
        readOnly: true,
      },
    },
    {
      name: 'printGlbPath',
      type: 'text',
      admin: {
        description: 'Relative path under media/ (e.g. print-models/token.glb).',
        readOnly: true,
      },
    },
    {
      name: 'printStlPath',
      type: 'text',
      admin: {
        description: 'Relative path under media/ (e.g. print-models/token.stl).',
        readOnly: true,
      },
    },
    {
      name: 'printGeneratedAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        readOnly: true,
      },
    },
    {
      name: 'printMode',
      type: 'select',
      options: [
        { label: 'Modular layflat', value: 'modular' },
        { label: 'Tripo preview', value: 'tripo' },
      ],
      admin: {
        description: 'modular = production parts; tripo = optional AI preview only.',
        position: 'sidebar',
      },
    },
    {
      name: 'printFrontStlPath',
      type: 'text',
      admin: { readOnly: true, description: 'media/print-models/…-front.stl' },
    },
    {
      name: 'printBackStlPath',
      type: 'text',
      admin: { readOnly: true, description: 'media/print-models/…-back.stl (size-common magnet+QR)' },
    },
    {
      name: 'printSpacerStlPath',
      type: 'text',
      admin: { readOnly: true, description: 'media/print-models/…-spacer.stl' },
    },
    {
      name: 'printManifestPath',
      type: 'text',
      admin: { readOnly: true, description: 'Assembly + boolean-op manifest JSON' },
    },
  ],
}
