#!/usr/bin/env node

// Script to test render-blocking resource elimination
const puppeteer = require('puppeteer');

async function testRenderBlocking() {
  console.log('🧪 Testing render-blocking resource elimination...\n');
  
  try {
    // Launch browser in headless mode
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Enable request interception to monitor resources
    const resources = [];
    const renderBlockingResources = [];
    
    page.on('response', async (response) => {
      const url = response.url();
      const contentType = response.headers()['content-type'] || '';
      
      if (contentType.includes('text/css') || url.endsWith('.css')) {
        resources.push({
          url: url.split('/').pop(),
          size: response.headers()['content-length'] || 'unknown',
          timing: response.timing() || {}
        });
        
        // Check if it's render-blocking (synchronous CSS)
        if (!url.includes('deferred-styles.css')) {
          renderBlockingResources.push(url);
        }
      }
    });
    
    // Navigate to the page
    const startTime = Date.now();
    await page.goto('http://localhost:3000', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    const loadTime = Date.now() - startTime;
    
    // Check for critical CSS in head
    const inlineCSSCount = await page.evaluate(() => {
      const styleTags = document.querySelectorAll('head style');
      let criticalSize = 0;
      let hasCritical = false;
      
      styleTags.forEach(style => {
        if (style.getAttribute('data-critical') || 
            style.textContent.includes('lcp-text') ||
            style.textContent.includes('min-height:100vh')) {
          hasCritical = true;
          criticalSize += style.textContent.length;
        }
      });
      
      return { count: styleTags.length, hasCritical, criticalSize };
    });
    
    // Check if deferred CSS is loaded
    const deferredCSSLoaded = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.some(link => link.href.includes('deferred-styles.css'));
    });
    
    // Performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
        loadComplete: nav.loadEventEnd - nav.loadEventStart,
        firstPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-paint')?.startTime,
        firstContentfulPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime
      };
    });
    
    await browser.close();
    
    // Results
    console.log('📊 Render-Blocking Analysis Results:');
    console.log('=====================================');
    console.log(`⏱️  Page Load Time: ${loadTime}ms`);
    console.log(`🎨 First Paint: ${performanceMetrics.firstPaint?.toFixed(2) || 'N/A'}ms`);
    console.log(`🖼️  First Contentful Paint: ${performanceMetrics.firstContentfulPaint?.toFixed(2) || 'N/A'}ms`);
    console.log(`📄 DOM Content Loaded: ${performanceMetrics.domContentLoaded?.toFixed(2) || 'N/A'}ms`);
    console.log('');
    
    console.log('🎯 Critical CSS Analysis:');
    console.log(`   Inline style tags: ${inlineCSSCount.count}`);
    console.log(`   Has critical CSS: ${inlineCSSCount.hasCritical ? '✅ Yes' : '❌ No'}`);
    console.log(`   Critical CSS size: ${(inlineCSSCount.criticalSize / 1024).toFixed(2)} KB`);
    console.log('');
    
    console.log('📦 CSS Resources Found:');
    resources.forEach(resource => {
      const size = resource.size !== 'unknown' ? `${(parseInt(resource.size) / 1024).toFixed(2)} KB` : resource.size;
      console.log(`   ${resource.url}: ${size}`);
    });
    console.log('');
    
    console.log('🚫 Render-Blocking CSS Files:');
    if (renderBlockingResources.length === 0) {
      console.log('   ✅ No render-blocking CSS files detected!');
    } else {
      renderBlockingResources.forEach(url => {
        console.log(`   ❌ ${url}`);
      });
    }
    console.log('');
    
    console.log('⚡ Deferred CSS Loading:');
    console.log(`   Deferred CSS loaded: ${deferredCSSLoaded ? '✅ Yes' : '❌ No'}`);
    console.log('');
    
    // Summary
    console.log('📈 Performance Summary:');
    const isOptimized = renderBlockingResources.length === 0 && 
                       inlineCSSCount.hasCritical && 
                       performanceMetrics.firstContentfulPaint < 1000;
    
    if (isOptimized) {
      console.log('   🎉 EXCELLENT: Render-blocking eliminated successfully!');
      console.log('   ✅ Critical CSS is inlined');
      console.log('   ✅ No render-blocking CSS files');
      console.log('   ✅ Fast first contentful paint');
    } else {
      console.log('   ⚠️  Areas for improvement:');
      if (renderBlockingResources.length > 0) {
        console.log('   - Still has render-blocking CSS');
      }
      if (!inlineCSSCount.hasCritical) {
        console.log('   - Missing critical CSS');
      }
      if (performanceMetrics.firstContentfulPaint >= 1000) {
        console.log('   - First contentful paint could be faster');
      }
    }
    
  } catch (error) {
    if (error.message.includes('ECONNREFUSED')) {
      console.error('❌ Cannot connect to http://localhost:3000');
      console.error('💡 Make sure your development server is running:');
      console.error('   npm run build && npm start');
    } else {
      console.error('❌ Error during test:', error.message);
    }
  }
}

// Only run if this is the main module
if (require.main === module) {
  testRenderBlocking();
}

module.exports = testRenderBlocking;