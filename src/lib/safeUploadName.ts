export function safeUploadName(name: string) {
  const trimmed = name.trim() || 'image.png'
  const lastDot = trimmed.lastIndexOf('.')
  const ext = lastDot >= 0 ? trimmed.slice(lastDot).toLowerCase() : ''
  const base = lastDot >= 0 ? trimmed.slice(0, lastDot) : trimmed
  const cleaned = base.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^[-.]+|[-.]+$/g, '') || 'image'
  const safeExt = /^\.(jpe?g|png|gif|webp|avif|mp4|webm|mov)$/i.test(ext) ? ext : '.png'
  return `${cleaned}${safeExt}`
}
