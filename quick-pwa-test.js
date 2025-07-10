#!/usr/bin/env node

/**
 * Quick PWA Test for Mobile Installation
 */

const http = require('http');

console.log('🧪 Testing PWA Mobile Installation...');

// Test manifest
http.get('http://localhost:3000/manifest.json', (res) => {
  if (res.statusCode === 200) {
    console.log('✅ Manifest.json accessible');
    
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const manifest = JSON.parse(data);
      console.log(`✅ App name: ${manifest.name}`);
      console.log(`✅ Display mode: ${manifest.display}`);
      console.log(`✅ Icons: ${manifest.icons.length} defined`);
      
      // Test key icons
      testIcon('icon-192x192.png');
      testIcon('icon-512x512.png');
    });
  } else {
    console.log('❌ Manifest.json not accessible');
  }
}).on('error', (err) => {
  console.log('❌ Error testing manifest:', err.message);
});

function testIcon(iconName) {
  http.get(`http://localhost:3000/icons/${iconName}`, (res) => {
    if (res.statusCode === 200) {
      console.log(`✅ ${iconName} accessible`);
    } else {
      console.log(`❌ ${iconName} not accessible (${res.statusCode})`);
    }
  }).on('error', (err) => {
    console.log(`❌ Error testing ${iconName}:`, err.message);
  });
}

// Test service worker
http.get('http://localhost:3000/sw.js', (res) => {
  if (res.statusCode === 200) {
    console.log('✅ Service Worker accessible');
  } else {
    console.log('❌ Service Worker not accessible');
  }
}).on('error', (err) => {
  console.log('❌ Error testing service worker:', err.message);
});

setTimeout(() => {
  console.log('\n🎉 PWA Test Complete!');
  console.log('📱 Your app should now be installable on mobile devices!');
  console.log('🚀 Deploy to HTTPS production to test installation.');
}, 2000);
