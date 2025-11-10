import { useState, useEffect } from 'react';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/api/v2/analytics/summary`);
        if (!res.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err.message);
      }
    }
    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">Error</h2>
        <p>Could not load analytics: {error}</p>
      </div>
    );
  }

  if (!stats) {
    return <p className="p-6 text-center">Loading analytics...</p>;
  }

  return (
    <div className="min-h-screen bg-blush p-6">
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-diamond font-semibold mb-4">Revenue Analytics</h2>
        <div className="space-y-3">
          <p>
            <strong>Total Revenue:</strong> ${stats.totalRevenue}
          </p>
          <p>
            <strong>Paying Users:</strong> {stats.payingUsers}
          </p>
          <p>
            <strong>Total Transactions:</strong> {stats.transactions}
          </p>
        </div>
        <div className="mt-6">
          <a href="/" className="text-rose-dark hover:underline">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
