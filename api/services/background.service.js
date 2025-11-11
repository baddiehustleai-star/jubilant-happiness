// Background removal service using remove.bg API
import fetch from 'node-fetch';
import logger from '../utils/logger.js';

const REMOVEBG_API_KEY = process.env.REMOVEBG_API_KEY;

/**
 * Remove background from product image
 * @param {string} imageUrl - Public URL of the image
 * @param {Object} options - Optional settings (size, type, bg_color, format)
 * @returns {Promise<Object>} - Result with transparent PNG or error
 */
export async function removeBackground(imageUrl, options = {}) {
  if (!REMOVEBG_API_KEY) {
    logger.warn('REMOVEBG_API_KEY not set, returning mock response');
    return {
      success: false,
      error: 'Background removal not configured',
      mockUrl: imageUrl, // Return original in dev
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('image_url', imageUrl);
    formData.append('size', options.size || 'auto');

    if (options.bg_color) {
      formData.append('bg_color', options.bg_color); // e.g., 'ffffff' for white
    }

    if (options.format) {
      formData.append('format', options.format); // 'png' or 'jpg'
    }

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVEBG_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`remove.bg API error: ${response.status} - ${errorText}`);
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUri = `data:image/png;base64,${base64}`;

    logger.info('Background removed successfully');
    return {
      success: true,
      dataUri,
      creditsUsed: response.headers.get('x-credits-charged') || 1,
    };
  } catch (error) {
    logger.error('Background removal failed', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Replace background with solid color or pattern
 * @param {string} transparentImageDataUri - Base64 data URI of image with transparent background
 * @param {string} bgColor - Hex color code (e.g., 'ffffff', 'f5f5f5', 'ffc0cb' for pink)
 * @returns {Promise<Object>} - Composite image with new background
 */
export async function replaceBackground(transparentImageDataUri, bgColor = 'ffffff') {
  try {
    const sharp = (await import('sharp')).default;

    // Decode base64
    const base64Data = transparentImageDataUri.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Get image dimensions
    const metadata = await sharp(imageBuffer).metadata();
    const { width, height } = metadata;

    // Create solid color background
    const hexColor = bgColor.replace('#', '');
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);

    const background = await sharp({
      create: {
        width,
        height,
        channels: 3,
        background: { r, g, b },
      },
    })
      .png()
      .toBuffer();

    // Composite transparent image over background
    const result = await sharp(background)
      .composite([{ input: imageBuffer }])
      .png()
      .toBuffer();

    const resultBase64 = result.toString('base64');
    const resultUri = `data:image/png;base64,${resultBase64}`;

    logger.info('Background replaced', { bgColor });
    return {
      success: true,
      dataUri: resultUri,
    };
  } catch (error) {
    logger.error('Background replacement failed', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export default { removeBackground, replaceBackground };
