import { getPayloadClient } from '@/lib/payload'
import { ReelCard } from '@/components/ui/ReelCard'
import { EmptyState } from '@/components/ui/States'
import { pageMeta } from '@/lib/seo'
import { mediaUrl, rel } from '@/lib/utils'

export const metadata = pageMeta({
  title: 'Reels',
  description: 'Watch beauty service videos from our Surat home service team.',
  path: '/reels',
})

export default async function ReelsPage() {
  const payload = await getPayloadClient()
  const found = await payload.find({
    collection: 'reels',
    where: { published: { equals: true } },
    sort: 'sortOrder',
    limit: 24,
    depth: 2,
    overrideAccess: true,
  })
  const list = found.docs.map((r) => ({
    id: String(r.id),
    title: r.title,
    caption: r.caption || undefined,
    thumbnail: mediaUrl(rel(r.thumbnail)),
    videoUrl: mediaUrl(rel(r.video)),
    externalUrl: r.externalUrl || undefined,
  }))
  return (
    <div className="space-y-6">
      <h1 className="font-display text-5xl">Reels</h1>
      {list.length ? (
        <div className="flex snap-x gap-3 overflow-x-auto pb-4 md:flex-wrap md:overflow-visible">
          {list.map((r) => (
            <ReelCard
              key={r.id}
              title={r.title}
              caption={r.caption}
              thumbnail={r.thumbnail}
              videoUrl={r.videoUrl}
              externalUrl={r.externalUrl}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No reels yet" body="Add reels in Admin and they will appear here." />
      )}
    </div>
  )
}
