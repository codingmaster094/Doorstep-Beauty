import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { INDIAN_PHONE, EMAIL } from '@/lib/pricing/money'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.name || !INDIAN_PHONE.test(body.phone) || !EMAIL.test(body.email) || !body.password || body.password.length < 8) {
      return NextResponse.json({ error: 'Please provide a valid name, phone, email, and password (8+ characters).' }, { status: 400 })
    }
    const payload = await getPayloadClient()
    const user = await payload.create({
      collection: 'users',
      overrideAccess: true,
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
        phone: body.phone,
        whatsapp: body.whatsapp || body.phone,
        role: 'customer',
        accountStatus: 'active',
      },
    })
    return NextResponse.json({ id: user.id, email: user.email })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to register.' }, { status: 400 })
  }
}
