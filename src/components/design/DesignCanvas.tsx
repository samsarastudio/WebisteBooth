'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Stage,
  Layer,
  Rect,
  Text,
  Group,
  Image as KonvaImage,
  Line,
  Transformer,
  Ellipse,
} from 'react-konva'
import type Konva from 'konva'

import { useImage } from '@/components/design/useImage'
import { ShapeOrnament } from '@/components/design/ShapeOrnament'
import { getBaseStructure, type FrameBaseRenderStyle } from '@/lib/frame-design/base-structures'
import {
  clampOrnamentPosition,
  getDecorZones,
  getOrnamentHalfSize,
  normalizeOrnamentLayer,
} from '@/lib/frame-design/decor-zones'
import { getFrameLayout } from '@/lib/frame-design/layouts'
import { getTheme, shadeHex } from '@/lib/frame-design/themes'
import { CAPTION_TEXT_PADDING, wrapCaptionText } from '@/lib/frame-design/text-utils'
import type {
  FrameDesignState,
  FrameOrnamentData,
  OrnamentLayer,
  TextLayer,
} from '@/lib/frame-design/types'

function StickerOrnament({ src, size }: { src: string; size: number }) {
  const img = useImage(src, 'anonymous')[0]
  if (!img) return null
  return (
    <KonvaImage
      image={img}
      width={size}
      height={size}
      offsetX={size / 2}
      offsetY={size / 2}
    />
  )
}

function OrnamentNode({
  layer,
  ornament,
  accentColor,
  detailColor,
  photoSlot,
  decorZones,
  canvasWidth,
  canvasHeight,
  selected,
  onSelect,
  onDragEnd,
}: {
  layer: OrnamentLayer
  ornament?: FrameOrnamentData
  accentColor: string
  detailColor: string
  photoSlot: { x: number; y: number; width: number; height: number }
  decorZones: ReturnType<typeof getDecorZones>
  canvasWidth: number
  canvasHeight: number
  selected: boolean
  onSelect: () => void
  onDragEnd: (x: number, y: number) => void
}) {
  const isSticker = ornament?.finish === 'sticker'
  const half = getOrnamentHalfSize(ornament, layer.scale)
  const size = half * 2
  const fill = ornament?.finish === 'raised3d' ? accentColor : detailColor
  const src = ornament?.imageUrl || ornament?.assetPath || ''

  const bound = (pos: { x: number; y: number }) =>
    clampOrnamentPosition(
      pos.x,
      pos.y,
      half,
      decorZones,
      photoSlot,
      canvasWidth,
      canvasHeight,
    )

  return (
    <Group
      id={layer.id}
      x={layer.x}
      y={layer.y}
      rotation={layer.rotation}
      draggable
      dragBoundFunc={bound}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        const clamped = bound({ x: e.target.x(), y: e.target.y() })
        e.target.x(clamped.x)
        e.target.y(clamped.y)
        onDragEnd(clamped.x, clamped.y)
      }}
    >
      {isSticker && src ? (
        <StickerOrnament src={src} size={size} />
      ) : (
        <ShapeOrnament
          shapeType={ornament?.shapeType}
          color={fill}
          size={size}
          embossed={ornament?.finish === 'raised3d'}
        />
      )}
      {selected ? (
        <Rect
          width={size + 8}
          height={size + 8}
          offsetX={(size + 8) / 2}
          offsetY={(size + 8) / 2}
          stroke="#C9A227"
          strokeWidth={2}
          dash={[4, 4]}
        />
      ) : null}
    </Group>
  )
}

function PhotoPlaceholder({
  x,
  y,
  w,
  h,
  radius,
  dark,
}: {
  x: number
  y: number
  w: number
  h: number
  radius: number
  dark?: boolean
}) {
  return (
    <Group>
      <Rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={dark ? '#282828' : '#e8e4dc'}
        cornerRadius={radius}
      />
      <Text
        x={x}
        y={y}
        width={w}
        height={h}
        text="Upload your photo"
        fontSize={13}
        fill={dark ? '#888' : '#9a958a'}
        align="center"
        verticalAlign="middle"
      />
    </Group>
  )
}

function RaisedText({
  layer,
  captionZone,
  onSelect,
}: {
  layer: TextLayer
  captionZone: { x: number; y: number; width: number; height: number }
  onSelect: () => void
}) {
  const pad = CAPTION_TEXT_PADDING
  const boxWidth = captionZone.width - pad * 2
  const boxHeight = captionZone.height - pad * 2
  const cx = captionZone.x + captionZone.width / 2
  const cy = captionZone.y + captionZone.height / 2
  const displayText = useMemo(
    () => wrapCaptionText(layer.text, boxWidth, layer.size),
    [layer.text, boxWidth, layer.size],
  )

  return (
    <Group id={layer.id} x={cx} y={cy} onClick={onSelect} onTap={onSelect}>
      <Text
        text={displayText}
        x={-boxWidth / 2}
        y={-boxHeight / 2 + 1.5}
        width={boxWidth}
        height={boxHeight}
        fontSize={layer.size}
        fontFamily={layer.font}
        fill="rgba(0,0,0,0.18)"
        align="center"
        verticalAlign="middle"
        wrap="char"
        lineHeight={1.35}
        listening={false}
      />
      <Text
        text={displayText}
        x={-boxWidth / 2}
        y={-boxHeight / 2}
        width={boxWidth}
        height={boxHeight}
        fontSize={layer.size}
        fontFamily={layer.font}
        fill={layer.color}
        align="center"
        verticalAlign="middle"
        wrap="char"
        lineHeight={1.35}
      />
    </Group>
  )
}

function FabricWeave({
  width,
  height,
  color,
  spacing = 6,
}: {
  width: number
  height: number
  color: string
  spacing?: number
}) {
  const lines: React.ReactNode[] = []
  for (let y = 8; y < height - 8; y += spacing) {
    lines.push(
      <Line
        key={y}
        points={[8, y, width - 8, y]}
        stroke={color}
        strokeWidth={0.5}
        opacity={0.12}
      />,
    )
  }
  return <Group listening={false}>{lines}</Group>
}

function RomanceDecorIcons({
  canvasWidth,
  canvasHeight,
  captionZone,
  accent,
}: {
  canvasWidth: number
  canvasHeight: number
  captionZone?: { x: number; y: number; width: number; height: number }
  accent: string
}) {
  const capBottom = captionZone?.y ?? canvasHeight * 0.78
  const birdX = canvasWidth - 52
  const birdY = 28

  return (
    <Group listening={false}>
      {/* Dove with envelope — top right */}
      <Group x={birdX} y={birdY}>
        <Ellipse x={0} y={4} radiusX={10} radiusY={6} fill={accent} opacity={0.9} />
        <Ellipse x={-8} y={2} radiusX={7} radiusY={4} fill={accent} opacity={0.85} rotation={-20} />
        <Rect x={6} y={-2} width={10} height={6} fill={accent} cornerRadius={1} />
        <Line points={[-14, 6, -6, 2, 2, 6]} stroke={accent} strokeWidth={2} lineCap="round" />
      </Group>

      {/* Tulips — bottom corners */}
      {[
        { x: 36, flip: false },
        { x: canvasWidth - 36, flip: true },
      ].map(({ x, flip }) => (
        <Group key={x} x={x} y={capBottom - 18} scaleX={flip ? -1 : 1}>
          <Line points={[0, 18, 0, 0]} stroke={accent} strokeWidth={2} lineCap="round" />
          <Ellipse x={0} y={-2} radiusX={7} radiusY={9} fill={accent} />
          <Ellipse x={-5} y={8} radiusX={5} radiusY={3} fill={accent} opacity={0.85} rotation={-35} />
          <Ellipse x={5} y={8} radiusX={5} radiusY={3} fill={accent} opacity={0.85} rotation={35} />
        </Group>
      ))}
    </Group>
  )
}

function FlatFrameBody({
  canvasWidth,
  canvasHeight,
  borderRadius,
  photoSlot,
  captionZone,
  colors,
  renderStyle,
  themeId,
  photoRadius,
}: {
  canvasWidth: number
  canvasHeight: number
  borderRadius: number
  photoSlot: { x: number; y: number; width: number; height: number }
  captionZone?: { x: number; y: number; width: number; height: number }
  colors: FrameDesignState['colors']
  renderStyle: FrameBaseRenderStyle
  themeId: string
  photoRadius: number
}) {
  const baseLight = shadeHex(colors.base, 6)
  const baseDark = shadeHex(colors.base, -8)
  const matColor = shadeHex(colors.base, -12)
  const weaveColor = shadeHex(colors.text, 0)
  const usesWeave =
    renderStyle === 'instant-rail' ||
    renderStyle === 'romance-decor' ||
    renderStyle === 'fabric-weave'

  return (
    <Group listening={false}>
      {/* Flat 2D face-on frame body */}
      <Rect
        width={canvasWidth}
        height={canvasHeight}
        cornerRadius={borderRadius}
        fill={colors.base}
        stroke={colors.accent}
        strokeWidth={
          renderStyle === 'plain-lines' || renderStyle === 'plain-double' ? 2 : 3
        }
        shadowColor="rgba(0,0,0,0.2)"
        shadowBlur={8}
        shadowOpacity={0.15}
        shadowOffset={{ x: 0, y: 3 }}
      />

      {usesWeave ? (
        <FabricWeave width={canvasWidth} height={canvasHeight} color={weaveColor} />
      ) : null}

      {renderStyle === 'gallery-mat' ? (
        <Rect
          x={photoSlot.x - 14}
          y={photoSlot.y - 14}
          width={photoSlot.width + 28}
          height={photoSlot.height + 28}
          fill={matColor}
          cornerRadius={Math.max(0, photoRadius + 2)}
        />
      ) : null}

      {renderStyle === 'plain-double' ? (
        <Rect
          x={8}
          y={8}
          width={canvasWidth - 16}
          height={canvasHeight - 16}
          cornerRadius={Math.max(0, borderRadius - 2)}
          stroke={colors.detail}
          strokeWidth={1}
          fill="transparent"
        />
      ) : null}

      {renderStyle === 'classic-ornate' ? (
        <>
          <Line
            points={[12, 12, 28, 28]}
            stroke={colors.accent}
            strokeWidth={2}
            opacity={0.55}
          />
          <Line
            points={[canvasWidth - 12, 12, canvasWidth - 28, 28]}
            stroke={colors.accent}
            strokeWidth={2}
            opacity={0.55}
          />
          <Line
            points={[12, canvasHeight - 12, 28, canvasHeight - 28]}
            stroke={colors.accent}
            strokeWidth={2}
            opacity={0.55}
          />
          <Line
            points={[canvasWidth - 12, canvasHeight - 12, canvasWidth - 28, canvasHeight - 28]}
            stroke={colors.accent}
            strokeWidth={2}
            opacity={0.55}
          />
        </>
      ) : null}

      {renderStyle === 'instant-rail' && captionZone ? (
        <Rect
          x={captionZone.x}
          y={captionZone.y - 2}
          width={captionZone.width}
          height={captionZone.height + 2}
          fill={baseDark}
          opacity={0.2}
          cornerRadius={0}
        />
      ) : null}

      {renderStyle === 'romance-decor' ? (
        <RomanceDecorIcons
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          captionZone={captionZone}
          accent={colors.accent}
        />
      ) : null}

      {captionZone ? (
        <>
          <Line
            points={[
              captionZone.x,
              captionZone.y - 1,
              captionZone.x + captionZone.width,
              captionZone.y - 1,
            ]}
            stroke={shadeHex(colors.base, -14)}
            strokeWidth={1}
            opacity={0.45}
          />
          <Rect
            x={captionZone.x}
            y={captionZone.y}
            width={captionZone.width}
            height={captionZone.height}
            fill={baseDark}
            opacity={0.35}
            cornerRadius={renderStyle === 'celebration-soft' ? 6 : 0}
          />
        </>
      ) : null}

      {renderStyle === 'modern-stripe' && captionZone ? (
        <Rect
          x={captionZone.x}
          y={captionZone.y}
          width={captionZone.width}
          height={5}
          fill={colors.accent}
          opacity={0.55}
        />
      ) : null}

      {renderStyle === 'plain-lines' && captionZone ? (
        <>
          {[0.28, 0.48, 0.68].map((pct) => (
            <Line
              key={pct}
              points={[
                captionZone.x + 24,
                captionZone.y + captionZone.height * pct,
                captionZone.x + captionZone.width - 24,
                captionZone.y + captionZone.height * pct,
              ]}
              stroke={colors.detail}
              strokeWidth={1}
              opacity={0.7}
            />
          ))}
        </>
      ) : null}

      {themeId === 'dark-accent' && captionZone ? (
        <Group>
          <Rect
            x={captionZone.x}
            y={captionZone.y + captionZone.height - 18}
            width={captionZone.width}
            height={3}
            fill={colors.detail}
            cornerRadius={1}
          />
          <Rect
            x={captionZone.x}
            y={captionZone.y + captionZone.height - 18}
            width={captionZone.width * 0.35}
            height={3}
            fill={colors.accent}
            cornerRadius={1}
          />
        </Group>
      ) : null}

      {!['plain-lines', 'plain-double', 'modern-stripe', 'instant-rail'].includes(
        renderStyle,
      ) &&
      captionZone &&
      themeId !== 'dark-accent' ? (
        <Rect
          x={captionZone.x + captionZone.width * 0.2}
          y={captionZone.y + captionZone.height - 10}
          width={captionZone.width * 0.6}
          height={2}
          fill={colors.accent}
          opacity={0.35}
          cornerRadius={1}
        />
      ) : null}

      {/* Photo recess — flat inset */}
      <Rect
        x={photoSlot.x}
        y={photoSlot.y}
        width={photoSlot.width}
        height={photoSlot.height}
        fill="#141414"
        cornerRadius={photoRadius}
      />
      <Rect
        x={photoSlot.x + 1}
        y={photoSlot.y + 1}
        width={photoSlot.width - 2}
        height={photoSlot.height - 2}
        stroke="rgba(0,0,0,0.22)"
        strokeWidth={1}
        cornerRadius={Math.max(0, photoRadius - 1)}
        fill="transparent"
      />

      {/* Subtle top-edge highlight on frame body */}
      <Rect
        x={2}
        y={2}
        width={canvasWidth - 4}
        height={3}
        fill={baseLight}
        opacity={0.4}
        cornerRadius={borderRadius}
      />
    </Group>
  )
}

export function DesignCanvas({
  design,
  ornaments,
  selectedId,
  onSelect,
  onChange,
  stageRef,
}: {
  design: FrameDesignState
  ornaments: FrameOrnamentData[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onChange: (next: FrameDesignState) => void
  stageRef: React.RefObject<Konva.Stage | null>
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const [scale, setScale] = useState(1)

  const base = getBaseStructure(design.baseId)
  const layout = getFrameLayout(
    design.format,
    design.shapeVariant || 'classic',
    base.layoutProfile,
  )
  const theme = getTheme(design.themeId)
  const { canvasWidth, canvasHeight, photoSlot, borderRadius, captionZone } = layout
  const { colors, photoTransform } = design
  const photoRadius = theme.photoRadius
  const decorZones = getDecorZones(canvasWidth, canvasHeight, photoSlot, captionZone)

  const photoImage = useImage(design.photoUrl || '', 'anonymous')[0]

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth
      setScale(Math.min(1, (w - 16) / canvasWidth))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [canvasWidth])

  useEffect(() => {
    const tr = transformerRef.current
    const stage = stageRef.current
    if (!tr || !stage) return
    if (!selectedId) {
      tr.nodes([])
      tr.getLayer()?.batchDraw()
      return
    }
    const node = stage.findOne(`#${selectedId}`)
    const isText = design.textLayers.some((t) => t.id === selectedId)
    if (node && !isText) {
      tr.nodes([node])
      tr.getLayer()?.batchDraw()
    } else {
      tr.nodes([])
      tr.getLayer()?.batchDraw()
    }
  }, [selectedId, design, stageRef])

  function updateOrnamentLayer(id: string, patch: Partial<OrnamentLayer>) {
    onChange({
      ...design,
      ornaments: design.ornaments.map((o) => {
        if (o.id !== id) return o
        const next = { ...o, ...patch }
        const ornament = ornaments.find((orn) => String(orn.id) === next.assetId)
        const maxScale = ornament?.finish === 'sticker' ? 1.15 : 1.1
        if (next.scale > maxScale) next.scale = maxScale
        return normalizeOrnamentLayer(
          next,
          ornament,
          decorZones,
          photoSlot,
          canvasWidth,
          canvasHeight,
        )
      }),
    })
  }

  const stagePad = 16
  const displayW = canvasWidth * scale
  const displayH = canvasHeight * scale
  const frameCenterX = canvasWidth / 2
  const textSelected =
    selectedId !== null && design.textLayers.some((t) => t.id === selectedId)
  const stageW = displayW + stagePad * 2
  const stageH = displayH + stagePad * 2

  return (
    <div ref={containerRef} className="w-full flex justify-center items-center min-h-[280px]">
      <div className="flex flex-col items-center gap-2 w-full">
        <p className="text-xs text-text-secondary font-medium">{layout.printSizeLabel}</p>
        <div
          className="rounded-[var(--radius-md)] overflow-hidden bg-[#2a2824] p-3 md:p-4 mx-auto"
          style={{ width: stageW + 8, height: stageH + 8 }}
        >
          <Stage
            ref={stageRef}
            width={stageW}
            height={stageH}
            scaleX={scale}
            scaleY={scale}
            x={stagePad}
            y={stagePad}
            onMouseDown={(e) => {
              if (e.target === e.target.getStage()) onSelect(null)
            }}
            onTouchStart={(e) => {
              if (e.target === e.target.getStage()) onSelect(null)
            }}
          >
            <Layer>
              <FlatFrameBody
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                borderRadius={borderRadius}
                photoSlot={photoSlot}
                captionZone={captionZone}
                colors={colors}
                renderStyle={base.renderStyle}
                themeId={theme.id}
                photoRadius={photoRadius}
              />

              <Group
                clipFunc={(ctx) => {
                  const r = photoRadius
                  const { x, y, width: w, height: h } = photoSlot
                  ctx.beginPath()
                  ctx.moveTo(x + r, y)
                  ctx.lineTo(x + w - r, y)
                  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
                  ctx.lineTo(x + w, y + h - r)
                  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
                  ctx.lineTo(x + r, y + h)
                  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
                  ctx.lineTo(x, y + r)
                  ctx.quadraticCurveTo(x, y, x + r, y)
                  ctx.closePath()
                }}
              >
                {photoImage ? (
                  <KonvaImage
                    image={photoImage}
                    x={photoSlot.x + photoTransform.x}
                    y={photoSlot.y + photoTransform.y}
                    width={
                      (design.photoNaturalSize?.width || photoSlot.width) * photoTransform.scale
                    }
                    height={
                      (design.photoNaturalSize?.height || photoSlot.height) * photoTransform.scale
                    }
                  />
                ) : (
                  <PhotoPlaceholder
                    x={photoSlot.x}
                    y={photoSlot.y}
                    w={photoSlot.width}
                    h={photoSlot.height}
                    radius={photoRadius}
                    dark={theme.id === 'dark-accent'}
                  />
                )}
              </Group>

              {captionZone && textSelected ? (
                <>
                  <Rect
                    x={captionZone.x + CAPTION_TEXT_PADDING}
                    y={captionZone.y + CAPTION_TEXT_PADDING}
                    width={captionZone.width - CAPTION_TEXT_PADDING * 2}
                    height={captionZone.height - CAPTION_TEXT_PADDING * 2}
                    stroke={colors.accent}
                    strokeWidth={1}
                    dash={[5, 5]}
                    opacity={0.45}
                    listening={false}
                  />
                  <Line
                    points={[frameCenterX, captionZone.y, frameCenterX, captionZone.y + captionZone.height]}
                    stroke="#3b82f6"
                    strokeWidth={1}
                    dash={[4, 6]}
                    opacity={0.3}
                    listening={false}
                  />
                </>
              ) : null}

              {design.textLayers.map((t) =>
                captionZone ? (
                  <RaisedText
                    key={t.id}
                    layer={t}
                    captionZone={captionZone}
                    onSelect={() => onSelect(t.id)}
                  />
                ) : null,
              )}

              <Group
                clipFunc={(ctx) => {
                  ctx.beginPath()
                  ctx.rect(0, 0, canvasWidth, canvasHeight)
                  ctx.closePath()
                }}
              >
                {design.ornaments
                  .slice()
                  .sort((a, b) => a.zIndex - b.zIndex)
                  .map((layer) => {
                    const ornament = ornaments.find((o) => String(o.id) === layer.assetId)
                    return (
                      <OrnamentNode
                        key={layer.id}
                        layer={layer}
                        ornament={ornament}
                        accentColor={colors.accent}
                        detailColor={colors.detail}
                        photoSlot={photoSlot}
                        decorZones={decorZones}
                        canvasWidth={canvasWidth}
                        canvasHeight={canvasHeight}
                        selected={selectedId === layer.id}
                        onSelect={() => onSelect(layer.id)}
                        onDragEnd={(x, y) => updateOrnamentLayer(layer.id, { x, y })}
                      />
                    )
                  })}
              </Group>

              <Transformer
                ref={transformerRef}
                rotateEnabled
                borderStroke="#C9A227"
                anchorStroke="#3b82f6"
                anchorFill="#ffffff"
                centeredScaling
                onTransformEnd={() => {
                  if (!selectedId) return
                  const node = stageRef.current?.findOne(`#${selectedId}`)
                  if (!node) return
                  const scaleX = node.scaleX()
                  const ornament = ornaments.find(
                    (o) =>
                      String(o.id) ===
                      design.ornaments.find((l) => l.id === selectedId)?.assetId,
                  )
                  const maxScale = ornament?.finish === 'sticker' ? 1.15 : 1.1
                  const layer = design.ornaments.find((l) => l.id === selectedId)
                  if (!layer) return
                  const nextScale = Math.min(maxScale, Math.max(0.45, layer.scale * scaleX))
                  node.scaleX(1)
                  node.scaleY(1)
                  updateOrnamentLayer(selectedId, {
                    scale: nextScale,
                    x: node.x(),
                    y: node.y(),
                    rotation: node.rotation(),
                  })
                }}
              />
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  )
}
