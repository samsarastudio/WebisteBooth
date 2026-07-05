import sharp from 'sharp'
import { writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const brandDir = path.join(__dirname, '../public/brand')
const app = path.join(__dirname, '../src/app')

const svg = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ff-gold" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
      <stop stop-color="#E8D078"/>
      <stop offset="0.5" stop-color="#D4B84A"/>
      <stop offset="1" stop-color="#B89830"/>
    </linearGradient>
    <linearGradient id="ff-cream" x1="12" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FFFEFB"/>
      <stop offset="1" stop-color="#F3EDE0"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="#F7F2E8"/>
  <circle cx="32" cy="32" r="26" stroke="url(#ff-gold)" stroke-width="1.5" opacity="0.35"/>
  <circle cx="32" cy="32" r="20" stroke="url(#ff-gold)" stroke-width="1" opacity="0.2"/>
  <rect x="14" y="12" width="36" height="42" rx="5" fill="url(#ff-cream)" stroke="url(#ff-gold)" stroke-width="2.5"/>
  <rect x="18" y="16" width="28" height="24" rx="2.5" fill="#EBE4D4" stroke="url(#ff-gold)" stroke-width="1.5"/>
  <circle cx="26" cy="26" r="3.5" fill="url(#ff-gold)" opacity="0.85"/>
  <circle cx="38" cy="26" r="3.5" fill="url(#ff-gold)" opacity="0.85"/>
  <path d="M24 32c2.5 3 4.5 4 8 4s5.5-1 8-4" stroke="url(#ff-gold)" stroke-width="2" stroke-linecap="round" fill="none"/>
  <rect x="22" y="44" width="20" height="2.5" rx="1.25" fill="url(#ff-gold)" opacity="0.7"/>
  <circle cx="48" cy="16" r="4" fill="url(#ff-gold)"/>
  <circle cx="48" cy="16" r="1.5" fill="#F7F2E8"/>
</svg>`

const buf = Buffer.from(svg)

await sharp(buf).resize(512, 512).png().toFile(path.join(brandDir, 'logo.png'))
await sharp(buf).resize(32, 32).png().toFile(path.join(app, 'icon.png'))
await sharp(buf).resize(180, 180).png().toFile(path.join(app, 'apple-icon.png'))
await sharp(buf).resize(192, 192).png().toFile(path.join(brandDir, 'icon-192.png'))
await sharp(buf).resize(512, 512).png().toFile(path.join(brandDir, 'icon-512.png'))
writeFileSync(path.join(brandDir, 'logo.svg'), svg)
console.log('logo assets written')
