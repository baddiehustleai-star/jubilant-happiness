/* eslint-env browser */
/* global fetch */
// Client helper for creating a Stripe Checkout session.
// Requires a serverless endpoint at /api/create-checkout-session.

export async function createCheckout({ email, priceId, successUrl, cancelUrl }) {
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, priceId, successUrl, cancelUrl }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Checkout session creation failed');
  return json; // contains sessionId and url
}
