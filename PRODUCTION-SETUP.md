# 🚀 Photo2Profit Production Setup Guide

## 📋 Production Checklist

### ✅ 1. Firebase Configuration Setup

**Steps:**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing: "photo2profit-prod"
3. Enable Authentication → Sign-in methods:
   - ✅ Email/Password
   - ✅ Google OAuth
4. Create Firestore Database (start in production mode)
5. Enable Storage for image uploads
6. Get your config from Project Settings → General → Web apps

**Required Environment Variables for Vercel:**

```bash
# Client-side (VITE_ prefix required)
VITE_FIREBASE_API_KEY=AIza...your_api_key
VITE_FIREBASE_AUTH_DOMAIN=photo2profit-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=photo2profit-prod
VITE_FIREBASE_STORAGE_BUCKET=photo2profit-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Server-side (for admin SDK)
FIREBASE_PROJECT_ID=photo2profit-prod
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xyz@photo2profit-prod.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### ✅ 2. Stripe Configuration Setup

**Steps:**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Switch to Live mode (or keep Test mode for now)
3. Create Products & Prices:
   - **Pro Plan**: $19.99/month recurring
   - **Business Plan**: $49.99/month recurring
4. Set up Webhook endpoint: `https://your-domain.vercel.app/api/webhook`
5. Copy keys from API Keys section

**Required Environment Variables:**

```bash
# Client-side
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_... (or pk_test_...)

# Server-side
STRIPE_SECRET_KEY=sk_live_... (or sk_test_...)
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_BUSINESS_PRICE_ID=price_...
```

### ✅ 3. Remove.bg API Setup

**Steps:**

1. Go to [Remove.bg](https://www.remove.bg/api)
2. Sign up for API access
3. Choose a plan (500 images/month = $9.99)
4. Get your API key from dashboard

**Required Environment Variables:**

```bash
REMOVEBG_API_KEY=your_removebg_api_key_here
```

### ✅ 4. eBay API Setup (Optional)

**Steps:**

1. Go to [eBay Developers](https://developer.ebay.com)
2. Create application
3. Get Client ID and Secret
4. Set up OAuth redirect URLs

**Required Environment Variables:**

```bash
EBAY_CLIENT_ID=your_client_id
EBAY_CLIENT_SECRET=your_client_secret
EBAY_REDIRECT_URI=https://your-domain.vercel.app/auth/ebay/callback
```

## 🔧 Adding Environment Variables to Vercel

### Method 1: Vercel Dashboard

1. Go to: https://vercel.com/baddiehustle/jubilant-happiness/settings/environment-variables
2. Add each variable one by one
3. Set environment: Production, Preview, Development (as needed)

### Method 2: Vercel CLI

```bash
# Add variables via CLI
vercel env add VITE_FIREBASE_API_KEY production
vercel env add STRIPE_SECRET_KEY production
# ... continue for each variable
```

## 🧪 Testing Checklist

### Authentication Testing:

- [ ] Email/password signup works
- [ ] Email/password signin works
- [ ] Google OAuth works
- [ ] Password reset works
- [ ] User profile creation in Firestore
- [ ] Protected routes redirect properly

### Payment Testing:

- [ ] Stripe checkout session creates
- [ ] Payment processing works
- [ ] Webhook receives subscription events
- [ ] User subscription updates in Firestore
- [ ] Feature gating works by plan
- [ ] Customer portal access works

### API Integration Testing:

- [ ] Remove.bg background removal works
- [ ] Image upload to Firebase Storage works
- [ ] eBay listing creation works (if enabled)
- [ ] Usage tracking updates properly

## 🚨 Security Checklist

- [ ] Firebase Security Rules configured
- [ ] Stripe webhook signature verification enabled
- [ ] API rate limiting implemented
- [ ] CORS properly configured
- [ ] Environment variables secured (no client secrets)
- [ ] Error logging set up (Sentry recommended)

## 📊 Monitoring Setup

- [ ] Firebase Analytics enabled
- [ ] Stripe webhook monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] User behavior analytics

Ready to deploy? Let's go through each step! 🚀
