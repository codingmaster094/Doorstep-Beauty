import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const store = await cookies()
  store.set('payload-token', '', {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: false,
    maxAge: 0,
  })
  return NextResponse.json({ message: 'Logged out' })
}
