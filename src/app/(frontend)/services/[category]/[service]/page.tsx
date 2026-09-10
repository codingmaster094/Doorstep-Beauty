import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { Button } from '@/components/ui/Button'
import { PriceBreakdown } from '@/components/ui/PriceBreakdown'
import { pageMeta, jsonLd, absUrl } from '@/lib/seo'
import { serviceSellPrice } from '@/lib/pricing/money'
import { mediaUrl, rel } from '@/lib/utils'
import { whatsappLink } from '@/lib/whatsapp'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ category: string; service: string }> }) {
  const { category, service } = await params
  const payload = await getPayloadClient()
  const found = await payload.find({ collection: 'services', where: { slug: { equals: service } }, limit: 1, overrideAccess: true })
  const s = found.docs[0]
  if (!s) return {}
  return pageMeta({
    title: s.seo?.title || `${s.name} at home in Surat`,
    description: s.seo?.description || s.shortDescription,
    path: `/services/${category}/${service}`,
  })
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ category: string; service: string }> }) {
  const { category, service } = await params
  const payload = await getPayloadClient()
  const [found, settings] = await Promise.all([
    payload.find({ collection: 'services', where: { slug: { equals: service } }, limit: 1, depth: 2, overrideAccess: true }),
    payload.findGlobal({ slug: 'site-settings', overrideAccess: true }),
  ])
  const s = found.docs[0]
  if (!s) notFound()
  const cat = rel(s.category)
  const price = serviceSellPrice(s)
  const visit = s.visitChargeType === 'fixed' ? (s.homeVisitCharge ?? settings.defaultHomeVisitCharge) : settings.defaultHomeVisitCharge
  return (
    <article className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: s.name,
            description: s.shortDescription,
            url: absUrl(`/services/${category}/${service}`),
            areaServed: 'Surat',
            offers: { '@type': 'Offer', priceCurrency: 'INR', price },
          }),
        }}
      />
      <p className="text-sm text-ink-soft">
        <Link href="/services">Services</Link> / <Link href={`/services/${cat?.slug}`}>{cat?.name}</Link>
      </p>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="salon-frame aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-blush">
          {mediaUrl(rel(s.featuredImage)) ? (
            <img
              src={mediaUrl(rel(s.featuredImage))}
              alt={s.name}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div>
          <h1 className="font-display text-5xl">{s.name}</h1>
          <p className="mt-4 leading-7 text-ink-soft">{s.shortDescription}</p>
          <p className="mt-3 text-sm">{s.durationMinutes} minutes</p>
          <div className="mt-5">
            <PriceBreakdown
              serviceAmount={price}
              homeVisitCharge={visit ?? 0}
              addonAmount={0}
              discount={0}
              finalAmount={price + (visit ?? 0)}
            />
            <p className="mt-2 text-xs text-ink-soft">Area-based visit charges may apply at checkout.</p>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button href={`/book?service=${s.slug}`}>Book this service</Button>
            <Button href={whatsappLink(settings.whatsapp, `Hi, I want to book ${s.name} at home in Surat.`)} variant="secondary">
              WhatsApp
            </Button>
          </div>
        </div>
      </div>
      {s.fullDescription ? <p className="max-w-3xl leading-7">{s.fullDescription}</p> : null}
      {s.included?.length ? (
        <section>
          <h2 className="font-display text-3xl">What is included</h2>
          <ul className="mt-3 list-disc pl-5 text-sm leading-7">
            {s.included.map((i) => (
              <li key={i.item}>{i.item}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {s.notIncluded?.length ? (
        <section>
          <h2 className="font-display text-3xl">What is not included</h2>
          <ul className="mt-3 list-disc pl-5 text-sm leading-7">
            {s.notIncluded.map((i) => (
              <li key={i.item}>{i.item}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {s.benefits?.length ? (
        <section>
          <h2 className="font-display text-3xl">Benefits</h2>
          <ul className="mt-3 list-disc pl-5 text-sm leading-7">
            {s.benefits.map((i) => (
              <li key={i.item}>{i.item}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {s.gallery?.length ? (
        <section>
          <h2 className="font-display text-3xl">Photos</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {s.gallery.map((item, index) => {
              const src = mediaUrl(rel(item))
              if (!src) return null
              return <img key={src + index} src={src} alt={`${s.name} ${index + 1}`} className="aspect-[4/5] w-full object-cover" />
            })}
          </div>
        </section>
      ) : null}
    </article>
  )
}
