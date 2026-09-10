import { getPayloadClient } from '@/lib/payload'
import { DemoNotice } from '@/components/ui/DemoNotice'
import { demoOffers } from '@/content/demo'
import { Button } from '@/components/ui/Button'
import { pageMeta } from '@/lib/seo'
import { mediaUrl, rel } from '@/lib/utils'

export const metadata = pageMeta({
  title: 'Offers in Surat',
  description: 'Current home beauty service offers and coupons in Surat.',
  path: '/offers',
})

export default async function OffersPage() {
  const payload = await getPayloadClient()
  const found = await payload.find({
    collection: 'offers',
    where: { active: { equals: true } },
    limit: 20,
    depth: 2,
    overrideAccess: true,
  })
  const nowMs = Date.now()
  const live = found.docs.filter((o) => {
    if (o.endDate && new Date(o.endDate).getTime() < nowMs) return false
    if (o.startDate && new Date(o.startDate).getTime() > nowMs) return false
    return true
  })
  const list = live.length
    ? live
    : demoOffers.map((o, i) => ({ id: String(i), title: o.title, description: o.description, coupon: null }))
  return (
    <div className="space-y-6">
      <DemoNotice />
      <h1 className="font-display text-5xl">Offers</h1>
      <div className="grid gap-4">
        {list.map((o) => {
          const coupon = 'coupon' in o ? rel(o.coupon) : null
          return (
            <article key={o.id} className="border border-line bg-white p-4">
              {'banner' in o && mediaUrl(rel(o.banner)) ? (
                <img src={mediaUrl(rel(o.banner))} alt={o.title} className="mb-3 aspect-[16/7] w-full object-cover" />
              ) : null}
              <h2 className="font-display text-3xl">{o.title}</h2>
              <p className="mt-2 text-sm text-ink-soft">{o.description}</p>
              {coupon ? (
                <p className="mt-3 text-sm">
                  Code <a className="text-rose" href={`/coupon/${coupon.code}`}>{coupon.code}</a>
                </p>
              ) : null}
              <Button href="/book" className="mt-4">
                Book with offer
              </Button>
            </article>
          )
        })}
      </div>
    </div>
  )
}
