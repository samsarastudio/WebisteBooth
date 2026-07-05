'use client'

import { useMemo, useState } from 'react'
import { X } from 'lucide-react'

import { ProductImage } from '@/components/marketing/ProductImage'
import { gallerySamples, type GallerySample } from '@/lib/brand-images'
import type { GalleryItem } from '@/lib/payload'

const filters = [
  { id: 'all', label: 'All' },
  { id: 'wedding', label: 'Weddings' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'birthday', label: 'Birthdays' },
  { id: 'graduation', label: 'Graduations' },
  { id: 'anniversary', label: 'Anniversaries' },
  { id: 'other', label: 'Other' },
]

function samplesToItems(samples: GallerySample[]): GalleryItem[] {
  return samples.map((img, i) => ({
    id: `sample-${i}`,
    eventType: img.eventType,
    imageUrl: img.src,
    alt: '',
    caption: null,
  }))
}

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState('all')
  const [active, setActive] = useState<GalleryItem | null>(null)

  const displayItems: GalleryItem[] = useMemo(() => {
    const cmsItems = items
      .filter((item) => item.imageUrl)
      .map((item) => ({
        ...item,
        caption: null,
        alt: '',
      }))

    // Always show curated samples so the gallery never looks empty
    const samples = samplesToItems(gallerySamples)
    const cmsUrls = new Set(cmsItems.map((i) => i.imageUrl))
    const uniqueSamples = samples.filter((s) => !cmsUrls.has(s.imageUrl))

    return [...cmsItems, ...uniqueSamples]
  }, [items])

  const filtered =
    filter === 'all'
      ? displayItems
      : displayItems.filter((item) => item.eventType === filter)

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === f.id
                ? 'bg-accent text-[#1f1c12]'
                : 'bg-bg-card border border-border text-text-secondary hover:border-accent hover:text-accent'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-text-secondary py-16">
          More photos for this category coming soon.
        </p>
      ) : (
        <div className="gallery-masonry">
          {filtered.map((item) => (
            <button
              key={String(item.id)}
              type="button"
              className="gallery-item group relative w-full text-left"
              onClick={() => setActive(item)}
              aria-label="View keepsake frame"
            >
              <div className="relative aspect-[4/5] bg-bg-secondary overflow-hidden rounded-[var(--radius-md)]">
                {item.imageUrl ? (
                  <ProductImage
                    src={item.imageUrl}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      )}

      {active?.imageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Frame preview"
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white p-2"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            <X size={28} />
          </button>
          <div
            className="relative w-full max-w-4xl aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
          >
            <ProductImage
              src={active.imageUrl}
              alt=""
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </div>
  )
}
