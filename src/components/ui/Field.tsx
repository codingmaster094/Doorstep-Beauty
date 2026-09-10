import { cn } from '@/lib/utils'

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'min-h-11 w-full rounded-xl border border-gold/25 bg-white px-3 text-base text-ink placeholder:text-ink-soft',
        className,
      )}
      {...props}
    />
  )
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn('min-h-24 w-full rounded-xl border border-gold/25 bg-white px-3 py-2 text-base text-ink', className)}
      {...props}
    />
  )
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn('min-h-11 w-full rounded-xl border border-gold/25 bg-white px-3 text-base', className)} {...props}>
      {children}
    </select>
  )
}

export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-ink">
      {children}
    </label>
  )
}

export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div className="w-full">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  )
}
