/* eslint-env node */
 
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

// Middleware to parse JSON bodies
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173', // local dev
  'https://photo2profitbaddie.web.app', // your Firebase hosting site
  'https://photo2profit-api-758851214311.us-west2.run.app' // optional, your backend itself
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Photo2Profit API is running' });
});

// Create Checkout Session endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;

    if (!priceId || !successUrl || !cancelUrl) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', // or 'payment' for one-time
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
});
