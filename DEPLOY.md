# Deploy FrameFlix on Raspberry Pi

FrameFlix runs as a **Next.js standalone** app on a Raspberry Pi. It uses:

- **SQLite** — database at `data/frameflix.db`
- **Local filesystem** — uploaded images in `media/`
- **PM2** — keeps the app running after reboot
- **Cloudflare Tunnel** — exposes the site at **`https://inmomentservices.com`** (no port forwarding, free TLS)

---

## What you need

| Item | Recommendation |
|------|----------------|
| Hardware | Raspberry Pi 4 or 5 with **4 GB+ RAM** |
| OS | Raspberry Pi OS 64-bit (Bookworm) |
| Storage | 16 GB+ SD card (32 GB preferred) |
| Network | Stable home internet with outbound HTTPS |
| Domain | **`inmomentservices.com`** on Cloudflare (nameservers pointed to Cloudflare) |
| Cloudflare | Free account with **Zero Trust** enabled (included on free plan) |

> **Build memory:** `npm run build:standalone` needs ~2–4 GB RAM. On a 2 GB Pi, add swap (see below) or build on your PC and copy the project to the Pi.

---

## 1. Prepare the Pi

SSH into the Pi, then install Node.js 20 LTS:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential git
node -v   # should print v20.x
npm -v
```

Optional — increase swap if the Pi has ≤ 2 GB RAM:

```bash
sudo dphys-swapfile swapoff
sudo sed -i 's/CONF_SWAPSIZE=.*/CONF_SWAPSIZE=2048/' /etc/dphys-swapfile
sudo dphys-swapfile setup
sudo dphys-swapfile swapon
```

---

## 2. Clone the project

```bash
cd ~
git clone https://github.com/samsarastudio/WebisteBooth.git frameflix
cd frameflix
```

Create runtime folders and environment file:

```bash
mkdir -p data media
cp .env.example .env
nano .env
```

Set these values in `.env`:

```bash
PAYLOAD_SECRET=your-long-random-secret-here
DATABASE_URI=file:./data/frameflix.db

# Production domain (must match Cloudflare Tunnel hostname exactly)
NEXT_PUBLIC_SERVER_URL=https://inmomentservices.com
PAYLOAD_PUBLIC_SERVER_URL=https://inmomentservices.com
NEXT_PUBLIC_PARENT_URL=https://inmomentservices.com

LEAD_NOTIFY_EMAIL=hello@inmomentservices.com
RESEND_API_KEY=re_xxxxx          # optional — leads still save to /admin without it
```

Generate a secret:

```bash
openssl rand -hex 32
```

---

## 3. Install and build

```bash
npm ci
npm run build:standalone
```

This produces a self-contained server at `.next/standalone/server.js` and copies static assets into place.

On first boot, Payload creates the SQLite schema and seeds packages, add-ons, FAQs, and site settings automatically.

---

## 4. Start with PM2

Install PM2 and start the app:

```bash
sudo npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup    # follow the printed command to enable boot on restart
```

Verify locally on the Pi:

```bash
curl -I http://127.0.0.1:3000
pm2 logs frameflix
pm2 status
```

The app listens on **`0.0.0.0:3000`**. Cloudflare Tunnel will connect to this port — you do **not** need to open ports on your router.

---

## 5. Cloudflare Tunnel (recommended)

Cloudflare Tunnel (`cloudflared`) creates an encrypted outbound connection from your Pi to Cloudflare. Visitors reach **`https://inmomentservices.com`** through Cloudflare — no public IP, no port forwarding, TLS handled automatically.

### 5a. Add the domain to Cloudflare

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Add site **`inmomentservices.com`** if not already added
3. Update nameservers at your registrar to the Cloudflare nameservers shown
4. Wait until the domain shows **Active**

### 5b. Create the tunnel

1. Go to **Zero Trust** → **Networks** → **Tunnels**  
   (Direct link: [one.dash.cloudflare.com](https://one.dash.cloudflare.com) → Networks → Tunnels)
2. Click **Create a tunnel**
3. Name it **`frameflix-pi`** → **Save tunnel**
4. Choose **Debian** as the operating system
5. Copy the install command — it looks like:

```bash
sudo cloudflared service install eyJhIjoi...
```

### 5c. Install cloudflared on the Pi

**Pi 4/5 (64-bit):**

```bash
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb -o /tmp/cloudflared.deb
sudo dpkg -i /tmp/cloudflared.deb
cloudflared --version
```

**Older 32-bit Pi:**

```bash
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm.deb -o /tmp/cloudflared.deb
sudo dpkg -i /tmp/cloudflared.deb
```

Run the **install command** from the Cloudflare dashboard (step 5b). This registers the Pi as a tunnel connector and installs a systemd service.

```bash
sudo cloudflared service install eyJhIjoi...   # paste your token from the dashboard
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
sudo systemctl status cloudflared
```

### 5d. Route the domain to the app

Back in the Cloudflare tunnel setup (or **Tunnels → frameflix-pi → Public Hostname**):

| Field | Value |
|-------|-------|
| **Subdomain** | *(leave blank for apex)* or `www` |
| **Domain** | `inmomentservices.com` |
| **Path** | *(leave blank)* |
| **Type** | HTTP |
| **URL** | `localhost:3000` |

Click **Save**. Repeat for **`www.inmomentservices.com`** if you want both apex and www.

Cloudflare creates the DNS records automatically (CNAME to `*.cfargotunnel.com`).

### 5e. Verify

```bash
# On the Pi — app must respond locally
curl -I http://127.0.0.1:3000

# Tunnel connector must be healthy
sudo systemctl status cloudflared
```

From any browser:

- **https://inmomentservices.com** — marketing site
- **https://inmomentservices.com/admin** — Payload CMS

If you changed `.env` URLs, restart the app:

```bash
pm2 restart frameflix
```

> **Important:** `NEXT_PUBLIC_SERVER_URL` and `PAYLOAD_PUBLIC_SERVER_URL` must exactly match the public URL (`https://inmomentservices.com`). Mismatched URLs break admin login, images, and quote form redirects.

---

## 6. First admin user

1. Open **`https://inmomentservices.com/admin`**
2. Create the first admin account (use a strong password)
3. Browse **Leads**, **Packages**, **Gallery**, and **Site Settings**
4. Upload gallery photos under **Media** → **Gallery**

---

## 7. Backups

Back up these regularly (they are not in git):

```bash
cd ~/frameflix
tar -czf ~/frameflix-backup-$(date +%F).tgz data media .env
```

Copy the archive to another machine or cloud storage.

---

## 8. Deploy updates

```bash
cd ~/frameflix
git pull
npm ci
npm run generate:importmap
npm run build:standalone
npm run migrate:prod
pm2 restart frameflix
```

After schema changes (new collections or fields), **`npm run migrate`** is required on the Pi — production does not auto-update the SQLite schema.

The Cloudflare Tunnel keeps running — no tunnel restart needed unless you change the hostname or port.

---

## 9. Useful commands

| Command | Purpose |
|---------|---------|
| `pm2 status` | Check if the app is running |
| `pm2 logs frameflix` | View app logs |
| `pm2 restart frameflix` | Restart after `.env` changes |
| `sudo systemctl status cloudflared` | Check tunnel connector |
| `sudo journalctl -u cloudflared -f` | Live tunnel logs |
| `npm run dev` | Local development (on any machine) |

---

## 10. Troubleshooting

| Problem | Fix |
|---------|-----|
| **522 / tunnel error** | App not running — check `pm2 status` and `curl http://127.0.0.1:3000` |
| **502 Bad Gateway** | Tunnel URL must be `localhost:3000` (not `127.0.0.1:3000` in some setups — try both) |
| Site loads but images broken | Set both URL env vars to `https://inmomentservices.com` and `pm2 restart frameflix` |
| `/admin` login fails | Confirm `PAYLOAD_SECRET` is set; URLs must match the public domain |
| **`/admin` shows server error after update** | Run `npm run generate:importmap && npm run migrate:prod && pm2 restart frameflix` |
| **`/admin` 500 after blog update** | Production DB missing `posts` table — run `npm run migrate:prod` on the Pi (or restart PM2; startup now auto-migrates) |
| **SQLite `frameflix.db: 14` (can't open)** | Run `mkdir -p data media`, then `pm2 delete frameflix && pm2 start ecosystem.config.cjs`. Ensure `data/` is writable. |
| Tunnel not connecting | `sudo systemctl restart cloudflared`; re-check install token in Zero Trust dashboard |
| Build runs out of memory | Add swap (step 1) or build on a PC and `rsync` the project to the Pi |
| Leads not emailing | Add `RESEND_API_KEY`; leads still appear in `/admin` → Leads |

---

## 11. Alternatives to Cloudflare Tunnel

Use these only if you cannot use a tunnel.

### Caddy (requires public IP + port forward)

Install Caddy, point DNS A record to your home IP, proxy to `localhost:3000`. See [Caddy docs](https://caddyserver.com/docs/).

### ngrok (quick testing)

```bash
ngrok http 3000
```

Put the ngrok HTTPS URL in both `NEXT_PUBLIC_SERVER_URL` and `PAYLOAD_PUBLIC_SERVER_URL`, then `pm2 restart frameflix`.

---

## Architecture

```
Visitor → https://inmomentservices.com
              ↓
         Cloudflare edge (TLS)
              ↓
         Cloudflare Tunnel (cloudflared)
              ↓
         PM2 → .next/standalone/server.js :3000
              ↓
         SQLite (data/frameflix.db) + uploads (media/)
```

Everything runs on the Pi. Cloudflare only proxies traffic — no Workers, D1, or R2 required.
