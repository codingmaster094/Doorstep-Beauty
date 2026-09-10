import { getPayloadClient } from '@/lib/payload'
import { Accordion } from '@/components/ui/Accordion'
import { EmptyState } from '@/components/ui/States'
import { pageMeta, jsonLd } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'FAQ',
  description: 'Questions about booking beauty services at home in Surat.',
  path: '/faq',
})

export default async function FaqPage() {
  const payload = await getPayloadClient()
  const faqs = await payload.find({
    collection: 'faqs',
    where: { published: { equals: true } },
    sort: 'sortOrder',
    limit: 50,
    overrideAccess: true,
  })
  return (
    <div className="space-y-6">
      {faqs.docs.length ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.docs.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: { '@type': 'Answer', text: f.answer },
              })),
            }),
          }}
        />
      ) : null}
      <h1 className="font-display text-5xl">FAQ</h1>
      {faqs.docs.length ? (
        <Accordion items={faqs.docs.map((f) => ({ question: f.question, answer: f.answer }))} />
      ) : (
        <EmptyState title="No FAQs yet" body="Add FAQs in Admin and they will appear here." />
      )}
    </div>
  )
}
