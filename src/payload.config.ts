import { sqliteAdapter } from '@payloadcms/db-sqlite'
import path from 'path'
import { fileURLToPath } from 'url'

import { loadSharp } from './lib/sharp-loader'
import { buildSharedPayloadConfig } from './payload.config.shared'
import { seedIfEmpty } from './seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildSharedPayloadConfig({
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./data/frameflix.db',
    },
    // Dev: auto-push schema. Production: use `npm run migrate` (non-interactive).
    push: process.env.NODE_ENV !== 'production',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp: loadSharp(),
  onInit: async (payload) => {
    await seedIfEmpty(payload)
  },
})
