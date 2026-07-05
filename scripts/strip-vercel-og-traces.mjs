/**
 * Remove @vercel/og from Next.js NFT traces so OpenNext does not copy resvg.wasm
 * and font binaries into the Cloudflare Worker bundle (~1.5 MiB saved).
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import { join } from 'path'

const root = process.cwd()
const serverDir = join(root, '.next', 'server')

const OG_PATTERN = /@vercel[/\\]og/

function walk(dir, files = []) {
  if (!existsSync(dir)) return files
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, files)
    else if (entry.endsWith('.nft.json')) files.push(full)
  }
  return files
}

let changed = 0
for (const nftPath of walk(serverDir)) {
  const raw = readFileSync(nftPath, 'utf8')
  const json = JSON.parse(raw)
  const files = json.files
  if (!Array.isArray(files)) continue

  const filtered = files.filter((file) => !OG_PATTERN.test(String(file)))
  if (filtered.length === files.length) continue

  json.files = filtered
  writeFileSync(nftPath, JSON.stringify(json))
  changed += 1
}

console.log(
  changed > 0
    ? `Stripped @vercel/og from ${changed} NFT trace file(s)`
    : 'No @vercel/og entries found in NFT traces (already clean or .next missing)',
)
