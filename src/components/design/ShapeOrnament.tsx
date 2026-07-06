'use client'

import { Group, Rect, Text, Arc, Line, Ellipse } from 'react-konva'

import type { OrnamentShapeType } from '@/lib/frame-design/types'

function ShadowWrap({
  size,
  embossed,
  children,
}: {
  size: number
  embossed?: boolean
  children: React.ReactNode
}) {
  if (!embossed) return <>{children}</>
  return (
    <Group>
      <Group x={1.2} y={1.5} opacity={0.2} listening={false}>
        {children}
      </Group>
      {children}
    </Group>
  )
}

function TulipKonva({ color, size }: { color: string; size: number }) {
  const w = size * 0.55
  const h = size
  return (
    <Group offsetX={w / 2} offsetY={h / 2}>
      <Line
        points={[w / 2, h * 0.88, w / 2, h * 0.38]}
        stroke={color}
        strokeWidth={Math.max(2, size * 0.06)}
        lineCap="round"
      />
      <Ellipse x={w / 2} y={h * 0.3} radiusX={w * 0.34} radiusY={h * 0.2} fill={color} />
      <Ellipse
        x={w * 0.28}
        y={h * 0.52}
        radiusX={w * 0.22}
        radiusY={h * 0.08}
        fill={color}
        rotation={-35}
      />
      <Ellipse
        x={w * 0.72}
        y={h * 0.52}
        radiusX={w * 0.22}
        radiusY={h * 0.08}
        fill={color}
        rotation={35}
      />
    </Group>
  )
}

function BirdMailKonva({ color, size }: { color: string; size: number }) {
  const s = size
  return (
    <Group offsetX={s / 2} offsetY={s / 2}>
      <Ellipse x={s * 0.34} y={s * 0.54} radiusX={s * 0.22} radiusY={s * 0.13} fill={color} />
      <Ellipse
        x={s * 0.2}
        y={s * 0.5}
        radiusX={s * 0.15}
        radiusY={s * 0.09}
        fill={color}
        rotation={-20}
      />
      <Rect
        x={s * 0.54}
        y={s * 0.36}
        width={s * 0.28}
        height={s * 0.16}
        fill={color}
        cornerRadius={1}
      />
      <Line
        points={[s * 0.12, s * 0.6, s * 0.22, s * 0.52, s * 0.34, s * 0.58]}
        stroke={color}
        strokeWidth={Math.max(1.5, size * 0.05)}
        lineCap="round"
        lineJoin="round"
      />
    </Group>
  )
}

function EnvelopeKonva({ color, size }: { color: string; size: number }) {
  const s = size * 0.85
  return (
    <Group offsetX={s / 2} offsetY={s / 2}>
      <Rect x={0} y={s * 0.2} width={s} height={s * 0.55} fill={color} cornerRadius={2} />
      <Line
        points={[0, s * 0.22, s / 2, s * 0.52, s, s * 0.22]}
        stroke={color}
        strokeWidth={1}
        fill="transparent"
        opacity={0.65}
      />
    </Group>
  )
}

function VineScrollKonva({ color, size }: { color: string; size: number }) {
  const s = size
  return (
    <Group offsetX={s / 2} offsetY={s / 2}>
      <Line
        points={[s * 0.08, s * 0.82, s * 0.35, s * 0.45, s * 0.62, s * 0.35, s * 0.88, s * 0.5]}
        stroke={color}
        strokeWidth={Math.max(2, size * 0.055)}
        lineCap="round"
        tension={0.4}
        bezier
      />
      <Ellipse x={s * 0.28} y={s * 0.58} radiusX={s * 0.1} radiusY={s * 0.06} fill={color} rotation={-30} />
      <Ellipse x={s * 0.58} y={s * 0.38} radiusX={s * 0.1} radiusY={s * 0.06} fill={color} rotation={20} />
      <Ellipse x={s * 0.78} y={s * 0.52} radiusX={s * 0.1} radiusY={s * 0.06} fill={color} rotation={-10} />
    </Group>
  )
}

function VineCornerKonva({ color, size }: { color: string; size: number }) {
  const s = size
  return (
    <Group offsetX={s / 2} offsetY={s / 2}>
      <Line
        points={[s * 0.12, s * 0.88, s * 0.12, s * 0.28]}
        stroke={color}
        strokeWidth={Math.max(2, size * 0.055)}
        lineCap="round"
      />
      <Line
        points={[s * 0.12, s * 0.88, s * 0.72, s * 0.88]}
        stroke={color}
        strokeWidth={Math.max(2, size * 0.055)}
        lineCap="round"
      />
      <Ellipse x={s * 0.22} y={s * 0.42} radiusX={s * 0.1} radiusY={s * 0.06} fill={color} rotation={-40} />
      <Ellipse x={s * 0.48} y={s * 0.78} radiusX={s * 0.1} radiusY={s * 0.06} fill={color} rotation={10} />
    </Group>
  )
}

function FloralClusterKonva({ color, size }: { color: string; size: number }) {
  const s = size
  const r = s * 0.11
  return (
    <Group offsetX={s / 2} offsetY={s / 2}>
      <Rect x={s / 2 - 1.2} y={s * 0.52} width={2.4} height={s * 0.35} fill={color} cornerRadius={1} />
      <Ellipse x={s * 0.34} y={s * 0.34} radiusX={r} radiusY={r} fill={color} />
      <Ellipse x={s * 0.66} y={s * 0.34} radiusX={r} radiusY={r} fill={color} />
      <Ellipse x={s * 0.5} y={s * 0.52} radiusX={r} radiusY={r} fill={color} />
    </Group>
  )
}

function RoseBudKonva({ color, size }: { color: string; size: number }) {
  const s = size
  return (
    <Group offsetX={s / 2} offsetY={s / 2}>
      <Line
        points={[s / 2, s * 0.88, s / 2, s * 0.42]}
        stroke={color}
        strokeWidth={Math.max(2, size * 0.05)}
        lineCap="round"
      />
      <Ellipse x={s / 2} y={s * 0.3} radiusX={s * 0.15} radiusY={s * 0.18} fill={color} />
      <Ellipse x={s * 0.38} y={s * 0.36} radiusX={s * 0.1} radiusY={s * 0.12} fill={color} rotation={-25} />
      <Ellipse x={s * 0.62} y={s * 0.36} radiusX={s * 0.1} radiusY={s * 0.12} fill={color} rotation={25} />
    </Group>
  )
}

function LeafSprigKonva({ color, size }: { color: string; size: number }) {
  const s = size
  return (
    <Group offsetX={s / 2} offsetY={s / 2}>
      <Rect x={s / 2 - 1.2} y={s * 0.18} width={2.4} height={s * 0.62} fill={color} cornerRadius={1.2} />
      <Ellipse x={s * 0.34} y={s * 0.42} radiusX={s * 0.14} radiusY={s * 0.07} fill={color} rotation={-40} />
      <Ellipse x={s * 0.66} y={s * 0.58} radiusX={s * 0.14} radiusY={s * 0.07} fill={color} rotation={40} />
    </Group>
  )
}

export function ShapeOrnament({
  shapeType,
  color,
  size,
  embossed,
}: {
  shapeType?: OrnamentShapeType
  color: string
  size: number
  embossed?: boolean
}) {
  const r = size / 2

  const complex =
    shapeType === 'tulip' ? (
      <TulipKonva color={color} size={size} />
    ) : shapeType === 'bird-mail' ? (
      <BirdMailKonva color={color} size={size} />
    ) : shapeType === 'envelope' ? (
      <EnvelopeKonva color={color} size={size} />
    ) : shapeType === 'vine-scroll' ? (
      <VineScrollKonva color={color} size={size} />
    ) : shapeType === 'vine-corner' ? (
      <VineCornerKonva color={color} size={size} />
    ) : shapeType === 'floral-cluster' ? (
      <FloralClusterKonva color={color} size={size} />
    ) : shapeType === 'rose-bud' ? (
      <RoseBudKonva color={color} size={size} />
    ) : shapeType === 'leaf-sprig' ? (
      <LeafSprigKonva color={color} size={size} />
    ) : null

  if (complex) {
    return <ShadowWrap size={size} embossed={embossed}>{complex}</ShadowWrap>
  }

  if (shapeType === 'circle') {
    return (
      <ShadowWrap size={size} embossed={embossed}>
        <Rect x={-r} y={-r} width={size} height={size} cornerRadius={size} fill={color} />
      </ShadowWrap>
    )
  }

  if (shapeType === 'diamond') {
    return (
      <ShadowWrap size={size} embossed={embossed}>
        <Group rotation={45}>
          <Rect x={-r * 0.7} y={-r * 0.7} width={size * 0.7} height={size * 0.7} fill={color} />
        </Group>
      </ShadowWrap>
    )
  }

  if (shapeType === 'arc') {
    return (
      <ShadowWrap size={size} embossed={embossed}>
        <Arc innerRadius={r * 0.5} outerRadius={r} angle={180} fill={color} rotation={180} />
      </ShadowWrap>
    )
  }

  if (shapeType === 'flourish') {
    return (
      <ShadowWrap size={size} embossed={embossed}>
        <Group>
          <Line
            points={[-r * 0.7, r * 0.3, 0, -r * 0.2, r * 0.7, r * 0.3]}
            stroke={color}
            strokeWidth={Math.max(2, size * 0.07)}
            lineCap="round"
            tension={0.35}
            bezier
          />
          <Line
            points={[-r * 0.5, r * 0.1, 0, -r * 0.45, r * 0.5, r * 0.1]}
            stroke={color}
            strokeWidth={Math.max(1.5, size * 0.05)}
            lineCap="round"
            tension={0.35}
            bezier
          />
        </Group>
      </ShadowWrap>
    )
  }

  const glyph =
    shapeType === 'star' ? '★' : shapeType === 'heart' || !shapeType ? '♥' : '●'

  return (
    <ShadowWrap size={size} embossed={embossed}>
      <Text
        text={glyph}
        fontSize={size}
        fill={color}
        offsetX={size / 2}
        offsetY={size / 2}
      />
    </ShadowWrap>
  )
}
