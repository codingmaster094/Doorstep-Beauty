import type { Payload } from 'payload'
import { computeFinalAmount, serviceSellPrice, type MoneyBreakdown } from './money'

export type QuoteInput = {
  serviceId: string
  addonIds?: string[]
  areaId?: string
  couponCode?: string
  customerId?: string
}

export type QuoteResult = MoneyBreakdown & {
  serviceName: string
  visitChargeType: string
  couponId?: string
  couponCode?: string
  couponError?: string
}

function relId(value: unknown): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value && 'id' in value) return String((value as { id: string }).id)
  return undefined
}

export async function calculateQuote(payload: Payload, input: QuoteInput): Promise<QuoteResult> {
  const service = await payload.findByID({
    collection: 'services',
    id: input.serviceId,
    depth: 0,
    overrideAccess: true,
  })

  if (!service || service.available === false) {
    throw new Error('This service is currently unavailable.')
  }

  const settings = await payload.findGlobal({
    slug: 'site-settings',
    overrideAccess: true,
  })

  const serviceAmount = serviceSellPrice(service)
  const visitType = (service.visitChargeType as string) || 'default'
  let homeVisitCharge = settings.defaultHomeVisitCharge ?? 0

  if (visitType === 'fixed') {
    homeVisitCharge = service.homeVisitCharge ?? homeVisitCharge
  } else if ((visitType === 'area' || visitType === 'distance') && input.areaId) {
    const area = await payload.findByID({
      collection: 'service-areas',
      id: input.areaId,
      overrideAccess: true,
    })
    if (!area || area.active === false) {
      throw new Error('This service area is not available.')
    }
    homeVisitCharge = area.homeVisitCharge ?? homeVisitCharge
  } else if (visitType === 'area' && !input.areaId) {
    homeVisitCharge = settings.defaultHomeVisitCharge ?? 0
  }

  const allowedAddonIds = new Set((service.addons || []).map((a) => relId(a)).filter(Boolean) as string[])
  const requested = input.addonIds || []
  let addonAmount = 0

  for (const addonId of requested) {
    if (allowedAddonIds.size && !allowedAddonIds.has(addonId)) {
      throw new Error('One or more add-ons are not valid for this service.')
    }
    const addon = await payload.findByID({
      collection: 'service-addons',
      id: addonId,
      overrideAccess: true,
    })
    if (!addon || addon.active === false) {
      throw new Error('An add-on is no longer available.')
    }
    addonAmount += addon.price ?? 0
  }

  let discount = 0
  let couponId: string | undefined
  let couponError: string | undefined
  const code = input.couponCode?.trim().toUpperCase()

  if (code) {
    const { validateCoupon } = await import('@/lib/coupons/validateCoupon')
    const result = await validateCoupon(payload, {
      code,
      serviceId: input.serviceId,
      subtotal: serviceAmount + homeVisitCharge + addonAmount,
      customerId: input.customerId,
    })
    if (result.ok) {
      discount = result.discount
      couponId = result.couponId
    } else {
      couponError = result.error
    }
  }

  const finalAmount = computeFinalAmount({
    serviceAmount,
    homeVisitCharge,
    addonAmount,
    discount,
  })

  return {
    serviceName: service.name,
    visitChargeType: visitType,
    serviceAmount,
    homeVisitCharge,
    addonAmount,
    discount,
    finalAmount,
    couponId,
    couponCode: code,
    couponError,
  }
}
