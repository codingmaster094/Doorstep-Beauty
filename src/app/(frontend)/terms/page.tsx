import { CmsPage } from '@/components/content/CmsPage'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Terms and conditions',
  description: 'Terms for booking home beauty services.',
  path: '/terms',
})

export default function Page() {
  return <CmsPage slug="terms" fallbackTitle="Terms and conditions" />
}
