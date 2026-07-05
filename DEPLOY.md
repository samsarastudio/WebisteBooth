# Deploy FrameFlix by inmoment

**Recommended:** [Cloudflare Workers + GitHub](CLOUDFLARE.md) — `frameflix.inmoment.com`

**Alternative:** Raspberry Pi + ngrok (see below)

FrameFlix runs as a subdomain of the inmoment main site (e.g. `https://frameflix.inmoment.com`). See **CLOUDFLARE.md** for GitHub → Cloudflare Workers setup (D1, R2, custom domain).

---

# Deploy on Raspberry Pi + ngrok (alternative)

## Requirements

- Node.js **20 LTS** or newer
- **4GB+ RAM** recommended for `npm run build` (Pi 4/5 or VPS)
- Internet access (outbound HTTPS for Resend email)
- For Pi + public URL without DNS: [ngrok](https://ngrok.com/) account + authtoken
- For production subdomain: DNS `CNAME` or `A` record → your host, plus TLS (nginx/Caddy/Cloudflare)

## 1. Install Node on the Pi

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential
node -v
```

## 2. Clone and configure

```bash
git clone https://github.com/samsarastudio/WebisteBooth.git frameflix
cd frameflix
cp .env.example .env
nano .env
```

Set at minimum:

```bash
PAYLOAD_SECRET=use-a-long-random-string-here
DATABASE_URI=file:./data/frameflix.db

# Production subdomain (recommended)
NEXT_PUBLIC_SERVER_URL=https://frameflix.inmoment.com
PAYLOAD_PUBLIC_SERVER_URL=https://frameflix.inmoment.com
NEXT_PUBLIC_PARENT_URL=https://inmoment.com

# Or ngrok while testing on Pi
# NEXT_PUBLIC_SERVER_URL=https://YOUR-SUBDOMAIN.ngrok-free.app
# PAYLOAD_PUBLIC_SERVER_URL=https://YOUR-SUBDOMAIN.ngrok-free.app

LEAD_NOTIFY_EMAIL=frameflix@inmoment.com
RESEND_API_KEY=re_xxxxx   # optional but recommended
# RESEND_FROM_EMAIL=FrameFlix by inmoment <quotes@inmoment.com>
```

Create runtime folders:

```bash
mkdir -p data media
```

## 3. Install and build

```bash
npm ci
npm run build   # also copies public/ + static assets into standalone output
```

On first boot, Payload pushes the SQLite schema and seeds packages, add-ons, FAQs, and site settings automatically.

If the build runs out of memory, add swap or build on a PC and copy the project (including `.next`, `node_modules`, `data`, and `media`) to the Pi.

```bash
# Optional: increase swap on Pi
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile   # set CONF_SWAPSIZE=2048
sudo dphys-swapfile setup
sudo dphys-swapfile swapon
```

## 4. Start with PM2

```bash
sudo npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

App listens on `0.0.0.0:3000`.

## 5. Expose publicly

### Option A — Subdomain (production)

Point `frameflix.inmoment.com` at your server (nginx/Caddy reverse proxy → `localhost:3000`). Ensure TLS is enabled. Set both URL env vars to the public HTTPS subdomain and restart PM2.

### Option B — ngrok (Pi testing)

```bash
# Install ngrok, then:
ngrok config add-authtoken YOUR_TOKEN
ngrok http 3000
```

Copy the HTTPS URL into `.env` as `NEXT_PUBLIC_SERVER_URL` and `PAYLOAD_PUBLIC_SERVER_URL`, then:

```bash
pm2 restart frameflix
```

**Tip:** Free ngrok URLs change on restart. A reserved domain (paid) keeps the same URL so you do not rewrite `.env` each time.

Optional ngrok autostart (systemd user service or `pm2` with a small wrapper script).

## 6. First admin user

1. Open `https://YOUR-SUBDOMAIN.ngrok-free.app/admin`
2. Create the first admin account (strong password — this URL is public)
3. Packages, add-ons, FAQs, and site settings are seeded automatically on first boot
4. Upload gallery images under **Gallery** / **Media**

## 7. Backups

Copy these folders regularly:

- `data/` — SQLite database (`frameflix.db`)
- `media/` — uploaded images

```bash
tar -czf frameflix-backup-$(date +%F).tgz data media .env
```

## 8. Updates

```bash
cd frameflix
git pull
npm ci
npm run build
pm2 restart frameflix
```

## Notes

- Free ngrok may show an interstitial “Visit Site” page to visitors
- Lead emails require a valid `RESEND_API_KEY` and `LEAD_NOTIFY_EMAIL`
- Without Resend, leads still appear in `/admin` → **Leads**
- Bind address is `0.0.0.0` so ngrok can reach the app on the Pi
