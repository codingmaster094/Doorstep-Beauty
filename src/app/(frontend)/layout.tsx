import { Cormorant_Garamond, Outfit } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileDock } from '@/components/layout/MobileDock'
import { SalonAtmosphere } from '@/components/layout/SalonAtmosphere'
import { PwaRegister } from '@/components/pwa/PwaRegister'
import { getPayloadClient } from '@/lib/payload'
import { mediaUrl, rel } from '@/lib/utils'
import { defaultExploreLinks, defaultHeaderLinks, defaultPolicyLinks, navFromCms } from '@/lib/navigation'
import type { Metadata, Viewport } from 'next'

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})
const sans = Outfit({ subsets: ['latin'], variable: '--font-sans' })

export const viewport: Viewport = {
  themeColor: '#7a3045',
  viewportFit: 'cover',
}

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 1, overrideAccess: true })
  const title = settings.seo?.defaultTitle || `${settings.businessName} | Beauty at home in Surat`
  const description =
    settings.seo?.defaultDescription ||
    'Professional women beauty and salon home services in Surat — facials, waxing, makeup, bridal and more at your doorstep.'
  const icon = mediaUrl(rel(settings.favicon))
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: { default: title, template: `%s | ${settings.businessName}` },
    description,
    icons: icon ? { icon } : undefined,
    manifest: '/manifest.webmanifest',
    appleWebApp: {
      capable: true,
      title: settings.businessName || 'Bloom At Home',
      statusBarStyle: 'default',
    },
    robots: { index: true, follow: true },
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayloadClient()
  const settings = await payload
    .findGlobal({ slug: 'site-settings', depth: 1, overrideAccess: true })
    .catch(() => null)
  const name = settings?.businessName || 'Bloom At Home'
  const phone = settings?.phone || '9876543210'
  const whatsapp = settings?.whatsapp || '919876543210'
  const email = settings?.email || 'hello@example.com'
  const address = settings?.address || 'Surat, Gujarat'
  const logoUrl = mediaUrl(rel(settings?.logo))
  const headerLinks = navFromCms(settings?.headerLinks, defaultHeaderLinks)
  const explore = navFromCms(settings?.footerExploreLinks, defaultExploreLinks)
  const policies = navFromCms(settings?.footerPolicyLinks, defaultPolicyLinks)

  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} bg-cream font-sans text-ink antialiased`}>
        <PwaRegister />
        <SalonAtmosphere />
        <div className="site-shell">
        <Header
          businessName={name}
          logoUrl={logoUrl}
          links={headerLinks}
          ctaLabel={settings?.headerCtaLabel || 'Book home service'}
          ctaHref={settings?.headerCtaHref || '/book'}
        />
        <main className="mx-auto min-h-[70vh] max-w-6xl px-4 pb-10 pt-6 md:pt-8">{children}</main>
        <Footer
          businessName={name}
          logoUrl={logoUrl}
          tagline={settings?.footerTagline || settings?.tagline || 'Professional beauty services at home in Surat.'}
          explore={explore}
          policies={policies}
          phone={phone}
          email={email}
          address={address}
          whatsapp={whatsapp}
          instagram={settings?.instagram || undefined}
          facebook={settings?.facebook || undefined}
          hours={settings?.businessHours || undefined}
          copyright={settings?.copyrightText || 'All rights reserved.'}
        />
        <MobileDock
          phone={phone}
          whatsapp={whatsapp}
          bookLabel={settings?.mobileBookLabel || 'Book now'}
          bookHref={settings?.headerCtaHref || '/book'}
        />
        </div>
      </body>
    </html>
  )
}
