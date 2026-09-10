import type { CollectionConfig } from 'payload'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { isContent } from '@/access'
import { safeUploadName } from '@/lib/safeUploadName'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Photo / Video',
    plural: 'Photos & Videos',
  },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: () => true,
    update: isContent,
    delete: isContent,
  },
  admin: {
    group: 'Content',
    description: 'Upload photos and videos here, then attach them on Services, Homepage, Beauticians, Reels, or Before & After.',
  },
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'video/mp4', 'video/webm', 'video/quicktime'],
    displayPreview: true,
    crop: false,
    focalPoint: false,
  },
  hooks: {
    beforeOperation: [
      ({ req, operation }) => {
        if (operation !== 'create' && operation !== 'update') return
        const file = req.file as { name?: string } | undefined
        if (file?.name) file.name = safeUploadName(file.name)
      },
    ],
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        if (typeof data.filename === 'string') data.filename = safeUploadName(data.filename)
        if (!data.alt) data.alt = typeof data.filename === 'string' ? data.filename : 'Website media'
        return data
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: {
        description: 'Short text for the photo. If empty, the file name is used.',
      },
    },
  ],
}
