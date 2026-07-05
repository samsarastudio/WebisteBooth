/** Stub for unused @vercel/og — keeps OG wasm/fonts out of the Worker bundle. */
export class ImageResponse extends Response {
  constructor() {
    super('ImageResponse is not available on Cloudflare Workers', { status: 501 })
  }
}

export default { ImageResponse }
