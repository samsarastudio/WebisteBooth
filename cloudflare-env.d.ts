/** Cloudflare Worker bindings — matches wrangler.jsonc */
interface CloudflareEnv {
  D1: D1Database
  R2: R2Bucket
  ASSETS: Fetcher
}

export {}
