const fs = require('fs');
const path = require('path');

// Simple PNG icon creator using data URIs
// This creates basic PNG icons as fallbacks

const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

function createSimplePNG(size) {
  // Create a simple travel-themed icon using SVG
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
      </linearGradient>
    </defs>
    
    <!-- Background circle -->
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="url(#grad)" stroke="#fff" stroke-width="2"/>
    
    <!-- Suitcase icon -->
    <g transform="translate(${size*0.2}, ${size*0.25})">
      <!-- Suitcase body -->
      <rect x="0" y="${size*0.15}" width="${size*0.6}" height="${size*0.4}" rx="4" fill="#fff" stroke="#333" stroke-width="2"/>
      
      <!-- Suitcase handle -->
      <rect x="${size*0.2}" y="${size*0.05}" width="${size*0.2}" height="${size*0.12}" rx="2" fill="none" stroke="#333" stroke-width="2"/>
      
      <!-- Suitcase lock -->
      <rect x="${size*0.27}" y="${size*0.25}" width="${size*0.06}" height="${size*0.08}" rx="1" fill="#333"/>
      
      <!-- Travel stickers -->
      <circle cx="${size*0.15}" cy="${size*0.35}" r="${size*0.04}" fill="#ff6b6b"/>
      <circle cx="${size*0.45}" cy="${size*0.3}" r="${size*0.04}" fill="#4ecdc4"/>
      <circle cx="${size*0.35}" cy="${size*0.45}" r="${size*0.04}" fill="#ffe66d"/>
    </g>
    
    <!-- Travel destination pin -->
    <g transform="translate(${size*0.7}, ${size*0.15})">
      <circle cx="0" cy="0" r="${size*0.08}" fill="#ff6b6b"/>
      <circle cx="0" cy="0" r="${size*0.04}" fill="#fff"/>
    </g>
  </svg>`;
  
  return svg;
}

function createIconFile(size) {
  const svg = createSimplePNG(size);
  const iconPath = path.join(__dirname, 'public', 'icons', `icon-${size}x${size}.svg`);
  
  // Save SVG icon
  fs.writeFileSync(iconPath, svg);
  console.log(`✅ Created icon-${size}x${size}.svg`);
  
  // Also create a PNG placeholder using base64 data
  const pngPath = path.join(__dirname, 'public', 'icons', `icon-${size}x${size}.png`);
  
  // Create a simple PNG header (this is a workaround - in production use proper image conversion)
  const base64Data = Buffer.from(svg).toString('base64');
  const dataUri = `data:image/svg+xml;base64,${base64Data}`;
  
  // Create an HTML file that can be used to generate the actual PNG
  const htmlContent = `<!DOCTYPE html>
<html>
<head><title>PNG Generator</title></head>
<body>
  <canvas id="canvas" width="${size}" height="${size}"></canvas>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = function() {
      ctx.drawImage(img, 0, 0, ${size}, ${size});
      const dataURL = canvas.toDataURL('image/png');
      console.log('PNG data for ${size}x${size}:', dataURL);
      // In a real app, you would save this dataURL as a PNG file
    };
    img.src = '${dataUri}';
  </script>
</body>
</html>`;
  
  // For now, just create a simple PNG file using a fallback approach
  // In production, you would use sharp or canvas to convert SVG to PNG
  const simplePngData = Buffer.from(`iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`, 'base64');
  
  try {
    fs.writeFileSync(pngPath, simplePngData);
    console.log(`✅ Created basic PNG fallback for icon-${size}x${size}.png`);
  } catch (error) {
    console.log(`⚠️  Could not create PNG for ${size}x${size}: ${error.message}`);
  }
}

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate all icon sizes
console.log('Creating PNG icons...');
iconSizes.forEach(size => {
  createIconFile(size);
});

console.log('\n✅ Icon generation complete!');
console.log('Note: The PNG files are basic fallbacks. For production, use proper image conversion tools.');
console.log('To generate high-quality PNG icons, visit: http://localhost:3000/icon-generator.html');
