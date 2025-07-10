/**
 * PWA PNG Icon Generator
 * Creates proper PNG icons using canvas for PWA installation
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// Generate a proper PNG icon using canvas
const generatePNGIcon = (size) => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  
  // Draw circle background
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2 - 4, 0, 2 * Math.PI);
  ctx.fill();
  
  // Draw white border
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = Math.max(1, size * 0.004);
  ctx.stroke();
  
  // Draw suitcase body
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#333';
  ctx.lineWidth = Math.max(1, size * 0.004);
  const suitcaseX = size * 0.2;
  const suitcaseY = size * 0.4;
  const suitcaseW = size * 0.6;
  const suitcaseH = size * 0.35;
  
  ctx.beginPath();
  ctx.roundRect(suitcaseX, suitcaseY, suitcaseW, suitcaseH, size * 0.02);
  ctx.fill();
  ctx.stroke();
  
  // Draw suitcase handle
  ctx.fillStyle = 'transparent';
  ctx.strokeStyle = '#333';
  ctx.lineWidth = Math.max(1, size * 0.004);
  const handleX = size * 0.4;
  const handleY = size * 0.3;
  const handleW = size * 0.2;
  const handleH = size * 0.12;
  
  ctx.beginPath();
  ctx.roundRect(handleX, handleY, handleW, handleH, size * 0.01);
  ctx.stroke();
  
  // Draw travel stickers
  ctx.fillStyle = '#ff6b6b';
  ctx.beginPath();
  ctx.arc(size * 0.35, size * 0.6, size * 0.04, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.fillStyle = '#4ecdc4';
  ctx.beginPath();
  ctx.arc(size * 0.65, size * 0.55, size * 0.04, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.fillStyle = '#ffe66d';
  ctx.beginPath();
  ctx.arc(size * 0.55, size * 0.7, size * 0.04, 0, 2 * Math.PI);
  ctx.fill();
  
  // Draw location pin
  ctx.fillStyle = '#ff6b6b';
  ctx.beginPath();
  ctx.arc(size * 0.7, size * 0.23, size * 0.08, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(size * 0.7, size * 0.23, size * 0.04, 0, 2 * Math.PI);
  ctx.fill();
  
  // Draw text (only for larger icons)
  if (size >= 128) {
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${size * 0.08}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('REISE', size/2, size * 0.85);
  }
  
  return canvas.toBuffer('image/png');
};

console.log('🎨 Generating PNG icons for PWA...');

const iconsDir = path.join(__dirname, 'public', 'icons');

iconSizes.forEach(size => {
  try {
    const pngBuffer = generatePNGIcon(size);
    const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    fs.writeFileSync(pngPath, pngBuffer);
    console.log(`✅ Created icon-${size}x${size}.png (${pngBuffer.length} bytes)`);
  } catch (error) {
    console.log(`❌ Failed to create icon-${size}x${size}.png:`, error.message);
  }
});

console.log('\n🚀 PWA PNG Icon Generation Complete!');
console.log('📱 Your app is now ready for mobile installation!');
