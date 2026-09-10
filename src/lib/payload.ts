import { getPayload, type Payload } from 'payload'
import config from '@payload-config'

const emptyList = {
  docs: [],
  totalDocs: 0,
  hasNextPage: false,
  hasPrevPage: false,
  limit: 0,
  page: 1,
  totalPages: 0,
  pagingCounter: 0,
  nextPage: null,
  prevPage: null,
}

function buildTimeStub(): Payload {
  return {
    find: async () => emptyList,
    findByID: async () => null,
    findGlobal: async () => ({
      businessName: 'Bloom At Home',
      tagline: 'Professional Beauty Services, At Your Doorstep.',
      phone: '9876543210',
      whatsapp: '919876543210',
      email: 'hello@example.com',
      address: 'Surat, Gujarat, India',
      defaultHomeVisitCharge: 150,
      seo: {
        defaultTitle: 'Bloom At Home | Beauty service at home in Surat',
        defaultDescription: 'Professional women beauty home services in Surat.',
      },
      heroHeadline: 'Professional Beauty Services, At Your Doorstep.',
      heroText: 'Book a beautician at home in Surat.',
      finalCtaHeadline: 'Your Beauty. Your Home. Your Time.',
      finalCtaText: 'Choose a service and pick a time.',
    }),
    auth: async () => ({ user: null }),
    create: async () => {
      throw new Error('Database is not available during this operation.')
    },
    update: async () => {
      throw new Error('Database is not available during this operation.')
    },
  } as unknown as Payload
}

export async function getPayloadClient() {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return buildTimeStub()
  }
  return getPayload({ config })
}
