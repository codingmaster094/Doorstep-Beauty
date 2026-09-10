import { Cormorant_Garamond, Outfit } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileDock } from '@/components/layout/MobileDock'
import { getPayloadClient } from '@/lib/payload'
import type { Metadata } from 'next'

const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-display' })
const sans = Outfit({ subsets: ['latin'], variable: '--font-sans' })

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
  const title = settings.seo?.defaultTitle || `${settings.businessName} | Beauty at home in Surat`
  const description =
    settings.seo?.defaultDescription ||
    'Professional women beauty and salon home services in Surat — facials, waxing, makeup, bridal and more at your doorstep.'
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: { default: title, template: `%s | ${settings.businessName}` },
    description,
    robots: { index: true, follow: true },
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true }).catch(() => null)
  const name = settings?.businessName || 'Bloom At Home'
  const phone = settings?.phone || '9876543210'
  const whatsapp = settings?.whatsapp || '919876543210'
  const email = settings?.email || 'hello@example.com'
  const address = settings?.address || 'Surat, Gujarat'

  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} bg-cream font-sans text-ink antialiased`}>
        <Header businessName={name} />
        <main className="mx-auto min-h-[70vh] max-w-6xl px-4 pb-8 pt-6">{children}</main>
        <Footer businessName={name} phone={phone} email={email} address={address} whatsapp={whatsapp} />
        <MobileDock phone={phone} whatsapp={whatsapp} />
      </body>
    </html>
  )
}
