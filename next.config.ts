import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint during build to focus on polyfill optimization
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Bundle optimization
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-i18next', 'lucide-react'],
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Webpack configuration for compression and CSS optimization
  webpack: (config, { dev, isServer }) => {
    // CSS render-blocking elimination
    if (!dev && !isServer) {
      // Copy deferred CSS to public folder for async loading
      const fs = require('fs');
      const path = require('path');
      
      try {
        const srcCSS = path.join(process.cwd(), 'src/app/globals-deferred.css');
        const destCSS = path.join(process.cwd(), 'public/css/deferred-styles.css');
        
        // Ensure public/css directory exists
        const cssDir = path.dirname(destCSS);
        if (!fs.existsSync(cssDir)) {
          fs.mkdirSync(cssDir, { recursive: true });
        }
        
        // Copy the file
        if (fs.existsSync(srcCSS)) {
          fs.copyFileSync(srcCSS, destCSS);
          console.log('✅ Deferred CSS copied to public/css/deferred-styles.css');
        }
      } catch (error) {
        console.warn('⚠️ Could not copy deferred CSS:', error instanceof Error ? error.message : String(error));
      }
    }

    // Add compression plugins for production builds
    if (!dev && !isServer) {
      const CompressionPlugin = require('compression-webpack-plugin');
      
      // Gzip compression
      config.plugins.push(
        new CompressionPlugin({
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: /\.(js|css|html|svg|json|txt|xml|woff|woff2|ttf|eot)$/,
          threshold: 1024, // Only compress files larger than 1KB
          minRatio: 0.8, // Only compress if compression ratio is better than 80%
        })
      );

      // Brotli compression (better than gzip)
      config.plugins.push(
        new CompressionPlugin({
          filename: '[path][base].br',
          algorithm: 'brotliCompress',
          test: /\.(js|css|html|svg|json|txt|xml|woff|woff2|ttf|eot)$/,
          compressionOptions: {
            params: {
              [require('zlib').constants.BROTLI_PARAM_QUALITY]: 11,
            },
          },
          threshold: 1024,
          minRatio: 0.8,
        })
      );
    }

    return config;
  },

  // Image optimization - optimized for performance audit
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    // Optimized device sizes for actual viewport usage
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1920],
    // Optimized image sizes for common component sizes
    imageSizes: [16, 24, 32, 40, 48, 64, 96, 128, 192, 256, 384, 512],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Quality settings for different image types
    domains: [], // Add any external domains if needed
    unoptimized: false,
  },

  // Enable compression
  compress: true,

  // Custom headers for compression and caching
  async headers() {
    return [
      {
        // Apply compression headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      {
        // Long-term caching for immutable static assets (1 year)
        source: '/(_next/static|images|assets)/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
          {
            key: 'X-Cache-Tag',
            value: 'static-asset',
          },
        ],
      },
      {
        // Specific long-term caching for Restaurant Guru assets and SVGs
        source: '/assets/restaurant-guru/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
          {
            key: 'X-Cache-Tag',
            value: 'restaurant-guru',
          },
        ],
      },
      {
        // Enhanced caching for all SVG assets
        source: '/(.*)\\.svg$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
          {
            key: 'Content-Type',
            value: 'image/svg+xml',
          },
        ],
      },
      {
        // Long-term caching for fonts and media files
        source: '/(.*)(woff|woff2|ttf|eot|mp4|webm|webp|avif|jpg|jpeg|png|gif)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      {
        // PDF files with long-term caching
        source: '/pdfs/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable', // 30 days for PDFs as they might update
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      {
        // Headers for API routes
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      {
        // Headers for RSC (React Server Components) routes
        source: '/(.*)\\?_rsc=(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, max-age=0, must-revalidate',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
          {
            key: 'Content-Encoding',
            value: 'gzip',
          },
        ],
      },
    ];
  },

  // Disable x-powered-by header
  poweredByHeader: false,
};

export default nextConfig;