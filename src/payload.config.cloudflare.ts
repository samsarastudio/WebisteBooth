import type { Plugin } from 'payload'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'

import {
  cloudflareEnv,
  getCloudflareBindings,
  getOptionalR2Bucket,
} from './lib/cloudflare-context'
import { buildSharedPayloadConfig } from './payload.config.shared'
import { seedIfEmpty } from './seed'

const cloudflare = await getCloudflareBindings()
const cfEnv = cloudflareEnv(cloudflare)

const plugins: Plugin[] = []
if (process.env.ENABLE_R2 === 'true') {
  const r2Bucket = getOptionalR2Bucket(cfEnv)
  if (r2Bucket) {
    const { r2Storage } = await import('@payloadcms/storage-r2')
    plugins.push(
      r2Storage({
        bucket: r2Bucket as Parameters<typeof r2Storage>[0]['bucket'],
        collections: { media: true },
      }),
    )
  }
}

export default buildSharedPayloadConfig({
  db: sqliteD1Adapter({ binding: cfEnv.D1 }),
  plugins,
  onInit: async (payload) => seedIfEmpty(payload),
})
