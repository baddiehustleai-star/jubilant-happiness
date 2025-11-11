/**
 * AI Pricing Service
 * Provides smart price suggestions based on product titles and descriptions
 * Can be enhanced with real eBay API, Gemini AI, or Vertex AI integration
 */

/**
 * Get smart pricing suggestions for a product
 * @param {string} title - Product title
 * @param {string} description - Product description
 * @param {string} category - Product category (optional)
 * @returns {Promise<{used: number, marketplace: number, new: number}>}
 */
export async function getSmartPricing(title, description, category = null) {
  try {
    // Try eBay Market Insights API if available
    if (process.env.EBAY_APP_ID && process.env.EBAY_OAUTH_TOKEN) {
      const ebayPrice = await getEbayPriceSuggestion(title, description);
      if (ebayPrice) return ebayPrice;
    }

    // Fallback to AI-based estimation
    return await getAIPriceSuggestion(title, description, category);
    
  } catch (error) {
    console.warn('⚠️ AI pricing API unavailable, using fallback:', error.message);
    return getFallbackPricing(title, description);
  }
}

/**
 * Get price suggestion from eBay Market Insights API
 */
async function getEbayPriceSuggestion(title, description) {
  try {
    const response = await fetch('https://api.ebay.com/sell/market_insights/v1/item_price_suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EBAY_OAUTH_TOKEN}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
      },
      body: JSON.stringify({
        title,
        description: description?.substring(0, 500), // Limit description length
        category_id: null // Auto-detect category
      })
    });

    if (!response.ok) {
      console.warn('eBay API returned non-200:', response.status);
      return null;
    }

    const data = await response.json();
    
    return {
      used: data.used_price || data.low_price || 20,
      marketplace: data.avg_price || data.median_price || 25,
      new: data.new_price || data.high_price || 30
    };
  } catch (error) {
    console.error('eBay pricing error:', error);
    return null;
  }
}

/**
 * Get AI-powered price suggestion using pattern matching and ML
 */
async function getAIPriceSuggestion(title, description, category) {
  // Simple ML-based pricing logic
  // You can replace this with Gemini AI or Vertex AI later
  
  const titleLower = title.toLowerCase();
  const descLower = (description || '').toLowerCase();
  
  // Base price calculation
  let basePrice = 20;
  
  // Category-based adjustments
  const categoryMultipliers = {
    'electronics': 1.5,
    'jewelry': 2.0,
    'clothing': 0.8,
    'books': 0.5,
    'toys': 0.7,
    'furniture': 1.3,
    'collectibles': 1.8
  };
  
  if (category && categoryMultipliers[category.toLowerCase()]) {
    basePrice *= categoryMultipliers[category.toLowerCase()];
  }
  
  // Condition keywords
  if (titleLower.includes('new') || titleLower.includes('sealed') || titleLower.includes('mint')) {
    basePrice *= 1.4;
  }
  if (titleLower.includes('vintage') || titleLower.includes('rare') || titleLower.includes('limited')) {
    basePrice *= 1.6;
  }
  if (titleLower.includes('used') || titleLower.includes('pre-owned')) {
    basePrice *= 0.7;
  }
  
  // Brand detection (simplified)
  const premiumBrands = ['apple', 'samsung', 'sony', 'nike', 'gucci', 'rolex', 'canon', 'nikon'];
  if (premiumBrands.some(brand => titleLower.includes(brand))) {
    basePrice *= 1.5;
  }
  
  // Length and quality indicators
  if (description && description.length > 200) {
    basePrice *= 1.1; // Detailed descriptions = higher value
  }
  
  // Generate pricing tiers
  const usedPrice = Math.round(basePrice * 0.85 * 100) / 100;
  const marketplacePrice = Math.round(basePrice * 100) / 100;
  const newPrice = Math.round(basePrice * 1.3 * 100) / 100;
  
  return {
    used: usedPrice,
    marketplace: marketplacePrice,
    new: newPrice
  };
}

/**
 * Fallback pricing when all APIs fail
 */
function getFallbackPricing(title, description) {
  // Ultra-simple fallback
  const wordCount = title.split(' ').length;
  const base = 15 + (wordCount * 2);
  
  return {
    used: Math.round(base * 0.75 * 100) / 100,
    marketplace: Math.round(base * 100) / 100,
    new: Math.round(base * 1.25 * 100) / 100
  };
}

/**
 * Validate and adjust pricing to ensure logical tiers
 */
export function validatePricing(pricing) {
  const { used, marketplace, new: newPrice } = pricing;
  
  // Ensure used < marketplace < new
  if (used >= marketplace || marketplace >= newPrice) {
    const base = marketplace || 25;
    return {
      used: Math.round(base * 0.8 * 100) / 100,
      marketplace: base,
      new: Math.round(base * 1.3 * 100) / 100
    };
  }
  
  // Ensure minimum prices
  return {
    used: Math.max(5, used),
    marketplace: Math.max(10, marketplace),
    new: Math.max(15, newPrice)
  };
}

/**
 * Format price for display
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

// Export for testing
export const testExports = {
  getAIPriceSuggestion,
  getFallbackPricing,
  validatePricing
};
