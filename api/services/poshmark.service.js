// Stub Poshmark service integration for remove and updatePrice
// Real implementation might use undocumented endpoints or headless automation
import logger from '../utils/logger.js';

async function simulate(delay = 500) {
  await new Promise((r) => setTimeout(r, delay));
}

export async function publish(_listing) {
  await simulate();
  const id = `posh_${Date.now()}`;
  logger.info('Simulated Poshmark publish', id);
  return { success: true, poshmark_id: id, platform: 'poshmark' };
}

export async function remove(listing) {
  await simulate(300);
  logger.info('Simulated Poshmark remove', listing.poshmark_id || listing.id);
  return { success: true };
}

export async function updatePrice(listing) {
  await simulate(300);
  logger.info(
    'Simulated Poshmark update price',
    listing.poshmark_id || listing.id,
    listing.new_price
  );
  return { success: true };
}

export default { publish, remove, updatePrice };
