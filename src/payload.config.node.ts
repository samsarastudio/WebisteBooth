import { pushDevSchema } from '@payloadcms/drizzle'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import sharp from 'sharp'

import { buildSharedPayloadConfig } from './payload.config.shared'
import { seedIfEmpty } from './seed'

export default buildSharedPayloadConfig({
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./data/frameflix.db',
    },
    push: true,
  }),
  sharp,
  onInit: async (payload) => {
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
