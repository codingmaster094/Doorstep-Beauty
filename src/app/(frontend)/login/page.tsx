import { LoginForm } from '@/components/auth/LoginForm'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Login',
  description: 'Sign in to manage your home beauty appointments.',
  path: '/login',
})

export default function LoginPage() {
  return <LoginForm />
}
