/* eslint-env node */
// Stripe webhook handler for subscription events

import Stripe from 'stripe';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Initialize Firebase Admin
let admin;
if (getApps().length === 0) {
  admin = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
} else {
  admin = getApps()[0];
}

const db = getFirestore(admin);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
}

async function handleCheckoutCompleted(session) {
  const { customer, subscription, metadata } = session;
  const { userId, planId } = metadata;

  if (!userId) {
    console.error('No userId in checkout session metadata');
    return;
  }

  try {
    // Update user profile with subscription info
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      'subscription.customerId': customer,
      'subscription.subscriptionId': subscription,
      'subscription.plan': planId,
      'subscription.status': 'active',
      'subscription.updatedAt': new Date(),
    });

    console.log(`Subscription activated for user ${userId}`);
  } catch (error) {
    console.error('Failed to update user subscription:', error);
  }
}

async function handleSubscriptionCreated(subscription) {
  const { customer, id: subscriptionId, items, status } = subscription;
  const priceId = items.data[0]?.price?.id;

  try {
    // Find user by customer ID
    const userQuery = await db
      .collection('users')
      .where('subscription.customerId', '==', customer)
      .limit(1)
      .get();

    if (userQuery.empty) {
      console.error(`No user found for customer ${customer}`);
      return;
    }

    const userDoc = userQuery.docs[0];
    const planId = getPlanFromPriceId(priceId);

    await userDoc.ref.update({
      'subscription.subscriptionId': subscriptionId,
      'subscription.plan': planId,
      'subscription.status': status,
      'subscription.updatedAt': new Date(),
    });

    console.log(`Subscription created for customer ${customer}`);
  } catch (error) {
    console.error('Failed to handle subscription creation:', error);
  }
}

async function handleSubscriptionUpdated(subscription) {
  const { id: subscriptionId, items, status } = subscription;
  const priceId = items.data[0]?.price?.id;

  try {
    const userQuery = await db
      .collection('users')
      .where('subscription.subscriptionId', '==', subscriptionId)
      .limit(1)
      .get();

    if (userQuery.empty) {
      console.error(`No user found for subscription ${subscriptionId}`);
      return;
    }

    const userDoc = userQuery.docs[0];
    const planId = getPlanFromPriceId(priceId);

    await userDoc.ref.update({
      'subscription.plan': planId,
      'subscription.status': status,
      'subscription.updatedAt': new Date(),
    });

    console.log(`Subscription updated for subscription ${subscriptionId}`);
  } catch (error) {
    console.error('Failed to handle subscription update:', error);
  }
}

async function handleSubscriptionDeleted(subscription) {
  const { id: subscriptionId } = subscription;

  try {
    const userQuery = await db
      .collection('users')
      .where('subscription.subscriptionId', '==', subscriptionId)
      .limit(1)
      .get();

    if (userQuery.empty) {
      console.error(`No user found for subscription ${subscriptionId}`);
      return;
    }

    const userDoc = userQuery.docs[0];

    await userDoc.ref.update({
      'subscription.plan': 'free',
      'subscription.status': 'cancelled',
      'subscription.updatedAt': new Date(),
      'subscription.cancelledAt': new Date(),
    });

    console.log(`Subscription cancelled for subscription ${subscriptionId}`);
  } catch (error) {
    console.error('Failed to handle subscription deletion:', error);
  }
}

async function handlePaymentSucceeded(invoice) {
  const { subscription: subscriptionId } = invoice;

  try {
    const userQuery = await db
      .collection('users')
      .where('subscription.subscriptionId', '==', subscriptionId)
      .limit(1)
      .get();

    if (userQuery.empty) {
      console.error(`No user found for subscription ${subscriptionId}`);
      return;
    }

    const userDoc = userQuery.docs[0];

    // Reset usage counts for the new billing period
    await userDoc.ref.update({
      'usage.imagesProcessed': 0,
      'usage.backgroundsRemoved': 0,
      'usage.listingsCreated': 0,
      'usage.monthlyReset': new Date(),
      'subscription.lastPayment': new Date(),
    });

    console.log(`Usage reset for subscription ${subscriptionId}`);
  } catch (error) {
    console.error('Failed to handle payment success:', error);
  }
}

async function handlePaymentFailed(invoice) {
  const { subscription: subscriptionId } = invoice;

  try {
    const userQuery = await db
      .collection('users')
      .where('subscription.subscriptionId', '==', subscriptionId)
      .limit(1)
      .get();

    if (userQuery.empty) {
      console.error(`No user found for subscription ${subscriptionId}`);
      return;
    }

    const userDoc = userQuery.docs[0];

    await userDoc.ref.update({
      'subscription.status': 'past_due',
      'subscription.updatedAt': new Date(),
    });

    console.log(`Payment failed for subscription ${subscriptionId}`);
  } catch (error) {
    console.error('Failed to handle payment failure:', error);
  }
}

function getPlanFromPriceId(priceId) {
  // Map Stripe price IDs to plan names
  const priceMap = {
    [process.env.STRIPE_PRO_PRICE_ID]: 'pro',
    [process.env.STRIPE_BUSINESS_PRICE_ID]: 'business',
  };

  return priceMap[priceId] || 'free';
}
