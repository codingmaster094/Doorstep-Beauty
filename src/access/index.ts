import type { Access, FieldAccess, Where } from 'payload'

export type Role = 'super-admin' | 'manager' | 'content-manager' | 'beautician' | 'customer'

export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user)

export const isSuperAdmin: Access = ({ req: { user } }) => user?.role === 'super-admin'

export const isStaff: Access = ({ req: { user } }) =>
  Boolean(user && ['super-admin', 'manager', 'content-manager'].includes(user.role as string))

export const isOps: Access = ({ req: { user } }) =>
  Boolean(user && ['super-admin', 'manager'].includes(user.role as string))

export const isContent: Access = ({ req: { user } }) =>
  Boolean(user && ['super-admin', 'manager', 'content-manager'].includes(user.role as string))

export const anyone: Access = () => true

export const nobody: Access = () => false

export const isSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'super-admin') return true
  return { id: { equals: user.id } } as Where
}

export const publishedOnly: Access = ({ req: { user } }) => {
  if (user && ['super-admin', 'manager', 'content-manager'].includes(user.role as string)) return true
  return { published: { equals: true } }
}

export const adminOrPublished: Access = publishedOnly

export const fieldStaff: FieldAccess = ({ req: { user } }) =>
  Boolean(user && ['super-admin', 'manager', 'content-manager'].includes(user.role as string))

export const ownCustomerData: Access = ({ req: { user } }) => {
  if (!user) return false
  if (['super-admin', 'manager'].includes(user.role as string)) return true
  return { customer: { equals: user.id } } as Where
}

export const beauticianOwnAppointments: Access = ({ req: { user } }) => {
  if (!user) return false
  if (['super-admin', 'manager'].includes(user.role as string)) return true
  if (user.role === 'beautician') {
    return { beauticianUser: { equals: user.id } } as Where
  }
  if (user.role === 'customer') {
    return { customer: { equals: user.id } } as Where
  }
  return false
}
