// Minimal signature verification middleware for webhooks
// Uses X-Signature header and SHARED_WEBHOOK_SECRET (HMAC-SHA256)
import crypto from 'crypto';

export function verifySignature(req, res, next) {
  const secret = process.env.SHARED_WEBHOOK_SECRET;
  if (!secret) return next(); // skip if not configured

  const sig = req.headers['x-signature'];
  if (!sig) return res.status(401).json({ error: 'Missing signature' });

  const body = JSON.stringify(req.body || {});
  const digest = crypto.createHmac('sha256', secret).update(body).digest('hex');
  if (crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(digest))) return next();
  return res.status(401).json({ error: 'Invalid signature' });
}

export default verifySignature;
