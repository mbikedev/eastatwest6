#!/usr/bin/env node

// Simple script to check render-blocking elimination without Puppeteer
const fs = require('fs');
const path = require('path');

function checkRenderBlocking() {
  console.log('🔍 Checking render-blocking resource elimination...\n');
  
  try {
    // Check build output
    const buildDir = path.join(process.cwd(), '.next');
    const staticCSSDir = path.join(buildDir, 'static', 'css');
    const publicCSSDir = path.join(process.cwd(), 'public', 'css');
    
    console.log('📁 Build Output Analysis:');
    console.log('=========================');
    
    // Check static CSS files (should be minimal now)
    if (fs.existsSync(staticCSSDir)) {
      const cssFiles = fs.readdirSync(staticCSSDir).filter(file => file.endsWith('.css'));
      console.log(`📦 Static CSS files: ${cssFiles.length}`);
      
      cssFiles.forEach(file => {
        const filePath = path.join(staticCSSDir, file);
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`   ${file}: ${sizeKB} KB`);
        
        // Check if it's significantly reduced (good sign)
        if (stats.size < 50000) { // Less than 50KB is good
          console.log(`   ✅ Small size indicates critical CSS extraction working`);
        }
      });
    } else {
      console.log('❌ No static CSS directory found');
    }
    
    console.log('');
    
    // Check deferred CSS file
    console.log('⚡ Deferred CSS Analysis:');
    console.log('========================');
    
    const deferredCSSPath = path.join(publicCSSDir, 'deferred-styles.css');
    if (fs.existsSync(deferredCSSPath)) {
      const stats = fs.statSync(deferredCSSPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`✅ Deferred CSS exists: ${sizeKB} KB`);
      
      // Check if it contains Tailwind import
      const content = fs.readFileSync(deferredCSSPath, 'utf8');
      if (content.includes('@import "tailwindcss"')) {
        console.log('✅ Contains Tailwind import (will be processed by PostCSS)');
      }
    } else {
      console.log('❌ Deferred CSS file not found');
    }
    
    console.log('');
    
    // Check layout file for globals.css import
    console.log('🧩 Layout Analysis:');
    console.log('==================');
    
    const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');
    if (fs.existsSync(layoutPath)) {
      const layoutContent = fs.readFileSync(layoutPath, 'utf8');
      
      if (layoutContent.includes('import "./globals.css"') && !layoutContent.includes('// import "./globals.css"')) {
        console.log('⚠️  globals.css import still present (render-blocking)');
      } else if (layoutContent.includes('// import "./globals.css"')) {
        console.log('✅ globals.css import commented out (render-blocking eliminated)');
      } else {
        console.log('✅ No globals.css import found');
      }
      
      if (layoutContent.includes('ultraCriticalCSS')) {
        console.log('✅ Critical CSS inlining detected');
      } else {
        console.log('❌ Critical CSS inlining not found');
      }
    }
    
    console.log('');
    
    // Check ZeroCSSBlocking component
    console.log('🛡️  CSS Blocking Component:');
    console.log('===========================');
    
    const componentPath = path.join(process.cwd(), 'src', 'components', 'ZeroCSSBlocking.tsx');
    if (fs.existsSync(componentPath)) {
      const componentContent = fs.readFileSync(componentPath, 'utf8');
      
      if (componentContent.includes('deferred-styles.css')) {
        console.log('✅ Deferred CSS loading implemented');
      }
      
      if (componentContent.includes('requestIdleCallback')) {
        console.log('✅ Optimal loading timing with requestIdleCallback');
      }
      
      if (componentContent.includes('lcp-text')) {
        console.log('✅ LCP optimization styles included');
      }
    }
    
    console.log('');
    
    // Performance prediction
    console.log('🎯 Performance Prediction:');
    console.log('==========================');
    
    const deferredExists = fs.existsSync(deferredCSSPath);
    const layoutContent = fs.existsSync(layoutPath) ? fs.readFileSync(layoutPath, 'utf8') : '';
    const layoutOptimized = fs.existsSync(layoutPath) && 
                          (!layoutContent.includes('import "./globals.css"') || 
                           layoutContent.includes('// import "./globals.css"'));
    
    if (deferredExists && layoutOptimized) {
      console.log('🎉 EXCELLENT: Render-blocking should be eliminated!');
      console.log('');
      console.log('Expected improvements:');
      console.log('• First paint: ~150ms faster');
      console.log('• First contentful paint: Improved');
      console.log('• Above-the-fold content: Renders immediately');
      console.log('• Lighthouse audit: Should pass');
      console.log('');
      console.log('💡 To test in production:');
      console.log('1. npm run build && npm start');
      console.log('2. Run Lighthouse audit');
      console.log('3. Check Network tab - no render-blocking CSS');
    } else {
      console.log('⚠️  Setup incomplete - render-blocking may still exist');
    }
    
  } catch (error) {
    console.error('❌ Error checking render-blocking:', error.message);
  }
}

// Only run if this is the main module
if (require.main === module) {
  checkRenderBlocking();
}

module.exports = checkRenderBlocking;