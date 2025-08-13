#!/usr/bin/env node

// Build Tailwind CSS with PostCSS and output a single compiled stylesheet
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

async function buildDeferredCSS() {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    const srcFile = path.join(process.cwd(), 'src/app/globals-deferred.css');
    const destDir = path.join(process.cwd(), 'public/css');
    const destFile = path.join(destDir, 'deferred-styles.css');

    if (!fs.existsSync(srcFile)) {
      console.error('❌ Source CSS file not found:', srcFile);
      process.exit(1);
    }

    // Ensure output directory exists
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
      console.log('📁 Created public/css directory');
    }

    const css = fs.readFileSync(srcFile, 'utf8');

    // Load PostCSS plugins
    const tailwind = require('@tailwindcss/postcss');
    const autoprefixer = require('autoprefixer');
    const plugins = [tailwind(), autoprefixer({ remove: true })];
    if (isProd) {
      const cssnano = require('cssnano');
      plugins.push(cssnano({ preset: ['default', { discardComments: { removeAll: true } }] }));
    }

    // Process CSS with PostCSS (which executes Tailwind)
    const result = await postcss(plugins).process(css, {
      from: srcFile,
      to: destFile,
      map: !isProd ? { inline: false } : false,
    });

    fs.writeFileSync(destFile, `/* Built by build-css.js - ${new Date().toISOString()} */\n${result.css}`);
    if (result.map) {
      fs.writeFileSync(`${destFile}.map`, result.map.toString());
    }

    const bytes = Buffer.byteLength(result.css, 'utf8');
    console.log('✅ Tailwind CSS built successfully');
    console.log(`   Source: ${srcFile}`);
    console.log(`   Output: ${destFile}`);
    console.log(`   Size: ${(bytes / 1024).toFixed(2)} KB${isProd ? ' (minified)' : ''}`);
  } catch (error) {
    console.error('❌ Error building CSS:', error && error.message ? error.message : error);
    process.exit(1);
  }
}

// Run if this is the main module
if (require.main === module) {
  buildDeferredCSS();
}

module.exports = buildDeferredCSS;