/** Canonical online gallery retention — keep marketing and legal copy in sync. */

export const RETENTION_ESSENTIAL_MONTHS = 3
export const RETENTION_PREMIUM_MONTHS = 12

export const RETENTION_ESSENTIAL_LABEL = '3 months'
export const RETENTION_PREMIUM_LABEL = '12 months'
export const RETENTION_SIGNATURE_LABEL = 'Custom (agreed in writing)'

export const ONLINE_PHOTOS_ESSENTIAL =
  'Online digital photos available for download — access for 3 months'
export const ONLINE_PHOTOS_PREMIUM =
  'Online digital photos available for download — access for 12 months (Premium)'
export const ONLINE_PHOTOS_SIGNATURE =
  'Online gallery access tailored to your event — discuss options with us'

export const RETENTION_TIER_SUMMARY =
  'Essential: 3 months · Premium: 12 months · Signature: custom'

export const RETENTION_LEGAL_PARAGRAPH =
  'Online gallery access depends on your package: Essential includes 3 months, Premium includes 12 months, and Signature packages use a custom retention period agreed in writing. After expiry, gallery links may be disabled and files may be deleted. Please download photos you wish to keep before access expires.'

export function retentionHintForPackage(slug: string): string | null {
  if (slug === 'premium') return `Online photos — ${RETENTION_PREMIUM_LABEL}`
  if (slug === 'signature' || slug === 'enterprise') return null
  return `Online photos — ${RETENTION_ESSENTIAL_LABEL}`
}

export function retentionFootnoteForPackage(slug: string): string | null {
  if (slug === 'signature' || slug === 'enterprise') {
    return 'Custom online access — contact us to plan your event'
  }
  return null
}
