import { getPayloadClient } from '@/lib/payload'
import { EmptyState } from '@/components/ui/States'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Search',
  description: 'Search services and beauticians for home beauty in Surat.',
  path: '/search',
})

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams
  const payload = await getPayloadClient()
  const query = q.trim()
  const [services, beauticians] = query
    ? await Promise.all([
        payload.find({
          collection: 'services',
          where: { or: [{ name: { like: query } }, { shortDescription: { like: query } }] },
          limit: 20,
          depth: 1,
          overrideAccess: true,
        }),
        payload.find({
          collection: 'beauticians',
          where: { name: { like: query } },
          limit: 10,
          overrideAccess: true,
        }),
      ])
    : [{ docs: [] }, { docs: [] }]

  return (
    <div className="space-y-6">
      <h1 className="font-display text-5xl">Search</h1>
      <form>
        <label className="sr-only" htmlFor="q">
          Search
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          placeholder="Facial, makeup, Vesu…"
          className="min-h-11 w-full border border-line bg-white px-3"
        />
      </form>
      {query && !services.docs.length && !beauticians.docs.length ? (
        <EmptyState title="No services found." body="Try another word, like facial or makeup." />
      ) : null}
      <div className="space-y-3">
        {services.docs.map((s) => (
          <a key={s.id} href={`/services/${typeof s.category === 'object' ? s.category.slug : 'all'}/${s.slug}`} className="block border border-line bg-white p-4">
            {s.name}
          </a>
        ))}
        {beauticians.docs.map((b) => (
          <a key={b.id} href={`/beauticians/${b.slug}`} className="block border border-line bg-white p-4">
            {b.name}
          </a>
        ))}
      </div>
    </div>
  )
}
