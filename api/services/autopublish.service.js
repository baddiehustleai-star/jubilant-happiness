// api/services/autopublish.service.js
// Automated publishing service for eBay and Facebook Marketplace

/**
 * Auto-Publishing Configuration
 * Set these in your environment:
 * - AUTO_PUBLISH_ENABLED=true
 * - AUTO_PUBLISH_THRESHOLD=5 (publish after N products)
 * - AUTO_PUBLISH_CHANNELS=ebay,facebook
 */

import { db } from '../lib/firebase.js';

// Publishing configuration
const CONFIG = {
  enabled: process.env.AUTO_PUBLISH_ENABLED === 'true',
  threshold: parseInt(process.env.AUTO_PUBLISH_THRESHOLD || '5', 10),
  channels: (process.env.AUTO_PUBLISH_CHANNELS || 'ebay,facebook').split(','),
};

/**
 * Publish a single product to eBay
 */
async function publishToEbay(product, userEmail) {
  const ebayToken = process.env.EBAY_OAUTH_TOKEN;
  if (!ebayToken) {
    console.warn('⚠️  eBay token not configured, skipping');
    return { success: false, error: 'eBay not configured' };
  }

  try {
    const listing = {
      sku: product.id,
      product: {
        title: product.description.split('\n')[0] || 'Product',
        description: product.description,
        imageUrls: [product.image],
        aspects: {
          Brand: ['Photo2Profit'],
          Type: ['General'],
        },
      },
      availability: {
        shipToLocationAvailability: {
          quantity: 1,
        },
      },
      condition: 'NEW',
    };

    const response = await fetch('https://api.ebay.com/sell/inventory/v1/inventory_item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ebayToken}`,
      },
      body: JSON.stringify(listing),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`eBay API error: ${error}`);
    }

    const data = await response.json();
    return { success: true, ebayId: data.sku };
  } catch (error) {
    console.error('eBay publish failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Publish a single product to Facebook
 */
async function publishToFacebook(product, userEmail) {
  const fbToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const catalogId = process.env.FB_CATALOG_ID;

  if (!fbToken || !catalogId) {
    console.warn('⚠️  Facebook not configured, skipping');
    return { success: false, error: 'Facebook not configured' };
  }

  try {
    const payload = {
      name: product.description.split('\n')[0] || 'Product',
      description: product.description,
      availability: 'in stock',
      condition: 'new',
      price: `${product.prices?.average || 20} USD`,
      currency: 'USD',
      url: `${process.env.FRONTEND_URL}/p/${encodeURIComponent(userEmail)}/${product.id}`,
    };

    // Add image if it's a public URL
    if (product.image && product.image.startsWith('http')) {
      payload.image_url = product.image;
    }

    const response = await fetch(`https://graph.facebook.com/v19.0/${catalogId}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${fbToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Facebook API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return { success: true, facebookId: data.id };
  } catch (error) {
    console.error('Facebook publish failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Publish a product to specified channels
 */
export async function publishProduct(product, userEmail, channels = CONFIG.channels) {
  const results = {};

  for (const channel of channels) {
    if (channel === 'ebay') {
      results.ebay = await publishToEbay(product, userEmail);
    } else if (channel === 'facebook') {
      results.facebook = await publishToFacebook(product, userEmail);
    }
  }

  return results;
}

/**
 * Get count of unpublished products for a user
 */
export async function getUnpublishedCount(userEmail) {
  try {
    const snapshot = await db
      .collection('users')
      .doc(userEmail)
      .collection('products')
      .where('published', '==', false)
      .get();

    return snapshot.size;
  } catch (error) {
    console.error('Error counting unpublished products:', error);
    return 0;
  }
}

/**
 * Check if threshold is met and publish if necessary
 */
export async function checkAndPublishThreshold(userEmail) {
  if (!CONFIG.enabled) {
    console.log('ℹ️  Auto-publish disabled');
    return { triggered: false, reason: 'disabled' };
  }

  const count = await getUnpublishedCount(userEmail);
  console.log(`📊 Unpublished products for ${userEmail}: ${count}/${CONFIG.threshold}`);

  if (count >= CONFIG.threshold) {
    console.log(`🚀 Threshold reached! Publishing ${count} products...`);
    const result = await publishPendingProducts(userEmail);
    return { triggered: true, ...result };
  }

  return { triggered: false, count, threshold: CONFIG.threshold };
}

/**
 * Publish all pending products for a user
 */
export async function publishPendingProducts(userEmail) {
  try {
    const snapshot = await db
      .collection('users')
      .doc(userEmail)
      .collection('products')
      .where('published', '==', false)
      .get();

    if (snapshot.empty) {
      return { success: true, count: 0, message: 'No products to publish' };
    }

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const doc of snapshot.docs) {
      const product = doc.data();
      console.log(`📤 Publishing product ${product.id}...`);

      const publishResults = await publishProduct(product, userEmail);

      // Check if at least one channel succeeded
      const hasSuccess = Object.values(publishResults).some((r) => r.success);

      if (hasSuccess) {
        // Mark as published
        await doc.ref.update({
          published: true,
          publishedAt: new Date().toISOString(),
          publishResults,
        });
        successCount++;
        console.log(`✅ Product ${product.id} published`);
      } else {
        errorCount++;
        console.error(`❌ Product ${product.id} failed to publish:`, publishResults);
      }

      results.push({
        productId: product.id,
        results: publishResults,
      });
    }

    return {
      success: true,
      count: snapshot.size,
      successCount,
      errorCount,
      results,
    };
  } catch (error) {
    console.error('Batch publish error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Publish all pending products across all users (for cron job)
 */
export async function publishAllPending() {
  try {
    console.log('🔄 Starting batch publish for all users...');

    // Get all users who have unpublished products
    const usersSnapshot = await db.collection('users').listDocuments();
    let totalPublished = 0;
    let totalErrors = 0;

    for (const userDoc of usersSnapshot) {
      const userEmail = userDoc.id;
      const result = await publishPendingProducts(userEmail);

      if (result.success) {
        totalPublished += result.successCount || 0;
        totalErrors += result.errorCount || 0;
      }
    }

    console.log(`✅ Batch publish complete: ${totalPublished} published, ${totalErrors} errors`);

    return {
      success: true,
      totalPublished,
      totalErrors,
    };
  } catch (error) {
    console.error('Global batch publish error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export const autoPublishConfig = CONFIG;

/**
 * Save a product to Firestore
 * This is called after AI processing to persist the product
 */
export async function saveProduct(product) {
  try {
    const docRef = await db.collection('products').add({
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log('✅ Product saved to Firestore:', docRef.id);
    return docRef.id;
  } catch (err) {
    console.error('❌ Error saving product:', err.message);
    throw err;
  }
}
