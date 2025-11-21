/* eslint-env node */
// Customer Portal session creation for Stripe subscription management

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerId, returnUrl } = req.body;

    if (!customerId || !returnUrl) {
      return res.status(400).json({ error: 'Missing customerId or returnUrl' });
    }

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return res.status(200).json({
      url: portalSession.url,
      sessionId: portalSession.id,
    });
  } catch (err) {
    console.error('Stripe portal error:', err);
    return res.status(500).json({
      error: 'Server error',
      details: err.message,
    });
  }
}
