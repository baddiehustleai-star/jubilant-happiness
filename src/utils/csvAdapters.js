import Papa from 'papaparse';

/**
 * Generate CSV for Mercari platform
 * @param {Array} listings - Array of listing objects
 * @returns {string} CSV string
 */
export function generateMercariCSV(listings) {
  const mercariData = listings.map(listing => ({
    'Title': listing.title || '',
    'Description': listing.description || '',
    'Price': listing.price || '',
    'Category': listing.category || '',
    'Brand': listing.brand || '',
    'Condition': listing.condition || '',
    'Shipping': listing.shipping || 'Buyer Pays',
    'Weight': listing.weight || '',
    'Photos': listing.photos ? listing.photos.join('; ') : ''
  }));

  return Papa.unparse(mercariData);
}

/**
 * Generate CSV for Depop platform
 * @param {Array} listings - Array of listing objects
 * @returns {string} CSV string
 */
export function generateDepopCSV(listings) {
  const depopData = listings.map(listing => ({
    'Title': listing.title || '',
    'Description': listing.description || '',
    'Price': listing.price || '',
    'Category': listing.category || '',
    'Size': listing.size || '',
    'Brand': listing.brand || '',
    'Condition': listing.condition || '',
    'Color': listing.color || '',
    'Style': listing.style || '',
    'Image1': listing.photos?.[0] || '',
    'Image2': listing.photos?.[1] || '',
    'Image3': listing.photos?.[2] || '',
    'Image4': listing.photos?.[3] || ''
  }));

  return Papa.unparse(depopData);
}

/**
 * Generate CSV for Poshmark platform
 * @param {Array} listings - Array of listing objects
 * @returns {string} CSV string
 */
export function generatePoshmarkCSV(listings) {
  const poshmarkData = listings.map(listing => ({
    'Title': listing.title || '',
    'Description': listing.description || '',
    'Price': listing.price || '',
    'Original Price': listing.originalPrice || '',
    'Category': listing.category || '',
    'Subcategory': listing.subcategory || '',
    'Brand': listing.brand || '',
    'Size': listing.size || '',
    'Color': listing.color || '',
    'Condition': listing.condition || '',
    'Tags': listing.tags ? listing.tags.join(', ') : '',
    'Photos': listing.photos ? listing.photos.join('; ') : ''
  }));

  return Papa.unparse(poshmarkData);
}

/**
 * Generate CSV for eBay platform
 * @param {Array} listings - Array of listing objects
 * @returns {string} CSV string
 */
export function generateEbayCSV(listings) {
  const ebayData = listings.map(listing => ({
    'Title': listing.title || '',
    'Description': listing.description || '',
    'StartPrice': listing.price || '',
    'BuyItNowPrice': listing.buyItNowPrice || listing.price || '',
    'Category': listing.category || '',
    'Brand': listing.brand || '',
    'Condition': listing.condition || '',
    'ConditionDescription': listing.conditionDescription || '',
    'Duration': listing.duration || '7',
    'Format': listing.format || 'FixedPrice',
    'Quantity': listing.quantity || '1',
    'ShippingService': listing.shippingService || 'Standard',
    'ShippingCost': listing.shippingCost || '0',
    'PicURL': listing.photos?.[0] || ''
  }));

  return Papa.unparse(ebayData);
}

/**
 * Get the appropriate CSV generator for a platform
 * @param {string} platform - Platform name
 * @returns {Function} CSV generator function
 */
export function getCSVGenerator(platform) {
  const generators = {
    mercari: generateMercariCSV,
    depop: generateDepopCSV,
    poshmark: generatePoshmarkCSV,
    ebay: generateEbayCSV
  };

  return generators[platform.toLowerCase()] || generateMercariCSV;
}
