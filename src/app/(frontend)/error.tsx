'use client'

import { ErrorState } from '@/components/ui/States'
import { Button } from '@/components/ui/Button'

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="space-y-4">
      <ErrorState title="Something went wrong" body={error.message} />
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
