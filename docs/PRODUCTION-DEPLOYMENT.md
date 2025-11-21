# 🚀 Photo2Profit - Complete Production Setup Guide

This guide provides step-by-step instructions to deploy Photo2Profit to production with all required services configured.

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository cloned
- Vercel account (free tier works)
- Firebase project created
- Stripe account (test mode initially)

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel CDN    │    │  Firebase Auth  │    │ Stripe Payments │
│   (Frontend)    │◄──►│   & Storage     │◄──►│   & Webhooks    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Vercel Functions│    │  Firestore DB   │    │  Remove.bg API  │
│   (Backend)     │◄──►│   (Database)    │◄──►│ (Image Process) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Step 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Project name: `photo2profit-prod`
4. Enable Google Analytics (recommended)
5. Create project

### 1.2 Enable Services

**Authentication:**

1. Go to Authentication → Sign-in method
2. Enable: Email/Password, Google, Anonymous
3. Add authorized domains (your production domain)

**Firestore Database:**

1. Go to Firestore Database
2. Create database in production mode
3. Location: `us-central1` (or closest to your users)

**Storage:**

1. Go to Storage
2. Get started in production mode
3. Same location as Firestore

### 1.3 Get Configuration Keys

**Web App Config:**

1. Project Settings → General
2. Scroll to "Your apps" → Web app
3. Copy the config object values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

**Admin SDK:**

1. Project Settings → Service accounts
2. Generate new private key
3. Download JSON file
4. Extract: `project_id`, `private_key`, `client_email`

## 💳 Step 2: Stripe Setup

### 2.1 Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Complete business verification (for live mode)
3. Start with test keys for initial setup

### 2.2 Create Products & Prices

**Pro Plan ($9.99/month):**

1. Products → Add product
2. Name: "Photo2Profit Pro"
3. Price: $9.99 recurring monthly
4. Copy the Price ID (starts with `price_`)

**Business Plan ($24.99/month):**

1. Products → Add product
2. Name: "Photo2Profit Business"
3. Price: $24.99 recurring monthly
4. Copy the Price ID

### 2.3 Get API Keys

1. Developers → API keys
2. Copy: Publishable key (`pk_test_...`)
3. Copy: Secret key (`sk_test_...`)

### 2.4 Webhook Configuration

1. Developers → Webhooks → Add endpoint
2. URL: `https://your-domain.com/api/webhooks/stripe`
3. Events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook signing secret (`whsec_...`)

## 🖼️ Step 3: Remove.bg API

1. Go to [Remove.bg API](https://www.remove.bg/api)
2. Sign up and verify email
3. Choose a plan (500 images/month = $9.99)
4. Copy your API key from dashboard

## 🌐 Step 4: Vercel Deployment

### 4.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 4.2 Link Project

```bash
vercel login
vercel link
```

### 4.3 Set Environment Variables

Run the automated setup script:

```bash
chmod +x scripts/setup-production.sh
./scripts/setup-production.sh
```

Or manually set each variable:

```bash
# Firebase (Client-side)
vercel env add VITE_FIREBASE_API_KEY "your_api_key" production
vercel env add VITE_FIREBASE_AUTH_DOMAIN "your-project.firebaseapp.com" production
vercel env add VITE_FIREBASE_PROJECT_ID "your-project-id" production
vercel env add VITE_FIREBASE_STORAGE_BUCKET "your-project.appspot.com" production
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID "123456789" production
vercel env add VITE_FIREBASE_APP_ID "1:123456789:web:abc123" production

# Firebase (Server-side)
vercel env add FIREBASE_PROJECT_ID "your-project-id" production
vercel env add FIREBASE_PRIVATE_KEY "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n" production
vercel env add FIREBASE_CLIENT_EMAIL "firebase-adminsdk-...@your-project.iam.gserviceaccount.com" production

# Stripe
vercel env add VITE_STRIPE_PUBLISHABLE_KEY "pk_test_or_live..." production
vercel env add STRIPE_SECRET_KEY "sk_test_or_live..." production
vercel env add STRIPE_WEBHOOK_SECRET "whsec_..." production
vercel env add STRIPE_PRO_PRICE_ID "price_..." production
vercel env add STRIPE_BUSINESS_PRICE_ID "price_..." production

# External APIs
vercel env add REMOVEBG_API_KEY "your_removebg_key" production

# URLs
vercel env add VERCEL_URL "https://photo2profit.online" production
```

### 4.4 Deploy

```bash
# Verify everything is ready
npm run verify:deploy

# Deploy to production
vercel --prod
```

## 🔧 Step 5: Post-Deployment Configuration

### 5.1 Domain Setup

1. In Vercel dashboard, go to your project
2. Settings → Domains
3. Add your custom domain: `photo2profit.online`
4. Configure DNS records as shown

### 5.2 Firebase Security Rules

Deploy security rules to Firestore:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and deploy rules
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

### 5.3 Update Stripe Webhooks

Update your webhook endpoint URL to production:

1. Stripe Dashboard → Developers → Webhooks
2. Edit endpoint
3. Update URL to: `https://photo2profit.online/api/webhooks/stripe`

## 🧪 Step 6: Testing

### 6.1 Automated Tests

```bash
npm run test:production
```

### 6.2 Manual Testing Checklist

- [ ] Homepage loads correctly
- [ ] User registration/login works
- [ ] Photo upload and optimization
- [ ] Stripe test payments (use test cards)
- [ ] Background removal (with Remove.bg)
- [ ] User dashboard and gallery
- [ ] Subscription management
- [ ] Mobile responsiveness

### 6.3 Stripe Test Cards

Use these for testing payments:

```
# Successful payment
4242 4242 4242 4242

# Declined payment
4000 0000 0000 0002

# Authentication required
4000 0025 0000 3155
```

## 📊 Step 7: Monitoring & Analytics

### 7.1 Vercel Analytics

1. Vercel dashboard → Analytics
2. Enable Web Analytics
3. Monitor performance metrics

### 7.2 Firebase Analytics

1. Firebase Console → Analytics
2. Enable Google Analytics integration
3. Track user engagement

### 7.3 Stripe Dashboard

1. Monitor payment metrics
2. Set up billing alerts
3. Review subscription churn

## 🚀 Step 8: Going Live

### 8.1 Switch to Live Mode

1. **Stripe**: Replace test keys with live keys
2. **Remove.bg**: Ensure production plan active
3. **Firebase**: Review security rules
4. **Environment**: Update all production variables

### 8.2 Final Checks

- [ ] All environment variables updated to live
- [ ] Webhook endpoints pointing to production
- [ ] Domain SSL certificate active
- [ ] Backup and monitoring configured
- [ ] Legal pages (Privacy, Terms) updated

## 🆘 Troubleshooting

### Common Issues

**Build Failures:**

- Check Node.js version (18+ required)
- Verify all dependencies installed
- Run `npm run verify:deploy` locally

**Authentication Errors:**

- Verify Firebase config keys
- Check authorized domains in Firebase
- Ensure API keys have correct permissions

**Payment Processing:**

- Confirm webhook URL is accessible
- Check Stripe dashboard for webhook delivery
- Verify webhook signing secret

**Image Upload Issues:**

- Check Firebase Storage rules
- Verify Remove.bg API key and credits
- Monitor file size limits (10MB max)

### Support Resources

- **Documentation**: [Photo2Profit Docs](https://docs.photo2profit.online)
- **GitHub Issues**: [Report bugs](https://github.com/baddiehustleai-star/jubilant-happiness/issues)
- **Email Support**: support@photo2profit.online

## 📈 Scaling Considerations

As your app grows, consider:

- **CDN**: Vercel Edge Network handles this automatically
- **Database**: Firebase Firestore auto-scales
- **Storage**: Firebase Storage scales with usage
- **Functions**: Vercel serverless functions auto-scale
- **Monitoring**: Add error tracking (Sentry)
- **Backups**: Set up automated Firebase backups

---

🎉 **Congratulations!** Your Photo2Profit app is now live in production.

For ongoing maintenance and updates, use the CI/CD pipeline to deploy changes safely to production.
