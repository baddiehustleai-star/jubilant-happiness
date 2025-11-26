/* eslint-env node */
/**
 * Instagram Account Lookup - Photo2Profit
 * Finds Instagram Business Account ID from Facebook Pages
 */

import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get token from Authorization header or query
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.split(' ')[1] || req.query.accessToken;

  if (!accessToken) {
    return res.status(401).json({
      error: 'Missing Access Token',
      hint: 'Provide via Authorization: Bearer <TOKEN> header or ?accessToken query param',
    });
  }

  try {
    // Fetch all Facebook Pages the user manages
    const response = await axios.get('https://graph.facebook.com/v19.0/me/accounts', {
      params: {
        access_token: accessToken,
        fields: 'id,name,access_token,instagram_business_account,picture{url}',
      },
    });

    const pages = response.data.data;

    // Filter for pages with Instagram Business accounts
    const validAccounts = pages
      .filter((page) => page.instagram_business_account)
      .map((page) => ({
        pageName: page.name,
        pageId: page.id,
        pageAccessToken: page.access_token, // IMPORTANT: Use this for posting
        instagramId: page.instagram_business_account.id, // THIS is the ID you need
        instagramUsername: 'Unknown',
        profilePicture: page.picture?.data?.url,
      }));

    if (validAccounts.length === 0) {
      return res.status(404).json({
        error: 'No connected Instagram Business accounts found',
        hint: 'Ensure your Instagram is switched to Business/Creator and connected to a Facebook Page',
        pagesFound: pages.length,
      });
    }

    // Fetch Instagram username for first account
    try {
      const igDetails = await axios.get(
        `https://graph.facebook.com/v19.0/${validAccounts[0].instagramId}`,
        {
          params: {
            access_token: accessToken,
            fields: 'username,profile_picture_url',
          },
        }
      );

      validAccounts[0].instagramUsername = igDetails.data.username;
      if (igDetails.data.profile_picture_url) {
        validAccounts[0].profilePicture = igDetails.data.profile_picture_url;
      }
    } catch (error) {
      console.warn('Could not fetch Instagram details:', error.message);
    }

    res.json({
      success: true,
      accountsFound: validAccounts.length,
      accounts: validAccounts,
    });
  } catch (error) {
    console.error('Instagram Lookup Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch Instagram accounts',
      details: error.response?.data?.error?.message || error.message,
    });
  }
}
