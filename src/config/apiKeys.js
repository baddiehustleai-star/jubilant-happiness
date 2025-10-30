/**
 * API Keys Configuration
 * Centralizes all API keys from environment variables
 */

const apiKeys = {
  // Firebase Configuration
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  },

  // Stripe Configuration
  stripe: {
    secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY || '',
    priceId: import.meta.env.VITE_STRIPE_PRICE_ID || '',
  },

  // External APIs
  removeBg: {
    apiKey: import.meta.env.VITE_REMOVEBG_API_KEY || '',
  },

  // eBay Configuration
  ebay: {
    appId: import.meta.env.VITE_EBAY_APP_ID || '',
    certId: import.meta.env.VITE_EBAY_CERT_ID || '',
    devId: import.meta.env.VITE_EBAY_DEV_ID || '',
    oauthToken: import.meta.env.VITE_EBAY_OAUTH_TOKEN || '',
  },

  // SendGrid Configuration
  sendGrid: {
    apiKey: import.meta.env.VITE_SENDGRID_API_KEY || '',
  },
};

export default apiKeys;
