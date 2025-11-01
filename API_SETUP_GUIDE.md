# 🔌 API Configuration Guide - Photo2Profit

This guide helps you configure all the external APIs needed for Photo2Profit's full functionality.

## 🎯 Required APIs for Full Functionality

### 1. 🔥 Firebase (Required)
**Purpose**: Authentication, Database, Storage, Hosting
**Status**: ✅ Already configured

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=photo2profit-ai.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=photo2profit-ai
VITE_FIREBASE_STORAGE_BUCKET=photo2profit-ai.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 2. 💳 Stripe (Required for Payments)
**Purpose**: Subscription billing ($1 trial → $14.99/month)
**Setup**: [Stripe Dashboard](https://dashboard.stripe.com/)

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PRICE_ID_TRIAL=price_your_trial_price_id
STRIPE_PRICE_ID_PRO=price_your_pro_price_id
```

**Stripe Setup Steps:**
1. Create Stripe account
2. Create products: "Trial" ($1) and "Pro" ($14.99/month)
3. Copy price IDs and API keys

### 3. 🤖 AI Services (Choose One)

#### Option A: OpenAI GPT-4 Vision (Recommended)
**Purpose**: AI listing generation from photos
**Cost**: ~$0.01-0.03 per image analysis
**Setup**: [OpenAI API](https://platform.openai.com/api-keys)

```env
VITE_OPENAI_API_KEY=sk-your_openai_api_key
```

#### Option B: Google Gemini (Alternative)
**Purpose**: AI listing generation from photos  
**Cost**: Free tier available
**Setup**: [Google AI Studio](https://makersuite.google.com/app/apikey)

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. 🖼️ Background Removal (Optional)
**Purpose**: Remove backgrounds from product photos
**Service**: remove.bg
**Cost**: Free tier: 50 images/month, then $0.20/image
**Setup**: [remove.bg API](https://www.remove.bg/api)

```env
VITE_REMOVEBG_API_KEY=your_removebg_api_key
```

### 5. 🛒 eBay Integration (Optional)
**Purpose**: Automatic listing to eBay
**Setup**: [eBay Developers](https://developer.ebay.com/)

```env
VITE_EBAY_APP_ID=your_ebay_app_id
VITE_EBAY_CERT_ID=your_ebay_cert_id
VITE_EBAY_DEV_ID=your_ebay_dev_id
VITE_EBAY_OAUTH_TOKEN=your_ebay_oauth_token
```

**eBay Setup Steps:**
1. Create eBay Developer account
2. Create application
3. Generate sandbox/production keys
4. Set up OAuth for user authentication

### 6. 📧 SendGrid (Optional)
**Purpose**: Weekly export emails and notifications
**Cost**: Free tier: 100 emails/day
**Setup**: [SendGrid](https://sendgrid.com/)

```env
SENDGRID_API_KEY=SG.your_sendgrid_api_key
```

## 🚀 Quick Setup Priority

### Phase 1: MVP Launch (Required)
1. ✅ **Firebase** - Already configured
2. ✅ **Stripe** - For payments and subscriptions

### Phase 2: Enhanced Features (Recommended)
3. **OpenAI or Gemini** - AI listing generation
4. **remove.bg** - Background removal

### Phase 3: Automation (Advanced)
5. **eBay API** - Direct listing automation
6. **SendGrid** - Email notifications

## 🔧 API Service Status

Your application will gracefully handle missing APIs:

- **No AI API**: Falls back to manual listing creation
- **No remove.bg**: Users upload photos as-is
- **No eBay API**: CSV export for manual upload
- **No SendGrid**: No email notifications

## 💰 Cost Estimation (Monthly)

### Minimal Setup (Firebase + Stripe)
- **Firebase**: Free tier covers ~25K reads/writes
- **Stripe**: 2.9% + $0.30 per transaction
- **Total**: ~$0-5/month for starter usage

### Full AI Setup
- **OpenAI**: ~$10-30/month (depending on usage)
- **remove.bg**: ~$10-40/month (depending on usage)
- **Total**: ~$25-80/month for full features

### Business Scale
- **Firebase**: ~$25-100/month (higher usage)
- **AI Services**: ~$100-300/month
- **Total**: ~$150-500/month (thousands of users)

## 🔐 API Security Best Practices

1. **Environment Variables**: Never commit API keys to Git
2. **Key Rotation**: Regularly rotate API keys
3. **Rate Limiting**: Implement usage limits
4. **Error Handling**: Graceful fallbacks for API failures
5. **Monitoring**: Track API usage and costs

## 🧪 Testing APIs

### Test OpenAI Integration
```bash
# In browser console (with API key configured)
import { listingGeneratorService } from './src/services/listingGenerator';
const result = await listingGeneratorService.generateMockListing();
console.log(result);
```

### Test Background Removal
```bash
# Upload test image in app and check console for processing logs
```

### Test Stripe
```bash
# Use test card: 4242 4242 4242 4242 in checkout
```

## 📞 API Support Resources

- **Firebase**: [Firebase Support](https://firebase.google.com/support)
- **Stripe**: [Stripe Docs](https://stripe.com/docs)
- **OpenAI**: [OpenAI Help](https://help.openai.com/)
- **remove.bg**: [remove.bg Support](https://www.remove.bg/support)
- **eBay**: [eBay Developer Program](https://developer.ebay.com/support)

## 🎯 Next Steps

1. **Start with Firebase + Stripe** for basic functionality
2. **Add AI services** for enhanced user experience  
3. **Add automation** for advanced features
4. **Monitor usage** and optimize costs

Your app is designed to work at any level of API integration! 🚀