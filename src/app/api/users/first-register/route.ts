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

async function setAuthCookie(token: string) {
  const store = await cookies()
  store.set(COOKIE, token, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: false,
    maxAge: MAX_AGE,
  })
}

export async function POST(request: Request) {
  try {
    const body = await readPayloadBody(request)
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : 'Admin'
    const phone = typeof body.phone === 'string' ? body.phone : String(body.phone ?? '')

    if (!email || !password) {
      return NextResponse.json({ errors: [{ message: 'Email and password are required.' }] }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    })

    if (!existing.docs[0]) {
      await payload.create({
        collection: 'users',
        overrideAccess: true,
        data: {
          name,
          email,
          password,
          phone,
          whatsapp: phone,
          role: 'super-admin',
          accountStatus: 'active',
        },
      })
    } else {
      await payload.update({
        collection: 'users',
        id: existing.docs[0].id,
        overrideAccess: true,
        data: {
          name,
          password,
          phone,
          role: 'super-admin',
          accountStatus: 'active',
        },
      })
    }

    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    if (!result.token || !result.user) {
      return NextResponse.json({ errors: [{ message: 'Admin was created but login failed. Open /admin/login and sign in.' }] }, { status: 401 })
    }

    await setAuthCookie(result.token)

    return NextResponse.json({
      message: 'Admin created',
      exp: result.exp,
      token: result.token,
      user: publicUser(result.user as unknown as Record<string, unknown>),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create the admin user.'
    return NextResponse.json({ errors: [{ message }] }, { status: 400 })
  }
}
