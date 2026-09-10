import { CmsPage } from '@/components/content/CmsPage'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Privacy policy',
  description: 'Privacy policy for Bloom At Home.',
  path: '/privacy',
})

export default function Page() {
  return <CmsPage slug="privacy" fallbackTitle="Privacy policy" />
}
