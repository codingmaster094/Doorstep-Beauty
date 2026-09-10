import { ImageResponse } from 'next/og'

export const size = 180
export const contentType = 'image/png'

export default function AppleIcon() {
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
          fontSize: 86,
          fontWeight: 600,
        }}
      >
        B
      </div>
    ),
    { width: 180, height: 180 },
  )
}
