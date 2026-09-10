'use client'

import { useEffect, useState } from 'react'

type Stats = {
  totalBookings: number
  todayBookings: number
  upcomingBookings: number
  completedBookings: number
  cancelledBookings: number
  totalCustomers: number
  activeBeauticians: number
  revenue: number
  averageOrderValue: number
}

export default function Analytics() {
  const [stats, setStats] = useState<Stats | null>(null)
  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => (r.ok ? r.json() : null))
      .then(setStats)
      .catch(() => setStats(null))
  }, [])
  if (!stats) return null
  const items = [
    ['Total bookings', stats.totalBookings],
    ["Today's bookings", stats.todayBookings],
    ['Upcoming', stats.upcomingBookings],
    ['Completed', stats.completedBookings],
    ['Cancelled', stats.cancelledBookings],
    ['Customers', stats.totalCustomers],
    ['Active beauticians', stats.activeBeauticians],
    ['Completed revenue (₹)', stats.revenue],
    ['Average order (₹)', stats.averageOrderValue],
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12, marginBottom: 24 }}>
      {items.map(([label, value]) => (
        <div key={String(label)} style={{ border: '1px solid #e4d8d2', padding: 12, background: '#fff' }}>
          <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
          <div style={{ fontSize: 22, marginTop: 8 }}>{value}</div>
        </div>
      ))}
    </div>
  )
}
