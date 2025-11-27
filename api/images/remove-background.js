// Background removal API endpoint using Remove.bg

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = req.headers['x-api-key'] || process.env.REMOVEBG_API_KEY;

    if (!apiKey || apiKey === 'undefined') {
      return res.status(401).json({
        error: 'API key required. Please configure REMOVEBG_API_KEY.',
        hasKey: !!process.env.REMOVEBG_API_KEY,
        keyLength: process.env.REMOVEBG_API_KEY ? process.env.REMOVEBG_API_KEY.length : 0,
      });
    }

    // For simplicity, expect the image to be sent as raw body buffer
    // Vercel automatically handles multipart parsing
    let imageBuffer = req.body;

    // If body is empty, check for JSON format
    if (!imageBuffer || imageBuffer.length === 0) {
      if (req.body && typeof req.body === 'object' && req.body.image) {
        imageBuffer = Buffer.from(req.body.image, 'base64');
      } else {
        return res.status(400).json({
          error: 'No image provided',
          help: 'Send image as FormData with key "image" or JSON with base64 "image" field',
        });
      }
    }

    // Call Remove.bg API with base64 encoding (more compatible)
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_file_b64: imageBuffer.toString('base64'),
        size: 'auto',
        format: 'png',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.title || 'Background removal failed');
    }

    const resultBuffer = await response.arrayBuffer();

    // Return processed image
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', resultBuffer.byteLength);

    return res.status(200).send(Buffer.from(resultBuffer));
  } catch (error) {
    console.error('Background removal error:', error);

    // Check if it's a Remove.bg API error
    let errorMessage = 'Background removal failed';
    let statusCode = 500;

    if (error.message.includes('402')) {
      errorMessage = 'Insufficient credits in Remove.bg account';
      statusCode = 402;
    } else if (error.message.includes('403')) {
      errorMessage = 'Invalid Remove.bg API key';
      statusCode = 403;
    } else if (error.message.includes('400')) {
      errorMessage = 'Invalid image format or size';
      statusCode = 400;
    }

    res.status(statusCode).json({
      error: errorMessage,
      message: process.env.NODE_ENV === 'development' ? error.message : errorMessage,
      apiKeyConfigured: !!process.env.REMOVEBG_API_KEY,
    });
  }
}

// Vercel configuration
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  maxDuration: 30,
};
