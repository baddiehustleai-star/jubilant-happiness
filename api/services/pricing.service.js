// Price lookup service using SerpAPI for eBay, Amazon, Google Shopping
import fetch from 'node-fetch';
import logger from '../utils/logger.js';

const SERPAPI_KEY = process.env.SERPAPI_KEY;

/**
 * Lookup prices across multiple marketplaces
 * @param {string} productTitle - Product search query
 * @param {string} category - Optional category for better results
 * @returns {Promise<Object>} - Price data from eBay, Amazon, Google Shopping
 */
export async function lookupPrices(productTitle, category = '') {
  if (!SERPAPI_KEY) {
    logger.warn('SERPAPI_KEY not set, returning mock prices');
    return {
      success: false,
      error: 'Price lookup not configured',
      mockData: {
        ebayUsed: 22.99,
        amazonNew: 38.0,
        poshmark: 27.0,
        googleShopping: 35.0,
      },
    };
  }

  try {
    const results = await Promise.allSettled([
      fetchEbayPrices(productTitle),
      fetchAmazonPrices(productTitle),
      fetchGoogleShoppingPrices(productTitle),
    ]);

    const [ebay, amazon, google] = results.map((r) =>
      r.status === 'fulfilled' ? r.value : null
    );

    const priceData = {
      ebay: ebay || { min: null, max: null, avg: null, listings: [] },
      amazon: amazon || { min: null, max: null, avg: null, listings: [] },
      googleShopping: google || { min: null, max: null, avg: null, listings: [] },
    };

    // Calculate suggested price (average of available data)
    const allPrices = [
      ebay?.avg,
      amazon?.avg,
      google?.avg,
    ].filter((p) => p != null);

    const suggestedPrice = allPrices.length > 0
      ? Math.round((allPrices.reduce((a, b) => a + b, 0) / allPrices.length) * 100) / 100
      : null;

    logger.info('Price lookup complete', { suggestedPrice, sources: allPrices.length });
    return {
      success: true,
      data: priceData,
      suggestedPrice,
    };
  } catch (error) {
    logger.error('Price lookup failed', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

async function fetchEbayPrices(query) {
  const url = `https://serpapi.com/search.json?engine=ebay&_nkw=${encodeURIComponent(
    query
  )}&ebay_domain=ebay.com&api_key=${SERPAPI_KEY}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`eBay search failed: ${response.status}`);

  const data = await response.json();
  const listings = (data.organic_results || []).slice(0, 10).map((item) => ({
    title: item.title,
    price: parsePrice(item.price),
    condition: item.condition,
    url: item.link,
  }));

  const prices = listings.map((l) => l.price).filter((p) => p > 0);
  return {
    min: Math.min(...prices) || null,
    max: Math.max(...prices) || null,
    avg: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : null,
    listings,
  };
}

async function fetchAmazonPrices(query) {
  const url = `https://serpapi.com/search.json?engine=amazon&q=${encodeURIComponent(
    query
  )}&api_key=${SERPAPI_KEY}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Amazon search failed: ${response.status}`);

  const data = await response.json();
  const listings = (data.organic_results || []).slice(0, 10).map((item) => ({
    title: item.title,
    price: parsePrice(item.price),
    rating: item.rating,
    url: item.link,
  }));

  const prices = listings.map((l) => l.price).filter((p) => p > 0);
  return {
    min: Math.min(...prices) || null,
    max: Math.max(...prices) || null,
    avg: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : null,
    listings,
  };
}

async function fetchGoogleShoppingPrices(query) {
  const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(
    query
  )}&api_key=${SERPAPI_KEY}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Google Shopping search failed: ${response.status}`);

  const data = await response.json();
  const listings = (data.shopping_results || []).slice(0, 10).map((item) => ({
    title: item.title,
    price: parsePrice(item.price),
    source: item.source,
    url: item.link,
  }));

  const prices = listings.map((l) => l.price).filter((p) => p > 0);
  return {
    min: Math.min(...prices) || null,
    max: Math.max(...prices) || null,
    avg: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : null,
    listings,
  };
}

function parsePrice(priceString) {
  if (!priceString) return 0;
  const cleaned = String(priceString).replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

export default { lookupPrices };
