/* eslint-env node */
/**
 * Pinterest Posting API - Photo2Profit
 * Uses Pinterest API V5
 */

import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { accessToken, boardId, imageUrl, title, description, link } = req.body;

  try {
    if (!accessToken || !boardId || !imageUrl) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['accessToken', 'boardId', 'imageUrl'],
        hint: 'Pinterest requires a public image URL (use Cloudinary/S3)',
      });
    }

    // Pinterest Pins API payload
    const pinData = {
      board_id: boardId,
      title: title || 'Photo2Profit Post',
      description: description || '',
      link: link || '', // Destination URL when clicked
      media_source: {
        source_type: 'image_url',
        url: imageUrl,
      },
    };

    const response = await axios.post('https://api.pinterest.com/v5/pins', pinData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    res.json({
      success: true,
      platform: 'pinterest',
      pinId: response.data.id,
      url: `https://www.pinterest.com/pin/${response.data.id}`,
    });
  } catch (error) {
    console.error('Pinterest Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Pinterest posting failed',
      details: error.response?.data?.message || error.message,
      platform: 'pinterest',
    });
  }
}
