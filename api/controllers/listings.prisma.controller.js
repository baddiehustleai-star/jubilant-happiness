import prisma from '../config/prisma.js';
import { analyzeWithVertex } from '../vertex/analyze.js';
import { enqueuePublish } from '../queue/publish.queue.js';
import logger from '../utils/logger.js';

// AI generation leveraging existing Vertex helper (wrapped for v2)
export async function generateListingAI(req, res) {
  try {
    const { image_url, category } = req.body;
    const ai = await analyzeWithVertex({
      title: 'Generated Listing',
      description: `Image: ${image_url || 'n/a'}`,
      category: category || 'general',
    });
    const result = {
      title: ai?.optimizedTitle || `Quality ${category || 'item'}`,
      description: ai?.competitorAnalysis || 'AI description coming soon.',
      suggested_price: ai?.suggestedPrice || 49.99,
      tags: ai?.tags || [],
    };
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function createListing(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Missing user context' });
    const { title, description, price, imageUrl, condition, category } = req.body;
    const listing = await prisma.listing.create({
      data: { userId, title, description, price, imageUrl, condition, category },
    });
    res.status(201).json(listing);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getListings(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Missing user context' });
    const listings = await prisma.listing.findMany({
      where: { userId },
      include: { channelListings: true },
    });
    res.json(listings);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getListing(req, res) {
  try {
    const { id } = req.params;
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { channelListings: true },
    });
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json(listing);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function publishListing(req, res) {
  try {
    const { id } = req.params;
    const { platforms = [] } = req.body || {};
    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    const results = {};
    for (const p of platforms) {
      const platform = p.toLowerCase();
      const enqueueResult = await enqueuePublish(listing.id, platform);
      results[platform] = enqueueResult || { success: false, error: 'Queue error' };
    }
    await prisma.auditEvent.create({
      data: {
        listingId: listing.id,
        type: 'publish',
        detail: 'Publish requested',
        payload: { platforms },
      },
    });
    logger.info('Publish enqueued (Prisma)', results);
    res.json({ success: true, results, queued: !!process.env.REDIS_URL });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function archiveListing(req, res) {
  try {
    const { id } = req.params;
    const exists = await prisma.listing.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ error: 'Listing not found' });
    await prisma.listing.update({ where: { id }, data: { status: 'archived' } });
    await prisma.auditEvent.create({
      data: { listingId: id, type: 'delist', detail: 'Listing archived (soft delete)' },
    });
    res.json({ success: true, archived: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export default {
  generateListingAI,
  createListing,
  getListings,
  getListing,
  publishListing,
  archiveListing,
};
