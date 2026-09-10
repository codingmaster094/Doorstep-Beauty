import { getPayloadClient } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'
import { EmptyState } from '@/components/ui/States'

async function CmsPage({ slug, fallbackTitle }: { slug: string; fallbackTitle: string }) {
  const payload = await getPayloadClient()
  const found = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, overrideAccess: true })
  const page = found.docs[0]
  if (!page?.content) {
    return <EmptyState title={page?.title || fallbackTitle} body="This page will appear once you publish it in Admin → Pages." />
  }
  return (
    <article className="max-w-2xl space-y-4">
      <h1 className="font-display text-5xl">{page.title || fallbackTitle}</h1>
      <div className="whitespace-pre-wrap leading-7 text-ink-soft">{page.content}</div>
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
