import { CmsPage } from '@/components/content/CmsPage'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Cancellation policy',
  description: 'How cancellations work for home beauty appointments in Surat.',
  path: '/cancellation',
})

export default function Page() {
  return <CmsPage slug="cancellation" fallbackTitle="Cancellation policy" />
}
