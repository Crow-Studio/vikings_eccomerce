import { ImageResponse } from 'next/og'

// Image metadata
export const alt = 'Vikings Kepower - Quality Tools & Equipment Supplier in Kenya'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        {/* Main content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            borderRadius: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              display: 'flex',
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#1d62fb',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            Vikings Kepower
          </div>
          
          {/* Subtitle */}
          <div
            style={{
              display: 'flex',
              fontSize: '32px',
              color: '#4a5568',
              textAlign: 'center',
              marginBottom: '10px',
            }}
          >
            Quality Tools & Equipment
          </div>
          
          {/* Location */}
          <div
            style={{
              display: 'flex',
              fontSize: '24px',
              color: '#718096',
              textAlign: 'center',
            }}
          >
            Trusted Supplier in Kenya
          </div>
        </div>

      </div>
    ),
    {
      ...size,
    }
  )
}