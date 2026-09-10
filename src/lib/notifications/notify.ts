import type { Payload } from 'payload'
import type { Notification } from '@/payload-types'

type NotifyInput = Pick<Notification, 'title' | 'body' | 'type' | 'audience'> & {
  user?: string
  appointment?: string
}

export async function notify(payload: Payload, data: NotifyInput) {
  await payload.create({
    collection: 'notifications',
    overrideAccess: true,
    data: {
      ...data,
      read: false,
    },
  })
}
