import Stripe from 'stripe';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Firebase Admin (only if not already initialized)
let app;
try {
  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
} catch (error) {
  // App already initialized
  console.log('Firebase initialization:', error.message);
  app = initializeApp();
}

const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
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
        await handleSubscriptionCanceled(event.data.object);
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

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

async function handleCheckoutCompleted(session) {
  const userId = session.metadata?.userId;
  const planType = session.metadata?.planType || 'subscription';

  console.log('Processing checkout for plan:', planType);

  if (!userId || userId === 'anonymous') {
    console.log('No user ID in checkout session metadata');
    return;
  }

  try {
    const userRef = db.collection('users').doc(userId);

    // Get subscription or payment details
    let subscriptionId = null;
    let customerId = session.customer;

    if (session.mode === 'subscription') {
      subscriptionId = session.subscription;
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      // Determine plan based on price ID
      const priceId = subscription.items.data[0].price.id;
      const plan = getPlanFromPriceId(priceId);

      await userRef.update({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        plan: plan,
        subscriptionStatus: subscription.status,
        planStartDate: new Date(subscription.current_period_start * 1000),
        planEndDate: new Date(subscription.current_period_end * 1000),
        photosLimit: getPlanLimits(plan).photos,
        lastPayment: new Date(),
      });

      console.log(`Subscription activated for user ${userId}, plan: ${plan}`);
    } else {
      // One-time payment
      await userRef.update({
        stripeCustomerId: customerId,
        lastPayment: new Date(),
        paymentHistory: db.FieldValue.arrayUnion({
          sessionId: session.id,
          amount: session.amount_total,
          currency: session.currency,
          date: new Date(),
        }),
      });

      console.log(`One-time payment processed for user ${userId}`);
    }
  } catch (error) {
    console.error('Error updating user after checkout:', error);
  }
}

async function handleSubscriptionCreated(subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.log('No user ID in subscription metadata');
    return;
  }

  try {
    const priceId = subscription.items.data[0].price.id;
    const plan = getPlanFromPriceId(priceId);

    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      plan: plan,
      subscriptionStatus: subscription.status,
      planStartDate: new Date(subscription.current_period_start * 1000),
      planEndDate: new Date(subscription.current_period_end * 1000),
      photosLimit: getPlanLimits(plan).photos,
    });

    console.log(`Subscription created for user ${userId}, plan: ${plan}`);
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    // Find user by subscription ID
    const usersSnapshot = await db
      .collection('users')
      .where('stripeSubscriptionId', '==', subscription.id)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.log('No user found for subscription update');
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    await userDoc.ref.update({
      subscriptionStatus: subscription.status,
      planEndDate: new Date(subscription.current_period_end * 1000),
    });
  } else {
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      subscriptionStatus: subscription.status,
      planEndDate: new Date(subscription.current_period_end * 1000),
    });
  }

  console.log(`Subscription updated for subscription ${subscription.id}`);
}

async function handleSubscriptionCanceled(subscription) {
  try {
    // Find user by subscription ID
    const usersSnapshot = await db
      .collection('users')
      .where('stripeSubscriptionId', '==', subscription.id)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.log('No user found for canceled subscription');
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    await userDoc.ref.update({
      plan: 'free',
      subscriptionStatus: 'canceled',
      photosLimit: 10,
      stripeSubscriptionId: null,
      planEndDate: new Date(), // Immediate cancellation
    });

    console.log(`Subscription canceled for subscription ${subscription.id}`);
  } catch (error) {
    console.error('Error handling subscription canceled:', error);
  }
}

async function handlePaymentSucceeded(invoice) {
  const customerId = invoice.customer;
  const subscriptionId = invoice.subscription;

  try {
    // Find user by customer ID or subscription ID
    let usersSnapshot = await db
      .collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();

    if (usersSnapshot.empty && subscriptionId) {
      usersSnapshot = await db
        .collection('users')
        .where('stripeSubscriptionId', '==', subscriptionId)
        .limit(1)
        .get();
    }

    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0];
      await userDoc.ref.update({
        lastPayment: new Date(),
        subscriptionStatus: 'active',
        paymentHistory: db.FieldValue.arrayUnion({
          invoiceId: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          date: new Date(),
        }),
      });

      console.log(`Payment succeeded for customer ${customerId}`);
    }
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(invoice) {
  const customerId = invoice.customer;

  try {
    const usersSnapshot = await db
      .collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();

    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0];
      await userDoc.ref.update({
        subscriptionStatus: 'past_due',
        lastFailedPayment: new Date(),
      });

      console.log(`Payment failed for customer ${customerId}`);
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

function getPlanFromPriceId(priceId) {
  // Map Stripe price IDs to plan names
  const priceMapping = {
    [process.env.STRIPE_PRO_PRICE_ID]: 'pro',
    [process.env.STRIPE_BUSINESS_PRICE_ID]: 'business',
  };

  return priceMapping[priceId] || 'free';
}

function getPlanLimits(plan) {
  const limits = {
    free: { photos: 10 },
    guest: { photos: 3 },
    pro: { photos: 500 },
    business: { photos: -1 }, // unlimited
  };

  return limits[plan] || limits.free;
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
