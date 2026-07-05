/**
 * OpenNext's @next/env shim only exports `loadEnvConfig` as a named export.
 * Payload's bin/loadEnv.js uses `import nextEnvImport from '@next/env'`, which
 * esbuild rejects during the Cloudflare Worker bundle step.
 */
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const shimPaths = [
  join(root, 'node_modules/@opennextjs/cloudflare/dist/cli/templates/shims/env.js'),
  join(root, '.open-next/cloudflare-templates/shims/env.js'),
]

const patchedContent = `export function loadEnvConfig() { }
export default { loadEnvConfig };
`

for (const shimPath of shimPaths) {
  if (!existsSync(shimPath)) continue

  const content = readFileSync(shimPath, 'utf8')
  if (content.includes('export default')) {
    console.log(`OpenNext env shim already patched: ${shimPath}`)
    continue
  }

  writeFileSync(shimPath, patchedContent)
  console.log(`Patched OpenNext env shim: ${shimPath}`)
}
