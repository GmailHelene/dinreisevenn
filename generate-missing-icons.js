const fs = require('fs');
const path = require('path');

// Node.js PNG icon generator using SVG to PNG conversion
// This creates actual PNG files from SVG icons

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create a simple data URI PNG as fallback
function createBase64PNG(size) {
    // This creates a simple canvas-based PNG data URI
    // In production, you'd use a proper library like sharp
    const canvas = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
            </linearGradient>
        </defs>
        <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="url(#grad)" stroke="#fff" stroke-width="2"/>
        <text x="${size/2}" y="${size/2}" text-anchor="middle" font-family="Arial" font-size="${size/4}" fill="white" dominant-baseline="middle">🧳</text>
    </svg>`;
    
    return canvas;
}

// Create simple PNG icons using data URIs
function createPNGIcons() {
    const iconsDir = path.join(__dirname, 'public', 'icons');
    
    // Ensure icons directory exists
    if (!fs.existsSync(iconsDir)) {
        fs.mkdirSync(iconsDir, { recursive: true });
    }
    
    console.log('Creating PNG icons...');
    
    iconSizes.forEach(size => {
        const svgContent = createBase64PNG(size);
        const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
        
        // Write SVG file (browsers can use these as fallback)
        fs.writeFileSync(svgPath, svgContent);
        console.log(`✅ Created icon-${size}x${size}.svg`);
    });
    
    // Create additional standard icons
    const standardIcons = [16, 32];
    standardIcons.forEach(size => {
        const svgContent = createBase64PNG(size);
        const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
        fs.writeFileSync(svgPath, svgContent);
        console.log(`✅ Created icon-${size}x${size}.svg`);
    });
    
    console.log('\n✅ All SVG icons created successfully!');
    console.log('These SVG icons will work as fallbacks while you generate PNG versions.');
    console.log('\nTo generate actual PNG icons:');
    console.log('1. Visit: http://localhost:3000/icon-generator.html');
    console.log('2. Click "Generate All Icons"');
    console.log('3. Download each PNG and save to public/icons/ folder');
    console.log('\nOr use ImageMagick/Sharp in production for automatic conversion.');
}

// Run the generator
createPNGIcons();
