import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { ServiceCategories } from './collections/ServiceCategories'
import { Services } from './collections/Services'
import { ServiceAddons } from './collections/ServiceAddons'
import { ServiceAreas } from './collections/ServiceAreas'
import { TimeSlots } from './collections/TimeSlots'
import { DisabledDates } from './collections/DisabledDates'
import { Beauticians } from './collections/Beauticians'
import { Addresses } from './collections/Addresses'
import { Appointments } from './collections/Appointments'
import { Coupons } from './collections/Coupons'
import { Offers } from './collections/Offers'
import { Reviews } from './collections/Reviews'
import { BeforeAfter } from './collections/BeforeAfter'
import { Reels } from './collections/Reels'
import { Faqs } from './collections/Faqs'
import { Pages } from './collections/Pages'
import { Notifications } from './collections/Notifications'
import { SiteSettings } from './globals/SiteSettings'
import { Homepage } from './globals/Homepage'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { isValidVercelBlobToken, publicServerURL, vercelBlobToken } from './lib/env'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const blobToken = vercelBlobToken()
const blobEnabled = isValidVercelBlobToken(blobToken)

export default buildConfig({
  serverURL: publicServerURL(),
  cors: '*',
  csrf: [],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' | Bloom At Home',
    },
    components: {
      afterDashboard: ['/components/admin/Analytics#default'],
    },
  },
  collections: [
    Users,
    Media,
    ServiceCategories,
    Services,
    ServiceAddons,
    ServiceAreas,
    TimeSlots,
    DisabledDates,
    Beauticians,
    Addresses,
    Appointments,
    Coupons,
    Offers,
    Reviews,
    BeforeAfter,
    Reels,
    Faqs,
    Pages,
    Notifications,
  ],
  globals: [SiteSettings, Homepage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
    connectOptions: {
      serverSelectionTimeoutMS: 30000,
    },
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: blobEnabled,
      alwaysInsertFields: true,
      collections: {
        media: true,
      },
      token: blobToken,
      addRandomSuffix: true,
      clientUploads: false,
    }),
  ],
})
