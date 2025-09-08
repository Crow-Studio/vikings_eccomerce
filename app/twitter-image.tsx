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
          backgroundColor: '#1da1f2',
          backgroundImage: 'linear-gradient(135deg, #1da1f2 0%, #1d62fb 100%)',
        }}
      >
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            borderRadius: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            margin: '40px',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* Brand name */}
          <div
            style={{
              fontSize: '68px',
              fontWeight: 'bold',
              color: '#1d62fb',
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            Vikings Kepower
          </div>
          
          {/* Tagline */}
          <div
            style={{
              fontSize: '28px',
              color: '#2d3748',
              textAlign: 'center',
              marginBottom: '8px',
            }}
          >
            Professional Tools & Equipment
          </div>
          
          {/* Call to action */}
          <div
            style={{
              fontSize: '20px',
              color: '#718096',
              textAlign: 'center',
            }}
          >
            🔧 Construction • 🌾 Agriculture • 🏭 Industrial
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
