import type { Payload } from 'payload'

export type CouponCheck =
  | { ok: true; discount: number; couponId: string }
  | { ok: false; error: string }

export async function validateCoupon(
  payload: Payload,
  args: { code: string; serviceId: string; subtotal: number; customerId?: string },
): Promise<CouponCheck> {
  const found = await payload.find({
    collection: 'coupons',
    where: { code: { equals: args.code } },
    limit: 1,
    overrideAccess: true,
  })
  const coupon = found.docs[0]
  if (!coupon) return { ok: false, error: 'This coupon code is not valid.' }
  if (!coupon.active) return { ok: false, error: 'This coupon is not active.' }

  const now = Date.now()
  if (coupon.startDate && new Date(coupon.startDate).getTime() > now) {
    return { ok: false, error: 'This coupon is not active yet.' }
  }
  if (coupon.endDate && new Date(coupon.endDate).getTime() < now) {
    return { ok: false, error: 'This coupon has expired.' }
  }
  if (coupon.usageLimit && (coupon.usedCount ?? 0) >= coupon.usageLimit) {
    return { ok: false, error: 'This coupon has reached its usage limit.' }
  }

  const applicable = (coupon.applicableServices || []) as Array<string | { id: string }>
  if (applicable.length) {
    const ids = applicable.map((s) => (typeof s === 'string' ? s : s.id))
    if (!ids.includes(args.serviceId)) {
      return { ok: false, error: 'This coupon does not apply to the selected service.' }
    }
  }

  if ((coupon.minimumOrderValue ?? 0) > args.subtotal) {
    return { ok: false, error: `Minimum order value is ₹${coupon.minimumOrderValue}.` }
  }

  if (args.customerId && coupon.perCustomerLimit) {
    const used = await payload.find({
      collection: 'appointments',
      where: {
        and: [
          { customer: { equals: args.customerId } },
          { coupon: { equals: coupon.id } },
          { status: { not_in: ['cancelled'] } },
        ],
      },
      limit: coupon.perCustomerLimit,
      overrideAccess: true,
    })
    if (used.totalDocs >= coupon.perCustomerLimit) {
      return { ok: false, error: 'You have already used this coupon.' }
    }
  }

  let discount = 0
  if (coupon.type === 'percentage') {
    discount = Math.round((args.subtotal * (coupon.percentage ?? 0)) / 100)
  } else {
    discount = coupon.fixedAmount ?? 0
  }
  if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
    discount = coupon.maximumDiscount
  }
  discount = Math.min(discount, args.subtotal)

  return { ok: true, discount, couponId: String(coupon.id) }
}
