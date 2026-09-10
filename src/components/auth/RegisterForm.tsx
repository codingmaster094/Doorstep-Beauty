'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Field'

export function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Unable to register.')
      return
    }
    const login = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
    })
    if (!login.ok) {
      router.push('/login')
      return
    }
    router.push('/account')
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-4">
      <h1 className="font-display text-4xl">Create account</h1>
      <Field label="Name" htmlFor="name">
        <Input id="name" name="name" required />
      </Field>
      <Field label="Phone" htmlFor="phone">
        <Input id="phone" name="phone" inputMode="numeric" required />
      </Field>
      <Field label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" required />
      </Field>
      <Field label="Password" htmlFor="password">
        <Input id="password" name="password" type="password" minLength={8} required />
      </Field>
      {error ? <p className="text-sm text-rose">{error}</p> : null}
      <Button type="submit" className="w-full">
        Register
      </Button>
    </form>
  )
}
