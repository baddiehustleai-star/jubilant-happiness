/* eslint-env browser */
/* global fetch */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Subscription() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        navigate('/dashboard');
        return;
      }

      // In a real app, fetch from backend API
      // For demo, we use localStorage
      const isPaid = localStorage.getItem('userPaid') === 'true';
      const createdAt = localStorage.getItem('userCreatedAt') || new Date().toISOString();

      setUser({
        email,
        paid: isPaid,
        createdAt,
      });
    }
    fetchUser();
  }, [navigate]);

  async function handleBillingPortal() {
    setLoading(true);
    setMessage('');

    try {
      const email = localStorage.getItem('userEmail');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

      const res = await fetch(`${apiUrl}/api/billing-portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage('Could not open billing portal: ' + (data.error || 'Unknown error'));
        setLoading(false);
      }
    } catch (err) {
      console.error('Billing portal error:', err);
      setMessage('Failed to open billing portal. Please try again.');
      setLoading(false);
    }
  }

  function handleUpgrade() {
    navigate('/dashboard');
  }

  function handleTogglePaidStatus() {
    // Demo feature to toggle paid status for testing
    const newPaidStatus = !user.paid;
    localStorage.setItem('userPaid', newPaidStatus.toString());
    setUser({ ...user, paid: newPaidStatus });
    setMessage(
      newPaidStatus
        ? '✅ Upgraded to Pro! (Demo mode - in production, this happens via Stripe webhook)'
        : '❌ Downgraded to Free (Demo mode)'
    );
  }

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <div className="mb-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
        >
          ← Back to Dashboard
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Subscription Details</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center py-3 border-b">
          <span className="text-gray-600">Email:</span>
          <span className="font-medium">{user.email}</span>
        </div>

        <div className="flex justify-between items-center py-3 border-b">
          <span className="text-gray-600">Status:</span>
          <span className={`font-semibold ${user.paid ? 'text-green-600' : 'text-gray-600'}`}>
            {user.paid ? '✅ Active Pro Member' : '❌ Free Plan'}
          </span>
        </div>

        {user.paid && (
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">Member since:</span>
            <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {message && (
        <div
          className={`mb-4 p-4 rounded ${
            message.includes('✅')
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-blue-50 border border-blue-200 text-blue-800'
          }`}
        >
          {message}
        </div>
      )}

      {user.paid ? (
        <div className="space-y-3">
          <button
            onClick={handleBillingPortal}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded font-semibold disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Manage Subscription with Stripe 💳'}
          </button>

          <p className="text-sm text-gray-600 text-center">
            You can update your payment method, view invoices, or cancel your subscription in the
            Stripe billing portal.
          </p>

          {/* Demo toggle button */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-gray-500 mb-2 text-center">Demo Mode Controls:</p>
            <button
              onClick={handleTogglePaidStatus}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm"
            >
              Toggle Paid Status (Demo)
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-gray-50 rounded-lg p-6 mb-4">
            <h3 className="font-semibold mb-3">Upgrade to Pro and get:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>AI Photo Enhancement & Analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Bulk Upload (up to 100 photos at once)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Advanced Analytics Dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Priority Support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Early access to new features</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleUpgrade}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-semibold"
          >
            Upgrade to Pro 💎
          </button>

          {/* Demo toggle button */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-gray-500 mb-2 text-center">Demo Mode Controls:</p>
            <button
              onClick={handleTogglePaidStatus}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm"
            >
              Toggle Paid Status (Demo)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
