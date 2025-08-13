import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Modern browser targeting - reduces polyfills
  transpilePackages: [],
  
  // Bundle optimization
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-i18next', 'lucide-react'],
  },
  
  // Disable ESLint during build to focus on polyfill optimization
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Enable tree shaking and optimization
  webpack: (config, { dev, isServer }) => {
    // Configure for modern browsers
    if (!isServer) {
      config.target = ['web', 'es2022'];
    }
    
    // Production optimizations
    if (!dev && !isServer) {
      // Enable tree shaking
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
        splitChunks: {
          chunks: 'all',
          maxSize: 120000, // Smaller chunks for better caching
          cacheGroups: {
            // React and core libraries
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 20,
            },
            // Animation libraries
            framerMotion: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'framer-motion',
              chunks: 'all',
              priority: 15,
            },
            // i18n libraries
            i18n: {
              test: /[\\/]node_modules[\\/](react-i18next|i18next)[\\/]/,
              name: 'i18n',
              chunks: 'all',
              priority: 10,
            },
            // Vendor libraries (smaller chunks)
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 5,
              maxSize: 100000, // 100kb vendor chunks
            },
            // Common app code
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true,
              maxSize: 100000,
              priority: 1,
            },
          },
        },
      };

      // Additional optimizations
      config.resolve.alias = {
        ...config.resolve.alias,
        // Tree shake lodash if used
        'lodash': 'lodash-es',
      };

      // Exclude polyfills for modern browsers
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Don't polyfill Node.js core modules for client
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };

      // Configure for modern JavaScript output - commented out due to potential conflicts
      // config.experiments = {
      //   ...config.experiments,
      //   outputModule: true,
      //   topLevelAwait: true,
      // };

      // Add compression plugins for production
      const CompressionPlugin = require('compression-webpack-plugin');
      
      config.plugins.push(
        new CompressionPlugin({
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: /\.(js|css|html|svg|pdf)$/,
          threshold: 8192,
          minRatio: 0.8,
        })
      );

      // Add Brotli compression if available
      try {
        const BrotliPlugin = require('compression-webpack-plugin');
        config.plugins.push(
          new BrotliPlugin({
            filename: '[path][base].br',
            algorithm: 'brotliCompress',
            test: /\.(js|css|html|svg|pdf)$/,
            compressionOptions: {
              params: {
                [require('zlib').constants.BROTLI_PARAM_QUALITY]: 11,
              },
            },
            threshold: 8192,
            minRatio: 0.8,
          })
        );
      } catch (e) {
        // Brotli not available
      }
    }

    return config;
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Enable compression
  compress: true,

  // Custom headers for better caching and compression support
  async headers() {
    return [
      {
        source: '/pdfs/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/assets/restaurant-guru/:path*',
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
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000', // 30 days
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
    ];
  },

  // Disable x-powered-by header
  poweredByHeader: false,
};

export default nextConfig;
