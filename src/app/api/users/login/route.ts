import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { readPayloadBody } from '@/lib/auth/readPayloadBody'

const COOKIE = 'payload-token'
const MAX_AGE = 60 * 60 * 24 * 14

function publicUser(user: Record<string, unknown>) {
  const {
    hash: _hash,
    salt: _salt,
    resetPasswordToken: _resetPasswordToken,
    resetPasswordExpiration: _resetPasswordExpiration,
    ...safe
  } = user
  return {
    ...safe,
    collection: 'users',
  }
}

export async function POST(request: Request) {
  try {
    const body = await readPayloadBody(request)
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!email || !password) {
      return NextResponse.json({ errors: [{ message: 'Email and password are required.' }] }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    const role = (result.user as { role?: string } | null)?.role
    if (!result.token || !result.user || !['super-admin', 'manager', 'content-manager'].includes(role || '')) {
      return NextResponse.json(
        { errors: [{ message: 'This account cannot access Payload CMS. Use a Super Admin account.' }] },
        { status: 401 },
      )
    }

    const store = await cookies()
    store.set(COOKIE, result.token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: false,
      maxAge: MAX_AGE,
    })

    return NextResponse.json({
      message: 'Login successful',
      exp: result.exp,
      token: result.token,
      user: publicUser(result.user as unknown as Record<string, unknown>),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to login.'
    return NextResponse.json({ errors: [{ message }] }, { status: 401 })
  }
}
