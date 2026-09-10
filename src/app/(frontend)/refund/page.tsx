import { CmsPage } from '@/components/content/CmsPage'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Refund policy',
  description: 'Refund policy for Bloom At Home appointments.',
  path: '/refund',
})

export default function Page() {
  return <CmsPage slug="refund" fallbackTitle="Refund policy" />
}
