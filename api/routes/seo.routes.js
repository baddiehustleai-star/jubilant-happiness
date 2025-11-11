import express from 'express';
import prisma from '../config/prisma.js';
import { generateProductSEO } from '../services/seoMagic.service.js';
import { generateImageAlt } from '../services/imageCaption.service.js';
import admin from 'firebase-admin';

const router = express.Router();
const db = admin.firestore();

function isAuthorized(req) {
  const headerSecret = req.headers['x-cron-secret'];
  const bearer = (req.headers['authorization'] || '').replace('Bearer ', '');
  const queryToken = req.query.token;
  const secret = process.env.CRON_SECRET || process.env.SHARED_WEBHOOK_SECRET;
  return !!secret && (headerSecret === secret || bearer === secret || queryToken === secret);
}

// POST /api/seo/refresh
// Optional query: limit (default 20), offset (default 0)
router.post('/refresh', async (req, res) => {
  try {
    if (!isAuthorized(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Keep batch tiny by default to control cost (can be raised via ?limit=)
    const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
    const offset = parseInt(req.query.offset || '0', 10);

    // Fetch a small batch of listings
    const listings = await prisma.listing.findMany({
      skip: offset,
      take: limit,
      orderBy: { updatedAt: 'desc' },
    });

    let processed = 0;
    let skipped = 0;
    const errors = [];

    for (const listing of listings) {
      try {
        const cacheRef = db.collection('seo_cache').doc(String(listing.id));
        const snap = await cacheRef.get();
        const now = new Date();
        const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
        let refreshNeeded = true;

        if (snap.exists) {
          const data = snap.data();
          const last = data.updatedAt ? new Date(data.updatedAt) : null;
          if (last && now.getTime() - last.getTime() < THIRTY_DAYS) {
            // Recently refreshed
            skipped++;
            continue;
          }
        }

        const imageUrl = listing.imageCleaned || listing.imageUrl || listing.image;
        const seo = await generateProductSEO(listing);
        const imageMeta = await generateImageAlt(imageUrl, listing.title, listing.description);

        await cacheRef.set(
          {
            listingId: String(listing.id),
            title: seo.title,
            description: seo.description,
            keywords: seo.keywords,
            hashtags: seo.hashtags,
            imageAlt: imageMeta.alt,
            imageCaption: imageMeta.caption,
            updatedAt: now.toISOString(),
          },
          { merge: true }
        );

        processed++;
      } catch (e) {
        errors.push({ id: listing.id, error: e.message });
      }
    }

    res.json({ success: true, processed, skipped, errors, batch: { limit, offset } });
  } catch (e) {
    console.error('SEO refresh failed:', e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
