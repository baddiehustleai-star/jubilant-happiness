// ==========================================
// 🧠 BullMQ Worker - Photo2Profit Queue Runner
// ==========================================
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';
import prisma from '../config/prisma.js';
import facebook from '../services/facebook.service.js';
import ebay from '../services/ebay.service.js';
import poshmark from '../services/poshmark.service.js';
import logger from '../utils/logger.js';

dotenv.config();

if (!process.env.REDIS_URL) {
  console.error('REDIS_URL not set; worker cannot start.');
  process.exit(1);
}

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

console.log('🚀 Worker started. Listening for queue jobs...');

// Queue name must match publish.queue.js ("publish")
const worker = new Worker(
  'publish',
  async (job) => {
    const { listingId, platform } = job.data;
    logger.info(`Processing publish job for ${listingId} on ${platform}...`);
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new Error('Listing not found');

    let result;
    switch (platform) {
      case 'facebook':
        result = await facebook.publish(listing);
        if (result.success) await prisma.channelListing.create({ data: { listingId, platform, externalId: result.fb_product_id } });
        break;
      case 'ebay':
        result = await ebay.publish(listing);
        if (result.success) await prisma.channelListing.create({ data: { listingId, platform, externalId: result.ebay_offer_id } });
        break;
      case 'poshmark':
        result = await poshmark.publish(listing);
        if (result.success) await prisma.channelListing.create({ data: { listingId, platform, externalId: result.poshmark_id } });
        break;
      default:
        result = { success: false, error: 'Unsupported platform' };
    }

    await prisma.auditEvent.create({
      data: {
        listingId,
        platform,
        type: 'publish',
        details: { source: 'worker', platform, queueJobId: job.id, result },
      },
    });

    logger.info(`✅ Completed publish job for ${listingId} on ${platform}`);
    return result;
  },
  { connection }
);

worker.on('completed', (job) => {
  logger.info(`🎉 Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  logger.error(`💥 Job ${job?.id} failed: ${err.message}`);
});

process.on('SIGINT', async () => {
  logger.info('Shutting down worker...');
  await worker.close();
  process.exit(0);
});
