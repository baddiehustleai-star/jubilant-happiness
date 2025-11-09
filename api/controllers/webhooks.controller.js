import { handleSyncEvent } from '../services/sync.service.js';
import logger from '../utils/logger.js';

export async function ebayWebhook(req, res) {
  try {
    // Example expected body: { listing_id: 'ebay_123', event_type: 'sold', ... }
    const { listing_id, event_type, ...rest } = req.body || {};
    if (!listing_id || !event_type) return res.status(400).json({ error: 'Missing listing_id or event_type' });
    const result = await handleSyncEvent('ebay', listing_id, event_type, rest);
    res.status(result.success ? 200 : 500).json(result);
  } catch (err) {
    logger.error('ebayWebhook error', err.message);
    res.status(500).json({ error: err.message });
  }
}

export async function facebookWebhook(req, res) {
  try {
    const { listing_id, event_type, ...rest } = req.body || {};
    if (!listing_id || !event_type) return res.status(400).json({ error: 'Missing listing_id or event_type' });
    const result = await handleSyncEvent('facebook', listing_id, event_type, rest);
    res.status(result.success ? 200 : 500).json(result);
  } catch (err) {
    logger.error('facebookWebhook error', err.message);
    res.status(500).json({ error: err.message });
  }
}

export async function poshmarkWebhook(req, res) {
  try {
    const { listing_id, event_type, ...rest } = req.body || {};
    if (!listing_id || !event_type) return res.status(400).json({ error: 'Missing listing_id or event_type' });
    const result = await handleSyncEvent('poshmark', listing_id, event_type, rest);
    res.status(result.success ? 200 : 500).json(result);
  } catch (err) {
    logger.error('poshmarkWebhook error', err.message);
    res.status(500).json({ error: err.message });
  }
}

export default { ebayWebhook, facebookWebhook, poshmarkWebhook };
