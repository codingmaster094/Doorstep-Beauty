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
    <footer className="mt-16 border-t border-line bg-white pb-24 md:pb-8">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          {logoUrl ? (
            <img src={logoUrl} alt={businessName} className="h-12 w-auto max-w-40 object-contain" />
          ) : (
            <p className="font-display text-3xl text-rose">{businessName}</p>
          )}
          <p className="mt-3 text-sm leading-6 text-ink-soft">{tagline}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">Explore</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            {explore.map((l) => (
              <Link key={l.href + l.label} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">Policies</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            {policies.map((l) => (
              <Link key={l.href + l.label} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="text-sm">
          <p className="whitespace-pre-line">{address}</p>
          {hours ? <p className="mt-2 text-ink-soft">{hours}</p> : null}
          <p className="mt-2">
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
      <div className="border-t border-line py-4 text-center text-xs text-ink-soft">
        © {year} {businessName}. {copyright}
      </div>
    </footer>
  )
}
