# Deploy FrameFlix on Cloudflare Workers (GitHub)

FrameFlix is configured for **Cloudflare Workers** via GitHub, using:

- **OpenNext** (`@opennextjs/cloudflare`) — runs Next.js 16 on Workers
- **Cloudflare D1** — SQLite database for Payload CMS (free tier available)
- **Optional R2** — admin media/gallery uploads only (paid; not required to launch)
- **Custom domain** — `frameflix.inmoment.com` (subdomain of inmoment)

> **Plan note:** Payload + Next.js on Workers typically needs a **paid Workers plan** (bundle size is usually >3 MB on the free tier). D1 has a free tier; R2 does not — but **R2 is optional** for this site (see below).

---

## Free tier: D1 only (no R2)

**R2 is not required** to launch FrameFlix. It is only used if you want to upload new images through `/admin` (Media / Gallery collections).

Without R2, you still get:

- Full marketing site (all pages, animations, brand images from `/public/brand`)
- Quote builder + lead capture → stored in **D1**
- Packages, add-ons, FAQs, site settings in **D1**
- Resend email notifications

**What you skip without R2:**

- Uploading new photos via Payload admin (Gallery / Media)
- The public gallery still shows curated sample images built into the repo

**Can KV or other free bindings substitute?** No — not for this app:

| Service | Good for | Why not for uploads |
|---------|----------|---------------------|
| **D1** | Database (leads, packages, FAQs) | Already used — not for binary files |
| **KV** | Small config/flags | ~25 MB value limit, no Payload adapter, wrong for images |
| **Images** | CDN transforms | Separate product; not a Payload upload target |
| **R2** | Object/file storage | What Payload expects — but paid |

**Minimum bindings to add in Cloudflare:**

1. **D1 database** only — binding name **`D1`**

Do **not** add R2 unless you subscribe later. Leave `ENABLE_R2` unset (or `false`).

---

## 1. Cloudflare dashboard — connect GitHub

In **Workers & Pages → Create → Connect to Git**:

| Field | Value |
|--------|--------|
| **GitHub repository** | `samsarastudio/WebisteBooth` |
| **Project name** | `frameflix` |
| **Production branch** | `main` |
| **Build command** | `npm run build:cloudflare` |
| **Deploy command** | `npm run deploy:cloudflare` |
| **Builds for non-production branches** | Optional (preview URLs per PR) |

Cloudflare will clone the repo and run build + deploy on each push to `main`.

---

## 2. Create D1 (required)

When prompted (or in **Workers → frameflix → Settings → Bindings**):

1. **D1 database** — name: `frameflix`  
   - Binding name must be **`D1`** (matches `wrangler.jsonc`)

**R2 is optional** — skip it on the free tier. Add later if you want admin image uploads (see [Free tier: D1 only](#free-tier-d1-only-no-r2)).

After Cloudflare creates D1, copy the **database ID** into `wrangler.jsonc` if it still shows `REPLACE_WITH_D1_DATABASE_ID`.

---

## 2b. Enable R2 later (optional, paid)

When you add an R2 subscription:

1. Add binding **`R2`** → bucket `frameflix-media`
2. Uncomment the `r2_buckets` block in `wrangler.jsonc`
3. Set env var `ENABLE_R2=true`
4. Redeploy — Media and Gallery collections appear in `/admin`

---

## 3. Environment variables (Cloudflare dashboard)

**Workers → frameflix → Settings → Variables and secrets**

| Variable | Example | Required |
|----------|---------|----------|
| `DEPLOY_TARGET` | `cloudflare` | Yes (set for all envs) |
| `ENABLE_R2` | `true` | Only if using paid R2 binding |
| `PAYLOAD_SECRET` | long random string (`openssl rand -hex 32`) | Yes — **encrypt as secret** |
| `NEXT_PUBLIC_SERVER_URL` | `https://frameflix.inmoment.com` | Yes |
| `PAYLOAD_PUBLIC_SERVER_URL` | `https://frameflix.inmoment.com` | Yes |
| `NEXT_PUBLIC_PARENT_URL` | `https://inmoment.com` | Yes |
| `LEAD_NOTIFY_EMAIL` | `frameflix@inmoment.com` | Yes |
| `RESEND_API_KEY` | `re_...` | Recommended |
| `LEAD_NOTIFY_PHONE` | your studio phone | Optional |
| `RESEND_FROM_EMAIL` | `FrameFlix by inmoment <quotes@inmoment.com>` | Optional |

Do **not** set `DATABASE_URI` on Cloudflare — D1 is bound as `D1`, not a file path.

---

## 4. Custom domain (frameflix.inmoment.com)

1. In Cloudflare DNS for **inmoment.com**, add:
   - **CNAME** `frameflix` → your Worker route (or use Workers **Custom Domains**)
2. **Workers → frameflix → Settings → Domains & Routes → Add custom domain**
   - Enter: `frameflix.inmoment.com`
3. Update env vars to use the HTTPS subdomain URL (step 3).
4. Redeploy (push to `main` or **Retry deployment**).

---

## 5. First deploy — database migrations

The deploy script runs Payload migrations against D1 before `wrangler deploy`.

**One-time locally** (after `npm ci` and `wrangler login`):

```bash
# Generate migration from current schema (only when schema changes)
npm run payload -- migrate:create

git add src/migrations
git commit -m "Add Payload D1 migrations"
git push
```

Then Cloudflare builds will apply migrations on each deploy.

---

## 6. First admin user

After a successful deploy:

1. Open `https://frameflix.inmoment.com/admin`
2. Create the first admin account
3. Packages, add-ons, FAQs, and site settings seed automatically on first boot

---

## 7. What each npm script does

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local Next.js dev (SQLite file in `./data/`) |
| `npm run build` | **Pi / VPS** standalone build |
| `npm run build:cloudflare` | OpenNext build for Workers (used by Cloudflare CI) |
| `npm run deploy:cloudflare` | D1 migrate + `wrangler deploy` (used by Cloudflare CI) |
| `npm run preview:cloudflare` | Local preview in Workers runtime |

---

## 8. GitHub → Cloudflare flow

```
push to main
    → Cloudflare clones WebisteBooth
    → npm ci
    → npm run build:cloudflare   (OpenNext + Next build)
    → npm run deploy:cloudflare  (payload migrate + wrangler deploy)
    → live at frameflix.inmoment.com
```

No Raspberry Pi or ngrok required for this path. See `DEPLOY.md` if you still want Pi + tunnel as a backup.

---

## 9. Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails — bundle too large | Upgrade to **Workers Paid** plan |
| `D1` binding not found | Ensure binding name is exactly `D1` in dashboard + `wrangler.jsonc` |
| Admin/media uploads fail | R2 not enabled — expected on free tier; set `ENABLE_R2=true` after adding R2 |
| Wrong URLs / broken images | Set `NEXT_PUBLIC_SERVER_URL` and redeploy |
| Migrations fail | Run `migrate:create` locally, commit `src/migrations`, push |
| Resend emails not sending | Add `RESEND_API_KEY` secret; verify domain in Resend |

---

## 10. Optional: preview deployments

Enable **Builds for non-production branches** in Cloudflare. Each PR branch gets a `*.workers.dev` preview URL. Use the same env vars (or a staging D1/R2) for preview workers.
