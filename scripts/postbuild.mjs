import { cpSync, existsSync, mkdirSync, readdirSync } from 'fs'
import { dirname, join } from 'path'

const standalone = '.next/standalone'
if (!existsSync(standalone)) {
  console.log('No standalone output — skipping asset copy')
  process.exit(0)
}

cpSync('public', join(standalone, 'public'), { recursive: true })
mkdirSync(join(standalone, '.next'), { recursive: true })
cpSync(join('.next', 'static'), join(standalone, '.next', 'static'), { recursive: true })

/** Copy native modules that Next standalone tracing often omits (breaks sharp on Pi). */
function copyPackage(name, fromDir = 'node_modules', toDir = join(standalone, 'node_modules')) {
  const src = join(fromDir, name)
  if (!existsSync(src)) return false

  const dest = join(toDir, name)
  mkdirSync(dirname(dest), { recursive: true })
  cpSync(src, dest, { recursive: true })
  return true
}

function copyPayloadDeps() {
  const destModules = join(standalone, 'node_modules')
  const copied = []

  const payloadPackages = [
    '@payloadcms/db-sqlite',
    '@payloadcms/drizzle',
    '@payloadcms/richtext-lexical',
    '@payloadcms/ui',
  ]

  for (const pkg of payloadPackages) {
    const src = join('node_modules', pkg)
    const dest = join(destModules, pkg)
    if (!existsSync(src)) continue
    mkdirSync(dirname(dest), { recursive: true })
    cpSync(src, dest, { recursive: true })
    copied.push(pkg)
  }

  // libsql native bindings (SQLite on Pi / local dev)
  if (copyPackage('libsql', 'node_modules', destModules)) {
    copied.push('libsql')
  }

  const libsqlScope = join('node_modules', '@libsql')
  if (existsSync(libsqlScope)) {
    const destLibsql = join(destModules, '@libsql')
    mkdirSync(destLibsql, { recursive: true })
    for (const pkg of readdirSync(libsqlScope)) {
      cpSync(join(libsqlScope, pkg), join(destLibsql, pkg), { recursive: true })
      copied.push(`@libsql/${pkg}`)
    }
  }

  if (copied.length > 0) {
    console.log(`Copied Payload/SQLite deps into standalone: ${copied.join(', ')}`)
  }
}

function copySharpDeps() {
  const destModules = join(standalone, 'node_modules')
  const copied = []

  if (copyPackage('sharp', 'node_modules', destModules)) {
    copied.push('sharp')
  }

  const imgScope = join('node_modules', '@img')
  if (existsSync(imgScope)) {
    const destImg = join(destModules, '@img')
    mkdirSync(destImg, { recursive: true })

    for (const pkg of readdirSync(imgScope)) {
      if (!pkg.startsWith('sharp') && pkg !== 'colour') continue
      cpSync(join(imgScope, pkg), join(destImg, pkg), { recursive: true })
      copied.push(`@img/${pkg}`)
    }
  }

  for (const dep of ['detect-libc', 'semver']) {
    if (copyPackage(dep, 'node_modules', destModules)) {
      copied.push(dep)
    }
  }

  if (copied.length > 0) {
    console.log(`Copied into standalone: ${copied.join(', ')}`)
  } else {
    console.warn('Warning: sharp was not found in node_modules — image processing may fail in production')
  }
}

copyPayloadDeps()
copySharpDeps()
console.log('Copied public/, .next/static, and native deps into standalone output')
