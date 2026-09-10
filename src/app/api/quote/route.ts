import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { calculateQuote } from '@/lib/pricing/calculateQuote'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = await getPayloadClient()
    const quote = await calculateQuote(payload, body)
    return NextResponse.json(quote)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to calculate price.' }, { status: 400 })
  }
}
