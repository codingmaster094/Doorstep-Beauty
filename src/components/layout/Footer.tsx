import Link from 'next/link'
import { whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from '@/lib/whatsapp'
import type { NavLink } from '@/lib/navigation'

export function Footer({
  businessName,
  logoUrl,
  tagline,
  explore,
  policies,
  phone,
  email,
  address,
  whatsapp,
  instagram,
  facebook,
  hours,
  copyright,
}: {
  businessName: string
  logoUrl?: string
  tagline: string
  explore: NavLink[]
  policies: NavLink[]
  phone: string
  email: string
  address: string
  whatsapp: string
  instagram?: string
  facebook?: string
  hours?: string
  copyright: string
}) {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-20 border-t border-gold/25 bg-white pb-24 md:pb-8">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          {logoUrl ? (
            <img src={logoUrl} alt={businessName} className="h-14 w-auto max-w-40 object-contain" />
          ) : (
            <p className="font-display text-3xl text-rose">{businessName}</p>
          )}
          <span className="ornament mt-4" />
          <p className="mt-4 text-sm leading-7 text-ink-soft">{tagline}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold">Explore</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            {explore.map((l) => (
              <Link key={l.href + l.label} href={l.href} className="hover:text-rose">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold">Policies</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            {policies.map((l) => (
              <Link key={l.href + l.label} href={l.href} className="hover:text-rose">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="text-sm leading-7">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold">Studio</p>
          <p className="mt-4 whitespace-pre-line">{address}</p>
          {hours ? <p className="text-ink-soft">{hours}</p> : null}
          <p>
            <a href={`tel:${phone}`}>{phone}</a>
          </p>
          <p>
            <a href={`mailto:${email}`}>{email}</a>
          </p>
          <a className="mt-3 inline-block text-rose" href={whatsappLink(whatsapp, DEFAULT_WHATSAPP_MESSAGE)}>
            WhatsApp us
          </a>
          <div className="mt-3 flex flex-col gap-1">
            {instagram ? (
              <a href={instagram} target="_blank" rel="noreferrer" className="text-rose">
                Instagram
              </a>
            ) : null}
            {facebook ? (
              <a href={facebook} target="_blank" rel="noreferrer" className="text-rose">
                Facebook
              </a>
            ) : null}
          </div>
        </div>
      </div>
      <div className="border-t border-gold/20 py-4 text-center text-xs tracking-wide text-ink-soft">
        © {year} {businessName}. {copyright}
      </div>
    </footer>
  )
}
