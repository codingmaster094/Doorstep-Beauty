const labels: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  assigned: 'Assigned',
  'on-the-way': 'Beautician on the way',
  arrived: 'Arrived',
  'service-started': 'Service started',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rescheduled: 'Rescheduled',
  'no-show': 'No show',
}

export function AppointmentStatus({ status }: { status: string }) {
  return (
    <span className="inline-flex border border-line px-2 py-1 text-xs uppercase tracking-wider text-ink">
      {labels[status] || status}
    </span>
  )
}
