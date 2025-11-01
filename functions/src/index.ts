/**
 * Firebase Cloud Functions for Photo2Profit
 * 
 * This module contains serverless functions for:
 * - Stripe webhook handling
 * - Weekly export scheduler (sends CSV exports via email)
 * - AI image processing triggers
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import sgMail from '@sendgrid/mail';
import Stripe from 'stripe';

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

// Initialize SendGrid
const sendGridApiKey = process.env.SENDGRID_API_KEY || '';
if (sendGridApiKey) {
  sgMail.setApiKey(sendGridApiKey);
}

/**
 * Weekly Export Scheduler
 * Runs every Monday at 9 AM to send users their listings export
 */
export const weeklyExport = functions.pubsub
  .schedule('0 9 * * 1')
  .timeZone('America/Los_Angeles')
  .onRun(async (context) => {
    functions.logger.info('Starting weekly export job', { time: new Date().toISOString() });

    try {
      // Get all pro users
      const usersSnapshot = await db
        .collection('users')
        .where('isPro', '==', true)
        .where('subscriptionStatus', '==', 'active')
        .get();

      const exportPromises = usersSnapshot.docs.map(async (userDoc) => {
        const userId = userDoc.id;
        const userData = userDoc.data();
        const email = userData.email;

        if (!email) {
          functions.logger.warn('User has no email', { userId });
          return;
        }

        try {
          // Get user's uploads from last week
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

          const uploadsSnapshot = await db
            .collection('users')
            .doc(userId)
            .collection('uploads')
            .where('uploadedAt', '>=', oneWeekAgo)
            .where('processed', '==', true)
            .get();

          if (uploadsSnapshot.empty) {
            functions.logger.info('No uploads to export', { userId, email });
            return;
          }

          // Generate CSV data
          const csvRows = [
            ['Title', 'Description', 'Price', 'Category', 'Tags', 'Image URL', 'Uploaded At'].join(','),
          ];

          uploadsSnapshot.docs.forEach((doc) => {
            const upload = doc.data();
            csvRows.push(
              [
                `"${upload.suggestedTitle || 'Untitled'}"`,
                `"${upload.suggestedDescription || ''}"`,
                upload.suggestedPrice || '',
                upload.category || '',
                `"${(upload.aiTags || []).join(', ')}"`,
                upload.downloadURL || '',
                upload.uploadedAt?.toDate?.()?.toISOString() || '',
              ].join(',')
            );
          });

          const csvContent = csvRows.join('\n');

          // Send email with CSV attachment
          if (sendGridApiKey) {
            await sgMail.send({
              to: email,
              from: 'noreply@photo2profit.app',
              subject: 'Your Weekly Photo2Profit Export',
              text: `Hi ${userData.displayName || 'there'},\n\nHere's your weekly export of ${uploadsSnapshot.size} listings from Photo2Profit.\n\nBest regards,\nThe Photo2Profit Team`,
              html: `
                <h2>Your Weekly Export is Ready! 📦</h2>
                <p>Hi ${userData.displayName || 'there'},</p>
                <p>We've prepared your weekly export of <strong>${uploadsSnapshot.size} listings</strong> from Photo2Profit.</p>
                <p>The attached CSV file contains all your processed photos and AI-generated listings from the past week.</p>
                <p>You can use this to bulk upload to your favorite platforms!</p>
                <br>
                <p>Best regards,<br>The Photo2Profit Team 💎</p>
              `,
              attachments: [
                {
                  content: Buffer.from(csvContent).toString('base64'),
                  filename: `photo2profit-export-${new Date().toISOString().split('T')[0]}.csv`,
                  type: 'text/csv',
                  disposition: 'attachment',
                },
              ],
            });

            functions.logger.info('Export email sent', { userId, email, count: uploadsSnapshot.size });
          } else {
            functions.logger.warn('SendGrid not configured, skipping email', { userId });
          }
        } catch (error) {
          functions.logger.error('Error processing user export', { userId, error });
        }
      });

      await Promise.all(exportPromises);
      functions.logger.info('Weekly export job completed');
    } catch (error) {
      functions.logger.error('Weekly export job failed', { error });
      throw error;
    }
  });

/**
 * Stripe Webhook Handler
 * Processes Stripe events and updates user subscription status
 */
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  if (!webhookSecret) {
    functions.logger.error('Stripe webhook secret not configured');
    res.status(500).send('Webhook secret not configured');
    return;
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    functions.logger.error('Webhook signature verification failed', { error: err });
    res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return;
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId && session.customer) {
          await db.collection('users').doc(userId).update({
            stripeCustomerId: session.customer,
            subscriptionStatus: 'active',
            isPro: true,
            uploadLimit: 100,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          functions.logger.info('Checkout completed', { userId, customerId: session.customer });
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by customer ID
        const usersSnapshot = await db.collection('users').where('stripeCustomerId', '==', customerId).limit(1).get();

        if (!usersSnapshot.empty) {
          const userDoc = usersSnapshot.docs[0];
          await userDoc.ref.update({
            subscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            isPro: subscription.status === 'active',
            uploadLimit: subscription.status === 'active' ? 100 : 5,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          functions.logger.info('Subscription updated', {
            userId: userDoc.id,
            subscriptionId: subscription.id,
            status: subscription.status,
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by customer ID
        const usersSnapshot = await db.collection('users').where('stripeCustomerId', '==', customerId).limit(1).get();

        if (!usersSnapshot.empty) {
          const userDoc = usersSnapshot.docs[0];
          await userDoc.ref.update({
            subscriptionId: null,
            subscriptionStatus: 'canceled',
            isPro: false,
            uploadLimit: 5,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          functions.logger.info('Subscription canceled', { userId: userDoc.id });
        }
        break;
      }

      default:
        functions.logger.info('Unhandled event type', { type: event.type });
    }

    res.json({ received: true });
  } catch (error) {
    functions.logger.error('Error processing webhook', { error });
    res.status(500).send('Webhook processing failed');
  }
});

/**
 * Trigger AI processing when a new photo is uploaded
 * This is a placeholder for future AI integration
 */
export const onPhotoUpload = functions.firestore
  .document('users/{userId}/uploads/{uploadId}')
  .onCreate(async (snap, context) => {
    const upload = snap.data();
    const { userId, uploadId } = context.params;

    functions.logger.info('New photo uploaded', { userId, uploadId });

    // TODO: Integrate with AI services
    // - OpenAI Vision API for image analysis
    // - remove.bg for background removal
    // - Generate listing title, description, tags, price

    // For now, just mark as processed (placeholder)
    await snap.ref.update({
      status: 'processing',
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Simulate AI processing delay
    setTimeout(async () => {
      await snap.ref.update({
        status: 'processed',
        processed: true,
        aiTags: ['fashion', 'clothing'],
        suggestedTitle: 'Beautiful Item',
        suggestedDescription: 'High-quality item in excellent condition.',
        suggestedPrice: '29.99',
        category: 'Clothing',
      });
    }, 2000);

    return null;
  });
