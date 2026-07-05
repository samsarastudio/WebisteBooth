/** PM2 process file for Raspberry Pi (standalone output) */
const fs = require('fs')
const path = require('path')

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return {}

  const env = {}
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const eq = trimmed.indexOf('=')
    if (eq === -1) continue

    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }
  return env
}

const dotenv = loadEnv(path.join(__dirname, '.env'))
const sharpPath = path.join(__dirname, '.next', 'standalone', 'node_modules', 'sharp')
const dbPath = path.join(__dirname, 'data', 'frameflix.db')

module.exports = {
  apps: [
    {
      name: 'frameflix',
      script: 'scripts/start-production.mjs',
      cwd: __dirname,
      interpreter: 'node',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '768M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
        FRAMEFLIX_ROOT: __dirname,
        ...(fs.existsSync(sharpPath) ? { NEXT_SHARP_PATH: sharpPath } : {}),
        ...dotenv,
        // Always use an absolute DB path in production so standalone cwd never breaks SQLite.
        DATABASE_URI: `file:${dbPath}`,
      },
    },
  ],
}
