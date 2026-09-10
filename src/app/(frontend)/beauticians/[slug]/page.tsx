import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { Button } from '@/components/ui/Button'
import { Rating } from '@/components/ui/Card'
import { pageMeta } from '@/lib/seo'
import { mediaUrl, rel } from '@/lib/utils'
import { demoImageForBeautician } from '@/content/demo'
import { whatsappLink } from '@/lib/whatsapp'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const found = await payload.find({ collection: 'beauticians', where: { slug: { equals: slug } }, limit: 1, overrideAccess: true })
  const b = found.docs[0]
  if (!b) return {}
  return pageMeta({
    title: b.seo?.title || `${b.name} · Beautician in Surat`,
    description: b.seo?.description || b.bio || `${b.name} home beautician in Surat.`,
    path: `/beauticians/${slug}`,
  })
}

export default async function BeauticianDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const [found, settings] = await Promise.all([
    payload.find({ collection: 'beauticians', where: { slug: { equals: slug } }, limit: 1, depth: 2, overrideAccess: true }),
    payload.findGlobal({ slug: 'site-settings', overrideAccess: true }),
  ])
  const b = found.docs[0]
  if (!b) notFound()
  return (
    <article className="space-y-6">
      <div className="flex gap-4">
        {mediaUrl(rel(b.profileImage)) || demoImageForBeautician(b.slug) ? (
          <img
            src={mediaUrl(rel(b.profileImage)) || demoImageForBeautician(b.slug)}
            alt={b.name}
            className="h-32 w-24 object-cover"
          />
        ) : null}
        <div>
          <h1 className="font-display text-5xl">{b.name}</h1>
          <p className="mt-2">{b.experienceYears}+ years experience</p>
          <Rating value={b.rating ?? 0} />
        </div>
      </div>
      <p className="leading-7 text-ink-soft">{b.bio}</p>
      <p className="text-sm">Areas: {(b.serviceAreas || []).map((a) => rel(a)?.name).filter(Boolean).join(', ')}</p>
      {b.portfolio?.length ? (
        <section>
          <h2 className="font-display text-3xl">Work photos</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {b.portfolio.map((item, index) => {
              const src = mediaUrl(rel(item))
              if (!src) return null
              return <img key={src + index} src={src} alt={`${b.name} work ${index + 1}`} className="aspect-[4/5] w-full object-cover" />
            })}
          </div>
        </section>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button href="/book">Book with us</Button>
        <Button href={whatsappLink(b.whatsapp || settings.whatsapp, `Hi ${b.name}, I would like to book a home beauty service.`)} variant="secondary">
          WhatsApp
        </Button>
      </div>
    </article>
  )
}
