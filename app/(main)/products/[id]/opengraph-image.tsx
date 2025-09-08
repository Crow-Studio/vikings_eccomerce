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
    // Fallback image for non-existent products
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f7fafc',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              color: '#4a5568',
            }}
          >
            Product Not Found
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
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
        }}
      >
        {/* Left side - Product info */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px',
          }}
        >
          {/* Brand */}
          <div
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#1d62fb',
              marginBottom: '20px',
            }}
          >
            Vikings Kepower
          </div>

          {/* Product name */}
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#2d3748',
              marginBottom: '16px',
              lineHeight: 1.2,
            }}
          >
            {product.name.length > 40 
              ? product.name.substring(0, 40) + '...' 
              : product.name}
          </div>

          {/* Category */}
          <div
            style={{
              fontSize: '24px',
              color: '#718096',
              marginBottom: '20px',
            }}
          >
            {product.category.name}
          </div>

          {/* Price */}
          <div
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#e53e3e',
            }}
          >
            {price}
          </div>
        </div>

        {/* Right side - Branding */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(29, 98, 251, 0.05)',
            borderLeft: '4px solid #1d62fb',
          }}
        >
          {/* Large icon/symbol */}
          <div
            style={{
              fontSize: '120px',
              color: '#1d62fb',
              marginBottom: '20px',
            }}
          >
            🔧
          </div>

          {/* Quality badge */}
          <div
            style={{
              fontSize: '24px',
              color: '#2d3748',
              textAlign: 'center',
              marginBottom: '10px',
            }}
          >
            Quality Guaranteed
          </div>

          {/* Location */}
          <div
            style={{
              fontSize: '20px',
              color: '#718096',
              textAlign: 'center',
            }}
          >
            🇰🇪 Made for Kenya
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
