import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerId, returnUrl } = req.body;

    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }

    // Create customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${process.env.VERCEL_URL || 'https://photo2profit.online'}/account`,
    });

    res.status(200).json({
      url: portalSession.url,
      status: 'success',
    });
  } catch (error) {
    console.error('Customer portal error:', error);
    res.status(500).json({
      error: 'Failed to create portal session',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}
