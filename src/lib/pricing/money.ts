export const BLOCKING_STATUSES = [
  'pending',
  'confirmed',
  'assigned',
  'on-the-way',
  'arrived',
  'service-started',
  'rescheduled',
] as const

export type MoneyBreakdown = {
  serviceAmount: number
  homeVisitCharge: number
  addonAmount: number
  discount: number
  finalAmount: number
}

export function serviceSellPrice(service: { basePrice?: number | null; salePrice?: number | null }): number {
  if (typeof service.salePrice === 'number' && service.salePrice > 0) return service.salePrice
  return service.basePrice ?? 0
}

export function computeFinalAmount(parts: Omit<MoneyBreakdown, 'finalAmount'>): number {
  return Math.max(0, parts.serviceAmount + parts.homeVisitCharge + parts.addonAmount - parts.discount)
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export const INDIAN_PHONE = /^[6-9]\d{9}$/
export const PINCODE = /^[1-9][0-9]{5}$/
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
