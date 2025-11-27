const eBayApi = require('ebay-api');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { accountId, inventoryItem } = req.body;
  // inventoryItem contains: { title, price, description, images[], sku, brand, size }

  if (!accountId || !inventoryItem) {
    return res.status(400).json({ error: 'Missing required fields: accountId, inventoryItem' });
  }

  try {
    // Mock Account lookup (replace with actual database query)
    // const Account = require('../../models/Account');
    // const account = await Account.findById(accountId);

    // For now, expect credentials in request body
    const { ebayAccessToken } = req.body;

    if (!ebayAccessToken) {
      return res.status(400).json({ error: 'Missing eBay access token' });
    }

    // Initialize eBay Client
    const ebay = eBayApi.fromEnv();
    ebay.auth.setOAuth2Token(ebayAccessToken);

    // 1. Create or Update Inventory Item
    // eBay separates the "Item details" from the "Selling details"
    await ebay.sell.inventory.createOrReplaceInventoryItem(inventoryItem.sku, {
      product: {
        title: inventoryItem.title,
        description: inventoryItem.description,
        aspects: {
          Brand: [inventoryItem.brand || 'Unbranded'],
          Size: [inventoryItem.size || 'One Size'],
        },
        imageUrls: inventoryItem.images,
      },
      condition: 'USED_EXCELLENT',
      availability: {
        shipToLocationAvailability: {
          quantity: 1,
        },
      },
    });

    // 2. Create an "Offer" (The Price & Shipping logic)
    const { fulfillmentPolicyId, paymentPolicyId, returnPolicyId } = req.body;

    if (!fulfillmentPolicyId || !paymentPolicyId || !returnPolicyId) {
      return res.status(400).json({
        error:
          'Missing eBay policies. User must configure fulfillmentPolicyId, paymentPolicyId, returnPolicyId in account settings.',
      });
    }

    const offer = await ebay.sell.inventory.createOffer({
      sku: inventoryItem.sku,
      marketplaceId: 'EBAY_US',
      format: 'FIXED_PRICE',
      listingDescription: inventoryItem.description,
      availableQuantity: 1,
      pricingSummary: {
        price: {
          currency: inventoryItem.currency || 'USD',
          value: inventoryItem.price.toString(),
        },
      },
      listingPolicies: {
        fulfillmentPolicyId,
        paymentPolicyId,
        returnPolicyId,
      },
      merchantLocationKey: req.body.merchantLocationKey || 'default',
    });

    const offerId = offer.offerId;

    // 3. Publish the Offer (Make it live)
    const published = await ebay.sell.inventory.publishOffer(offerId);

    res.json({
      success: true,
      listingId: published.listingId,
      sku: inventoryItem.sku,
      offerId: offerId,
    });
  } catch (error) {
    console.error('eBay API Error:', error);

    // eBay API errors are nested deeply
    const errorMessage =
      error.response?.data?.errors?.[0]?.message || error.message || 'eBay listing creation failed';

    res.status(500).json({
      error: errorMessage,
      details: error.response?.data,
    });
  }
}
