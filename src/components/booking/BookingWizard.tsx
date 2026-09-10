'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Field, Input, Select, Textarea } from '@/components/ui/Field'
import { PriceBreakdown } from '@/components/ui/PriceBreakdown'
import { EmptyState } from '@/components/ui/States'
import { formatInr } from '@/lib/pricing/money'

type ServiceOption = { id: string; name: string; durationMinutes: number; basePrice: number; salePrice?: number | null }
type Addon = { id: string; name: string; price: number }
type Area = { id: string; name: string; homeVisitCharge: number }
type Beautician = { id: string; name: string }
type Slot = { id: string; label: string }
type Quote = {
  serviceAmount: number
  homeVisitCharge: number
  addonAmount: number
  discount: number
  finalAmount: number
  couponError?: string
}

const steps = [
  'Service',
  'Add-ons',
  'Date',
  'Time',
  'Beautician',
  'Details',
  'Address',
  'Coupon',
  'Review',
]

export function BookingWizard({
  services,
  addonsByService,
  areas,
  beauticians,
  initialServiceId,
}: {
  services: ServiceOption[]
  addonsByService: Record<string, Addon[]>
  areas: Area[]
  beauticians: Beautician[]
  initialServiceId?: string
}) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [serviceId, setServiceId] = useState(initialServiceId || services[0]?.id || '')
  const [addonIds, setAddonIds] = useState<string[]>([])
  const [date, setDate] = useState('')
  const [slotId, setSlotId] = useState('')
  const [slots, setSlots] = useState<Slot[]>([])
  const [assignment, setAssignment] = useState<'auto' | 'manual'>('auto')
  const [beauticianId, setBeauticianId] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [areaId, setAreaId] = useState(areas[0]?.id || '')
  const [addressLine, setAddressLine] = useState('')
  const [pincode, setPincode] = useState('')
  const [landmark, setLandmark] = useState('')
  const [instructions, setInstructions] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [quote, setQuote] = useState<Quote | null>(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const addons = addonsByService[serviceId] || []
  const service = services.find((s) => s.id === serviceId)

  const payload = useMemo(
    () => ({
      serviceId,
      addonIds,
      date,
      slotId,
      assignmentMode: assignment,
      beauticianId: assignment === 'manual' ? beauticianId : undefined,
      customerName,
      customerPhone,
      customerEmail,
      areaId,
      addressLine,
      pincode,
      landmark,
      instructions,
      couponCode,
      paymentMethod: 'pay-after-service',
    }),
    [serviceId, addonIds, date, slotId, assignment, beauticianId, customerName, customerPhone, customerEmail, areaId, addressLine, pincode, landmark, instructions, couponCode],
  )

  useEffect(() => {
    setAddonIds([])
  }, [serviceId])

  useEffect(() => {
    if (!serviceId) return
    fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId, addonIds, areaId, couponCode }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else {
          setError('')
          setQuote(data)
        }
      })
      .catch(() => setError('Unable to calculate price.'))
  }, [serviceId, addonIds, areaId, couponCode])

  useEffect(() => {
    if (!date || !serviceId) return
    const params = new URLSearchParams({ date, serviceId, areaId, beauticianId })
    fetch(`/api/slots?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setSlots(data)
        else setSlots([])
      })
  }, [date, serviceId, areaId, beauticianId])

  function next() {
    setStep((s) => Math.min(s + 1, steps.length - 1))
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0))
  }

  async function confirm() {
    setSubmitting(true)
    setError('')
    const res = await fetch('/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    setSubmitting(false)
    if (!res.ok) {
      setError(data.error || 'Could not complete booking.')
      return
    }
    router.push(`/book/confirmation/${data.bookingId}`)
  }

  if (!services.length) {
    return <EmptyState title="No services found." body="Please check back soon." />
  }

  return (
    <div className="mx-auto max-w-lg">
      <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">
        Step {step + 1} of {steps.length}
      </p>
      <div className="mt-2 h-1 bg-blush">
        <div className="h-full bg-rose" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
      </div>
      <h1 className="mt-4 font-display text-4xl">{steps[step]}</h1>

      <div className="mt-6 space-y-4">
        {step === 0 && (
          <Field label="Choose a service">
            <Select value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} · from {formatInr(s.salePrice || s.basePrice)}
                </option>
              ))}
            </Select>
          </Field>
        )}

        {step === 1 && (
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Optional add-ons</legend>
            {addons.length ? (
              addons.map((a) => (
                <label key={a.id} className="flex min-h-11 items-center justify-between gap-3 border-b border-line py-3">
                  <span>
                    {a.name} <span className="text-ink-soft">+{formatInr(a.price)}</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={addonIds.includes(a.id)}
                    onChange={(e) =>
                      setAddonIds((ids) => (e.target.checked ? [...ids, a.id] : ids.filter((id) => id !== a.id)))
                    }
                  />
                </label>
              ))
            ) : (
              <p className="text-sm text-ink-soft">No add-ons for this service.</p>
            )}
          </fieldset>
        )}

        {step === 2 && (
          <Field label="Appointment date" htmlFor="date">
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
        )}

        {step === 3 && (
          <div>
            {!slots.length ? (
              <EmptyState title="No beauticians are currently available for this time." body="Try another date." />
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    className={`min-h-11 border px-3 ${slotId === slot.id ? 'border-rose bg-blush' : 'border-line bg-white'}`}
                    onClick={() => setSlotId(slot.id)}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <label className="flex min-h-11 items-center gap-2">
              <input type="radio" checked={assignment === 'auto'} onChange={() => setAssignment('auto')} />
              Auto assign a beautician
            </label>
            <label className="flex min-h-11 items-center gap-2">
              <input type="radio" checked={assignment === 'manual'} onChange={() => setAssignment('manual')} />
              Choose a beautician
            </label>
            {assignment === 'manual' ? (
              <Select value={beauticianId} onChange={(e) => setBeauticianId(e.target.value)}>
                <option value="">Select</option>
                {beauticians.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </Select>
            ) : null}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-3">
            <Field label="Full name" htmlFor="name">
              <Input id="name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </Field>
            <Field label="Phone" htmlFor="phone">
              <Input id="phone" inputMode="numeric" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
            </Field>
            <Field label="Email (optional)" htmlFor="email">
              <Input id="email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
            </Field>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-3">
            <Field label="Service area">
              <Select value={areaId} onChange={(e) => setAreaId(e.target.value)}>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Address" htmlFor="address">
              <Textarea id="address" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} />
            </Field>
            <Field label="Pincode" htmlFor="pin">
              <Input id="pin" inputMode="numeric" value={pincode} onChange={(e) => setPincode(e.target.value)} />
            </Field>
            <Field label="Landmark" htmlFor="landmark">
              <Input id="landmark" value={landmark} onChange={(e) => setLandmark(e.target.value)} />
            </Field>
            <Field label="Instructions" htmlFor="notes">
              <Textarea id="notes" value={instructions} onChange={(e) => setInstructions(e.target.value)} />
            </Field>
          </div>
        )}

        {step === 7 && (
          <Field label="Coupon code" htmlFor="coupon">
            <Input id="coupon" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} />
          </Field>
        )}

        {step === 8 && (
          <div className="space-y-4">
            <p>
              <strong>{service?.name}</strong> on {date}
            </p>
            {quote ? <PriceBreakdown {...quote} /> : null}
            <p className="text-sm text-ink-soft">Payment: pay after service. Online UPI/card can be enabled with Razorpay keys.</p>
          </div>
        )}
      </div>

      {quote && step < 8 ? (
        <div className="mt-6">
          <p className="text-sm text-ink-soft">
            Estimated total <span className="font-medium text-ink">{formatInr(quote.finalAmount)}</span>
            {quote.couponError ? <span className="block text-rose">{quote.couponError}</span> : null}
          </p>
        </div>
      ) : null}

      {error ? <p className="mt-4 text-sm text-rose">{error}</p> : null}

      <div className="mt-8 flex gap-3">
        {step > 0 ? (
          <Button variant="secondary" onClick={back}>
            Back
          </Button>
        ) : null}
        {step < steps.length - 1 ? (
          <Button className="flex-1" onClick={next}>
            Continue
          </Button>
        ) : (
          <Button className="flex-1" onClick={confirm} disabled={submitting}>
            {submitting ? 'Booking…' : 'Confirm appointment'}
          </Button>
        )}
      </div>
    </div>
  )
}
