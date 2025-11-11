#!/usr/bin/env node
/**
 * PWA Icon Generator for Photo2Profit
 * Generates icons from brand colors using SVG
 * Requires: sharp npm package
 */

import sharp from 'sharp';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, 'public');
const iconsDir = join(publicDir, 'icons');

// Ensure directories exist
if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
}

// Brand colors
const BRAND_COLORS = {
  rose: '#B76E79',
  gold: '#D4AF37',
  blush: '#F8E0E7',
  dark: '#2D1B1E',
};

/**
 * Generate SVG icon with P2P mark
 */
function generateSVG(size) {
  const fontSize = Math.floor(size * 0.4);
  const borderRadius = Math.floor(size * 0.2);

  return `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${BRAND_COLORS.rose};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${BRAND_COLORS.gold};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${BRAND_COLORS.rose};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background with rounded corners -->
  <rect width="${size}" height="${size}" rx="${borderRadius}" fill="url(#brandGradient)"/>
  
  <!-- P2P Text -->
  <text
    x="50%"
    y="50%"
    dominant-baseline="middle"
    text-anchor="middle"
    font-family="Arial, sans-serif"
    font-size="${fontSize}"
    font-weight="bold"
    fill="white"
    style="text-shadow: 0 2px 4px rgba(0,0,0,0.2)">P2P</text>
</svg>
  `.trim();
}

/**
 * Generate Photo2Profit logo SVG
 */
function generateLogoSVG(size) {
  const fontSize = Math.floor(size * 0.12);
  const iconSize = Math.floor(size * 0.25);
  const iconY = Math.floor(size * 0.3);
  const textY = Math.floor(size * 0.65);

  return `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${BRAND_COLORS.rose};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${BRAND_COLORS.gold};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${BRAND_COLORS.rose};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="${BRAND_COLORS.blush}"/>
  
  <!-- Icon circle -->
  <circle cx="${size / 2}" cy="${iconY}" r="${iconSize}" fill="url(#brandGradient)"/>
  
  <!-- P2P in circle -->
  <text
    x="50%"
    y="${iconY}"
    dominant-baseline="middle"
    text-anchor="middle"
    font-family="Arial, sans-serif"
    font-size="${Math.floor(iconSize * 0.8)}"
    font-weight="bold"
    fill="white">P2P</text>
  
  <!-- Photo2Profit text -->
  <text
    x="50%"
    y="${textY}"
    dominant-baseline="middle"
    text-anchor="middle"
    font-family="Arial, sans-serif"
    font-size="${fontSize}"
    font-weight="bold"
    letter-spacing="2"
    fill="${BRAND_COLORS.dark}">PHOTO2PROFIT</text>
</svg>
  `.trim();
}

/**
 * Generate favicon SVG (simple P2P)
 */
function generateFaviconSVG() {
  return `
<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${BRAND_COLORS.rose};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${BRAND_COLORS.gold};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="6" fill="url(#brandGradient)"/>
  <text
    x="50%"
    y="50%"
    dominant-baseline="middle"
    text-anchor="middle"
    font-family="Arial, sans-serif"
    font-size="14"
    font-weight="bold"
    fill="white">P</text>
</svg>
  `.trim();
}

async function generateIcons() {
  console.log('🎨 Generating Photo2Profit PWA icons...\n');

  try {
    // Generate PWA icons (simple P2P mark)
    const sizes = [192, 512];

    for (const size of sizes) {
      const svg = generateSVG(size);
      const pngPath = join(publicDir, `pwa-${size}x${size}.png`);

      await sharp(Buffer.from(svg)).resize(size, size).png().toFile(pngPath);

      console.log(`✅ Generated: pwa-${size}x${size}.png`);
    }

    // Generate detailed logo icons
    const logoSizes = [192, 512];

    for (const size of logoSizes) {
      const svg = generateLogoSVG(size);
      const svgPath = join(publicDir, `icon-${size}.svg`);
      const pngPath = join(iconsDir, `logo-${size}x${size}.png`);

      // Save SVG
      writeFileSync(svgPath, svg);
      console.log(`✅ Generated: icon-${size}.svg`);

      // Convert to PNG
      await sharp(Buffer.from(svg)).resize(size, size).png().toFile(pngPath);

      console.log(`✅ Generated: icons/logo-${size}x${size}.png`);
    }

    // Generate favicon
    const faviconSvg = generateFaviconSVG();
    const faviconPath = join(publicDir, 'favicon.ico');

    await sharp(Buffer.from(faviconSvg))
      .resize(32, 32)
      .png()
      .toFile(faviconPath.replace('.ico', '.png'));

    console.log(`✅ Generated: favicon.png`);

    // Generate apple-touch-icon
    const appleTouchSvg = generateSVG(180);
    const appleTouchPath = join(publicDir, 'apple-touch-icon.png');

    await sharp(Buffer.from(appleTouchSvg)).resize(180, 180).png().toFile(appleTouchPath);

    console.log(`✅ Generated: apple-touch-icon.png`);

    // Generate maskable icon (with padding)
    const maskableSvg = generateSVG(512);
    const maskablePath = join(publicDir, 'maskable-icon-512x512.png');

    await sharp(Buffer.from(maskableSvg))
      .resize(512, 512)
      .extend({
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toFile(maskablePath);

    console.log(`✅ Generated: maskable-icon-512x512.png`);

    console.log('\n🎉 All icons generated successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Update index.html with favicon link');
    console.log('2. Verify manifest.json icon paths');
    console.log('3. Test PWA installation on mobile');
    console.log('4. Run: npm run build');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

// Run generator
generateIcons();
