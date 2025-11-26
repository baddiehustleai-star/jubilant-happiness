/* eslint-env node */
/**
 * Twitter (X) Posting API - Photo2Profit
 * Uses Twitter API V2 for posting with V1.1 for media upload
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { accessToken, accessSecret, text } = req.body;
  const file = req.file; // Multer attaches uploaded file

  try {
    // Import Twitter API client
    const { TwitterApi } = await import('twitter-api-v2');

    if (!accessToken || !accessSecret || !text) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['accessToken', 'accessSecret', 'text'],
      });
    }

    // Initialize Twitter client
    const client = new TwitterApi({
      appKey: process.env.TW_API_KEY,
      appSecret: process.env.TW_API_SECRET,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });

    let mediaId;

    // Upload media if file provided
    if (file && file.buffer) {
      console.log(`Uploading media: ${file.originalname} (${file.size} bytes)`);
      const mimeType = file.mimetype;

      // Twitter V1.1 API for media upload (returns media_id)
      mediaId = await client.v1.uploadMedia(file.buffer, { mimeType });
      console.log('Media uploaded, ID:', mediaId);
    }

    // Compose tweet payload
    const payload = { text: text };
    if (mediaId) {
      payload.media = { media_ids: [mediaId] };
    }

    // Post tweet using V2 API
    const tweet = await client.v2.tweet(payload);

    res.json({
      success: true,
      platform: 'twitter',
      tweetId: tweet.data.id,
      url: `https://twitter.com/user/status/${tweet.data.id}`,
    });
  } catch (error) {
    console.error('Twitter Error:', error);
    res.status(500).json({
      error: 'Twitter posting failed',
      details: error.message,
      platform: 'twitter',
    });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable for file uploads
  },
};
