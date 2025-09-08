import { ImageResponse } from 'next/og'
import { getProductById } from '@/actions/product-actions'

// Image metadata
export const alt = 'Product from Vikings Kepower'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

interface Props {
  params: {
    id: string
  }
}

// Image generation
export default async function Image({ params }: Props) {
  const product = await getProductById(params.id)

  if (!product) {
    // Fallback image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1da1f2',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              color: '#ffffff',
            }}
          >
            Product Not Available
          </div>
        </div>
      ),
      { ...size }
    )
  }

  const price = `KSh ${Number.parseFloat(product.price).toLocaleString()}`

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1da1f2',
          backgroundImage: 'linear-gradient(135deg, #1da1f2 0%, #1d62fb 100%)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '40px 60px 20px',
          }}
        >
          <div
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#ffffff',
            }}
          >
            Vikings Kepower
          </div>
          <div
            style={{
              fontSize: '28px',
              color: '#ffffff',
            }}
          >
            🇰🇪
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
              borderRadius: '20px',
              padding: '50px',
              textAlign: 'center',
              maxWidth: '80%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* Product name */}
            <div
              style={{
                fontSize: '42px',
                fontWeight: 'bold',
                color: '#2d3748',
                marginBottom: '16px',
                lineHeight: 1.2,
              }}
            >
              {product.name.length > 35 
                ? product.name.substring(0, 35) + '...' 
                : product.name}
            </div>

            {/* Category & Price */}
            <div
              style={{
                fontSize: '24px',
                color: '#718096',
                marginBottom: '12px',
              }}
            >
              {product.category.name}
            </div>

            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#e53e3e',
              }}
            >
              {price}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '20px 60px 40px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            Quality Tools & Equipment • vikings.co.ke
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
