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
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        }}
      >
        {/* Left side - Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '80px 60px',
          }}
        >
          {/* Brand */}
          <div
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#1d62fb',
              marginBottom: '24px',
            }}
          >
            Vikings Kepower
          </div>

          {/* Main heading */}
          <div
            style={{
              fontSize: '56px',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '20px',
              lineHeight: 1.1,
            }}
          >
            All Products
          </div>

          {/* Subheading */}
          <div
            style={{
              fontSize: '28px',
              color: '#64748b',
              marginBottom: '24px',
            }}
          >
            Complete Collection of Quality Tools & Equipment
          </div>

          {/* Features */}
          <div
            style={{
              fontSize: '22px',
              color: '#475569',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div>🔧 Construction Tools</div>
            <div>🌾 Agricultural Equipment</div>
            <div>🏭 Industrial Machinery</div>
          </div>
        </div>

        {/* Right side - Visual elements */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            backgroundColor: 'rgba(29, 98, 251, 0.08)',
          }}
        >
          {/* Large centered icon */}
          <div
            style={{
              fontSize: '180px',
              color: '#1d62fb',
              opacity: 0.6,
            }}
          >
            🛠️
          </div>

          {/* Floating elements */}
          <div
            style={{
              position: 'absolute',
              top: '80px',
              right: '80px',
              fontSize: '48px',
              color: '#3b82f6',
            }}
          >
            ⚙️
          </div>
          
          <div
            style={{
              position: 'absolute',
              bottom: '80px',
              left: '80px',
              fontSize: '48px',
              color: '#3b82f6',
            }}
          >
            🔩
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '6px',
            background: 'linear-gradient(90deg, #1d62fb 0%, #3b82f6 100%)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
