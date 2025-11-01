import { loadStripe } from '@stripe/stripe-js';

// Load Stripe with the publishable key from environment variables
// Note: In production, you would use VITE_STRIPE_PUBLISHABLE_KEY
// The secret key should only be used on the server side
let stripePromise;

try {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (publishableKey) {
    stripePromise = loadStripe(publishableKey);
  } else {
    console.warn('Stripe publishable key not found. Payment features will be disabled.');
  }
} catch (error) {
  console.error('Error loading Stripe:', error);
}

export { stripePromise };
