'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  quality?: number
  sizes?: string
  loading?: 'lazy' | 'eager'
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  quality = 65, // Aggressive default compression
  sizes,
  loading = 'lazy',
  ...props
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false)

  // Generate optimized sizes based on image usage context
  const getOptimizedSizes = () => {
    if (sizes) return sizes
    
    // Default responsive sizes for maximum efficiency
    if (fill) {
      return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
    }
    
    // For fixed width images, provide appropriate sizes
    if (width && width <= 128) {
      return '(max-width: 640px) 64px, (max-width: 768px) 96px, 128px'
    } else if (width && width <= 256) {
      return '(max-width: 640px) 128px, (max-width: 768px) 192px, 256px'
    } else if (width && width <= 512) {
      return '(max-width: 640px) 256px, (max-width: 768px) 384px, 512px'
    }
    
    return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
  }



  // Error fallback image
  const fallbackSrc = '/images/placeholder.svg'

  return (
    <Image
      src={imageError ? fallbackSrc : src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={`transition-opacity duration-300 ${className}`}
      priority={priority}
      quality={quality}
      sizes={getOptimizedSizes()}
      loading={loading}

      onError={() => setImageError(true)}
      {...props}
    />
  )
}

// Preset configurations for common use cases
export const ImagePresets = {
  // Hero/banner images - higher quality for visual impact
  hero: {
    quality: 80,
    priority: true,
    sizes: '100vw'
  },
  
  // Gallery thumbnails - aggressive compression
  thumbnail: {
    quality: 60,
    loading: 'lazy' as const,
    sizes: '(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw'
  },
  
  // Blog featured images - balanced quality
  featured: {
    quality: 70,
    priority: true,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw'
  },
  
  // Blog post images - lower quality for faster loading
  post: {
    quality: 65,
    loading: 'lazy' as const,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  },
  
  // Logo/icons - highest quality but small size
  logo: {
    quality: 85,
    priority: true,
    sizes: '(max-width: 768px) 32px, 40px'
  }
} 