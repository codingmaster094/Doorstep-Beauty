export type NavLink = {
  label: string
  href: string
}

export const defaultHeaderLinks: NavLink[] = [
  { href: '/services', label: 'Services' },
  { href: '/beauticians', label: 'Beauticians' },
  { href: '/offers', label: 'Offers' },
  { href: '/before-after', label: 'Results' },
  { href: '/reels', label: 'Reels' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export const defaultExploreLinks: NavLink[] = [
  { href: '/services', label: 'Services' },
  { href: '/beauticians', label: 'Beauticians' },
  { href: '/offers', label: 'Offers' },
  { href: '/faq', label: 'FAQ' },
]

export const defaultPolicyLinks: NavLink[] = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/cancellation', label: 'Cancellation' },
  { href: '/refund', label: 'Refund' },
]

export function navFromCms(
  items?: { label?: string | null; href?: string | null }[] | null,
  fallback: NavLink[] = [],
): NavLink[] {
  const mapped =
    items
      ?.map((item) => ({
        label: item.label?.trim() || '',
        href: item.href?.trim() || '',
      }))
      .filter((item) => item.label && item.href) || []
  return mapped.length ? mapped : fallback
}
