import { initializeApp, cert } from 'firebase-admin/app';

// Initialize Firebase Admin (optional for this endpoint)
try {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
} catch {
  // App already initialized or not needed
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = req.headers['x-api-key'] || process.env.REMOVEBG_API_KEY;

    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }

    // Get image from form data
    const imageBuffer = req.body;

    if (!imageBuffer) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Call Remove.bg API
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
    res.status(500).json({
      error: 'Background removal failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
