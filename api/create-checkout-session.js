// Stripe checkout session API endpoint
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, priceId, successUrl, cancelUrl } = req.body;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      automatic_tax: { enabled: true },
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          userId,
        },
      },
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(400).json({ error: error.message });
  }
}