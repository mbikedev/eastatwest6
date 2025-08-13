#!/usr/bin/env node

// Simple script to test if compression is working
const http = require('http');
const { gzipSync, brotliCompressSync } = require('zlib');

async function testCompression() {
  const testUrls = [
    'http://localhost:3000/',
    'http://localhost:3000/gallery',
    'http://localhost:3000/reservations',
  ];

  console.log('🧪 Testing compression on local development server...\n');
  
  for (const url of testUrls) {
    try {
      console.log(`Testing: ${url}`);
      
      // Test with different Accept-Encoding headers
      const headers = [
        { name: 'No compression', 'accept-encoding': '' },
        { name: 'Gzip', 'accept-encoding': 'gzip, deflate' },
        { name: 'Brotli + Gzip', 'accept-encoding': 'br, gzip, deflate' },
      ];
      
      for (const header of headers) {
        const response = await fetch(url, {
          headers: {
            'Accept-Encoding': header['accept-encoding'],
            'User-Agent': 'Compression-Test/1.0'
          }
        });
        
        const contentLength = response.headers.get('content-length');
        const contentEncoding = response.headers.get('content-encoding');
        
        console.log(`  ${header.name}: ${contentLength || 'Unknown'} bytes ${contentEncoding ? `(${contentEncoding})` : '(no compression)'}`);
      }
      
      console.log('');
    } catch (error) {
      console.error(`Error testing ${url}:`, error.message);
    }
  }
  
  console.log('💡 Tips:');
  console.log('- Start your dev server: npm run dev');
  console.log('- For production testing: npm run build && npm start');
  console.log('- Check Network tab in DevTools for compression headers');
}

// Only run if this is the main module
if (require.main === module) {
  testCompression();
}

module.exports = testCompression;