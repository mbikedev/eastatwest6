#!/usr/bin/env node

// Script to process and copy deferred CSS for render-blocking elimination
const fs = require('fs');
const path = require('path');

function buildDeferredCSS() {
  try {
    const srcFile = path.join(process.cwd(), 'src/app/globals-deferred.css');
    const destDir = path.join(process.cwd(), 'public/css');
    const destFile = path.join(destDir, 'deferred-styles.css');
    
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
      console.log('📁 Created public/css directory');
    }
    
    if (fs.existsSync(srcFile)) {
      let cssContent = fs.readFileSync(srcFile, 'utf8');
      
      // Process the CSS (could add minification here)
      cssContent = `/* Deferred styles - loaded asynchronously to eliminate render blocking */\n${cssContent}`;
      
      fs.writeFileSync(destFile, cssContent);
      console.log('✅ Deferred CSS built successfully');
      console.log(`   Source: ${srcFile}`);
      console.log(`   Output: ${destFile}`);
      console.log(`   Size: ${(cssContent.length / 1024).toFixed(2)} KB`);
    } else {
      console.error('❌ Source CSS file not found:', srcFile);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error building deferred CSS:', error.message);
    process.exit(1);
  }
}

// Run if this is the main module
if (require.main === module) {
  buildDeferredCSS();
}

module.exports = buildDeferredCSS;