const axios = require('axios');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { accessToken, instagramAccountId, imageUrls, caption } = req.body;
  // imageUrls is an Array: ["https://s3.../img1.jpg", "https://s3.../img2.jpg", ...]

  if (!accessToken || !instagramAccountId || !imageUrls || !Array.isArray(imageUrls)) {
    return res.status(400).json({
      error: 'Missing required fields: accessToken, instagramAccountId, imageUrls (array)',
    });
  }

  if (imageUrls.length < 2 || imageUrls.length > 10) {
    return res.status(400).json({
      error: 'Instagram carousels require 2-10 images',
    });
  }

  try {
    // 1. Create Item Containers (One for each image)
    const itemContainerIds = [];

    for (const url of imageUrls) {
      const response = await axios.post(
        `https://graph.facebook.com/v19.0/${instagramAccountId}/media`,
        {
          image_url: url,
          is_carousel_item: true, // CRITICAL FLAG for carousel items
          access_token: accessToken,
        }
      );
      itemContainerIds.push(response.data.id);
    }

    console.log(`Created ${itemContainerIds.length} carousel item containers`);

    // 2. Create the Carousel Container (Holding the items)
    const carouselContainer = await axios.post(
      `https://graph.facebook.com/v19.0/${instagramAccountId}/media`,
      {
        media_type: 'CAROUSEL',
        children: itemContainerIds, // Array of IDs from step 1
        caption: caption || '',
        access_token: accessToken,
      }
    );

    const carouselId = carouselContainer.data.id;
    console.log(`Created carousel container: ${carouselId}`);

    // 3. Publish the Carousel
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v19.0/${instagramAccountId}/media_publish`,
      {
        creation_id: carouselId,
        access_token: accessToken,
      }
    );

    res.json({
      success: true,
      postId: publishResponse.data.id,
      itemContainerIds,
      carouselContainerId: carouselId,
    });
  } catch (error) {
    console.error('Instagram Carousel Error:', error.response?.data || error.message);

    const errorMessage =
      error.response?.data?.error?.message || error.message || 'Instagram carousel creation failed';

    res.status(500).json({
      error: errorMessage,
      details: error.response?.data,
    });
  }
}
