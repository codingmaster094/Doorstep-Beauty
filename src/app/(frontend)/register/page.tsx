import { RegisterForm } from '@/components/auth/RegisterForm'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Register',
  description: 'Create a customer account for home beauty bookings in Surat.',
  path: '/register',
})

export default function RegisterPage() {
  return <RegisterForm />
}
