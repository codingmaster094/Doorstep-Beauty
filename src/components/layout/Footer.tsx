import Link from 'next/link'
import { whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from '@/lib/whatsapp'

export function Footer({
  businessName,
  phone,
  email,
  address,
  whatsapp,
}: {
  businessName: string
  phone: string
  email: string
  address: string
  whatsapp: string
}) {
  return (
    <footer className="mt-16 border-t border-line bg-white pb-24 md:pb-8">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <p className="font-display text-3xl text-rose">{businessName}</p>
          <p className="mt-3 text-sm leading-6 text-ink-soft">Professional beauty services at home in Surat.</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">Explore</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/services">Services</Link>
            <Link href="/beauticians">Beauticians</Link>
            <Link href="/offers">Offers</Link>
            <Link href="/faq">FAQ</Link>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">Policies</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/cancellation">Cancellation</Link>
            <Link href="/refund">Refund</Link>
          </div>
        </div>
        <div className="text-sm">
          <p>{address}</p>
          <p className="mt-2">{phone}</p>
          <p>{email}</p>
          <a className="mt-3 inline-block text-rose" href={whatsappLink(whatsapp, DEFAULT_WHATSAPP_MESSAGE)}>
            WhatsApp us
          </a>
        </div>
      </div>
    </footer>
  )
}
