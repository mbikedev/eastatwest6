#!/usr/bin/env node

// Script to test cache policies for static assets
const http = require('http');

async function testCachePolicies() {
  const testAssets = [
    'http://localhost:3000/assets/restaurant-guru/star_red.svg', // Target asset from audit
    'http://localhost:3000/_next/static/css/test.css', // Next.js static asset
    'http://localhost:3000/images/banner.webp', // Image asset
    'http://localhost:3000/pdfs/menus.pdf', // PDF asset
  ];

  console.log('🧪 Testing cache policies for static assets...\n');
  
  for (const url of testAssets) {
    try {
      console.log(`Testing: ${url}`);
      
      const response = await fetch(url, {
        method: 'HEAD', // Only get headers
        headers: {
          'User-Agent': 'Cache-Policy-Test/1.0'
        }
      });
      
      const cacheControl = response.headers.get('cache-control');
      const vary = response.headers.get('vary');
      const etag = response.headers.get('etag');
      const contentType = response.headers.get('content-type');
      const xCacheTag = response.headers.get('x-cache-tag');
      const xPerfOptimized = response.headers.get('x-performance-optimized');
      
      console.log(`  Status: ${response.status}`);
      console.log(`  Cache-Control: ${cacheControl || 'Not set'}`);
      console.log(`  Vary: ${vary || 'Not set'}`);
      console.log(`  ETag: ${etag || 'Not set'}`);
      console.log(`  Content-Type: ${contentType || 'Not set'}`);
      
      if (xCacheTag) {
        console.log(`  X-Cache-Tag: ${xCacheTag}`);
      }
      
      if (xPerfOptimized) {
        console.log(`  🎯 Performance Optimized: ${xPerfOptimized}`);
      }
      
      // Analyze cache policy
      if (cacheControl) {
        if (cacheControl.includes('max-age=31536000') && cacheControl.includes('immutable')) {
          console.log(`  ✅ Excellent: 1-year immutable cache`);
        } else if (cacheControl.includes('max-age=2592000')) {
          console.log(`  ✅ Good: 30-day cache`);
        } else if (cacheControl.includes('max-age=15768000')) {
          console.log(`  ✅ Good: 6-month cache`);
        } else {
          console.log(`  ⚠️  Cache policy could be improved`);
        }
      } else {
        console.log(`  ❌ No cache policy set`);
      }
      
      console.log('');
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error(`❌ Cannot connect to ${url}. Make sure your dev server is running (npm run dev or npm start)`);
      } else {
        console.error(`Error testing ${url}:`, error.message);
      }
      console.log('');
    }
  }
  
  console.log('💡 Expected Results:');
  console.log('- Restaurant Guru SVG: 1-year immutable cache (target of performance audit)');
  console.log('- Next.js static files: 1-year immutable cache');
  console.log('- Images: 6-month cache');
  console.log('- PDFs: 30-day cache');
  console.log('\n🔧 To test:');
  console.log('1. Start server: npm run dev (or npm run build && npm start for production)');
  console.log('2. Run this script: npm run test:cache');
  console.log('3. Check browser DevTools Network tab for cache headers');
}

// Only run if this is the main module
if (require.main === module) {
  testCachePolicies();
}

module.exports = testCachePolicies;