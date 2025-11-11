// src/pages/Orders.jsx
import React, { useEffect, useState } from 'react';
import {
  BrandContainer,
  BrandCard,
  BrandHeading,
  BrandText,
  BrandSpinner,
} from '../components/branding';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view orders');
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('Fetch orders error:', err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <BrandContainer>
        <div className="flex justify-center items-center min-h-screen">
          <BrandSpinner size="large" />
        </div>
      </BrandContainer>
    );
  }

  return (
    <BrandContainer>
      <div className="max-w-6xl mx-auto py-8">
        <BrandHeading className="mb-6">Your Sales</BrandHeading>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <BrandCard>
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <BrandHeading size="small" className="mb-2">
                No orders yet
              </BrandHeading>
              <BrandText>When customers purchase your products, they'll appear here.</BrandText>
            </div>
          </BrandCard>
        ) : (
          <BrandCard>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="pb-3 font-semibold text-gray-700">Buyer</th>
                    <th className="pb-3 font-semibold text-gray-700">Product</th>
                    <th className="pb-3 font-semibold text-gray-700">Amount</th>
                    <th className="pb-3 font-semibold text-gray-700">Date</th>
                    <th className="pb-3 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-4 text-gray-900">{order.buyerEmail}</td>
                      <td className="py-4 text-gray-700">{order.productName || order.productId}</td>
                      <td className="py-4 font-semibold text-green-600">
                        ${order.amount?.toFixed(2)}
                      </td>
                      <td className="py-4 text-gray-600 text-sm">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <BrandText>Total Sales</BrandText>
                <span className="text-2xl font-bold text-green-600">
                  ${orders.reduce((sum, o) => sum + (o.amount || 0), 0).toFixed(2)}
                </span>
              </div>
            </div>
          </BrandCard>
        )}
      </div>
    </BrandContainer>
  );
}
