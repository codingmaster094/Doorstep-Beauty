import type { CollectionConfig } from 'payload'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { isContent } from '@/access'
import { revalidateAfterChange } from '@/hooks/cms'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Photo / Video',
    plural: 'Photos & Videos',
  },
  access: {
    create: isContent,
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
    imageSizes: [
      { name: 'thumb', width: 320, height: 320, position: 'centre', withoutEnlargement: true },
      { name: 'card', width: 800, height: 1000, position: 'centre', withoutEnlargement: true },
      { name: 'hero', width: 1600, height: 2000, position: 'centre', withoutEnlargement: true },
      { name: 'og', width: 1200, height: 630, position: 'centre', withoutEnlargement: true },
    ],
    adminThumbnail: 'thumb',
    focalPoint: true,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && !data.alt) {
          data.alt = typeof data.filename === 'string' ? data.filename : 'Website media'
        }
        return data
      },
    ],
    afterChange: [revalidateAfterChange],
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
