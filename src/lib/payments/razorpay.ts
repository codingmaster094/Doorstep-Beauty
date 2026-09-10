/**
 * Isolated Razorpay adapter. Secrets stay on the server.
 * Online checkout can be enabled later without changing booking records.
 */
export type PaymentIntentInput = {
  amountInPaise: number
  bookingId: string
  customerEmail?: string
  customerPhone?: string
}

export function isRazorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
}

export async function createPaymentOrder(input: PaymentIntentInput) {
  if (!isRazorpayConfigured()) {
    return {
      provider: 'none' as const,
      message: 'Pay after service is available. Online payments will activate once Razorpay keys are set.',
      amountInPaise: input.amountInPaise,
      bookingId: input.bookingId,
    }
  }

  throw new Error('Razorpay live order creation is configured via environment keys and should be enabled in production.')
}
