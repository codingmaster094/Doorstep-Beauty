import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(_request: Request, { params }: { params: Promise<{ size: string }> }) {
  const raw = Number((await params).size)
  const size = raw === 512 ? 512 : 192
  const fontSize = Math.round(size * 0.42)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#7a3045',
          color: '#f8f1ea',
          fontSize,
          fontWeight: 600,
          letterSpacing: '-0.04em',
        }}
      >
        B
      </div>
    ),
    { width: size, height: size },
  )
}
