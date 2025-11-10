/* eslint-env browser */
/* global fetch, localStorage */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        setLoading(false);
        return;
      }

      // In a real app, fetch user data from backend
      // For demo purposes, we'll use localStorage
      const isPaid = localStorage.getItem('userPaid') === 'true';
      setUser({
        email,
        paid: isPaid,
        createdAt: localStorage.getItem('userCreatedAt') || new Date().toISOString(),
      });
      setLoading(false);
    }
    loadUser();
  }, []);

  async function handleUpgrade() {
    setLoading(true);
    setMessage('Redirecting to checkout...');

    try {
      const email = localStorage.getItem('userEmail');
      const priceId = import.meta.env.VITE_STRIPE_PRICE_ID || 'price_XXXXXXXXXXXX';
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const successUrl = window.location.origin + '/dashboard?upgraded=true';
      const cancelUrl = window.location.origin + '/dashboard';

      const res = await fetch(`${apiUrl}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, successUrl, cancelUrl, email }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage('Could not start checkout: ' + (data.error || 'Unknown error'));
        setLoading(false);
      }
    } catch (err) {
      console.error('Upgrade error:', err);
      setMessage('Failed to start checkout. Please try again.');
      setLoading(false);
    }
  }

  async function handlePremiumAction(action) {
    setLoading(true);
    setMessage(`Processing ${action}...`);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const email = localStorage.getItem('userEmail');

      const res = await fetch(`${apiUrl}/api/v2/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: 'https://example.com/sample-photo.jpg',
          email,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ ${action} completed! ${JSON.stringify(data, null, 2)}`);
      } else {
        setMessage(`❌ Error: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Premium action error:', err);
      setMessage(`❌ Failed to ${action}`);
    } finally {
      setLoading(false);
    }
  }

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-diamond mb-2">Dashboard</h1>
        {user ? (
          <div className="flex items-center gap-4">
            <p className="text-gray-700">
              <strong>Email:</strong> {user.email}
            </p>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                user.paid
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {user.paid ? '✅ Pro Member' : 'Free Plan'}
            </span>
            <button
              onClick={() => navigate('/subscription')}
              className="text-indigo-600 hover:text-indigo-800 text-sm underline"
            >
              Manage Subscription
            </button>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
            <p className="text-yellow-800 mb-2">
              You're not signed in. Please enter your email to continue:
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 border rounded"
                id="email-input"
              />
              <button
                onClick={() => {
                  const email = document.getElementById('email-input').value;
                  if (email) {
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('userCreatedAt', new Date().toISOString());
                    window.location.reload();
                  }
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>

      {message && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <pre className="text-sm whitespace-pre-wrap">{message}</pre>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Tools Section */}
        <div className="border rounded-lg p-6 bg-white shadow">
          <h3 className="text-lg font-semibold mb-4">Basic Tools</h3>
          <div className="space-y-3">
            <button
              className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              onClick={() => navigate('/upload')}
            >
              📸 Upload Photos
            </button>
            <button className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
              📋 View Listings
            </button>
            <button className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
              📊 Basic Stats
            </button>
          </div>
        </div>

        {/* Premium Tools Section */}
        <div className="border rounded-lg p-6 bg-white shadow">
          {user?.paid ? (
            <>
              <h3 className="text-lg font-semibold mb-4 text-indigo-600">💎 Pro Tools</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handlePremiumAction('ai-enhance')}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  ✨ AI Photo Enhancer
                </button>
                <button
                  onClick={() => handlePremiumAction('analyze-photo')}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  🔍 AI Photo Analyzer
                </button>
                <button
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  📦 Bulk Upload
                </button>
                <button
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  📈 Advanced Analytics
                </button>
              </div>
            </>
          ) : (
            <div className="bg-gray-50 rounded-md p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">🔒 Pro Features Locked</h3>
              <p className="text-gray-700 mb-4">
                Upgrade to unlock premium tools like AI enhancements, bulk uploads, and advanced
                analytics.
              </p>
              <ul className="text-left text-sm text-gray-600 mb-4 space-y-1">
                <li>✨ AI Photo Enhancement</li>
                <li>🔍 AI Quality Analysis</li>
                <li>📦 Bulk Photo Upload</li>
                <li>📈 Advanced Analytics Dashboard</li>
                <li>🎯 Priority Support</li>
              </ul>
              <button
                onClick={handleUpgrade}
                disabled={loading || !user}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Upgrade to Pro 💎'}
              </button>
              {!user && (
                <p className="text-xs text-gray-500 mt-2">Sign in first to upgrade</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
