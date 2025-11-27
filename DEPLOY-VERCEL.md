# 🚀 Vercel Deployment Guide for Photo2Profit

## Quick Deploy Steps:

### 1. Deploy to Vercel

```bash
vercel --prod
```

### 2. Set Environment Variables in Vercel Dashboard

After deployment, go to your Vercel dashboard and add these environment variables:

#### **Frontend Variables (VITE\_)**

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

#### **Backend/API Variables**

```
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PRO_PRICE_ID=price_your_pro_plan_id
STRIPE_BUSINESS_PRICE_ID=price_your_business_plan_id
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
REMOVEBG_API_KEY=your_removebg_key
EBAY_CLIENT_ID=your_ebay_client_id
EBAY_CLIENT_SECRET=your_ebay_secret
```

### 3. Redeploy After Adding Variables

```bash
vercel --prod
```

## 🔗 Your App Will Be Available At:

- **Production URL**: `https://your-app-name.vercel.app`
- **API Endpoints**: `https://your-app-name.vercel.app/api/*`

## 🎯 Post-Deployment Setup:

1. **Test authentication** with Firebase
2. **Configure Stripe webhooks** to point to your Vercel URL
3. **Test payment flow** with Stripe test cards
4. **Verify external APIs** (Remove.bg, eBay) are working

Ready to deploy! 🚀
