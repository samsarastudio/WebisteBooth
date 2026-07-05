import { cpSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const standalone = '.next/standalone'
if (!existsSync(standalone)) {
  console.log('No standalone output — skipping asset copy')
  process.exit(0)
}

cpSync('public', join(standalone, 'public'), { recursive: true })
mkdirSync(join(standalone, '.next'), { recursive: true })
cpSync(join('.next', 'static'), join(standalone, '.next', 'static'), { recursive: true })
console.log('Copied public/ and .next/static into standalone output')
