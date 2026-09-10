import { ImageResponse } from 'next/og'

export const size = 32
export const contentType = 'image/png'

export default function Icon() {
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
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        B
      </div>
    ),
    { width: 32, height: 32 },
  )
}
