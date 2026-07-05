import { spawnSync } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'

const root = process.cwd()
const env = {
  ...process.env,
  NODE_OPTIONS: process.env.NODE_OPTIONS || '--no-deprecation',
  DEPLOY_TARGET: 'cloudflare',
}

function run(label, cmd, args) {
  console.log(`\n▶ ${label}`)
  const result = spawnSync(cmd, args, { cwd: root, env, stdio: 'inherit', shell: true })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

run('Patch OpenNext env shim', 'node', ['scripts/patch-opennext-env.mjs'])
run('Next.js build', 'npx', ['next', 'build'])
run('Strip @vercel/og NFT traces', 'node', ['scripts/strip-vercel-og-traces.mjs'])

const openNextBin = join(root, 'node_modules', '@opennextjs', 'cloudflare', 'dist', 'cli', 'index.js')
const openNextArgs = existsSync(openNextBin) ? [openNextBin, 'build', '--skipBuild'] : ['opennextjs-cloudflare', 'build', '--skipBuild']

run('OpenNext Cloudflare bundle', process.execPath, openNextArgs)
