/* eslint-env browser */
/* global fetch, localStorage */
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        // Get email from localStorage (you can adjust this based on your auth implementation)
        const email = localStorage.getItem('userEmail');
        if (!email) {
          setError('No user email found. Please sign in.');
          setLoading(false);
          return;
        }

        const apiUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiUrl}/api/users?email=${encodeURIComponent(email)}`);
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch user data');
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blush">
        <div className="text-center">
          <p className="text-lg text-dark">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blush">
        <div className="text-center max-w-md p-6">
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <button
            className="cta"
            onClick={() => window.location.href = '/'}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-blush text-dark px-6">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-diamond mb-6 text-center tracking-wide">
          Dashboard
        </h1>

        {user && (
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-semibold">{user.email}</p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <p className="text-sm text-gray-600">Account Status</p>
              <p className="text-lg font-semibold">
                {user.paid ? (
                  <span className="text-green-600">✅ Paid Member</span>
                ) : (
                  <span className="text-gray-600">❌ Free User</span>
                )}
              </p>
            </div>

            {!user.paid && (
              <div className="mt-6 p-4 bg-rose-50 rounded-lg">
                <p className="text-sm text-rose-800 mb-3">
                  Upgrade to unlock premium features!
                </p>
                <button
                  className="cta bg-rose-600 hover:bg-rose-700"
                  onClick={() => {
                    // Navigate to upgrade page or trigger checkout
                    window.location.href = '/';
                  }}
                >
                  Upgrade to Pro
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            className="text-rose-600 hover:text-rose-700 underline"
            onClick={() => window.location.href = '/'}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}
