/** Cloudflare Worker bindings — D1 required; R2 optional (paid add-on) */
interface CloudflareEnv {
  D1: D1Database
  R2?: R2Bucket
  ASSETS: Fetcher
}

export {}
