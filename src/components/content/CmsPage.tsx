import { getPayloadClient } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

async function CmsPage({ slug, fallbackTitle }: { slug: string; fallbackTitle: string }) {
  const payload = await getPayloadClient()
  const found = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, overrideAccess: true })
  const page = found.docs[0]
  return (
    <article className="max-w-2xl space-y-4">
      <h1 className="font-display text-5xl">{page?.title || fallbackTitle}</h1>
      <div className="whitespace-pre-wrap leading-7 text-ink-soft">{page?.content || 'Content will appear here once published in the CMS.'}</div>
    </article>
  )
}

export function makeCmsRoute(slug: string, title: string, description: string, path: string) {
  return {
    metadata: pageMeta({ title, description, path }),
    Page: async function Page() {
      return <CmsPage slug={slug} fallbackTitle={title} />
    },
  }
}

export { CmsPage }
