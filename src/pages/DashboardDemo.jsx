/* eslint-env browser */
/* global setTimeout */
import { useState, useEffect } from 'react';
import { createCheckout } from '../lib/stripe';

// Mock data for development demo
const MOCK_USERS = {
  'paid@example.com': { id: 1, email: 'paid@example.com', paid: true },
  'free@example.com': { id: 2, email: 'free@example.com', paid: false },
};

export default function DashboardDemo() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('paid@example.com');

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        setError(null);
        
        // Use mock data for demo
        const mockUser = MOCK_USERS[selectedEmail];
        if (mockUser) {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));
          setUser(mockUser);
        } else {
          throw new Error('User not found');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [selectedEmail]);

  async function handleUpgrade() {
    try {
      setMessage('Redirecting to checkout...');
      const priceId = import.meta.env.VITE_STRIPE_PRICE_ID || 'price_XXXXXXXXXXXX';
      const successUrl = window.location.origin + '/';
      const cancelUrl = window.location.origin + '/';
      
      const json = await createCheckout({ priceId, successUrl, cancelUrl });
      if (json.url) {
        window.location.href = json.url;
      } else {
        setMessage('Could not start checkout. Please configure Stripe settings.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setMessage('Checkout failed. Please try again later.');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blush">
        <div className="text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blush">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-2xl font-semibold mb-4 text-rose-dark">Error</h2>
          <p className="mb-4">{error}</p>
          <p className="text-sm text-gray-600">
            Note: This requires a database connection. Make sure DATABASE_URL is configured.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blush px-6">
      {/* Demo switcher */}
      <div className="mb-4 bg-yellow-100 border border-yellow-400 rounded-lg p-3 max-w-md">
        <p className="text-sm font-semibold mb-2">🎭 Demo Mode - Switch User:</p>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded text-sm ${
              selectedEmail === 'paid@example.com'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setSelectedEmail('paid@example.com')}
          >
            Paid User
          </button>
          <button
            className={`px-3 py-1 rounded text-sm ${
              selectedEmail === 'free@example.com'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setSelectedEmail('free@example.com')}
          >
            Free User
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-diamond mb-6 text-center">Dashboard</h1>
        
        {user && (
          <div className="space-y-4">
            <div className="border-b pb-4">
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="text-lg font-semibold">{user.email}</p>
            </div>
            
            <div className="border-b pb-4">
              <p className="text-sm text-gray-600 mb-1">Account Status</p>
              <div className="flex items-center gap-2">
                {user.paid ? (
                  <span className="text-lg font-semibold text-green-600">✅ Paid Member</span>
                ) : (
                  <span className="text-lg font-semibold text-gray-600">❌ Free User</span>
                )}
              </div>
            </div>

            {!user.paid && (
              <div className="pt-4">
                <button
                  className="cta w-full"
                  onClick={handleUpgrade}
                >
                  Upgrade to Pro
                </button>
                {message && (
                  <p className="mt-2 text-sm text-center text-gray-600">{message}</p>
                )}
              </div>
            )}

            {user.paid && (
              <div className="pt-4 text-center">
                <p className="text-sm text-green-600">
                  🎉 You have full access to all features!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
