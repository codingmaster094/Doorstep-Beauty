export function EmptyState({ title, body, action }: { title: string; body?: string; action?: React.ReactNode }) {
  return (
    <div className="border border-dashed border-line bg-white px-4 py-10 text-center">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      {body ? <p className="mt-2 text-ink-soft">{body}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export function ErrorState({ title = 'Something went wrong', body }: { title?: string; body?: string }) {
  return (
    <div className="border border-rose/30 bg-white px-4 py-8 text-center">
      <h2 className="font-display text-2xl text-rose">{title}</h2>
      {body ? <p className="mt-2 text-ink-soft">{body}</p> : null}
    </div>
  )
}
