import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { pushDevSchema } from '@payloadcms/drizzle'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { r2Storage } from '@payloadcms/storage-r2'
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
import { getCloudflareBindings, cloudflareEnv, getOptionalR2Bucket, isCloudflareDeploy } from './lib/cloudflare-context'
import { seedIfEmpty } from './seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.PAYLOAD_PUBLIC_SERVER_URL ||
  'http://localhost:3000'

const cloudflare = isCloudflareDeploy ? await getCloudflareBindings() : null
const cfEnv = cloudflare ? cloudflareEnv(cloudflare) : null
const r2Bucket =
  isCloudflareDeploy && process.env.ENABLE_R2 === 'true' && cfEnv
    ? getOptionalR2Bucket(cfEnv)
    : undefined

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
  db: isCloudflareDeploy
    ? sqliteD1Adapter({ binding: cfEnv!.D1 })
    : sqliteAdapter({
        client: {
          url: process.env.DATABASE_URI || 'file:./data/frameflix.db',
        },
        push: true,
      }),
  plugins: r2Bucket
    ? [
        r2Storage({
          bucket: r2Bucket as Parameters<typeof r2Storage>[0]['bucket'],
          collections: { media: true },
        }),
      ]
    : [],
  sharp: isCloudflareDeploy ? undefined : sharp,
  serverURL,
  cors: [serverURL].filter(Boolean),
  csrf: [serverURL].filter(Boolean),
  onInit: async (payload) => {
    if (!isCloudflareDeploy && process.env.NODE_ENV === 'production') {
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
