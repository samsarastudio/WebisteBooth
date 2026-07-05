/** PM2 process file for Raspberry Pi (standalone output) */
module.exports = {
  apps: [
    {
      name: 'frameflix',
      script: '.next/standalone/server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
    },
  ],
}
