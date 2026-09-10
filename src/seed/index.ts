import { getPayload, type Payload } from 'payload'
import config from '../payload.config'

async function ensureAdmin(payload: Payload) {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@hbs.local'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!'

  const users = await payload.find({
    collection: 'users',
    where: { email: { equals: adminEmail } },
    limit: 1,
    overrideAccess: true,
  })

  if (users.docs[0]) {
    await payload.update({
      collection: 'users',
      id: users.docs[0].id,
      overrideAccess: true,
      data: {
        role: 'super-admin',
        accountStatus: 'active',
        name: users.docs[0].name || 'Studio Admin',
      },
    })
    console.log('Admin access restored:', adminEmail)
    return
  }

  await payload.create({
    collection: 'users',
    overrideAccess: true,
    data: {
      name: 'Studio Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'super-admin',
      phone: '9876500000',
      accountStatus: 'active',
    },
  })
  console.log('Admin user created:', adminEmail)
}

async function seed() {
  const payload = await getPayload({ config })
  await ensureAdmin(payload)
  console.log('Seed does not write website content. Add real data in Admin.')
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
