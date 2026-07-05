import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const NEXT_PUBLIC_SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  outputFileTracingIncludes: {
    '/**/*': [
      './node_modules/@payloadcms/richtext-lexical/**/*',
      './node_modules/@payloadcms/ui/**/*',
      './node_modules/@payloadcms/db-sqlite/**/*',
      './node_modules/@payloadcms/drizzle/**/*',
    ],
  },
  async redirects() {
    return [{ source: '/favicon.ico', destination: '/icon', permanent: false }]
  },
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
    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
