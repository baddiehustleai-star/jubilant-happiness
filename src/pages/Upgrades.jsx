import { useEffect, useState } from 'react';
import { fetchStripeProducts } from '../lib/stripeClient.js';

export default function Upgrades() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStripeProducts()
      .then(setProducts)
      .catch((err) => console.error('Failed to load products:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-600">Loading premium options...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Premium Upgrades</h1>
        <p className="text-gray-600">No premium products available at this time.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
        Premium Upgrades
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Unlock powerful features and grow your business faster
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="border border-gray-200 rounded-xl shadow-sm p-6 bg-white hover:shadow-lg transition-shadow duration-200"
          >
            {/* Product Image */}
            {p.images?.[0] && (
              <img
                src={p.images[0]}
                alt={p.name}
                className="mx-auto mb-4 w-32 h-32 object-cover rounded-lg"
              />
            )}

            {/* Product Name */}
            <h2 className="text-xl font-semibold mb-2 text-center text-gray-900">{p.name}</h2>

            {/* Product Description */}
            <p className="text-gray-600 mb-6 text-center text-sm leading-relaxed">
              {p.description}
            </p>

            {/* Price Options */}
            <div className="space-y-2">
              {p.prices?.map((price) => (
                <button
                  key={price.id}
                  className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg font-medium hover:from-rose-600 hover:to-rose-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  onClick={async () => {
                    try {
                      const body = {
                        priceId: price.id,
                        successUrl: window.location.origin + '/dashboard',
                        cancelUrl: window.location.href,
                      };
                      const res = await fetch('/api/create-checkout-session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body),
                      });
                      const data = await res.json();
                      if (data.url) {
                        window.location.href = data.url;
                      } else {
                        console.error('No checkout URL received');
                      }
                    } catch (err) {
                      console.error('Checkout error:', err);
                    }
                  }}
                >
                  {price.recurring
                    ? `$${(price.amount / 100).toFixed(2)}/month`
                    : `$${(price.amount / 100).toFixed(2)} one-time`}
                </button>
              ))}
            </div>

            {/* Trust Badge */}
            <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Secure checkout powered by Stripe
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>All purchases are securely processed through Stripe.</p>
        <p className="mt-1">Premium features activate instantly after payment.</p>
      </div>
    </div>
  );
}
