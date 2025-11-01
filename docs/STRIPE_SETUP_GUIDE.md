# 💳 Stripe Setup Guide for Photo2Profit

## 🚀 Current Status

### ✅ **What's Already Set Up**
- **Frontend Integration**: Stripe.js installed and payment service using Firebase callable functions
- **Firebase Functions**: Server-side Stripe operations configured with v2 callable functions
- **Webhook Handlers**: Subscription and payment event processing
- **Database Schema**: Firestore collections for subscriptions and payments
- **Environment Variables**: Template ready for your Stripe keys
- **API Integration**: Frontend properly integrated with Firebase callable functions (fixed)

### ❌ **What You Need to Complete**
1. **Create Stripe Account** and get API keys
2. **Create Products & Prices** in Stripe Dashboard
3. **Configure Webhooks** for payment events
4. **Set Environment Variables** with your keys
5. **Deploy Firebase Functions** to handle server-side operations

---

## 📋 Step-by-Step Setup

### 1. Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete business verification (required for live payments)
3. Navigate to the Dashboard

### 2. Get Your API Keys
1. In Stripe Dashboard, go to **Developers > API Keys**
2. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)
3. Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 3. Create Products & Pricing
```bash
# In Stripe Dashboard, go to Products > Add Product

# Product 1: Trial Plan
Name: Photo2Profit Trial
Description: $1 trial for 1 month, then $14.99/month
Price: $1.00 USD (Recurring: Monthly)
# Copy the Price ID (starts with price_)

# Product 2: Pro Plan  
Name: Photo2Profit Pro
Description: Full access to all features
Price: $14.99 USD (Recurring: Monthly)
# Copy the Price ID (starts with price_)
```

### 4. Configure Webhooks
1. Go to **Developers > Webhooks** in Stripe Dashboard
2. Click **Add Endpoint**
3. **Endpoint URL**: `https://your-project-id-default-rtdb.firebaseapp.com/stripeWebhook`
4. **Events to Listen For**:
   - `customer.subscription.created`
   - `customer.subscription.updated` 
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Webhook Signing Secret** (starts with `whsec_`)

### 5. Set Environment Variables

Create `.env` file in your project root:
```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PRICE_ID_TRIAL=price_your_trial_price_id_here
STRIPE_PRICE_ID_PRO=price_your_pro_price_id_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 6. Configure Firebase Functions Environment
```bash
# Set Stripe keys for Firebase Functions
firebase functions:config:set stripe.secret_key="sk_test_your_secret_key"
firebase functions:config:set stripe.webhook_secret="whsec_your_webhook_secret"
firebase functions:config:set stripe.price_id_trial="price_your_trial_id"
firebase functions:config:set stripe.price_id_pro="price_your_pro_id"
```

### 7. Deploy Firebase Functions
```bash
# Install function dependencies
cd functions
npm install

# Deploy functions
cd ..
firebase deploy --only functions
```

---

## 🧪 Testing Your Integration

### Test with Stripe Test Cards
```javascript
// Use these test card numbers in Stripe Checkout:

// Successful payment
4242424242424242

// Requires authentication (3D Secure)
4000002500003155

// Declined payment
4000000000000002
```

### Test Subscription Flow
1. **Start Trial**: User pays $1, gets trial access
2. **Upgrade to Pro**: User pays $14.99/month 
3. **Cancel Subscription**: Access continues until period end
4. **Payment Failure**: User gets notified, access restricted

### Monitor in Stripe Dashboard
- **Payments**: See all transactions
- **Subscriptions**: Monitor active/canceled subscriptions
- **Customers**: View customer details and history
- **Webhooks**: Check webhook delivery status

---

## 📊 How Your Billing Works

### Pricing Structure
```
Trial Plan: $1/month for first month
├── 10 photo uploads
├── 5 background removals  
├── Basic AI features
└── Standard support

Pro Plan: $14.99/month ongoing
├── Unlimited uploads
├── 100 background removals
├── Advanced AI features
├── Priority support
└── Advanced analytics
```

### Revenue Flow
1. **User Signs Up**: Creates account (free)
2. **Starts Trial**: Pays $1 via Stripe Checkout
3. **Trial Period**: 30 days of limited access
4. **Auto-Upgrade**: Automatically charges $14.99 monthly
5. **Cancellation**: Access continues until period end

### Usage Tracking
- **Frontend**: Tracks user actions and API calls
- **Firebase**: Stores usage data in Firestore
- **Billing**: Usage resets each billing cycle
- **Limits**: Enforced based on subscription tier

---

## 🔧 Integration Points

### Frontend (React)
```javascript
import { paymentService } from './services/payment';

// Start trial subscription
await paymentService.subscribeToTrial(userId, userEmail);

// Upgrade to pro
await paymentService.subscribeToPro(userId, userEmail);

// Open customer portal
await paymentService.createCustomerPortalSession(customerId);

// Note: The payment service now uses Firebase callable functions
// via httpsCallable() instead of REST API endpoints
```

### Backend (Firebase Functions)
- **`createCheckoutSession`**: Creates Stripe checkout (callable function)
- **`createPortalSession`**: Customer billing portal (callable function)
- **`stripeWebhook`**: Handles subscription events (HTTP endpoint)
- **`getUserSubscription`**: Gets current subscription status (callable function)
- **`cancelSubscription`**: Cancel user subscription (callable function)

### Database (Firestore)
```javascript
// User document includes:
{
  subscriptionStatus: 'active' | 'trialing' | 'canceled',
  subscriptionPlan: 'trial' | 'pro',
  stripeCustomerId: 'cus_...',
  stripeSubscriptionId: 'sub_...',
  currentPeriodEnd: timestamp,
  cancelAtPeriodEnd: boolean
}
```

---

## 🚨 Important Security Notes

### Environment Variables
- **Never commit `.env` files** to version control
- **Use different keys** for development and production
- **Rotate keys** if they're ever compromised

### Webhook Security
- **Always verify webhook signatures** (already implemented)
- **Use HTTPS endpoints** for webhook URLs
- **Monitor webhook delivery** in Stripe Dashboard

### Customer Data
- **Store minimal data** - Stripe handles payment details
- **Use Stripe Customer IDs** to reference customers
- **Implement proper access controls** in Firestore rules

---

## 🎯 Next Steps After Setup

### 1. Test Everything
- [ ] Create test subscription
- [ ] Test payment flow end-to-end
- [ ] Verify webhook delivery
- [ ] Check Firestore data updates

### 2. Go Live
- [ ] Switch to live Stripe keys
- [ ] Update webhook endpoint to production URL
- [ ] Test with real payment methods
- [ ] Monitor for errors

### 3. Monitor & Optimize
- [ ] Set up Stripe alerts for failed payments
- [ ] Monitor subscription metrics
- [ ] Track revenue and churn
- [ ] Optimize pricing based on usage

---

## 💡 Revenue Optimization Tips

### Pricing Strategy
- **$1 trial removes friction** - low commitment barrier
- **$14.99 pro plan** - positioned for serious resellers
- **Annual plans** - offer discount for yearly payment
- **Enterprise tier** - for high-volume users

### Conversion Optimization
- **Clear value proposition** - show ROI calculations
- **Usage notifications** - alert users approaching limits
- **Upgrade prompts** - strategic placement in UI
- **Free value** - provide some features without subscription

### Retention Strategies
- **Onboarding flow** - ensure users see value quickly
- **Regular engagement** - email tips and success stories
- **Feature updates** - continuously add value
- **Customer support** - responsive help increases retention

---

## 📞 Support & Troubleshooting

### Common Issues
1. **Webhook not receiving events**: Check endpoint URL and events selected
2. **Payment fails but user not updated**: Verify webhook signature validation
3. **Subscription status incorrect**: Check Firestore security rules
4. **Functions timing out**: Monitor function logs in Firebase Console

### Stripe Dashboard Monitoring
- **Failed payments**: Set up alerts for declined cards
- **Disputed charges**: Monitor chargeback rates
- **Revenue reports**: Track MRR, churn, and growth
- **Customer insights**: Analyze usage patterns

### Debug Tools
- **Stripe CLI**: Test webhooks locally
- **Firebase Console**: Monitor function logs
- **Network tab**: Check API request/response
- **Firestore Console**: Verify data updates

---

**🎉 Your Stripe integration is ready! Follow this guide to complete the setup and start processing payments.**