/* eslint-env node */
/**
 * Instagram Posting API - Photo2Profit
 * Uses Facebook Graph API with Cloudinary for image hosting
 */

import axios from 'axios';

// Cloudinary configuration (for image hosting - Instagram requires public URLs)
let cloudinary;
try {
  cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });
} catch (error) {
  console.warn('Cloudinary not configured, will require imageUrl in request');
}

// Upload buffer to Cloudinary and return public URL
async function uploadToCloud(buffer) {
  if (!cloudinary) {
    throw new Error(
      'Cloudinary not configured. Set CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET'
    );
  }

  return new Promise((resolve, reject) => {
    const streamifier = require('streamifier');
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'photo2profit_posts' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { accessToken, instagramAccountId, caption, imageUrl: providedImageUrl } = req.body;
  const file = req.file; // Multer attaches this if form-data upload

  try {
    let imageUrl = providedImageUrl;

    // If user uploaded a file, convert buffer to public URL
    if (file && file.buffer) {
      console.log(`Uploading ${file.originalname} to cloud storage...`);
      imageUrl = await uploadToCloud(file.buffer);
      console.log('Image hosted at:', imageUrl);
    }

    if (!imageUrl) {
      return res.status(400).json({
        error: 'Image required',
        hint: 'Provide either: 1) multipart form-data with "media" file, or 2) "imageUrl" in body',
      });
    }

    if (!accessToken || !instagramAccountId) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['accessToken', 'instagramAccountId'],
      });
    }

    // Step 1: Create Instagram Media Container
    const createResponse = await axios.post(
      `https://graph.facebook.com/v19.0/${instagramAccountId}/media`,
      {
        image_url: imageUrl,
        caption: caption || '',
        access_token: accessToken,
      }
    );

    const containerId = createResponse.data.id;

    // Step 2: Publish the Container
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v19.0/${instagramAccountId}/media_publish`,
      {
        creation_id: containerId,
        access_token: accessToken,
      }
    );

    res.json({
      success: true,
      platform: 'instagram',
      postId: publishResponse.data.id,
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error('Instagram Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Instagram posting failed',
      details: error.response?.data?.error?.message || error.message,
      platform: 'instagram',
    });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable default body parser for file uploads
  },
};
