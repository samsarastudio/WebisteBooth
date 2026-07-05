# FrameFlix by inmoment

Lead-generating marketing site for **FrameFlix by inmoment** — custom photobooth frames, sticker studio, and quote builder.

## Deploy on Raspberry Pi

Production runs on a **Raspberry Pi** (or Linux VPS) with SQLite and local file storage.

**Full instructions:** [DEPLOY.md](./DEPLOY.md)

Quick summary:

```bash
git clone https://github.com/samsarastudio/WebisteBooth.git frameflix
cd frameflix
cp .env.example .env          # edit PAYLOAD_SECRET and public URLs
mkdir -p data media
npm ci
npm run build:standalone
pm2 start ecosystem.config.cjs
```

Live at **`https://inmomentservices.com`** via Raspberry Pi + Cloudflare Tunnel — see [DEPLOY.md](./DEPLOY.md).

## Features

- Premium marketing pages (Home, About, Packages, Stickers, Gallery, FAQ, Contact)
- Interactive **quote builder** with packages, add-ons, and lead capture
- **Payload CMS** admin at `/admin` for packages, add-ons, leads, gallery, FAQs, and site settings
- SQLite database + local media uploads on the Pi
- Lead capture with honeypot + rate limiting; optional Resend email alerts

## Quick start (local dev)

```bash
cp .env.example .env
npm install
mkdir -p data media
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin) (create first user on first visit)
- Quote builder: [http://localhost:3000/quote](http://localhost:3000/quote)

Default packages, add-ons, FAQs, and site settings seed automatically on first boot.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build:standalone` | Production build for Pi (standalone + asset copy) |
| `npm start` | Start standalone server on `0.0.0.0:3000` |
| `npm run generate:types` | Regenerate Payload types |
| `npm run generate:importmap` | Regenerate admin import map |

## Stack

- Next.js 16, React 19, Tailwind CSS 4
- Payload CMS 3 + SQLite
- Motion, Lucide, Resend, Sharp

## Deploy

See [DEPLOY.md](./DEPLOY.md) for Raspberry Pi setup, PM2, Caddy, backups, and updates.
