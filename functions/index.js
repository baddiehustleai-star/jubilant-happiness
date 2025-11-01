// Firebase Cloud Functions for Photo2Profit Stripe Integration
const { onCall, onRequest, HttpsError } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// CORS wrapper for HTTP functions
const corsWrapper = (handler) => (req, res) => {
  return cors(req, res, () => handler(req, res));
};

// Create Stripe checkout session
exports.createCheckoutSession = onCall(async (request) => {
  const { priceId, userId, email, successUrl, cancelUrl } = request.data;

  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    // Get or create customer
    let customer;
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    
    if (userDoc.exists && userDoc.data().stripeCustomerId) {
      customer = await stripe.customers.retrieve(userDoc.data().stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: email,
        metadata: {
          userId: userId,
        },
      });

      // Update user with customer ID
      await admin.firestore().collection('users').doc(userId).update({
        stripeCustomerId: customer.id,
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId,
      },
    });

    return { sessionId: session.id };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new HttpsError('internal', 'Failed to create checkout session');
  }
});

// Create customer portal session
exports.createPortalSession = onCall(async (request) => {
  const { customerId, returnUrl } = request.data;

  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw new HttpsError('internal', 'Failed to create portal session');
  }
});

// Stripe webhook handler
exports.stripeWebhook = onRequest(corsWrapper(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).send('Webhook handler failed');
  }
}));

// Handle subscription changes
async function handleSubscriptionChange(subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer);
  const userId = customer.metadata.userId;

  if (!userId) {
    console.error('No userId found in customer metadata');
    return;
  }

  const subscriptionData = {
    subscriptionStatus: subscription.status,
    subscriptionPlan: getPlanFromPriceId(subscription.items.data[0].price.id),
    stripeCustomerId: customer.id,
    stripeSubscriptionId: subscription.id,
    currentPeriodEnd: admin.firestore.Timestamp.fromDate(
      new Date(subscription.current_period_end * 1000)
    ),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await admin.firestore().collection('users').doc(userId).update(subscriptionData);
  
  // Log subscription event
  await admin.firestore().collection('subscription_events').add({
    userId,
    eventType: 'subscription_updated',
    subscriptionId: subscription.id,
    status: subscription.status,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
}

// Handle subscription cancellation
async function handleSubscriptionCancellation(subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer);
  const userId = customer.metadata.userId;

  if (!userId) {
    console.error('No userId found in customer metadata');
    return;
  }

  await admin.firestore().collection('users').doc(userId).update({
    subscriptionStatus: 'canceled',
    canceledAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Log cancellation event
  await admin.firestore().collection('subscription_events').add({
    userId,
    eventType: 'subscription_canceled',
    subscriptionId: subscription.id,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
}

// Handle successful payment
async function handlePaymentSuccess(invoice) {
  const customer = await stripe.customers.retrieve(invoice.customer);
  const userId = customer.metadata.userId;

  if (!userId) {
    console.error('No userId found in customer metadata');
    return;
  }

  // Log payment success
  await admin.firestore().collection('payment_events').add({
    userId,
    eventType: 'payment_succeeded',
    invoiceId: invoice.id,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Reset usage for new billing period if needed
  if (invoice.billing_reason === 'subscription_cycle') {
    const currentDate = new Date();
    const usageDocId = `${userId}_${currentDate.getFullYear()}_${currentDate.getMonth() + 1}`;
    
    await admin.firestore().collection('usage').doc(usageDocId).set({
      uploads: 0,
      backgroundRemovals: 0,
      aiAnalysis: 0,
      apiCalls: 0,
      resetAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}

// Handle payment failure
async function handlePaymentFailed(invoice) {
  const customer = await stripe.customers.retrieve(invoice.customer);
  const userId = customer.metadata.userId;

  if (!userId) {
    console.error('No userId found in customer metadata');
    return;
  }

  // Log payment failure
  await admin.firestore().collection('payment_events').add({
    userId,
    eventType: 'payment_failed',
    invoiceId: invoice.id,
    amount: invoice.amount_due,
    currency: invoice.currency,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Optionally notify user of payment failure
  // This could trigger an email or in-app notification
}

// Helper function to determine plan from price ID
function getPlanFromPriceId(priceId) {
  // You'll need to map your actual Stripe price IDs to plan names
  const trialPriceId = process.env.STRIPE_PRICE_ID_TRIAL;
  const proPriceId = process.env.STRIPE_PRICE_ID_PRO;

  if (priceId === trialPriceId) return 'trial';
  if (priceId === proPriceId) return 'pro';
  
  return 'unknown';
}

// Function to get user subscription details
exports.getUserSubscription = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = request.auth.uid;

  try {
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return { status: 'none', plan: null };
    }

    const userData = userDoc.data();
    return {
      status: userData.subscriptionStatus || 'none',
      plan: userData.subscriptionPlan || null,
      customerId: userData.stripeCustomerId || null,
      currentPeriodEnd: userData.currentPeriodEnd || null,
      cancelAtPeriodEnd: userData.cancelAtPeriodEnd || false,
    };
  } catch (error) {
    console.error('Error getting subscription:', error);
    throw new HttpsError('internal', 'Failed to get subscription details');
  }
});

// Function to cancel subscription
exports.cancelSubscription = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = request.auth.uid;

  try {
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    
    if (!userDoc.exists || !userDoc.data().stripeSubscriptionId) {
      throw new HttpsError('not-found', 'No active subscription found');
    }

    const subscriptionId = userDoc.data().stripeSubscriptionId;
    
    // Cancel at period end (don't cancel immediately)
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    // Update user document
    await admin.firestore().collection('users').doc(userId).update({
      cancelAtPeriodEnd: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, message: 'Subscription will cancel at period end' };
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new HttpsError('internal', 'Failed to cancel subscription');
  }
});