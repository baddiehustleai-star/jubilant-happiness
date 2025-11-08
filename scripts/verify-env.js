#!/usr/bin/env node
/**
 * Photo2Profit Environment Variable Verification Script
 * Fails build if required env vars are missing.
 */

const required = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_API_BASE_URL',
  'VITE_STRIPE_PUBLISHABLE_KEY',
  'VITE_STRIPE_PRICE_ID_TRIAL',
  'VITE_STRIPE_PRICE_ID_PRO'
];

const optional = [
  'VITE_REMOVEBG_API_KEY',
  'VITE_OPENAI_API_KEY',
  'VITE_GEMINI_API_KEY',
  'VITE_EBAY_CLIENT_ID',
  'VITE_EBAY_CLIENT_SECRET',
  'VITE_EBAY_REDIRECT_URI'
];

let missing = [];
for (const key of required) {
  if (!process.env[key] || process.env[key].trim() === '') {
    missing.push(key);
  }
}

if (missing.length) {
  console.error('\n❌ Missing required environment variables for Photo2Profit build:\n');
  for (const m of missing) console.error('   • ' + m);
  console.error('\nAdd these in Vercel: Settings → Environment Variables, then redeploy.');
  process.exit(1);
} else {
  console.log('✅ All required environment variables are present.');
}

// Report optional ones
const missingOptional = optional.filter(k => !process.env[k]);
if (missingOptional.length) {
  console.log('\nℹ️ Optional enhancements not configured:');
  for (const o of missingOptional) console.log('   • ' + o);
  console.log('\nConfigure them later for extended AI/cross-posting features.');
}

console.log('\n💎 Photo2Profit env verification complete.');
