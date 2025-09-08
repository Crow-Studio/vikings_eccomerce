import { ImageResponse } from 'next/og'

// Image metadata
export const alt = 'All Products - Vikings Kepower Quality Tools & Equipment'
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
          backgroundColor: '#1da1f2',
          backgroundImage: 'linear-gradient(135deg, #0ea5e9 0%, #1d62fb 100%)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          <div
            style={{
              fontSize: '40px',
              fontWeight: 'bold',
              color: '#ffffff',
            }}
          >
            Vikings Kepower
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '24px',
              padding: '60px',
              textAlign: 'center',
              width: '90%',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* Main title */}
            <div
              style={{
                fontSize: '52px',
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '20px',
              }}
            >
              All Products
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: '28px',
                color: '#64748b',
                marginBottom: '30px',
              }}
            >
              Browse Our Complete Collection
            </div>

            {/* Category icons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '40px',
                fontSize: '48px',
              }}
            >
              <span>🔧</span>
              <span>🌾</span>
              <span>🏭</span>
              <span>⚙️</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '24px',
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            Quality Tools & Equipment • 🇰🇪 Kenya
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
