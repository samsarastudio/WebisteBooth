import fs from 'fs'
import path from 'path'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import type { GetPlatformProxyOptions } from 'wrangler'

const realpath = (value: string) => (fs.existsSync(value) ? fs.realpathSync(value) : undefined)

export const isCloudflareDeploy = process.env.DEPLOY_TARGET === 'cloudflare'

export const isPayloadCLI = process.argv.some((value) =>
  realpath(value)?.endsWith(path.join('payload', 'bin.js')),
)

export type CloudflareBindings = CloudflareEnv & { D1: D1Database }

/** R2 binding when ENABLE_R2=true — not part of the base CloudflareEnv type. */
export function getOptionalR2Bucket(env: CloudflareBindings): unknown {
  return (env as unknown as Record<string, unknown>).R2
}

export async function getCloudflareBindings(): Promise<{
  env: CloudflareBindings
}> {
  const isProduction = process.env.NODE_ENV === 'production'

  if (isPayloadCLI || !isProduction) {
    const { getPlatformProxy } = await import(/* webpackIgnore: true */ 'wrangler')
    const proxy = await getPlatformProxy({
      environment: process.env.CLOUDFLARE_ENV,
      remoteBindings: isProduction,
    } satisfies GetPlatformProxyOptions)
    return { env: proxy.env as unknown as CloudflareBindings }
  }

  const ctx = await getCloudflareContext({ async: true })
  return { env: ctx.env as unknown as CloudflareBindings }
}

export function cloudflareEnv(
  cloudflare: { env: CloudflareBindings } | null,
): CloudflareBindings {
  if (!cloudflare) {
    throw new Error('Cloudflare bindings are unavailable')
  }
  return cloudflare.env
}
