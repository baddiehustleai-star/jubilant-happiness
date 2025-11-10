/* eslint-env node */
/* eslint-disable no-undef */
// Vercel / Netlify-style serverless function to handle Stripe webhooks.
// Requires: environment variables STRIPE_SECRET_KEY and SHARED_WEBHOOK_SECRET

import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });
const endpointSecret = process.env.SHARED_WEBHOOK_SECRET;
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];

  let event;
  try {
    // For serverless functions, req.body is already parsed, but we need the raw body
    // In a real deployment, you'd configure the platform to send raw body for webhooks
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed.', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle event types
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerEmail = session.customer_details?.email;

        if (customerEmail) {
          await prisma.user.upsert({
            where: { email: customerEmail },
            update: { paid: true },
            create: { email: customerEmail, paid: true },
          });
          console.log(`✅ User ${customerEmail} marked as paid.`);

          // Optional: Sync to Firestore if using dual storage
          // Uncomment and install firebase-admin if needed:
          // import { getFirestore } from 'firebase-admin/firestore';
          // const db = getFirestore();
          // await db.collection('users').doc(customerEmail).set(
          //   { paid: true },
          //   { merge: true }
          // );
        } else {
          console.warn('⚠️ No customer email in session.');
        }
        break;
      }
      case 'invoice.payment_failed':
        console.warn('❌ Payment failed:', event.data.object.id);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
