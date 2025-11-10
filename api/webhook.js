/* eslint-env node */
/* eslint-disable no-undef */
// Stripe webhook handler for payment events
// Requires: environment variables STRIPE_SECRET_KEY, SHARED_WEBHOOK_SECRET, FIREBASE_PROJECT_ID

import Stripe from 'stripe';
import { db } from './firebaseAdmin.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });
const endpointSecret = process.env.SHARED_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      // Extract payment details
      const customerEmail = session.customer_details?.email || session.customer_email || 'unknown';
      const amount = session.amount_total / 100;
      const currency = session.currency || 'usd';

      // Write payment event to Firestore
      await db.collection('payments').add({
        email: customerEmail,
        amount: amount,
        currency: currency,
        status: 'succeeded',
        createdAt: new Date().toISOString(),
        sessionId: session.id,
      });

      console.log('Payment logged to Firestore:', { email: customerEmail, amount });
    } catch (err) {
      console.error('Error writing to Firestore:', err);
      return res.status(500).json({ error: 'Failed to log payment' });
    }
  }

  // Return a response to acknowledge receipt of the event
  return res.status(200).json({ received: true });
}
