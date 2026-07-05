import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const isCloudflareDeploy = process.env.DEPLOY_TARGET === 'cloudflare'
const emptyOgShim = path.resolve(dirname, 'src/shims/empty-og.ts')

const NEXT_PUBLIC_SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const cloudflareExternalPackages = [
  'jose',
  'pg-cloudflare',
  '@payloadcms/db-d1-sqlite',
  '@payloadcms/drizzle/sqlite',
  '@libsql/isomorphic-ws',
  '@libsql/client',
  'drizzle-kit',
  '@payloadcms/drizzle',
  '@payloadcms/db-sqlite',
  'sharp',
] as string[]

const nextConfig: NextConfig = {
  ...(isCloudflareDeploy ? {} : { output: 'standalone' }),
  reactStrictMode: true,
  ...(isCloudflareDeploy
    ? {
        serverExternalPackages: cloudflareExternalPackages,
      }
    : {}),
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [256, 384, 512, 640, 750, 828],
    qualities: [75, 90, 95, 100],
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/brand/**',
      },
    ],
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)
        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', '') as 'http' | 'https',
        }
      }),
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    if (isCloudflareDeploy) {
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'next/dist/compiled/@vercel/og/index.node.js': emptyOgShim,
        'next/dist/compiled/@vercel/og/index.edge.js': emptyOgShim,
        'next/og': false,
      }
    }
    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
    ...(isCloudflareDeploy
      ? {
          resolveAlias: {
            'next/dist/compiled/@vercel/og/index.node.js': emptyOgShim,
            'next/dist/compiled/@vercel/og/index.edge.js': emptyOgShim,
          },
        }
      : {}),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
