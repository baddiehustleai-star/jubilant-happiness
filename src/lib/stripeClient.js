/**
 * Stripe Products Client
 * Frontend helper to fetch Stripe products from Firestore cache
 */

export async function fetchStripeProducts() {
  const res = await fetch('/api/stripe-products');
  if (!res.ok) throw new Error('Failed to load products');
  return res.json();
}
