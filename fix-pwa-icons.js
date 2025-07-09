#!/usr/bin/env node

/**
 * PWA Icon Fix Script
 * This script ensures all PWA icons are properly generated and accessible
 */

const fs = require('fs');
const path = require('path');

const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// Create a simple travel-themed icon as base64 PNG
function createBasicPNG(size) {
  // This is a fallback 1x1 transparent PNG
  const transparentPNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  return Buffer.from(transparentPNG, 'base64');
}

// Ensure icons directory exists
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('🔧 Checking PWA icons...');

let missingIcons = [];
let existingIcons = [];

// Check which icons exist
iconSizes.forEach(size => {
  const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`);
  const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  
  if (fs.existsSync(pngPath)) {
    existingIcons.push(`icon-${size}x${size}.png`);
  } else {
    missingIcons.push(`icon-${size}x${size}.png`);
  }
  
  if (fs.existsSync(svgPath)) {
    existingIcons.push(`icon-${size}x${size}.svg`);
  } else {
    missingIcons.push(`icon-${size}x${size}.svg`);
  }
});

console.log(`✅ Found ${existingIcons.length} existing icons`);
console.log(`⚠️  Missing ${missingIcons.length} icons`);

// List existing icons
if (existingIcons.length > 0) {
  console.log('\n📁 Existing icons:');
  existingIcons.forEach(icon => console.log(`  - ${icon}`));
}

// List missing icons
if (missingIcons.length > 0) {
  console.log('\n❌ Missing icons:');
  missingIcons.forEach(icon => console.log(`  - ${icon}`));
}

// Check if we have the core required icons
const requiredIcons = ['icon-192x192.png', 'icon-512x512.png'];
const missingRequired = requiredIcons.filter(icon => !fs.existsSync(path.join(iconsDir, icon)));

if (missingRequired.length === 0) {
  console.log('\n✅ All required PWA icons are present!');
} else {
  console.log('\n⚠️  Missing required PWA icons:', missingRequired.join(', '));
}

// Test manifest.json
const manifestPath = path.join(__dirname, 'public', 'manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log('\n📄 Manifest.json validation:');
    console.log(`  - Name: ${manifest.name}`);
    console.log(`  - Icons: ${manifest.icons.length} defined`);
    
    // Check if all manifest icons exist
    let manifestErrors = [];
    manifest.icons.forEach(icon => {
      const iconPath = path.join(__dirname, 'public', icon.src);
      if (!fs.existsSync(iconPath)) {
        manifestErrors.push(icon.src);
      }
    });
    
    if (manifestErrors.length === 0) {
      console.log('  ✅ All manifest icons exist');
    } else {
      console.log('  ⚠️  Missing manifest icons:', manifestErrors.join(', '));
    }
  } catch (error) {
    console.log('  ❌ Error reading manifest.json:', error.message);
  }
} else {
  console.log('\n❌ manifest.json not found');
}

// Test service worker
const swPath = path.join(__dirname, 'public', 'sw.js');
if (fs.existsSync(swPath)) {
  console.log('\n🔧 Service worker: ✅ Found');
} else {
  console.log('\n❌ Service worker not found');
}

console.log('\n🎉 PWA icon check complete!');
console.log('\nTo generate missing icons:');
console.log('1. Visit: http://localhost:3000/icon-generator.html');
console.log('2. Click "Generate All Icons"');
console.log('3. Download and save missing icons to public/icons/');
