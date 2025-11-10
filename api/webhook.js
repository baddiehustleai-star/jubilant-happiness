/* eslint-env node */
/* eslint-disable no-undef */
// Stripe webhook handler for Cloud Run / serverless deployment
// Handles checkout.session.completed events and sends confirmation emails via SendGrid

import Stripe from 'stripe';
import sgMail from '@sendgrid/mail';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature for security
    if (webhookSecret && sig) {
      // In serverless environments, req.body might already be parsed
      // For raw body, use req.body if it's a Buffer, otherwise stringify
      const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    } else {
      // If no webhook secret is configured, parse the event directly (not recommended for production)
      event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      console.warn('⚠️  Webhook signature verification is disabled. Set STRIPE_WEBHOOK_SECRET for production.');
    }
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerEmail = session.customer_details?.email;

        console.log(`✅ Checkout completed for session: ${session.id}`);

        if (customerEmail) {
          // Send confirmation email via SendGrid
          if (process.env.SENDGRID_API_KEY) {
            const msg = {
              to: customerEmail,
              from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@photo2profit.com',
              subject: '🎉 Payment Received — Welcome to Photo2Profit Pro!',
              text: `Hi there, your payment was successful! You now have full access to Photo2Profit Pro features.`,
              html: `
                <h2>🎉 Payment Successful!</h2>
                <p>Thank you for upgrading to <b>Photo2Profit Pro</b>.</p>
                <p>You now have full access to all premium tools.</p>
                <p>Visit your dashboard to start earning smarter.</p>
                <a href="${process.env.FRONTEND_URL || 'https://photo2profitbaddie.web.app'}" 
                   style="background:#4f46e5;color:white;padding:10px 16px;text-decoration:none;border-radius:6px;display:inline-block;margin-top:10px;">
                   Go to Dashboard
                </a>
              `,
            };

            try {
              await sgMail.send(msg);
              console.log(`📧 Confirmation email sent to ${customerEmail}`);
            } catch (emailErr) {
              console.error('❌ Email send error:', emailErr.response?.body || emailErr.message);
              // Don't fail the webhook if email fails - log and continue
            }
          } else {
            console.warn('⚠️  SendGrid API key not configured. Skipping email.');
          }
        } else {
          console.warn('⚠️  No customer email found in session.');
        }
        break;
      }

      default:
        console.log(`ℹ️  Unhandled event type: ${event.type}`);
    }

    // Return success response to Stripe
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('❌ Error processing webhook:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
