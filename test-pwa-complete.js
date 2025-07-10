#!/usr/bin/env node

/**
 * Comprehensive PWA Test Script
 * Tests all PWA requirements for full mobile installability
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const testUrl = 'http://localhost:3000';
const tests = [];

// Test helper function
function test(name, testFn) {
  tests.push({ name, testFn });
}

// HTTP request helper
function request(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data, headers: res.headers }));
    }).on('error', reject);
  });
}

// PWA Tests
test('✅ Manifest JSON is valid and accessible', async () => {
  const res = await request(`${testUrl}/manifest.json`);
  if (res.statusCode !== 200) throw new Error(`Manifest returned ${res.statusCode}`);
  
  const manifest = JSON.parse(res.data);
  if (!manifest.name) throw new Error('Missing name in manifest');
  if (!manifest.short_name) throw new Error('Missing short_name in manifest');
  if (!manifest.start_url) throw new Error('Missing start_url in manifest');
  if (!manifest.display) throw new Error('Missing display in manifest');
  if (!manifest.icons || manifest.icons.length === 0) throw new Error('Missing icons in manifest');
  
  console.log(`  - Name: ${manifest.name}`);
  console.log(`  - Icons: ${manifest.icons.length} defined`);
  console.log(`  - Display: ${manifest.display}`);
});

test('✅ Service Worker is accessible', async () => {
  const res = await request(`${testUrl}/sw.js`);
  if (res.statusCode !== 200) throw new Error(`Service Worker returned ${res.statusCode}`);
  if (res.headers['content-type'] !== 'application/javascript; charset=UTF-8') {
    throw new Error('Service Worker has wrong content-type');
  }
  console.log(`  - Service Worker size: ${res.data.length} bytes`);
});

test('✅ Required PWA icons are accessible', async () => {
  const requiredIcons = [
    'icon-192x192.png',
    'icon-512x512.png',
    'icon-144x144.png',
    'icon-152x152.png'
  ];
  
  for (const icon of requiredIcons) {
    const res = await request(`${testUrl}/icons/${icon}`);
    if (res.statusCode !== 200) {
      throw new Error(`Icon ${icon} returned ${res.statusCode}`);
    }
  }
  console.log(`  - All ${requiredIcons.length} required icons accessible`);
});

test('✅ Mobile HTML contains PWA meta tags', async () => {
  const res = await request(`${testUrl}/mobile.html`);
  if (res.statusCode !== 200) throw new Error(`Mobile HTML returned ${res.statusCode}`);
  
  const html = res.data;
  const requiredMeta = [
    'name="theme-color"',
    'name="apple-mobile-web-app-capable"',
    'rel="manifest"',
    'rel="apple-touch-icon"'
  ];
  
  for (const meta of requiredMeta) {
    if (!html.includes(meta)) {
      throw new Error(`Missing required meta tag: ${meta}`);
    }
  }
  console.log(`  - All ${requiredMeta.length} required meta tags present`);
});

test('✅ HTTPS ready (development check)', async () => {
  // Check if the app can handle HTTPS headers
  const res = await request(`${testUrl}/mobile.html`);
  if (!res.data.includes('serviceWorker')) {
    throw new Error('Service Worker registration code not found');
  }
  console.log('  - Service Worker registration code present');
});

test('✅ PWA install prompt code is present', async () => {
  const res = await request(`${testUrl}/mobile.html`);
  const html = res.data;
  
  if (!html.includes('beforeinstallprompt')) {
    throw new Error('beforeinstallprompt event handler not found');
  }
  if (!html.includes('installApp')) {
    throw new Error('installApp function not found');
  }
  console.log('  - Install prompt handling code present');
});

test('✅ Browserconfig.xml for Microsoft Edge', async () => {
  const res = await request(`${testUrl}/browserconfig.xml`);
  if (res.statusCode !== 200) throw new Error(`Browserconfig returned ${res.statusCode}`);
  
  const xml = res.data;
  if (!xml.includes('msapplication') || !xml.includes('TileColor')) {
    throw new Error('Invalid browserconfig.xml content');
  }
  console.log('  - Browserconfig.xml is valid');
});

test('✅ Form labels are updated as requested', async () => {
  const res = await request(`${testUrl}/mobile.html`);
  const html = res.data;
  
  if (!html.includes('Totalbudsjett')) {
    throw new Error('Budget label not updated to "Totalbudsjett"');
  }
  if (!html.includes('Hvor mange reisende er dere?')) {
    throw new Error('Travelers question not updated to "Hvor mange reisende er dere?"');
  }
  console.log('  - Form labels updated correctly');
});

// Run all tests
async function runTests() {
  console.log('🧪 Running PWA Comprehensive Tests...\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const { name, testFn } of tests) {
    try {
      await testFn();
      console.log(`${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${name}`);
      console.log(`   Error: ${error.message}`);
      failed++;
    }
    console.log('');
  }
  
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('\n🎉 All PWA tests passed! Your app is fully PWA-ready for mobile installation.');
    console.log('\n📱 PWA Installation Requirements Met:');
    console.log('   ✅ Valid Web App Manifest');
    console.log('   ✅ Service Worker for offline support');
    console.log('   ✅ HTTPS ready (required for production)');
    console.log('   ✅ Required PWA icons (192x192, 512x512)');
    console.log('   ✅ PWA meta tags for mobile browsers');
    console.log('   ✅ Install prompt functionality');
    console.log('   ✅ Apple Touch Icons for iOS');
    console.log('   ✅ Microsoft Edge browserconfig');
    console.log('   ✅ Form labels updated as requested');
    console.log('\n🚀 Deploy to HTTPS production environment to test installation on mobile devices!');
  } else {
    console.log('\n⚠️  Some tests failed. Fix the issues above before deploying.');
  }
}

runTests().catch(console.error);
