import { Queue, Worker } from 'bullmq';
import logger from '../utils/logger.js';
import facebook from '../services/facebook.service.js';
import ebay from '../services/ebay.service.js';
import poshmark from '../services/poshmark.service.js';
import prisma from '../config/prisma.js';

const connectionUrl = process.env.REDIS_URL || null;
let queue = null;

if (connectionUrl) {
  queue = new Queue('publish', { connection: { url: connectionUrl } });
  new Worker(
    'publish',
    async (job) => {
      const { listingId, platform } = job.data;
      const listing = await prisma.listing.findUnique({ where: { id: listingId } });
      if (!listing) throw new Error('Listing not found');
      switch (platform) {
        case 'facebook': {
          const r = await facebook.publish(listing);
          if (r.success)
            await prisma.channelListing.create({
              data: { listingId, platform, externalId: r.fb_product_id },
            });
          return r;
        }
        case 'ebay': {
          const r = await ebay.publish(listing);
          if (r.success)
            await prisma.channelListing.create({
              data: { listingId, platform, externalId: r.ebay_offer_id },
            });
          return r;
        }
        case 'poshmark': {
          const r = await poshmark.publish(listing);
          if (r.success)
            await prisma.channelListing.create({
              data: { listingId, platform, externalId: r.poshmark_id },
            });
          return r;
        }
      }
      return { success: false, error: 'Unsupported platform in queue worker' };
    },
    { connection: { url: connectionUrl } }
  );
  logger.info('Publish queue initialized');
} else {
  logger.info('Publish queue running in inline fallback mode (no REDIS_URL)');
}

export async function enqueuePublish(listingId, platform) {
  if (queue) {
    await queue.add('publish-task', { listingId, platform });
    return { enqueued: true, platform };
  }
  // Fallback inline
  switch (platform) {
    case 'facebook':
      return facebook.publish(await prisma.listing.findUnique({ where: { id: listingId } }));
    case 'ebay':
      return ebay.publish(await prisma.listing.findUnique({ where: { id: listingId } }));
    case 'poshmark':
      return poshmark.publish(await prisma.listing.findUnique({ where: { id: listingId } }));
    default:
      return { success: false, error: 'Unsupported platform' };
  }
}

export default { enqueuePublish };
export { queue as publishQueue };
