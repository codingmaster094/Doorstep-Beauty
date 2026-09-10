import { getPayloadClient } from '@/lib/payload'
import { ReelCard } from '@/components/ui/ReelCard'
import { DemoNotice } from '@/components/ui/DemoNotice'
import { demoReels } from '@/content/demo'
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
  const list = found.docs.length
    ? found.docs.map((r) => ({
        id: String(r.id),
        title: r.title,
        caption: r.caption || undefined,
        thumbnail: mediaUrl(rel(r.thumbnail)) || demoReels.find((d) => d.title === r.title)?.thumbnail,
        videoUrl: mediaUrl(rel(r.video)),
        externalUrl: r.externalUrl || undefined,
      }))
    : demoReels
  return (
    <div className="space-y-6">
      <DemoNotice />
      <h1 className="font-display text-5xl">Reels</h1>
      <div className="flex snap-x gap-3 overflow-x-auto pb-4 md:flex-wrap md:overflow-visible">
        {list.map((r) => (
          <ReelCard
            key={'id' in r ? r.id : r.title}
            title={r.title}
            caption={r.caption}
            thumbnail={r.thumbnail}
            videoUrl={'videoUrl' in r ? r.videoUrl : undefined}
            externalUrl={r.externalUrl}
          />
        ))}
      </div>
    </div>
  )
}
