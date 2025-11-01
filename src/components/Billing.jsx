import { useState } from 'react';
import { stripePromise } from '../config/stripe.js';

export default function Billing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async (_priceId) => {
    if (!stripePromise) {
      setError('Stripe is not configured. Please add your Stripe publishable key.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // In a real application, you would call your backend to create a checkout session
      // For now, we'll just show that the integration is ready
      await stripePromise;

      // This would typically be an API call to your backend
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ priceId }),
      // });
      // const session = await response.json();
      // const result = await stripe.redirectToCheckout({ sessionId: session.id });

      // For demo purposes, show a message
      window.alert(
        'Stripe checkout would be initiated here. In production, this would redirect to a Stripe checkout page.'
      );
    } catch (err) {
      setError(err.message);
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-diamond mb-8 text-center text-rose-dark">Choose Your Plan</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Trial Plan */}
        <div className="border-2 border-rose rounded-lg p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-diamond mb-2 text-rose-dark">Trial</h3>
          <p className="text-3xl font-bold mb-4">
            $1<span className="text-lg text-gray-600">/7 days</span>
          </p>
          <ul className="mb-6 space-y-2 text-sm">
            <li>✓ 10 photo uploads</li>
            <li>✓ AI-powered listings</li>
            <li>✓ Background removal</li>
            <li>✓ Basic cross-posting</li>
          </ul>
          <button
            onClick={() => handleCheckout('price_trial')}
            disabled={loading}
            className="cta w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Start Trial'}
          </button>
        </div>

        {/* Basic Plan */}
        <div className="border-2 border-rose-dark rounded-lg p-6 hover:shadow-lg transition bg-blush">
          <div className="text-center mb-2">
            <span className="bg-rose-dark text-white px-3 py-1 rounded-full text-xs font-bold">
              POPULAR
            </span>
          </div>
          <h3 className="text-xl font-diamond mb-2 text-rose-dark">Basic</h3>
          <p className="text-3xl font-bold mb-4">
            $9.99<span className="text-lg text-gray-600">/month</span>
          </p>
          <ul className="mb-6 space-y-2 text-sm">
            <li>✓ Unlimited uploads</li>
            <li>✓ AI-powered listings</li>
            <li>✓ Background removal</li>
            <li>✓ Advanced cross-posting</li>
            <li>✓ Weekly exports</li>
          </ul>
          <button
            onClick={() => handleCheckout('price_basic')}
            disabled={loading}
            className="cta w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Subscribe'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="border-2 border-gold rounded-lg p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-diamond mb-2 text-gold">Pro</h3>
          <p className="text-3xl font-bold mb-4">
            $19.99<span className="text-lg text-gray-600">/month</span>
          </p>
          <ul className="mb-6 space-y-2 text-sm">
            <li>✓ Everything in Basic</li>
            <li>✓ AI trend analytics</li>
            <li>✓ Auto pricing</li>
            <li>✓ Priority support</li>
            <li>✓ Referral rewards</li>
          </ul>
          <button
            onClick={() => handleCheckout('price_pro')}
            disabled={loading}
            className="cta w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Go Pro'}
          </button>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600 mt-8">
        All plans include secure payment processing by Stripe. Cancel anytime.
      </p>
    </div>
  );
}
