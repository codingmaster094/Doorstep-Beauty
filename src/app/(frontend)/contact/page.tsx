import { getPayloadClient } from '@/lib/payload'
import { Button } from '@/components/ui/Button'
import { pageMeta } from '@/lib/seo'
import { whatsappLink, telLink, DEFAULT_WHATSAPP_MESSAGE } from '@/lib/whatsapp'

export const metadata = pageMeta({
  title: 'Contact',
  description: 'Contact Bloom At Home for beauty services at home in Surat.',
  path: '/contact',
})

export default async function ContactPage() {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
  return (
    <div className="max-w-xl space-y-6 rounded-[1.75rem] border border-gold/25 bg-white/80 p-6 shadow-[0_18px_40px_rgba(90,36,50,0.06)]">
      <div>
        <h1 className="font-display text-5xl">Contact</h1>
        <span className="ornament mt-3" />
      </div>
      <p className="leading-7">{settings.address}</p>
      <p className="text-ink-soft">{settings.businessHours}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button href={telLink(settings.phone)}>Call now</Button>
        <Button href={whatsappLink(settings.whatsapp, DEFAULT_WHATSAPP_MESSAGE)} variant="secondary">
          WhatsApp
        </Button>
        <Button href={`mailto:${settings.email}`} variant="ghost">
          Email
        </Button>
      </div>
    </div>
  )
}
