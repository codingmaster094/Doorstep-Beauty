import { getPayloadClient } from '@/lib/payload'
import { Accordion } from '@/components/ui/Accordion'
import { pageMeta, jsonLd } from '@/lib/seo'
import { demoFaqs } from '@/content/demo'
import { DemoNotice } from '@/components/ui/DemoNotice'

export const metadata = pageMeta({
  title: 'FAQ',
  description: 'Questions about booking beauty services at home in Surat.',
  path: '/faq',
})

export default async function FaqPage() {
  const payload = await getPayloadClient()
  const faqs = await payload.find({ collection: 'faqs', where: { published: { equals: true } }, sort: 'sortOrder', limit: 50, overrideAccess: true })
  const items = faqs.docs.length ? faqs.docs : demoFaqs
  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: items.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
          }),
        }}
      />
      <DemoNotice />
      <h1 className="font-display text-5xl">FAQ</h1>
      <Accordion items={items.map((f) => ({ question: f.question, answer: f.answer }))} />
    </div>
  )
}
