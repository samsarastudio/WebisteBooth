/// <reference types="@cloudflare/workers-types" />

/** Augment OpenNext's global CloudflareEnv with Payload D1 binding */
declare global {
  interface CloudflareEnv {
    D1: D1Database
  }
}

export {}
