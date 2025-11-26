const axios = require('axios');
const FormData = require('form-data');
const { TwitterApi } = require('twitter-api-v2');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, itemData } = req.body;
  // itemData: { title, price, brand, imageUrl, shopLink, poshmarkUrl, depopUrl, etc. }

  if (!userId || !itemData) {
    return res.status(400).json({ error: 'Missing required fields: userId, itemData' });
  }

  try {
    // Mock Account lookup (replace with actual database query)
    // const Account = require('../../models/Account');
    // const accounts = await Account.find({ user: userId, isActive: true });

    // For demo purposes, expect accounts array in request
    const { accounts } = req.body;

    if (!accounts || accounts.length === 0) {
      return res.status(400).json({ error: 'No connected accounts found for user' });
    }

    const results = [];

    // 2. Format the Message for Socials
    const brandTag = itemData.brand ? `#${itemData.brand.replace(/\s/g, '')}` : '';
    const statusText = `Just listed! ✨\n${itemData.title}\nPrice: $${itemData.price}\n\nShop now: ${itemData.shopLink}\n#reseller #poshmark ${brandTag}`;

    for (const acc of accounts) {
      try {
        // --- TWITTER BLAST ---
        if (acc.platform === 'twitter') {
          const client = new TwitterApi({
            appKey: process.env.TWITTER_API_KEY,
            appSecret: process.env.TWITTER_API_SECRET,
            accessToken: acc.accessToken,
            accessSecret: acc.accessTokenSecret,
          });

          let mediaId = null;

          // Upload image if provided
          if (itemData.imageUrl) {
            // Download image as buffer
            const imageResponse = await axios.get(itemData.imageUrl, {
              responseType: 'arraybuffer',
            });
            const imageBuffer = Buffer.from(imageResponse.data);

            // Upload to Twitter
            mediaId = await client.v1.uploadMedia(imageBuffer, {
              mimeType: 'image/jpeg',
            });
          }

          // Post tweet with media
          const tweetParams = { text: statusText };
          if (mediaId) {
            tweetParams.media = { media_ids: [mediaId] };
          }

          const tweet = await client.v2.tweet(tweetParams);

          results.push({
            platform: 'twitter',
            status: 'posted',
            postId: tweet.data.id,
          });
        }

        // --- PINTEREST BLAST (Highly effective for resellers) ---
        if (acc.platform === 'pinterest') {
          const pinData = {
            board_id: acc.metadata.defaultBoardId,
            title: itemData.title,
            description: `Shop this ${itemData.brand || 'item'} for $${itemData.price}!`,
            link: itemData.shopLink, // DIRECT LINK TO POSHMARK/DEPOP
            media_source: {
              source_type: 'image_url',
              url: itemData.imageUrl,
            },
          };

          const pinResponse = await axios.post('https://api.pinterest.com/v5/pins', pinData, {
            headers: {
              Authorization: `Bearer ${acc.accessToken}`,
              'Content-Type': 'application/json',
            },
          });

          results.push({
            platform: 'pinterest',
            status: 'posted',
            pinId: pinResponse.data.id,
          });
        }

        // --- FACEBOOK PAGE BLAST ---
        if (acc.platform === 'facebook' && acc.metadata.facebookPageId) {
          const fbPost = await axios.post(
            `https://graph.facebook.com/v19.0/${acc.metadata.facebookPageId}/photos`,
            {
              url: itemData.imageUrl,
              caption: statusText,
              access_token: acc.accessToken,
            }
          );

          results.push({
            platform: 'facebook',
            status: 'posted',
            postId: fbPost.data.id,
          });
        }
      } catch (platformError) {
        console.error(`Error posting to ${acc.platform}:`, platformError.message);
        results.push({
          platform: acc.platform,
          status: 'failed',
          error: platformError.response?.data || platformError.message,
        });
      }
    }

    res.json({
      success: true,
      report: results,
      totalPosted: results.filter((r) => r.status === 'posted').length,
      totalFailed: results.filter((r) => r.status === 'failed').length,
    });
  } catch (error) {
    console.error('Reseller Blast Error:', error);
    res.status(500).json({
      error: error.message,
      report: [],
    });
  }
}
