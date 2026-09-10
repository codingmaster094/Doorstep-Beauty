import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { Button } from '@/components/ui/Button'
import { pageMeta } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  return pageMeta({
    title: `Coupon ${code}`,
    description: `Apply coupon ${code} on home beauty services in Surat.`,
    path: `/coupon/${code}`,
  })
}

export default async function CouponPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const payload = await getPayloadClient()
  const found = await payload.find({ collection: 'coupons', where: { code: { equals: code.toUpperCase() } }, limit: 1, overrideAccess: true })
  const coupon = found.docs[0]
  if (!coupon || !coupon.active) notFound()
  return (
    <div className="space-y-4">
      <h1 className="font-display text-5xl">{coupon.code}</h1>
      <p>
        {coupon.type === 'percentage' ? `${coupon.percentage}% off` : `₹${coupon.fixedAmount} off`}
        {coupon.minimumOrderValue ? ` on orders above ₹${coupon.minimumOrderValue}` : ''}
      </p>
      <Button href="/book">Apply in booking</Button>
    </div>
  )
}
