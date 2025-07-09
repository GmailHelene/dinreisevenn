const fs = require('fs');
const path = require('path');

// Simple icon generator for PWA
// This creates a basic travel-themed icon

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create a simple SVG icon
const createSVGIcon = (size) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 4}" fill="url(#grad)" stroke="#fff" stroke-width="2"/>
  
  <!-- Suitcase icon -->
  <g transform="translate(${size*0.2}, ${size*0.25})">
    <!-- Suitcase body -->
    <rect x="0" y="${size*0.15}" width="${size*0.6}" height="${size*0.4}" rx="8" fill="#fff" stroke="#333" stroke-width="2"/>
    
    <!-- Suitcase handle -->
    <rect x="${size*0.2}" y="${size*0.05}" width="${size*0.2}" height="${size*0.12}" rx="4" fill="none" stroke="#333" stroke-width="2"/>
    
    <!-- Suitcase lock -->
    <rect x="${size*0.27}" y="${size*0.25}" width="${size*0.06}" height="${size*0.08}" rx="2" fill="#333"/>
    
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
};

// Function to convert SVG to PNG using canvas (browser-only)
const generateIconHTML = () => {
  return `<!DOCTYPE html>
<html>
<head>
    <title>PWA Icon Generator</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .icon-container { margin: 20px 0; }
        canvas { border: 1px solid #ccc; margin: 10px; }
        button { padding: 10px 20px; margin: 10px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; }
    </style>
</head>
<body>
    <h1>PWA Icon Generator for Din Reisevenn</h1>
    <p>Click "Generate All Icons" to create PNG icons for the PWA:</p>
    
    <button onclick="generateAllIcons()">Generate All Icons</button>
    <button onclick="downloadAllIcons()">Download All Icons as ZIP</button>
    
    <div id="icons-container"></div>
    
    <script>
        const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
        const svgIcon = \`${createSVGIcon(192)}\`;
        
        function generateAllIcons() {
            const container = document.getElementById('icons-container');
            container.innerHTML = '';
            
            iconSizes.forEach(size => {
                const iconContainer = document.createElement('div');
                iconContainer.className = 'icon-container';
                
                const title = document.createElement('h3');
                title.textContent = \`icon-\${size}x\${size}.png\`;
                iconContainer.appendChild(title);
                
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                canvas.style.width = Math.min(size, 200) + 'px';
                canvas.style.height = Math.min(size, 200) + 'px';
                
                const ctx = canvas.getContext('2d');
                const img = new Image();
                
                img.onload = function() {
                    ctx.drawImage(img, 0, 0, size, size);
                    
                    // Add download link
                    const downloadLink = document.createElement('a');
                    downloadLink.download = \`icon-\${size}x\${size}.png\`;
                    downloadLink.href = canvas.toDataURL();
                    downloadLink.textContent = 'Download';
                    downloadLink.style.display = 'block';
                    downloadLink.style.marginTop = '10px';
                    
                    iconContainer.appendChild(downloadLink);
                };
                
                // Create SVG with current size
                const scaledSvg = \`<?xml version="1.0" encoding="UTF-8"?>
<svg width="\${size}" height="\${size}" viewBox="0 0 \${size} \${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="\${size/2}" cy="\${size/2}" r="\${size/2 - 4}" fill="url(#grad)" stroke="#fff" stroke-width="2"/>
  
  <!-- Suitcase icon -->
  <g transform="translate(\${size*0.2}, \${size*0.25})">
    <!-- Suitcase body -->
    <rect x="0" y="\${size*0.15}" width="\${size*0.6}" height="\${size*0.4}" rx="8" fill="#fff" stroke="#333" stroke-width="2"/>
    
    <!-- Suitcase handle -->
    <rect x="\${size*0.2}" y="\${size*0.05}" width="\${size*0.2}" height="\${size*0.12}" rx="4" fill="none" stroke="#333" stroke-width="2"/>
    
    <!-- Suitcase lock -->
    <rect x="\${size*0.27}" y="\${size*0.25}" width="\${size*0.06}" height="\${size*0.08}" rx="2" fill="#333"/>
    
    <!-- Travel stickers -->
    <circle cx="\${size*0.15}" cy="\${size*0.35}" r="\${size*0.04}" fill="#ff6b6b"/>
    <circle cx="\${size*0.45}" cy="\${size*0.3}" r="\${size*0.04}" fill="#4ecdc4"/>
    <circle cx="\${size*0.35}" cy="\${size*0.45}" r="\${size*0.04}" fill="#ffe66d"/>
  </g>
  
  <!-- Travel destination pin -->
  <g transform="translate(\${size*0.7}, \${size*0.15})">
    <circle cx="0" cy="0" r="\${size*0.08}" fill="#ff6b6b"/>
    <circle cx="0" cy="0" r="\${size*0.04}" fill="#fff"/>
  </g>
</svg>\`;
                
                img.src = 'data:image/svg+xml;base64,' + btoa(scaledSvg);
                
                iconContainer.appendChild(canvas);
                container.appendChild(iconContainer);
            });
        }
        
        function downloadAllIcons() {
            alert('Please generate icons first, then download each icon individually. In a production environment, you would use a build tool to generate these automatically.');
        }
    </script>
</body>
</html>`;
};

// Create the HTML file
fs.writeFileSync(path.join(__dirname, 'public', 'icon-generator.html'), generateIconHTML());

// Also create a basic icon.svg file if it doesn't exist
const iconSvgPath = path.join(__dirname, 'public', 'icons', 'icon.svg');
if (!fs.existsSync(iconSvgPath)) {
  fs.writeFileSync(iconSvgPath, createSVGIcon(192));
}

console.log('✅ PWA icon generator created at public/icon-generator.html');
console.log('✅ Basic icon.svg created at public/icons/icon.svg');
console.log('');
console.log('To generate PWA icons:');
console.log('1. Open http://localhost:3000/icon-generator.html in your browser');
console.log('2. Click "Generate All Icons"');
console.log('3. Download each icon and save to public/icons/ folder');
console.log('');
console.log('Or use a tool like sharp in production to generate icons automatically.');
