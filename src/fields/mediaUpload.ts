export function mediaUpload(
  name: string,
  options?: {
    label?: string
    description?: string
    required?: boolean
    hasMany?: boolean
    admin?: Record<string, unknown>
  },
) {
  return {
    name,
    type: 'upload' as const,
    relationTo: 'media' as const,
    required: options?.required,
    hasMany: options?.hasMany,
    label: options?.label,
    admin: {
      description: options?.description || 'Upload a new file into Media, or choose one already saved there.',
      ...options?.admin,
    },
  }
}
