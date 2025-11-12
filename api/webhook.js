/* eslint-env node */
/* eslint-disable no-undef */
// Stripe webhook handler for processing payment events
// Requires: STRIPE_SECRET_KEY, SENDGRID_API_KEY, DATABASE_URL

import Stripe from 'stripe';
import sgMail from '@sendgrid/mail';
import prisma from './lib/prisma.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    const body = await getRawBody(req);
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const customerEmail = session.customer_details?.email;

      if (customerEmail) {
        try {
          // Update or create user in database
          await prisma.user.upsert({
            where: { email: customerEmail },
            update: { paid: true },
            create: { email: customerEmail, paid: true },
          });

          console.log(`✅ User ${customerEmail} marked as paid`);

          // Send confirmation email
          const msg = {
            to: customerEmail,
            from: 'no-reply@photo2profit.com', // Verify this domain in SendGrid
            subject: '🎉 Payment Received — Welcome to Photo2Profit Pro!',
            text: `Hi there, your payment was successful! You now have full access to Photo2Profit Pro features.`,
            html: `
              <h2>🎉 Payment Successful!</h2>
              <p>Thank you for upgrading to <b>Photo2Profit Pro</b>.</p>
              <p>You now have full access to all premium tools.</p>
              <p>Visit your dashboard to start earning smarter.</p>
              <a href="https://photo2profitbaddie.web.app" 
                 style="background:#4f46e5;color:white;padding:10px 16px;text-decoration:none;border-radius:6px;">
                 Go to Dashboard
              </a>
            `,
          };

          await sgMail.send(msg);
          console.log(`📧 Confirmation email sent to ${customerEmail}`);
        } catch (err) {
          console.error('Error processing payment confirmation:', err);
          // Don't fail the webhook if email fails
        }
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return res.status(200).json({ received: true });
}

// Helper function to get raw body for signature verification
async function getRawBody(req) {
  if (req.body && typeof req.body === 'string') {
    return req.body;
  }
  
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}
