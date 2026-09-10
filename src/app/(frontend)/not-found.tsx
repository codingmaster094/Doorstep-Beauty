import { EmptyState } from '@/components/ui/States'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      body="The page you are looking for is not available."
      action={<Button href="/">Go home</Button>}
    />
  )
}
