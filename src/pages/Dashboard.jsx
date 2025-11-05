import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/photo2profit-logo.svg';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  }

  async function handleSubscribe() {
    // In a real app, you would create a Checkout Session on your backend
    // and redirect the user to Stripe Checkout
    console.log('Stripe integration: Navigate to checkout (backend implementation required)');
  }

  return (
    <main className="min-h-screen bg-blush">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Photo2Profit Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-diamond text-dark">
              PHOTO<span className="text-rose-dark">2</span>PROFIT
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Log Out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-diamond mb-4 text-dark">
            Welcome, {currentUser?.email}!
          </h2>
          <p className="text-gray-600 mb-4">
            You&apos;re logged in and ready to start turning your photos into profit.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h3 className="text-2xl font-diamond mb-4 text-dark">Free Trial</h3>
            <p className="text-gray-600 mb-4">
              Try Photo2Profit for $1 and see how easy it is to create professional listings.
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li>✓ AI-powered product descriptions</li>
              <li>✓ Background removal</li>
              <li>✓ Cross-post to multiple platforms</li>
              <li>✓ 7-day trial period</li>
            </ul>
            <button onClick={handleSubscribe} className="w-full cta">
              Start $1 Trial
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <h3 className="text-2xl font-diamond mb-4 text-dark">Pro Plan</h3>
            <p className="text-3xl font-bold text-rose mb-4">
              $9.99<span className="text-lg text-gray-600">/month</span>
            </p>
            <p className="text-gray-600 mb-4">
              Everything in Free Trial, plus:
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li>✓ Unlimited listings</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Priority support</li>
              <li>✓ Custom branding</li>
            </ul>
            <button onClick={handleSubscribe} className="w-full cta">
              Subscribe Now
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-xl p-8">
          <h3 className="text-2xl font-diamond mb-4 text-dark">Your Dashboard</h3>
          <p className="text-gray-600">
            Upload photos, create listings, and manage your products here. 
            (Full dashboard features coming soon!)
          </p>
        </div>
      </div>
    </main>
  );
}
