'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Field'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.errors?.[0]?.message || 'Unable to sign in.')
      return
    }
    router.push('/account')
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-4">
      <h1 className="font-display text-4xl">Customer login</h1>
      <Field label="Email" htmlFor="email">
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </Field>
      <Field label="Password" htmlFor="password">
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </Field>
      {error ? <p className="text-sm text-rose">{error}</p> : null}
      <Button type="submit" className="w-full">
        Sign in
      </Button>
      <p className="text-sm">
        New here? <Link href="/register" className="text-rose">Create an account</Link>
      </p>
    </form>
  )
}
