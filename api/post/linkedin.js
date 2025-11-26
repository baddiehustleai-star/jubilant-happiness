/* eslint-env node */
/**
 * LinkedIn Posting API - Photo2Profit
 * Uses LinkedIn Posts API (replaced ugcPosts)
 */

import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { accessToken, authorUrn, text, articleUrl } = req.body;

  try {
    if (!accessToken || !authorUrn || !text) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['accessToken', 'authorUrn', 'text'],
        hint: 'authorUrn format: urn:li:person:12345 or urn:li:organization:67890',
      });
    }

    // LinkedIn Posts API payload
    const postData = {
      author: authorUrn,
      commentary: text,
      visibility: 'PUBLIC',
      distribution: {
        feedDistribution: 'MAIN_FEED',
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
    };

    // Attach article link if provided
    if (articleUrl) {
      postData.content = {
        article: {
          source: articleUrl,
          title: 'Check this out!',
        },
      };
    }

    const response = await axios.post('https://api.linkedin.com/rest/posts', postData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0', // CRITICAL header
        'LinkedIn-Version': '202401', // Current API version
        'Content-Type': 'application/json',
      },
    });

    // LinkedIn returns post ID in x-restli-id header
    const postId = response.headers['x-restli-id'] || 'unknown';

    res.json({
      success: true,
      platform: 'linkedin',
      postId: postId,
      status: response.status,
    });
  } catch (error) {
    console.error('LinkedIn Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'LinkedIn posting failed',
      details: error.response?.data?.message || error.message,
      platform: 'linkedin',
    });
  }
}
