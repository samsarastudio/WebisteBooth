import type { OrnamentShapeType } from './types'

export const RAISED_ORNAMENT_SHAPES: OrnamentShapeType[] = [
  'heart',
  'star',
  'circle',
  'diamond',
  'flourish',
  'arc',
  'tulip',
  'bird-mail',
  'envelope',
  'vine-scroll',
  'vine-corner',
  'floral-cluster',
  'rose-bud',
  'leaf-sprig',
]

export function ornamentShapeLabel(shapeType?: OrnamentShapeType): string {
  switch (shapeType) {
    case 'heart':
      return 'Heart'
    case 'star':
      return 'Star'
    case 'circle':
      return 'Circle'
    case 'diamond':
      return 'Diamond'
    case 'flourish':
      return 'Flourish'
    case 'arc':
      return 'Arc'
    case 'tulip':
      return 'Tulip'
    case 'bird-mail':
      return 'Dove & letter'
    case 'envelope':
      return 'Envelope'
    case 'vine-scroll':
      return 'Vine scroll'
    case 'vine-corner':
      return 'Corner vine'
    case 'floral-cluster':
      return 'Floral cluster'
    case 'rose-bud':
      return 'Rose bud'
    case 'leaf-sprig':
      return 'Leaf sprig'
    default:
      return 'Accent'
  }
}
