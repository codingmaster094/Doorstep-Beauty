export async function readPayloadBody(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get('content-type') || ''

  if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
    const form = await request.formData()
    const raw = form.get('_payload')
    if (typeof raw === 'string' && raw.trim()) {
      return JSON.parse(raw) as Record<string, unknown>
    }

    const data: Record<string, unknown> = {}
    form.forEach((value, key) => {
      if (typeof value === 'string') data[key] = value
    })
    return data
  }

  const text = await request.text()
  if (!text.trim()) return {}
  return JSON.parse(text) as Record<string, unknown>
}
