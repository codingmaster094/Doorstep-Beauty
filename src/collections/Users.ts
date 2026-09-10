import type { CollectionConfig, Where } from 'payload'
import { isOps, isSuperAdmin } from '@/access'

const adminRoles = ['super-admin', 'manager', 'content-manager']

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Admin user',
    plural: 'Admin users',
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 14,
    maxLoginAttempts: 0,
    useSessions: false,
    cookies: {
      sameSite: 'Lax',
      secure: false,
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role', 'accountStatus'],
    group: 'People',
    description: 'Payload CMS login is for admins only. Create the first Super Admin, then sign in.',
  },
  access: {
    admin: ({ req: { user } }) => Boolean(user && adminRoles.includes(user.role as string)),
    create: ({ req: { user } }) => {
      if (!user) return true
      return user.role === 'super-admin'
    },
    read: ({ req: { user } }) => {
      if (!user) return false
      if (adminRoles.includes(user.role as string)) return true
      return { id: { equals: user.id } } as Where
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true
      return { id: { equals: user.id } } as Where
    },
    delete: isSuperAdmin,
    unlock: isOps,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Admin',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'super-admin',
      saveToJWT: true,
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Content Manager', value: 'content-manager' },
        { label: 'Beautician', value: 'beautician' },
        { label: 'Customer', value: 'customer' },
      ],
      access: {
        update: ({ req: { user } }) => !user || user.role === 'super-admin',
      },
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'whatsapp',
      type: 'text',
      admin: {
        condition: (_data, _sibling, { user }) => Boolean(user),
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_data, _sibling, { user }) => Boolean(user),
      },
    },
    {
      name: 'accountStatus',
      type: 'select',
      defaultValue: 'active',
      saveToJWT: true,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Suspended', value: 'suspended' },
        { label: 'Pending', value: 'pending' },
      ],
    },
    {
      name: 'favouriteServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        hidden: true,
      },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        if (!data || operation !== 'create') return data

        if (req.payloadAPI === 'local' || req.user) return data

        const url = `${req.pathname || ''} ${typeof req.url === 'string' ? req.url : ''}`
        if (url.includes('first-register')) {
          data.role = 'super-admin'
          data.accountStatus = 'active'
          return data
        }

        const existing = await req.payload.find({
          collection: 'users',
          limit: 1,
          overrideAccess: true,
        })
        data.role = existing.totalDocs === 0 ? 'super-admin' : 'customer'
        return data
      },
    ],
  },
  timestamps: true,
}
