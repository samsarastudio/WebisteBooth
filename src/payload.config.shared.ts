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
import { PageViews } from './collections/PageViews'
import { FrameStyles } from './collections/FrameStyles'
import { FrameTemplates } from './collections/FrameTemplates'
import { FrameOrnaments } from './collections/FrameOrnaments'
import { FrameDesigns } from './collections/FrameDesigns'
import { Designers } from './collections/Designers'
import { SiteSettings } from './globals/SiteSettings'
import { seedIfEmpty } from './seed'
import { PRODUCTION_SITE_ORIGINS, resolvePublicServerUrl } from './lib/public-url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const payloadServerURL = resolvePublicServerUrl()

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
        titleSuffix: ' | FrameFlix Admin',
      },
    },
    collections: [Users, Media, Packages, AddOns, FrameStyles, FrameTemplates, FrameOrnaments, FrameDesigns, Designers, Leads, Gallery, FAQs, Posts, PageViews],
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
    cors: [...new Set([payloadServerURL, ...PRODUCTION_SITE_ORIGINS])].filter(Boolean),
    csrf: [...new Set([payloadServerURL, ...PRODUCTION_SITE_ORIGINS])].filter(Boolean),
    onInit: onInit ?? (async (payload) => seedIfEmpty(payload)),
  })
}
