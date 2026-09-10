import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export function absUrl(path: string): string {
  return new URL(path, siteUrl).toString()
}

export function pageMeta(args: {
  title: string
  description: string
  path: string
  image?: string
}): Metadata {
  const url = absUrl(args.path)
  return {
    title: args.title,
    description: args.description,
    alternates: { canonical: url },
    openGraph: {
      title: args.title,
      description: args.description,
      url,
      type: 'website',
      images: args.image ? [{ url: args.image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: args.title,
      description: args.description,
    },
  }
}

export function jsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data)
}
