function cleanEnv(value?: string) {
  return (value || '').trim().replace(/^["']|["']$/g, '')
}

export function vercelBlobToken() {
  return cleanEnv(process.env.BLOB_READ_WRITE_TOKEN)
}

export function isValidVercelBlobToken(token: string) {
  return /^vercel_blob_rw_[a-z\d]+_[a-z\d]+$/i.test(token)
}

export function publicServerURL() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return cleanEnv(process.env.PAYLOAD_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL)
}
