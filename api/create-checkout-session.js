/* eslint-env node */
// Vercel / Netlify-style serverless function to create a Stripe Checkout session.
// Requires: environment variable STRIPE_SECRET_KEY

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      priceId,
      successUrl,
      cancelUrl,
      mode = 'subscription',
      customerEmail,
      metadata = {},
    } = req.body;

    if (!priceId || !successUrl || !cancelUrl) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    // Create checkout session configuration
    const sessionConfig = {
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
    };

    // Add customer email if provided
    if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
    }

    // Additional config for subscriptions
    if (mode === 'subscription') {
      sessionConfig.allow_promotion_codes = true;
      sessionConfig.billing_address_collection = 'required';
      sessionConfig.subscription_data = {
        metadata,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
      mode: session.mode,
    });
  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(500).json({
      error: 'Server error',
      details: err.message,
    });
  }
}
