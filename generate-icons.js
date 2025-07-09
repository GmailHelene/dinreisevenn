const fs = require('fs');
const path = require('path');

// This is a placeholder for icon generation
// In a real app, you would use a tool like sharp or canvas to generate PNG icons
// For now, we'll create a simple HTML file that can be used to generate icons

const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Icon Generator</title>
    <style>
        canvas { border: 1px solid #ccc; margin: 10px; }
    </style>
</head>
<body>
    <h1>PWA Icon Generator</h1>
    <p>Right-click on each canvas and save as PNG with the specified name:</p>
    
    ${iconSizes.map(size => `
        <div>
            <h3>icon-${size}x${size}.png</h3>
            <canvas id="canvas${size}" width="${size}" height="${size}"></canvas>
        </div>
    `).join('')}
    
    <script>
        function drawIcon(canvas, size) {
            const ctx = canvas.getContext('2d');
            
            // Background
            ctx.fillStyle = '#667eea';
            ctx.fillRect(0, 0, size, size);
            
            // Circle
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(size/2, size/2, size*0.35, 0, 2 * Math.PI);
            ctx.fill();
            
            // Inner circle
            ctx.fillStyle = '#667eea';
            ctx.beginPath();
            ctx.arc(size/2, size/2, size*0.25, 0, 2 * Math.PI);
            ctx.fill();
            
            // Emoji
            ctx.fillStyle = 'white';
            ctx.font = size*0.4 + 'px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🧳', size/2, size/2);
        }
        
        ${iconSizes.map(size => `
            drawIcon(document.getElementById('canvas${size}'), ${size});
        `).join('')}
    </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'public', 'icon-generator.html'), htmlContent);
console.log('Icon generator created at public/icon-generator.html');
console.log('Open this file in a browser to generate and download the PWA icons.');
