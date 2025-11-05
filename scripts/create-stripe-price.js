#!/usr/bin/env node
/* eslint-env node */

/**
 * Create a Stripe product and price programmatically.
 * Expects STRIPE_SECRET_KEY in env. Prints the created price ID to stdout.
 * Usage: STRIPE_SECRET_KEY=sk_test_xxx node scripts/create-stripe-price.js
 */
import Stripe from 'stripe';

async function main() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error('ERROR: STRIPE_SECRET_KEY is not set in environment');
    process.exit(1);
  }

  const stripe = new Stripe(key, { apiVersion: '2022-11-15' });

  // Change product/price details below as you like
  const product = await stripe.products.create({
    name: 'Photo2Profit Pro',
    description: 'Pro plan: higher resolution exports, analytics, priority support',
  });

  // Create a recurring price (monthly; amount in cents)
  const price = await stripe.prices.create({
    unit_amount: 990, // $9.90
    currency: 'usd',
    recurring: { interval: 'month' },
    product: product.id,
  });

  console.log('Created product:', product.id);
  console.log('Created price:', price.id);
  // Print just the price id for easy consumption
  console.log(price.id);
}

main().catch((err) => {
  console.error('Error creating stripe price:', err);
  process.exit(1);
});
