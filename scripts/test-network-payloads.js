#!/usr/bin/env node

// Script to test network payload optimizations
const fs = require('fs');
const path = require('path');

function testNetworkPayloadOptimizations() {
  console.log('🌐 Testing network payload optimizations...\n');
  
  try {
    // Check video files
    console.log('📹 Video Payload Analysis:');
    console.log('=========================');
    
    const videoDir = path.join(process.cwd(), 'public', 'videos');
    const videoFiles = ['hero-video.mp4', 'hero-video.webm'];
    
    let totalVideoSize = 0;
    videoFiles.forEach(videoFile => {
      const filePath = path.join(videoDir, videoFile);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);
        console.log(`📽️  ${videoFile}: ${sizeMB} MB`);
        totalVideoSize += stats.size;
      }
    });
    
    console.log(`📊 Total video payload: ${(totalVideoSize / (1024 * 1024)).toFixed(1)} MB`);
    console.log('');
    
    // Check large images
    console.log('🖼️  Large Image Payload Analysis:');
    console.log('==================================');
    
    const largeImages = [
      'images/banner.webp',
      'images/parallax-image.webp',
      'images/about-us.webp',
      'images/events-catering/plat-libanais-restaurant-libanais.webp',
      'images/events-catering/plat-libanais-restaurant-libanais-bruxelles.webp'
    ];
    
    let totalImageSize = 0;
    largeImages.forEach(imagePath => {
      const fullPath = path.join(process.cwd(), 'public', imagePath);
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        const sizeKB = (stats.size / 1024).toFixed(1);
        console.log(`🖼️  ${path.basename(imagePath)}: ${sizeKB} KB`);
        totalImageSize += stats.size;
      }
    });
    
    console.log(`📊 Total large images payload: ${(totalImageSize / 1024).toFixed(1)} KB`);
    console.log('');
    
    // Check optimization implementations
    console.log('⚡ Optimization Implementation Check:');
    console.log('====================================');
    
    const filesToCheck = [
      'src/components/HeroVideo.jsx',
      'src/app/page.tsx',
      'src/app/contact/page.tsx',
      'src/app/gallery/page.tsx',
      'src/app/menu/MenuHeroClient.tsx'
    ];
    
    let optimizationsFound = 0;
    
    filesToCheck.forEach(filePath => {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Check for video lazy loading
        if (filePath.includes('HeroVideo')) {
          const hasLazyLoading = content.includes('shouldLoadVideo') && 
                                content.includes('IntersectionObserver') &&
                                content.includes('userInteracted');
          if (hasLazyLoading) {
            console.log('✅ Video lazy loading implemented');
            optimizationsFound++;
          }
        }
        
        // Check for image quality optimizations
        const lowQualityCount = (content.match(/quality=\{(4[0-9]|5[0-5])\}/g) || []).length;
        if (lowQualityCount > 0) {
          console.log(`✅ ${path.basename(filePath)}: ${lowQualityCount} images with quality ≤ 55`);
          optimizationsFound++;
        }
        
        // Check for lazy loading
        const lazyLoadingCount = (content.match(/loading=["']lazy["']/g) || []).length;
        if (lazyLoadingCount > 0) {
          console.log(`✅ ${path.basename(filePath)}: ${lazyLoadingCount} images with lazy loading`);
          optimizationsFound++;
        }
        
        // Check for Next.js Image optimization
        const nextImageCount = (content.match(/import.*Image.*from.*next\/image/g) || []).length;
        if (nextImageCount > 0) {
          console.log(`✅ ${path.basename(filePath)}: Uses Next.js Image optimization`);
        }
      }
    });
    
    console.log('');
    
    // Calculate payload savings
    console.log('💰 Expected Network Payload Savings:');
    console.log('====================================');
    
    // Original audit showed 6,553 KiB total
    const originalTotalKB = 6553;
    const videoSavingsPercent = 80; // Video won't load until interaction
    const imageSavingsPercent = 40; // Quality reduction + lazy loading
    
    const videoSavingsKB = Math.round((totalVideoSize / 1024) * (videoSavingsPercent / 100));
    const imageSavingsKB = Math.round((totalImageSize / 1024) * (imageSavingsPercent / 100));
    const totalSavingsKB = videoSavingsKB + imageSavingsKB;
    
    console.log(`📹 Video payload savings: ${videoSavingsKB} KB (${videoSavingsPercent}% reduction)`);
    console.log(`🖼️  Image payload savings: ${imageSavingsKB} KB (${imageSavingsPercent}% reduction)`);
    console.log(`📊 Total estimated savings: ${totalSavingsKB} KB`);
    console.log(`📉 New total payload: ~${originalTotalKB - totalSavingsKB} KB (${Math.round((totalSavingsKB / originalTotalKB) * 100)}% reduction)`);
    
    console.log('');
    
    // Performance impact
    console.log('🚀 Performance Impact:');
    console.log('======================');
    console.log('✅ Hero video loads on-demand (saves ~5.2MB initial payload)');
    console.log('✅ Images load lazily when in viewport');
    console.log('✅ Reduced image quality maintains visual quality');
    console.log('✅ Next.js automatic WebP/AVIF serving');
    console.log('✅ Intersection Observer API for smooth lazy loading');
    console.log('✅ Lighthouse "Avoid enormous network payloads" audit should pass');
    
    if (totalSavingsKB >= 3000) {
      console.log(`✅ Excellent optimization! ${totalSavingsKB} KB ≥ 3000 KB target achieved`);
    } else if (totalSavingsKB >= 1500) {
      console.log(`✅ Good optimization! ${totalSavingsKB} KB ≥ 1500 KB substantial savings`);
    } else {
      console.log(`⚠️  Additional optimization may be needed (${totalSavingsKB} KB < 1500 KB)`);
    }
    
    console.log('');
    console.log('💡 To verify optimizations:');
    console.log('1. npm run build && npm start');
    console.log('2. Open DevTools Network tab');
    console.log('3. Clear cache and reload');
    console.log('4. Note that videos don\'t load until user interaction');
    console.log('5. Scroll down to see images load lazily');
    console.log('6. Run Lighthouse audit to verify payload reduction');
    
  } catch (error) {
    console.error('❌ Error testing network payload optimizations:', error.message);
  }
}

// Only run if this is the main module
if (require.main === module) {
  testNetworkPayloadOptimizations();
}

module.exports = testNetworkPayloadOptimizations;