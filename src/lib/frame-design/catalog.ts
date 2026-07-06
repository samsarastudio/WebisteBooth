import { unstable_noStore as noStore } from 'next/cache'

import type { FrameOrnament, FrameTemplate } from '@/payload-types'
import type {
  FrameOrnamentData,
  FrameStylePreset,
  FrameTemplateData,
  PlaColorRole,
} from '@/lib/frame-design/types'
import { getPayloadClient } from '@/lib/payload'
import {
  defaultFrameOrnaments,
  defaultFrameStyles,
  defaultFrameTemplates,
} from '@/seed/defaults'

function mapTemplate(doc: FrameTemplate): FrameTemplateData {
  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
    format: doc.format,
    canvasWidth: doc.canvasWidth,
    canvasHeight: doc.canvasHeight,
    photoSlot: {
      x: doc.photoSlot?.x ?? 40,
      y: doc.photoSlot?.y ?? 40,
      width: doc.photoSlot?.width ?? 320,
      height: doc.photoSlot?.height ?? 320,
    },
    captionZone: doc.captionZone
      ? {
          x: doc.captionZone.x ?? 40,
          y: doc.captionZone.y ?? 380,
          width: doc.captionZone.width ?? 320,
          height: doc.captionZone.height ?? 80,
        }
      : undefined,
    borderRadius: doc.borderRadius ?? 8,
  }
}

function mapOrnament(doc: FrameOrnament): FrameOrnamentData {
  const imageUrl =
    typeof doc.image === 'object' && doc.image?.url
      ? doc.image.url
      : doc.assetPath || undefined

  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
    category: doc.category,
    kind: doc.kind,
    finish: doc.finish === 'sticker' ? 'sticker' : 'raised3d',
    assetPath: doc.assetPath || undefined,
    shapeType: doc.shapeType || undefined,
    imageUrl,
  }
}

function mapStylePreset(doc: {
  id: string | number
  name: string
  slug: string
  sampleMessage: string
  imagePath: string
  plaColors: { name: string; hex: string; role: PlaColorRole }[]
}): FrameStylePreset {
  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
    sampleMessage: doc.sampleMessage,
    imagePath: doc.imagePath,
    plaColors: doc.plaColors,
  }
}

export async function getDesignCatalog() {
  noStore()
  try {
    const payload = await getPayloadClient()
    const [templatesRes, ornamentsRes, stylesRes] = await Promise.all([
      payload.find({
        collection: 'frame-templates',
        where: { active: { equals: true } },
        sort: 'sortOrder',
        limit: 20,
        depth: 0,
      }),
      payload.find({
        collection: 'frame-ornaments',
        where: { active: { equals: true } },
        sort: 'sortOrder',
        limit: 50,
        depth: 1,
      }),
      payload.find({
        collection: 'frame-styles',
        where: { active: { equals: true } },
        sort: 'sortOrder',
        limit: 10,
        depth: 0,
      }),
    ])

    if (templatesRes.docs.length === 0) {
      return {
        templates: defaultFrameTemplates.map((t, i) => ({
          id: `fb-${i}`,
          name: t.name,
          slug: t.slug,
          format: t.format,
          canvasWidth: t.canvasWidth,
          canvasHeight: t.canvasHeight,
          photoSlot: t.photoSlot,
          captionZone: t.captionZone,
          borderRadius: t.borderRadius,
        })),
        ornaments: defaultFrameOrnaments.map((o, i) => ({
          id: `fb-${i}`,
          name: o.name,
          slug: o.slug,
          category: o.category,
          kind: o.kind,
          finish: o.finish,
          shapeType: o.shapeType,
          assetPath: o.assetPath,
          imageUrl: o.assetPath,
        })),
        stylePresets: defaultFrameStyles.map((s, i) => mapStylePreset({ ...s, id: `fb-${i}` })),
      }
    }

    return {
      templates: templatesRes.docs.map(mapTemplate),
      ornaments: ornamentsRes.docs.map(mapOrnament),
      stylePresets: stylesRes.docs.map(mapStylePreset),
    }
  } catch {
    return {
      templates: defaultFrameTemplates.map((t, i) => ({
        id: `fb-${i}`,
        name: t.name,
        slug: t.slug,
        format: t.format,
        canvasWidth: t.canvasWidth,
        canvasHeight: t.canvasHeight,
        photoSlot: t.photoSlot,
        captionZone: t.captionZone,
        borderRadius: t.borderRadius,
      })),
      ornaments: defaultFrameOrnaments.map((o, i) => ({
        id: `fb-${i}`,
        name: o.name,
        slug: o.slug,
        category: o.category,
        kind: o.kind,
        finish: o.finish,
        shapeType: o.shapeType,
        assetPath: o.assetPath,
        imageUrl: o.assetPath,
      })),
      stylePresets: defaultFrameStyles.map((s, i) => mapStylePreset({ ...s, id: `fb-${i}` })),
    }
  }
}
