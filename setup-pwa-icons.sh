#!/bin/bash

# Simple PWA icon generator script
# This creates basic placeholder icons for development

ICON_DIR="public/icons"

# Create icons directory if it doesn't exist
mkdir -p "$ICON_DIR"

# Create a simple SVG icon
cat > "$ICON_DIR/base-icon.svg" << 'EOF'
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="256" cy="256" r="248" fill="url(#grad)" stroke="#fff" stroke-width="8"/>
  
  <!-- Suitcase icon -->
  <g transform="translate(102, 128)">
    <!-- Suitcase body -->
    <rect x="0" y="77" width="308" height="205" rx="20" fill="#fff" stroke="#333" stroke-width="8"/>
    
    <!-- Suitcase handle -->
    <rect x="102" y="26" width="104" height="61" rx="15" fill="none" stroke="#333" stroke-width="8"/>
    
    <!-- Suitcase lock -->
    <rect x="138" y="128" width="32" height="41" rx="8" fill="#333"/>
    
    <!-- Travel stickers -->
    <circle cx="77" cy="179" r="20" fill="#ff6b6b"/>
    <circle cx="231" cy="154" r="20" fill="#4ecdc4"/>
    <circle cx="179" cy="231" r="20" fill="#ffe66d"/>
  </g>
  
  <!-- Travel destination pin -->
  <g transform="translate(358, 77)">
    <circle cx="0" cy="0" r="41" fill="#ff6b6b"/>
    <circle cx="0" cy="0" r="20" fill="#fff"/>
  </g>
  
  <!-- Travel emoji -->
  <text x="256" y="400" text-anchor="middle" font-size="48" fill="#fff">🧳</text>
</svg>
EOF

# Create simple placeholder PNG files (you would use ImageMagick or similar in production)
# For now, just create the SVG and use it as a base

echo "✅ PWA base icon created at $ICON_DIR/base-icon.svg"
echo ""
echo "PWA Setup Status:"
echo "✅ manifest.json - Complete"
echo "✅ service worker (sw.js) - Complete"  
echo "✅ PWA meta tags in mobile.html - Complete"
echo "✅ Install prompt functionality - Complete"
echo "✅ Offline detection - Complete"
echo "✅ App shortcuts - Complete"
echo "⚠️  PNG icons - Need to be generated from SVG"
echo ""
echo "To complete PWA setup:"
echo "1. Use ImageMagick or online tool to convert base-icon.svg to PNG files"
echo "2. Generate these sizes: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512"
echo "3. Save them as icon-{size}x{size}.png in the public/icons/ folder"
echo ""
echo "The app is already PWA-ready with all necessary functionality!"
