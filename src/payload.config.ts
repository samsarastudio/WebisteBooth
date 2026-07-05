import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { pushDevSchema } from '@payloadcms/drizzle'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Packages } from './collections/Packages'
import { AddOns } from './collections/AddOns'
import { Leads } from './collections/Leads'
import { Gallery } from './collections/Gallery'
import { FAQs } from './collections/FAQs'
import { FrameStyles } from './collections/FrameStyles'
import { SiteSettings } from './globals/SiteSettings'
import { seedIfEmpty } from './seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.PAYLOAD_PUBLIC_SERVER_URL ||
  'http://localhost:3000'

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— FrameFlix Admin',
    },
  },
  collections: [Users, Media, Packages, AddOns, FrameStyles, Leads, Gallery, FAQs],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./data/frameflix.db',
    },
    // Auto-create/update tables — ideal for single-node Pi deploys
    push: true,
  }),
  sharp,
  serverURL,
  cors: [serverURL].filter(Boolean),
  csrf: [serverURL].filter(Boolean),
  onInit: async (payload) => {
    // SQLite on a single Pi: push schema in production (Payload only auto-pushes in dev)
    if (process.env.NODE_ENV === 'production') {
      try {
        await pushDevSchema(payload.db as unknown as Parameters<typeof pushDevSchema>[0])
      } catch (err) {
        payload.logger.error(
          `Schema push failed: ${err instanceof Error ? err.message : String(err)}`,
        )
      }
    }
    await seedIfEmpty(payload)
  },
})
