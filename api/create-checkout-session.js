/* eslint-env node */

// Vercel / Netlify-style serverless function to create a Stripe Checkout session.
// Requires: environment variable STRIPE_SECRET_KEY

import Stripe from 'stripe';

// Helper to load local .env file for development if STRIPE_SECRET_KEY isn't set.
async function ensureLocalEnv() {
  if (!process.env.STRIPE_SECRET_KEY) {
    try {
      // dynamic import works in ESM and avoids requiring dotenv in production
      const dotenv = await import('dotenv');
      dotenv.config({ path: process.cwd() + '/.env.local' });
      console.info('Loaded .env.local for local development');
    } catch (e) {
      console.warn(
        'Could not load .env.local (this is fine in production).',
        e && e.message ? e.message : e
      );
    }
  }
}

export default async function handler(req, res) {
  await ensureLocalEnv();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, successUrl, cancelUrl } = req.body;

    if (!priceId || !successUrl || !cancelUrl) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', // or 'payment' for one-time
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
