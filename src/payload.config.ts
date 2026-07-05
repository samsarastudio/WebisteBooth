import { isCloudflareDeploy } from './lib/cloudflare-context'

/** Route to Cloudflare or Node config so Workers bundles never import drizzle-kit / db-sqlite. */
export default (isCloudflareDeploy
  ? import('./payload.config.cloudflare')
  : import('./payload.config.node')
).then((module) => module.default)
