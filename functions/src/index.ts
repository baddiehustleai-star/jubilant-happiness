// Firebase Cloud Functions for Photo2Profit
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';
import * as cors from 'cors';
import * as express from 'express';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Stripe
const stripe = new Stripe(functions.config().stripe.secret_key || process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Initialize Express app with CORS
const app = express();
app.use(cors({ origin: true }));

// Database references
const db = admin.firestore();

// Stripe webhook handler
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = functions.config().stripe.webhook_secret || process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Webhook processing failed');
  }
});

// Subscription event handlers
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  
  const userData = {
    customerId: subscription.customer,
    subscriptionId: subscription.id,
    status: subscription.status,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    priceId: subscription.items.data[0]?.price.id,
    planType: subscription.items.data[0]?.price.metadata?.planType || 'pro',
    trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // Find user by email and update their subscription info
  if (customer.email) {
    const userQuery = await db.collection('users')
      .where('email', '==', customer.email)
      .limit(1)
      .get();

    if (!userQuery.empty) {
      const userDoc = userQuery.docs[0];
      await userDoc.ref.update({
        subscription: userData,
        isPro: true,
        trialEndsAt: userData.trialEnd,
      });

      console.log(`Subscription created for user: ${userDoc.id}`);
    }
  }

  // Store subscription record
  await db.collection('subscriptions').doc(subscription.id).set(userData);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const subscriptionData = {
    status: subscription.status,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    priceId: subscription.items.data[0]?.price.id,
    planType: subscription.items.data[0]?.price.metadata?.planType || 'pro',
    trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // Update subscription record
  await db.collection('subscriptions').doc(subscription.id).update(subscriptionData);

  // Update user record
  const customerId = subscription.customer as string;
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  
  if (customer.email) {
    const userQuery = await db.collection('users')
      .where('email', '==', customer.email)
      .limit(1)
      .get();

    if (!userQuery.empty) {
      const userDoc = userQuery.docs[0];
      await userDoc.ref.update({
        'subscription.status': subscription.status,
        'subscription.currentPeriodEnd': subscriptionData.currentPeriodEnd,
        'subscription.cancelAtPeriodEnd': subscription.cancel_at_period_end,
        isPro: subscription.status === 'active',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Subscription updated for user: ${userDoc.id}`);
    }
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Update subscription record
  await db.collection('subscriptions').doc(subscription.id).update({
    status: 'canceled',
    canceledAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Update user record
  const customerId = subscription.customer as string;
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  
  if (customer.email) {
    const userQuery = await db.collection('users')
      .where('email', '==', customer.email)
      .limit(1)
      .get();

    if (!userQuery.empty) {
      const userDoc = userQuery.docs[0];
      await userDoc.ref.update({
        'subscription.status': 'canceled',
        isPro: false,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Reset usage limits to free tier
      await userDoc.ref.update({
        'usage.uploads': 0,
        'usage.aiGenerations': 0,
        'usage.backgroundRemovals': 0,
        'limits.uploads': 5,
        'limits.aiGenerations': 3,
        'limits.backgroundRemovals': 0,
      });

      console.log(`Subscription canceled for user: ${userDoc.id}`);
    }
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    const subscriptionId = invoice.subscription as string;
    
    // Log successful payment
    await db.collection('payments').add({
      subscriptionId,
      invoiceId: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'succeeded',
      paidAt: new Date(invoice.status_transitions.paid_at! * 1000),
      periodStart: new Date(invoice.period_start * 1000),
      periodEnd: new Date(invoice.period_end * 1000),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Reset usage for new billing period
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const customerId = subscription.customer as string;
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    
    if (customer.email) {
      const userQuery = await db.collection('users')
        .where('email', '==', customer.email)
        .limit(1)
        .get();

      if (!userQuery.empty) {
        const userDoc = userQuery.docs[0];
        await userDoc.ref.update({
          'usage.uploads': 0,
          'usage.aiGenerations': 0,
          'usage.backgroundRemovals': 0,
          'billing.lastPayment': new Date(invoice.status_transitions.paid_at! * 1000),
          'billing.nextPayment': new Date(invoice.period_end * 1000),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`Payment processed and usage reset for user: ${userDoc.id}`);
      }
    }
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    const subscriptionId = invoice.subscription as string;
    
    // Log failed payment
    await db.collection('payments').add({
      subscriptionId,
      invoiceId: invoice.id,
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: 'failed',
      attemptedAt: new Date(),
      failureReason: invoice.last_finalization_error?.message || 'Payment failed',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Notify user of payment failure
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const customerId = subscription.customer as string;
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    
    if (customer.email) {
      // Here you could send an email notification
      console.log(`Payment failed for customer: ${customer.email}`);
    }
  }
}

async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  
  if (customer.email) {
    const userQuery = await db.collection('users')
      .where('email', '==', customer.email)
      .limit(1)
      .get();

    if (!userQuery.empty) {
      const userDoc = userQuery.docs[0];
      
      // Mark trial ending soon
      await userDoc.ref.update({
        'subscription.trialEndingSoon': true,
        'notifications.trialEndingNotified': admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Trial ending notification for user: ${userDoc.id}`);
    }
  }
}

// Create Stripe customer
export const createStripeCustomer = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { email, name } = data;

  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        firebaseUID: context.auth.uid,
      },
    });

    // Update user document with customer ID
    await db.collection('users').doc(context.auth.uid).update({
      stripeCustomerId: customer.id,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { customerId: customer.id };
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create customer');
  }
});

// Create checkout session
export const createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { priceId, successUrl, cancelUrl, trialPeriodDays } = data;

  try {
    // Get or create customer
    const userDoc = await db.collection('users').doc(context.auth.uid).get();
    const userData = userDoc.data();
    
    let customerId = userData?.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData?.email,
        metadata: {
          firebaseUID: context.auth.uid,
        },
      });
      
      customerId = customer.id;
      
      await userDoc.ref.update({
        stripeCustomerId: customerId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
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
      subscription_data: trialPeriodDays ? {
        trial_period_days: trialPeriodDays,
      } : undefined,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      tax_id_collection: {
        enabled: true,
      },
    });

    return { sessionId: session.id, url: session.url };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create checkout session');
  }
});

// Create billing portal session
export const createBillingPortalSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { returnUrl } = data;

  try {
    const userDoc = await db.collection('users').doc(context.auth.uid).get();
    const userData = userDoc.data();
    
    if (!userData?.stripeCustomerId) {
      throw new functions.https.HttpsError('failed-precondition', 'No customer ID found');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: userData.stripeCustomerId,
      return_url: returnUrl,
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create billing portal session');
  }
});

// Process image upload (triggered by Storage)
export const processImageUpload = functions.storage.object().onFinalize(async (object) => {
  const { name, bucket, contentType } = object;
  
  if (!name || !contentType?.startsWith('image/')) {
    return;
  }

  // Only process uploads in the 'uploads' folder
  if (!name.startsWith('uploads/')) {
    return;
  }

  try {
    const pathParts = name.split('/');
    const userId = pathParts[1];
    const uploadId = pathParts[2];

    if (pathParts[3] === 'original') {
      // This is an original image upload - trigger AI processing
      const downloadUrl = `gs://${bucket}/${name}`;
      
      // Update upload record with processing status
      const uploadsQuery = await db.collection('uploads')
        .where('uploadId', '==', uploadId)
        .where('userId', '==', userId)
        .limit(1)
        .get();

      if (!uploadsQuery.empty) {
        const uploadDoc = uploadsQuery.docs[0];
        await uploadDoc.ref.update({
          'processing.imageProcessed': true,
          'processing.imageUrl': downloadUrl,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      console.log(`Image processed for upload: ${uploadId}`);
    }
  } catch (error) {
    console.error('Error processing image upload:', error);
  }
});

// Cleanup old uploads (scheduled function)
export const cleanupOldUploads = functions.pubsub.schedule('0 2 * * *') // Daily at 2 AM
  .timeZone('UTC')
  .onRun(async () => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30); // 30 days ago

    try {
      // Find old uploads
      const oldUploadsQuery = await db.collection('uploads')
        .where('createdAt', '<', cutoffDate)
        .where('status', '==', 'completed')
        .limit(100) // Process in batches
        .get();

      const batch = db.batch();
      const deletionPromises: Promise<void>[] = [];

      oldUploadsQuery.docs.forEach((doc) => {
        const data = doc.data();
        
        // Mark for deletion in Firestore
        batch.update(doc.ref, {
          status: 'deleted',
          deletedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Delete from Storage
        if (data.uploadId && data.userId) {
          const bucket = admin.storage().bucket();
          const folderPath = `uploads/${data.userId}/${data.uploadId}/`;
          
          deletionPromises.push(
            bucket.deleteFiles({
              prefix: folderPath,
            }).then(() => {
              console.log(`Deleted storage files for upload: ${data.uploadId}`);
            }).catch((error) => {
              console.error(`Failed to delete storage files for upload ${data.uploadId}:`, error);
            })
          );
        }
      });

      // Execute batch update
      if (oldUploadsQuery.docs.length > 0) {
        await batch.commit();
        await Promise.allSettled(deletionPromises);
        console.log(`Cleaned up ${oldUploadsQuery.docs.length} old uploads`);
      }

    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  });

// User registration trigger
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  try {
    // Create user document with default settings
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      isPro: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      usage: {
        uploads: 0,
        aiGenerations: 0,
        backgroundRemovals: 0,
      },
      limits: {
        uploads: 5, // Free tier limit
        aiGenerations: 3,
        backgroundRemovals: 0,
      },
      preferences: {
        notifications: true,
        autoAI: true,
        defaultPlatform: 'poshmark',
      },
    });

    console.log(`Created user document for: ${user.uid}`);
  } catch (error) {
    console.error('Error creating user document:', error);
  }
});

// User deletion trigger
export const onUserDelete = functions.auth.user().onDelete(async (user) => {
  try {
    // Delete user document
    await db.collection('users').doc(user.uid).delete();

    // Delete user's uploads
    const uploadsQuery = await db.collection('uploads')
      .where('userId', '==', user.uid)
      .get();

    const batch = db.batch();
    uploadsQuery.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    if (uploadsQuery.docs.length > 0) {
      await batch.commit();
    }

    // Delete user's storage files
    const bucket = admin.storage().bucket();
    await bucket.deleteFiles({
      prefix: `uploads/${user.uid}/`,
    });

    console.log(`Cleaned up data for deleted user: ${user.uid}`);
  } catch (error) {
    console.error('Error cleaning up user data:', error);
  }
});

// Health check endpoint
export const healthCheck = functions.https.onRequest((req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});