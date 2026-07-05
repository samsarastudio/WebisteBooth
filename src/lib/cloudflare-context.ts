import fs from 'fs'
import path from 'path'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import type { GetPlatformProxyOptions } from 'wrangler'

const realpath = (value: string) => (fs.existsSync(value) ? fs.realpathSync(value) : undefined)

export const isCloudflareDeploy = process.env.DEPLOY_TARGET === 'cloudflare'

export const isPayloadCLI = process.argv.some((value) =>
  realpath(value)?.endsWith(path.join('payload', 'bin.js')),
)

export async function getCloudflareBindings() {
  const isProduction = process.env.NODE_ENV === 'production'

  if (isPayloadCLI || !isProduction) {
    const { getPlatformProxy } = await import(/* webpackIgnore: true */ 'wrangler')
    const proxy = await getPlatformProxy({
      environment: process.env.CLOUDFLARE_ENV,
      remoteBindings: isProduction,
    } satisfies GetPlatformProxyOptions)
    return proxy
  }

  return getCloudflareContext({ async: true })
}
