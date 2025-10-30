/**
 * API Keys Configuration
 * Centralizes all API keys from environment variables
 *
 * Note: Only client-safe keys should be prefixed with VITE_ and exposed to the frontend.
 * Server-only keys (like Stripe secret key and SendGrid API key) should NOT have the VITE_ prefix
 * and should only be used in server-side code (e.g., Firebase Functions, backend APIs).
 */

const apiKeys = {
  // Firebase Configuration (client-safe)
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  },

  // Stripe Configuration (client-safe - publishable key only)
  // Note: Stripe secret key should NEVER be exposed to the frontend
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    priceId: import.meta.env.VITE_STRIPE_PRICE_ID || '',
  },

  // External APIs (client-safe)
  removeBg: {
    apiKey: import.meta.env.VITE_REMOVEBG_API_KEY || '',
  },

  // eBay Configuration (client-safe)
  ebay: {
    appId: import.meta.env.VITE_EBAY_APP_ID || '',
    certId: import.meta.env.VITE_EBAY_CERT_ID || '',
    devId: import.meta.env.VITE_EBAY_DEV_ID || '',
    oauthToken: import.meta.env.VITE_EBAY_OAUTH_TOKEN || '',
  },
};

export default apiKeys;
