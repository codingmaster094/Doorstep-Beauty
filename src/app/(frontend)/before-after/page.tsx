import { getPayloadClient } from '@/lib/payload'
import { BeforeAfterSlider } from '@/components/ui/BeforeAfterSlider'
import { EmptyState } from '@/components/ui/States'
import { pageMeta } from '@/lib/seo'
import { mediaUrl, rel } from '@/lib/utils'

export const metadata = pageMeta({
  title: 'Before and after results',
  description: 'See at-home beauty service results from our Surat beauticians.',
  path: '/before-after',
})

export default async function BeforeAfterPage() {
  const payload = await getPayloadClient()
  const found = await payload.find({
    collection: 'before-after',
    where: { published: { equals: true } },
    sort: 'sortOrder',
    limit: 24,
    depth: 2,
    overrideAccess: true,
  })
  const list = found.docs.map((item) => ({
    id: String(item.id),
    title: item.title,
    beforeSrc: mediaUrl(rel(item.beforeImage)) || '',
    afterSrc: mediaUrl(rel(item.afterImage)) || '',
  }))
  return (
    <div className="space-y-6">
      <h1 className="font-display text-5xl">Before & after</h1>
      {list.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((item) => (
            <BeforeAfterSlider
              key={item.id}
              title={item.title}
              beforeSrc={item.beforeSrc}
              afterSrc={item.afterSrc}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No results yet" body="Add before & after photos in Admin and they will appear here." />
      )}
    </div>
  )
}
