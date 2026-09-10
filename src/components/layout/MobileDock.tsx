import { whatsappLink, telLink, DEFAULT_WHATSAPP_MESSAGE } from '@/lib/whatsapp'
import { Button } from '@/components/ui/Button'

export function MobileDock({
  phone,
  whatsapp,
  bookLabel,
  bookHref,
}: {
  phone: string
  whatsapp: string
  bookLabel: string
  bookHref: string
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/25 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className="grid grid-cols-3">
        <a
          className="flex min-h-12 flex-col items-center justify-center text-[11px] uppercase tracking-[0.12em] text-ink-soft"
          href={whatsappLink(whatsapp, DEFAULT_WHATSAPP_MESSAGE)}
        >
          WhatsApp
        </a>
        <a className="flex min-h-12 flex-col items-center justify-center text-[11px] uppercase tracking-[0.12em] text-ink-soft" href={telLink(phone)}>
          Call
        </a>
        <Button href={bookHref} className="w-full rounded-none">
          {bookLabel}
        </Button>
      </div>
    </div>
  )
}
