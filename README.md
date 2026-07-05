# FrameFlix by inmoment

Lead-generating marketing site for **FrameFlix by inmoment** — custom photobooth frames, sticker studio, and quote builder.

## Deploy

- **Production (recommended):** [Cloudflare Workers + GitHub](CLOUDFLARE.md) → `frameflix.inmoment.com`
- **Alternative:** Raspberry Pi + ngrok → [DEPLOY.md](./DEPLOY.md)

## Features

- Premium marketing pages (Home, About, Packages, Stickers, Gallery, FAQ, Contact)
- Interactive **quote builder** with packages, add-ons, and lead capture
- **Payload CMS** admin at `/admin` for packages, add-ons, leads, gallery, FAQs, and site settings
- Cloudflare: D1 database + R2 media · Local/Pi: SQLite + filesystem
- Lead capture with honeypot + rate limiting; optional Resend email alerts

## Quick start (local)

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
| `npm run build:standalone` | Production build for Pi/VPS (standalone + asset copy) |
| `npm start` | Start on `0.0.0.0:3000` |
| `npm run generate:types` | Regenerate Payload types |
| `npm run generate:importmap` | Regenerate admin import map |

## Stack

- Next.js 16, React 19, Tailwind CSS 4
- Payload CMS 3 + SQLite
- Motion, Lucide, Resend

## Deploy

See [DEPLOY.md](./DEPLOY.md) for Raspberry Pi + PM2 + ngrok instructions.
