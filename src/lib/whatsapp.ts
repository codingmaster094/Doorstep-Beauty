export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

export function whatsappLink(phone: string, message: string): string {
  const number = digitsOnly(phone)
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function telLink(phone: string): string {
  const number = digitsOnly(phone)
  return `tel:+${number.startsWith('91') ? number : `91${number}`}`
}

export const DEFAULT_WHATSAPP_MESSAGE = 'Hi, I want to book a home beauty service in Surat.'

export function bookingWhatsappMessage(bookingId: string): string {
  return `Hi, I need help with my appointment ${bookingId}.`
}
