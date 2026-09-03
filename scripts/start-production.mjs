import { mkdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const dbPath = path.join(root, 'data', 'frameflix.db')
const databaseUri = `file:${dbPath}`

mkdirSync(path.join(root, 'data'), { recursive: true })
mkdirSync(path.join(root, 'media'), { recursive: true })

function publicSiteUrl() {
  const candidates = [process.env.PAYLOAD_PUBLIC_SERVER_URL, process.env.NEXT_PUBLIC_SERVER_URL]
  for (const raw of candidates) {
    const url = typeof raw === 'string' ? raw.trim().replace(/\/$/, '') : ''
    if (url && !/localhost|127\.0\.0\.1/i.test(url)) return url
  }
  return 'https://inmomentservices.com'
}

const siteUrl = publicSiteUrl()

const env = {
  ...process.env,
  NODE_ENV: 'production',
  NODE_OPTIONS: '--no-deprecation',
  HOSTNAME: process.env.HOSTNAME || '0.0.0.0',
  PORT: process.env.PORT || '3000',
  FRAMEFLIX_ROOT: root,
  DATABASE_URI: databaseUri,
  PAYLOAD_PUBLIC_SERVER_URL: siteUrl,
  NEXT_PUBLIC_SERVER_URL: siteUrl,
}

console.log('[start-production] Project root:', root)
console.log('[start-production] DATABASE_URI:', databaseUri)
console.log('[start-production] Public URL:', siteUrl)

console.log('[start-production] Running database migrations...')
const migrate = spawnSync('npm', ['run', 'migrate:prod'], {
  cwd: root,
  env,
  stdio: 'inherit',
  shell: true,
})

if (migrate.status !== 0) {
  console.warn(
    `[start-production] migrate exited with code ${migrate.status ?? 1} — starting server anyway`,
  )
}

console.log('[start-production] Starting standalone server...')
const server = spawnSync(process.execPath, [path.join(root, '.next/standalone/server.js')], {
  cwd: root,
  env,
  stdio: 'inherit',
})

process.exit(server.status ?? 1)
