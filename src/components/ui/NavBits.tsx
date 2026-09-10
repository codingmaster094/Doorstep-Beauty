export function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
      <ol className="flex flex-wrap gap-1">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            {item.href ? <a href={item.href}>{item.label}</a> : <span className="text-ink">{item.label}</span>}
            {i < items.length - 1 ? <span aria-hidden>/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function Pagination({ page, totalPages, hrefFor }: { page: number; totalPages: number; hrefFor: (p: number) => string }) {
  if (totalPages <= 1) return null
  return (
    <nav className="flex gap-2" aria-label="Pagination">
      {page > 1 ? (
        <a className="min-h-11 border border-line px-4 py-2" href={hrefFor(page - 1)}>
          Previous
        </a>
      ) : null}
      {page < totalPages ? (
        <a className="min-h-11 border border-line px-4 py-2" href={hrefFor(page + 1)}>
          Next
        </a>
      ) : null}
    </nav>
  )
}

export function Tabs({ items, current }: { items: { href: string; label: string }[]; current: string }) {
  return (
    <div role="tablist" className="flex gap-2 overflow-x-auto">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          role="tab"
          aria-selected={current === item.href}
          className={`min-h-11 px-4 py-2 ${current === item.href ? 'bg-rose text-white' : 'border border-line bg-white'}`}
        >
          {item.label}
        </a>
      ))}
    </div>
  )
}
