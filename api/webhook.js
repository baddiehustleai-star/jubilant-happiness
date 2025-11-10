/* eslint-env node */
/* eslint-disable no-undef */
// Stripe webhook handler to capture payment events
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });
const prisma = new PrismaClient();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default async function webhookHandler(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerEmail = session.customer_details?.email || session.customer_email;

    console.log(`✅ Checkout session completed for ${customerEmail}`);

    // Send confirmation email
    if (customerEmail) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: customerEmail,
          subject: '🎉 Welcome to Photo2Profit!',
          text: `Thanks for subscribing! Your access is now active.`,
          html: `<h1>🎉 Welcome to Photo2Profit!</h1><p>Thanks for subscribing! Your access is now active.</p>`,
        });
        console.log(`📧 Sent welcome email to ${customerEmail}`);
      } catch (emailErr) {
        console.error('Failed to send email:', emailErr);
      }
    }

    // Record payment in database
    try {
      await prisma.payment.create({
        data: {
          email: customerEmail || 'unknown',
          amount: session.amount_total || 0,
          currency: session.currency || 'usd',
          status: 'succeeded',
        },
      });
      console.log(`💰 Recorded payment of $${((session.amount_total || 0) / 100).toFixed(2)} from ${customerEmail}`);
    } catch (dbErr) {
      console.error('Failed to record payment:', dbErr);
    }
  }

  res.json({ received: true });
}
