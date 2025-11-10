import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useState, useEffect } from 'react';

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [daily, setDaily] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const base = import.meta.env.VITE_API_URL || '';
      const [sumRes, dailyRes] = await Promise.all([
        fetch(`${base}/api/analytics-summary`),
        fetch(`${base}/api/analytics-daily`),
      ]);
      const [sumData, dailyData] = await Promise.all([
        sumRes.json(),
        dailyRes.json(),
      ]);
      setSummary(sumData);
      setDaily(dailyData);
    }
    fetchData();
  }, []);

  if (!summary) return <p className="p-6">Loading analytics...</p>;

  return (
    <div className="min-h-screen bg-blush p-6">
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
        <div className="flex items-center mb-4">
          <button
            onClick={() => window.location.reload()}
            className="mr-4 text-rose-dark hover:text-rose-darker"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-semibold">Revenue Analytics Dashboard</h2>
        </div>
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold">${summary.totalRevenue}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 text-sm">Paying Users</p>
            <p className="text-2xl font-bold">{summary.payingUsers}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 text-sm">Transactions</p>
            <p className="text-2xl font-bold">{summary.transactions}</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2">Revenue Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={daily}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
