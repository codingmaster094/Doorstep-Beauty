import { CmsPage } from '@/components/content/CmsPage'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'About us',
  description: 'About our women beauty home service in Surat.',
  path: '/about',
})

export default function AboutPage() {
  return <CmsPage slug="about" fallbackTitle="About us" />
}
