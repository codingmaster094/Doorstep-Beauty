import { formatInr } from '@/lib/pricing/money'

export function PriceBreakdown({
  serviceAmount,
  homeVisitCharge,
  addonAmount,
  discount,
  finalAmount,
}: {
  serviceAmount: number
  homeVisitCharge: number
  addonAmount: number
  discount: number
  finalAmount: number
}) {
  const Row = ({ label, value, muted }: { label: string; value: string; muted?: boolean }) => (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <span className={muted ? 'text-ink-soft' : 'text-ink'}>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )

  return (
    <div className="rounded-2xl border border-gold/20 bg-white p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">Price breakdown</p>
      <Row label="Service charge" value={formatInr(serviceAmount)} />
      <Row label="Home visit charge" value={formatInr(homeVisitCharge)} />
      <Row label="Add-ons" value={formatInr(addonAmount)} />
      <Row label="Discount" value={`-${formatInr(discount)}`} muted />
      <div className="mt-2 flex items-center justify-between border-t border-line pt-3">
        <span className="font-medium">Total</span>
        <span className="text-lg font-medium text-rose">{formatInr(finalAmount)}</span>
      </div>
    </div>
  )
}
