// Stub eBay service integration for withdraw/end listing and price update
// Real implementation would call eBay Sell APIs with OAuth tokens
import logger from '../utils/logger.js';

async function simulate(delay = 600) {
  await new Promise((r) => setTimeout(r, delay));
}

export async function publish(_listing) {
  await simulate();
  const id = `ebay_${Date.now()}`;
  logger.info('Simulated eBay publish', id);
  return { success: true, ebay_offer_id: id, platform: 'ebay' };
}

export async function endListing(listing) {
  await simulate(300);
  logger.info('Simulated eBay end listing', listing.ebay_offer_id || listing.id);
  return { success: true };
}

export async function updatePrice(listing) {
  await simulate(300);
  logger.info(
    'Simulated eBay update price',
    listing.ebay_offer_id || listing.id,
    listing.new_price
  );
  return { success: true };
}

export default { publish, endListing, updatePrice };
