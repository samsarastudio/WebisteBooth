import path from 'path'

/**
 * Resolve SQLite URL to an absolute file path.
 * Standalone Next.js can change cwd; FRAMEFLIX_ROOT is set by start-production.mjs / PM2.
 */
export function resolveDatabaseUri(): string {
  const root = process.env.FRAMEFLIX_ROOT || process.cwd()
  const raw = process.env.DATABASE_URI || 'file:./data/frameflix.db'

  if (!raw.startsWith('file:')) {
    return raw
  }

  let filePath = raw.slice('file:'.length)
  // Normalise file:///absolute/path
  if (filePath.startsWith('//')) {
    filePath = filePath.slice(1)
  }

  if (!path.isAbsolute(filePath)) {
    filePath = path.resolve(root, filePath)
  }

  return `file:${filePath}`
}

export function resolveProjectRoot(): string {
  return process.env.FRAMEFLIX_ROOT || process.cwd()
}
