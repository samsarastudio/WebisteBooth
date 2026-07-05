import type { Config, Plugin, SanitizedConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Packages } from './collections/Packages'
import { AddOns } from './collections/AddOns'
import { Leads } from './collections/Leads'
import { Gallery } from './collections/Gallery'
import { FAQs } from './collections/FAQs'
import { Posts } from './collections/Posts'
import { FrameStyles } from './collections/FrameStyles'
import { SiteSettings } from './globals/SiteSettings'
import { seedIfEmpty } from './seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const payloadServerURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.PAYLOAD_PUBLIC_SERVER_URL ||
  'http://localhost:3000'

type SharedPayloadOptions = {
  db: Config['db']
  plugins?: Plugin[]
  sharp?: Config['sharp']
  onInit?: Config['onInit']
}

export function buildSharedPayloadConfig({
  db,
  plugins = [],
  sharp,
  onInit,
}: SharedPayloadOptions): Promise<SanitizedConfig> {
  return buildConfig({
    graphQL: {
      disable: true,
    },
    admin: {
      user: Users.slug,
      importMap: {
        baseDir: path.resolve(dirname),
      },
      meta: {
        titleSuffix: '— FrameFlix Admin',
      },
    },
    collections: [Users, Media, Packages, AddOns, FrameStyles, Leads, Gallery, FAQs, Posts],
    globals: [SiteSettings],
    editor: lexicalEditor(),
    secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
    typescript: {
      outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    db,
    plugins,
    sharp,
    serverURL: payloadServerURL,
    cors: [payloadServerURL].filter(Boolean),
    csrf: [payloadServerURL].filter(Boolean),
    onInit: onInit ?? (async (payload) => seedIfEmpty(payload)),
  })
}
