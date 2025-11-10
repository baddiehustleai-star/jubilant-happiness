/* eslint-env browser */
/* global localStorage */
import { useState } from 'react';
import { createCheckout } from '../lib/stripe';

export default function Dashboard() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    try {
      setLoading(true);
      setMessage('Redirecting to checkout...');

      // Get user email - in a real app this would come from your auth system
      const email = localStorage.getItem('userEmail') || 'user@example.com';
      
      const priceId = import.meta.env.VITE_STRIPE_PRICE_ID || 'price_XXXXXXXXXXXX';
      const successUrl = window.location.origin + '/success';
      const cancelUrl = window.location.origin + '/cancel';

      const json = await createCheckout({ email, priceId, successUrl, cancelUrl });
      
      if (json.url) {
        window.location.href = json.url;
      } else {
        setMessage('Could not start checkout. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setMessage('Checkout failed: ' + (err.message || 'Unknown error'));
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blush text-dark px-6">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-diamond mb-4 text-center tracking-wide">
          Dashboard
        </h1>
        
        <div className="mb-8">
          <p className="text-lg text-center mb-6">
            Welcome to Photo2Profit! Upgrade to Pro to unlock premium features.
          </p>
          
          <div className="bg-gradient-to-r from-rose-100 to-gold-light p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">Pro Features</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="text-rose-dark mr-3">✓</span>
                Unlimited photo uploads
              </li>
              <li className="flex items-center">
                <span className="text-rose-dark mr-3">✓</span>
                AI-powered background removal
              </li>
              <li className="flex items-center">
                <span className="text-rose-dark mr-3">✓</span>
                Automatic listing generation
              </li>
              <li className="flex items-center">
                <span className="text-rose-dark mr-3">✓</span>
                Cross-platform posting
              </li>
              <li className="flex items-center">
                <span className="text-rose-dark mr-3">✓</span>
                Priority support
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleUpgrade}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Upgrade to Pro 💎'}
          </button>
          
          {message && (
            <div className="mt-4 text-sm text-gray-700">
              {message}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="text-indigo-600 hover:text-indigo-700">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
