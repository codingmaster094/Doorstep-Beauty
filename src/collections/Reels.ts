import type { CollectionConfig } from 'payload'
import { isContent } from '@/access'
import { revalidateAfterChange } from '@/hooks/cms'
import { mediaUpload } from '@/fields/mediaUpload'

export const Reels: CollectionConfig = {
  slug: 'reels',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  access: {
    create: isContent,
    read: () => true,
    update: isContent,
    delete: isContent,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'caption', type: 'textarea' },
    mediaUpload('thumbnail', { label: 'Cover photo', description: 'Cover photo for the reel. Stored in Media.' }),
    mediaUpload('video', { label: 'Video', description: 'MP4 or WebM video. Stored in Media.' }),
    { name: 'externalUrl', type: 'text' },
    { name: 'service', type: 'relationship', relationTo: 'services' },
    { name: 'beautician', type: 'relationship', relationTo: 'beauticians' },
    { name: 'category', type: 'relationship', relationTo: 'service-categories' },
    { name: 'published', type: 'checkbox', defaultValue: true, label: 'Show on website' },
    { name: 'featured', type: 'checkbox', defaultValue: true, label: 'Show on homepage' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
  },
}
