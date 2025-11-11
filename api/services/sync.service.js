// Sync service for inventory events across platforms
// When one platform reports a sale or price change, propagate updates/delisting.
import logger from '../utils/logger.js';
import facebook from './facebook.service.js';
import ebay from './ebay.service.js';
import poshmark from './poshmark.service.js';
import admin from 'firebase-admin';
import prisma from '../config/prisma.js';

function getDb() {
  try {
    if (!admin.apps.length) {
      // Minimal lazy init for test/local contexts; server.js will init in real runs
      admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || 'test-project' });
    }
    return admin.firestore();
  } catch {
    return null;
  }
}

// Attempt Prisma lookup first; fallback to Firestore legacy mapping
async function findListingByPlatformListingId(platform, platformListingId) {
  // Prisma channelListings.externalId match
  try {
    const channel = await prisma.channelListing.findFirst({
      where: { platform, externalId: platformListingId },
      include: { listing: true },
    });
    if (channel) return { id: channel.listing.id, data: channel.listing, prisma: true };
  } catch (e) {
    logger.warn('Prisma lookup failed (maybe not migrated yet)', e.message);
  }
  // Firestore fallback
  const db = getDb();
  if (!db) return null;
  const snap = await db
    .collection('listings')
    .where(`crossPostResults.${platform}.listingId`, '==', platformListingId)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, data: doc.data(), firestore: true };
}

export async function handleSyncEvent(sourcePlatform, listingExternalId, eventType, payload = {}) {
  try {
    logger.info('Handle sync event', { sourcePlatform, listingExternalId, eventType });
    const listingWrap = await findListingByPlatformListingId(sourcePlatform, listingExternalId);
    if (!listingWrap) {
      logger.warn('No listing found for platform id', listingExternalId);
      return { success: false, error: 'Listing not found for platform id' };
    }
    const { id, data } = listingWrap;

    if (listingWrap.prisma) {
      // Use channelListings relation for other platforms
      const channels = await prisma.channelListing.findMany({ where: { listingId: id } });
      const otherChannels = channels.filter((c) => c.platform !== sourcePlatform);
      if (eventType === 'sold') {
        await prisma.listing.update({ where: { id }, data: { sold: true, status: 'sold' } });
        for (const ch of otherChannels) {
          await delistPrismaChannel(ch);
        }
        await prisma.auditEvent.create({
          data: {
            listingId: id,
            type: 'sold',
            detail: `Sold on ${sourcePlatform}`,
            payload: { sourcePlatform },
          },
        });
      } else if (eventType === 'price_change') {
        const new_price = payload?.new_price;
        if (new_price) await prisma.listing.update({ where: { id }, data: { price: new_price } });
        for (const ch of otherChannels) {
          await updatePrice(ch.platform, { ...ch, new_price });
        }
        await prisma.auditEvent.create({
          data: {
            listingId: id,
            type: 'price_change',
            detail: `Price change from ${sourcePlatform}`,
            payload: { new_price },
          },
        });
      }
      return { success: true, prisma: true };
    }

    // Firestore legacy path
    const db = getDb();
    const crossPost = data.crossPostResults || {};
    const otherPlatforms = Object.keys(crossPost).filter((p) => p !== sourcePlatform);
    if (eventType === 'sold') {
      if (db)
        await db
          .collection('listings')
          .doc(id)
          .set(
            { status: 'sold', soldAt: admin.firestore.FieldValue.serverTimestamp() },
            { merge: true }
          );
      for (const p of otherPlatforms) await delist(p, crossPost[p]);
    } else if (eventType === 'price_change') {
      const new_price = payload?.new_price || data.price;
      if (db)
        await db
          .collection('listings')
          .doc(id)
          .set(
            { price: new_price, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
            { merge: true }
          );
      for (const p of otherPlatforms) await updatePrice(p, { ...crossPost[p], new_price });
    }
    // Firestore path does not log AuditEvent (Prisma-only)
    return { success: true, firestore: true };
  } catch (err) {
    logger.error('handleSyncEvent error', err.message);
    return { success: false, error: err.message };
  }
}

async function delistPrismaChannel(channel) {
  switch (channel.platform) {
    case 'facebook':
      await facebook.unpublish({ fb_product_id: channel.externalId, id: channel.listingId });
      break;
    case 'ebay':
      await ebay.endListing({ ebay_offer_id: channel.externalId, id: channel.listingId });
      break;
    case 'poshmark':
      await poshmark.remove({ poshmark_id: channel.externalId, id: channel.listingId });
      break;
  }
  try {
    await prisma.channelListing.update({ where: { id: channel.id }, data: { status: 'ended' } });
  } catch (e) {
    logger.warn('Failed to update channelListing status', e.message);
  }
}

async function delist(platform, listing) {
  if (!listing) return;
  switch (platform) {
    case 'facebook':
      return facebook.unpublish(listing);
    case 'ebay':
      return ebay.endListing(listing);
    case 'poshmark':
      return poshmark.remove(listing);
    default:
      logger.warn('Unknown platform for delist', platform);
  }
}

async function updatePrice(platform, listing) {
  if (!listing) return;
  switch (platform) {
    case 'facebook':
      return facebook.updatePrice(listing);
    case 'ebay':
      return ebay.updatePrice(listing);
    case 'poshmark':
      return poshmark.updatePrice(listing);
    default:
      logger.warn('Unknown platform for price update', platform);
  }
}

export default { handleSyncEvent };
