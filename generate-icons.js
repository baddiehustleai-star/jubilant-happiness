import sharp from 'sharp';

// Convert SVG icons to PNG for PWA
async function convertIcons() {
  try {
    // Convert 192x192 icon
    await sharp('public/icon-192.svg')
      .png()
      .resize(192, 192)
      .toFile('public/pwa-192x192.png');
    
    // Convert 512x512 icon
    await sharp('public/icon-512.svg')
      .png()
      .resize(512, 512)
      .toFile('public/pwa-512x512.png');
    
    console.log('✅ PWA icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
  }
}

convertIcons();