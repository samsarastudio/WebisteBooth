# FrameFlix Studio

Lead-generating marketing site for FrameFlix Studio — custom 3D-printed photobooth frames with dye-sublimation prints.

## Features

- Premium marketing pages (Home, About, Packages, Gallery, FAQ, Contact)
- Interactive **quote builder** with packages, add-ons, and live estimate
- **Payload CMS** admin at `/admin` for packages, add-ons, leads, gallery, FAQs, and site settings
- SQLite database + local media (Raspberry Pi friendly)
- Lead capture with honeypot + rate limiting; optional Resend email alerts
- Designed for **Pi + ngrok** public access (see [DEPLOY.md](./DEPLOY.md))

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
| `npm run build` | Production build (standalone) |
| `npm start` | Start on `0.0.0.0:3000` |
| `npm run generate:types` | Regenerate Payload types |
| `npm run generate:importmap` | Regenerate admin import map |

## Stack

- Next.js 16, React 19, Tailwind CSS 4
- Payload CMS 3 + SQLite
- Motion, Lucide, Resend

## Deploy

See [DEPLOY.md](./DEPLOY.md) for Raspberry Pi + PM2 + ngrok instructions.
