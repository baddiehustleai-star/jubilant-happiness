/* eslint-env node */
// Vercel / Netlify-style serverless function to create a Stripe Checkout session.
// Requires: environment variable STRIPE_SECRET_KEY

import Stripe from 'stripe';

let stripe = null;

function getStripe() {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });
  }
  return stripe;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stripeInstance = getStripe();
    if (!stripeInstance) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const { priceId, successUrl, cancelUrl } = req.body;

    if (!priceId || !successUrl || !cancelUrl) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const session = await stripeInstance.checkout.sessions.create({
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
