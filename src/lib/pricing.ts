export type PricingUnit = 'fixed' | 'per_frame' | 'per_hour' | 'per_km' | 'per_pack'

export type PricedPackage = {
  id: string | number
  name: string
  slug: string
  basePrice: number
  priceRange: string
  frameSummary: string
  description: string
  icon?: string | null
  features: { item: string; id?: string | null }[]
  notIncluded?: { item: string; id?: string | null }[] | null
  popular?: boolean | null
}

export type PricedAddOn = {
  id: string | number
  name: string
  slug: string
  price: number
  pricingUnit: PricingUnit
  description?: string | null
}

export type SelectedAddOn = {
  id: string | number
  quantity: number
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100)
}

export function unitLabel(unit: PricingUnit): string {
  switch (unit) {
    case 'per_frame':
      return '/frame'
    case 'per_hour':
      return '/hr'
    case 'per_km':
      return '/km'
    case 'per_pack':
      return '/pack'
    default:
      return ''
  }
}

export function formatAddOnPrice(price: number, unit: PricingUnit): string {
  const base = formatCents(price)
  const suffix = unitLabel(unit)
  return suffix ? `+${base}${suffix}` : `+${base}`
}

export function lineTotal(price: number, unit: PricingUnit, quantity: number): number {
  if (unit === 'fixed') return price
  return price * Math.max(1, quantity)
}

export function calculateEstimate(
  pkg: PricedPackage | null | undefined,
  addons: PricedAddOn[],
  selected: SelectedAddOn[],
): {
  packageTotal: number
  addOnLines: {
    id: string | number
    name: string
    price: number
    pricingUnit: PricingUnit
    quantity: number
    lineTotal: number
  }[]
  total: number
} {
  const packageTotal = pkg?.basePrice ?? 0
  const addOnLines = selected
    .map((sel) => {
      const addon = addons.find((a) => String(a.id) === String(sel.id))
      if (!addon) return null
      const quantity = Math.max(1, sel.quantity || 1)
      return {
        id: addon.id,
        name: addon.name,
        price: addon.price,
        pricingUnit: addon.pricingUnit,
        quantity,
        lineTotal: lineTotal(addon.price, addon.pricingUnit, quantity),
      }
    })
    .filter(Boolean) as {
    id: string | number
    name: string
    price: number
    pricingUnit: PricingUnit
    quantity: number
    lineTotal: number
  }[]

  const addOnTotal = addOnLines.reduce((sum, line) => sum + line.lineTotal, 0)

  return {
    packageTotal,
    addOnLines,
    total: packageTotal + addOnTotal,
  }
}
