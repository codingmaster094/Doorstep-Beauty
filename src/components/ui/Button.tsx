import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const variants = {
  primary: 'bg-rose text-white hover:bg-rose-deep disabled:opacity-50',
  secondary: 'bg-white text-rose border border-line hover:bg-blush',
  ghost: 'bg-transparent text-ink hover:bg-blush',
  gold: 'bg-gold text-ink hover:opacity-90',
}

export function Button({
  children,
  className,
  variant = 'primary',
  href,
  type = 'button',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
  href?: string
  children: ReactNode
}) {
  const cls = cn(
    'inline-flex min-h-11 min-w-11 items-center justify-center gap-2 px-5 text-sm font-medium tracking-wide transition',
    variants[variant],
    className,
  )
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type} className={cls} {...props}>
      {children}
    </button>
  )
}
