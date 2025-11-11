# 🛒 Photo2Profit Commerce Guide

Complete guide to Photo2Profit's e-commerce features: authentication, payments, shareable product pages, and order management.

---

## 🔐 Authentication System

### Features

- **Google OAuth 2.0** - One-click sign-in with Google
- **Email/JWT Login** - Simple email-based authentication
- **Silent Refresh** - 15-minute access tokens with 30-day refresh tokens
- **Secure Cookies** - HttpOnly cookies for refresh tokens
- **Auto-refresh** - Tokens refresh 5 minutes before expiry

### Setup Google OAuth

1. **Create OAuth Client ID:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create credentials → OAuth client ID
   - Application type: Web application
   - Authorized JavaScript origins: `https://your-domain.com`
   - Authorized redirect URIs: `https://your-domain.com/auth/google/callback`

2. **Configure Environment Variables:**

   ```bash
   # Backend (.env)
   GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_client_secret
   JWT_SECRET=your-secret-key-here

   # Frontend (.env)
   VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   VITE_API_URL=https://your-api-domain.com
   ```

3. **Test Authentication:**

   ```bash
   # Simple login
   curl -X POST http://localhost:8080/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'

   # Use the returned token
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/products
   ```

---

## 💳 Stripe Payments

### Features

- **Secure Checkout** - Stripe Checkout for PCI compliance
- **Product Pages** - Shareable URLs with buy buttons
- **Order Tracking** - Automatic order logging in Firestore
- **Email Receipts** - Beautiful HTML receipts sent automatically
- **Webhook Handling** - Verified Stripe webhooks

### Setup Stripe

1. **Get API Keys:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
   - Copy your **Publishable key** and **Secret key**

2. **Configure Webhook:**
   - Go to Developers → Webhooks
   - Add endpoint: `https://your-api.com/api/stripe-webhook`
   - Select events: `checkout.session.completed`
   - Copy the **Signing secret**

3. **Environment Variables:**

   ```bash
   STRIPE_SECRET_KEY=sk_test_your_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   FRONTEND_URL=https://your-frontend.com
   ```

4. **Test Checkout:**
   ```bash
   # Test with Stripe test card: 4242 4242 4242 4242
   # Any future date, any CVC
   ```

### Shareable Product Pages

Every product gets a public URL:

```
https://your-api.com/p/{userEmail}/{productId}
```

Features:

- ✅ Open Graph meta tags (preview on social media)
- ✅ One-click "Buy Now" button
- ✅ Responsive design
- ✅ Direct Stripe Checkout integration

---

## 📧 Email Receipts

### Setup Gmail SMTP

1. **Enable 2-Factor Authentication** on your Gmail account

2. **Create App Password:**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - 2-Step Verification → App passwords
   - Generate password for "Mail" / "Other"

3. **Configure Environment:**

   ```bash
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   ```

4. **Test Email:**
   The system automatically sends receipts after successful Stripe checkouts.

### Custom SMTP Providers

For production, consider:

- **SendGrid** - 100 emails/day free
- **Mailgun** - First 5,000 emails free
- **AWS SES** - $0.10 per 1,000 emails

Update the transporter configuration in `server.js`:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY,
  },
});
```

---

## 🤖 AI Product Features

### Background Removal

- **Service:** remove.bg API
- **Cost:** 50 free/month, then $0.20/image
- **Setup:** Get key from [remove.bg](https://remove.bg/api)
- **Env:** `REMOVE_BG_KEY=your_key_here`

### Product Analysis

- **Service:** Google Gemini 1.5 Pro Vision
- **Features:** Detects product, suggests title, keywords
- **Setup:** Get key from [AI Studio](https://aistudio.google.com/app/apikey)
- **Env:** `GEMINI_API_KEY=your_key_here`

### Price Intelligence

- **Service:** SerpAPI Google Shopping
- **Features:** Scrapes real prices from Google Shopping
- **Setup:** Get key from [SerpAPI](https://serpapi.com/)
- **Env:** `SERPAPI_KEY=your_key_here`

---

## 📦 Order Management

### Dashboard Features

- View all sales in `/orders`
- Filter by buyer email
- Track total revenue
- See order status (paid/pending)

### API Endpoints

```bash
# Get user's sales
GET /api/orders
Authorization: Bearer {token}

# Response:
[
  {
    "id": "order_123",
    "buyerEmail": "customer@example.com",
    "productName": "Vintage Camera",
    "amount": 49.99,
    "status": "paid",
    "createdAt": "2025-11-11T10:30:00Z"
  }
]
```

---

## 🚀 Deployment

### Cloud Run Deployment

```bash
# Deploy API
gcloud run deploy photo2profit-api \
  --source ./api \
  --region us-west2 \
  --allow-unauthenticated \
  --set-env-vars "JWT_SECRET=your-secret,GOOGLE_CLIENT_ID=your-id,GOOGLE_CLIENT_SECRET=your-secret,STRIPE_SECRET_KEY=sk_live_...,GEMINI_API_KEY=your-key,REMOVE_BG_KEY=your-key,SERPAPI_KEY=your-key,SMTP_USER=your-email,SMTP_PASS=your-pass,FRONTEND_URL=https://your-frontend.com"
```

### Environment Checklist

**Required:**

- ✅ `JWT_SECRET` - For authentication
- ✅ `GOOGLE_CLIENT_ID` - Google OAuth
- ✅ `GOOGLE_CLIENT_SECRET` - Google OAuth
- ✅ `STRIPE_SECRET_KEY` - Payments
- ✅ `STRIPE_WEBHOOK_SECRET` - Webhook verification

**Recommended:**

- ✅ `GEMINI_API_KEY` - AI product analysis
- ✅ `REMOVE_BG_KEY` - Background removal
- ✅ `SERPAPI_KEY` - Price intelligence
- ✅ `SMTP_USER` - Email receipts
- ✅ `SMTP_PASS` - Email receipts
- ✅ `FRONTEND_URL` - CORS and redirects

**Optional:**

- `DATABASE_URL` - Postgres (if using Prisma)
- `REDIS_URL` - BullMQ queue (if using workers)

---

## 🧪 Testing

### Test Authentication

```bash
# Login
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Save the token and use it:
TOKEN="eyJhbGc..."
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/products
```

### Test Product Upload

```bash
# Upload image (requires authentication)
curl -X POST http://localhost:8080/api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@product.jpg"
```

### Test Stripe Checkout

1. Visit a product page: `http://localhost:8080/p/user@example.com/product123`
2. Click "Buy Now"
3. Use test card: `4242 4242 4242 4242`
4. Check Cloud Run logs for order confirmation
5. Check email for receipt

---

## 🔧 Troubleshooting

### Stripe Webhook Not Working

- Verify webhook URL is accessible: `https://your-api.com/api/stripe-webhook`
- Check webhook signing secret matches env var
- View webhook attempts in Stripe Dashboard

### Email Not Sending

- Verify Gmail App Password (not regular password)
- Check 2FA is enabled on Gmail account
- View server logs for email errors
- Test SMTP connection with nodemailer test

### Google OAuth Failing

- Check redirect URI matches exactly (including trailing slash)
- Verify Client ID/Secret are correct
- Ensure OAuth consent screen is configured
- Check CORS origins include your frontend domain

### Products Not Saving

- Verify Firestore is initialized correctly
- Check PROJECT_ID matches your Firebase project
- View server logs for Firestore errors
- Ensure service account has Firestore permissions

---

## 📊 Analytics & Monitoring

### Key Metrics to Track

- Successful logins vs failures
- Product uploads per day
- Checkout conversion rate
- Average order value
- Email delivery rate

### Recommended Tools

- **Google Analytics 4** - Website traffic
- **Stripe Dashboard** - Payment metrics
- **Cloud Run Logs** - API monitoring
- **Firebase Console** - Database usage

---

## 💰 Cost Estimates

### Free Tier (Testing)

- Firebase: Free up to 1GB storage, 50K reads/day
- Cloud Run: 2M requests/month free
- Stripe: No monthly fee (2.9% + $0.30 per transaction)
- Remove.bg: 50 images/month free
- Gmail SMTP: Free for low volume

### Production (1000 users/month)

- Firebase: $25/month
- Cloud Run: $10-30/month
- Remove.bg: $50/month (250 images)
- Gemini API: ~$10/month
- SerpAPI: $50/month (5000 searches)
- SendGrid: Free (up to 100 emails/day)

**Total: ~$145-175/month** for 1000 monthly active users

---

## 🎯 Next Steps

1. **Set up all environment variables**
2. **Deploy to Cloud Run**
3. **Configure Stripe webhook**
4. **Test end-to-end flow**
5. **Enable email receipts**
6. **Monitor logs and metrics**
7. **Scale as needed**

---

## 📚 Additional Resources

- [Stripe Checkout Docs](https://stripe.com/docs/payments/checkout)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Nodemailer Guide](https://nodemailer.com/about/)

---

**Built with ❤️ by the Photo2Profit team**
