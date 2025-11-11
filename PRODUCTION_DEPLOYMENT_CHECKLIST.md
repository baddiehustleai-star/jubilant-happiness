# 🚀 Photo2Profit Production Deployment Checklist

## Pre-Deployment Setup

### 1. Environment Variables Configuration

Create production `.env` file with real credentials:

```bash
# Copy template
cp .env.example .env.production

# Required: Firebase Configuration
VITE_FIREBASE_API_KEY=your_real_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=photo2profit-758851214311.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=photo2profit-758851214311
VITE_FIREBASE_STORAGE_BUCKET=photo2profit-758851214311.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=758851214311
VITE_FIREBASE_APP_ID=your_real_firebase_app_id

# Required: Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Required: API Base (update after Cloud Run deployment)
VITE_API_BASE=https://photo2profit-api-uc.a.run.app

# Optional: AI/Image APIs
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_REMOVEBG_API_KEY=your_removebg_api_key

# Optional: Platform OAuth
EBAY_CLIENT_ID=your_ebay_client_id
EBAY_CLIENT_SECRET=your_ebay_client_secret
FACEBOOK_CATALOG_ID=your_facebook_catalog_id
FACEBOOK_ACCESS_TOKEN=your_facebook_token
```

### 2. Google Cloud Setup

```bash
# Set project ID
export PROJECT_ID=photo2profit-758851214311
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable \
  aiplatform.googleapis.com \
  secretmanager.googleapis.com \
  firestore.googleapis.com \
  storage.googleapis.com \
  run.googleapis.com \
  cloudbuild.googleapis.com

# Create Firestore database
gcloud alpha firestore databases create \
  --location=us-central \
  --type=firestore-native
```

### 3. Secret Manager Configuration

```bash
# Store Stripe secrets
echo -n "sk_live_YOUR_KEY" | gcloud secrets create stripe-secret-key \
  --data-file=- --replication-policy="automatic"

echo -n "whsec_YOUR_SECRET" | gcloud secrets create stripe-webhook-secret \
  --data-file=- --replication-policy="automatic"

# Store platform API credentials
echo -n "YOUR_EBAY_CLIENT_ID" | gcloud secrets create ebay-client-id \
  --data-file=- --replication-policy="automatic"

echo -n "YOUR_EBAY_SECRET" | gcloud secrets create ebay-client-secret \
  --data-file=- --replication-policy="automatic"

echo -n "YOUR_EBAY_TOKEN" | gcloud secrets create ebay-access-token \
  --data-file=- --replication-policy="automatic"

echo -n "YOUR_FB_CATALOG" | gcloud secrets create facebook-catalog-id \
  --data-file=- --replication-policy="automatic"

echo -n "YOUR_FB_TOKEN" | gcloud secrets create facebook-access-token \
  --data-file=- --replication-policy="automatic"

# Verify secrets
gcloud secrets list
```

## Deployment Steps

### 4. Deploy Backend API to Cloud Run

```bash
cd api

# Build and push container
gcloud builds submit --tag gcr.io/$PROJECT_ID/photo2profit-api

# Deploy to Cloud Run
gcloud run deploy photo2profit-api \
  --image gcr.io/$PROJECT_ID/photo2profit-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars PROJECT_ID=$PROJECT_ID \
  --max-instances 10 \
  --memory 1Gi \
  --timeout 60s

# Get API URL
API_URL=$(gcloud run services describe photo2profit-api \
  --region us-central1 \
  --format 'value(status.url)')

echo "API deployed at: $API_URL"

# Test health endpoint
curl -s $API_URL/health | jq
```

### 5. Update Frontend with API URL

```bash
cd ..

# Update .env.production with deployed API URL
echo "VITE_API_BASE=$API_URL" >> .env.production
```

### 6. Deploy Frontend to Vercel

```bash
# Install Vercel CLI if needed
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Or link and deploy
vercel link
vercel env pull .env.vercel.local
vercel --prod
```

**Alternative: Deploy to Firebase Hosting**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (if not done)
firebase init hosting

# Build
npm run build

# Deploy
firebase deploy --only hosting

# Get hosting URL
firebase hosting:sites:list
```

### 7. Configure Stripe Webhooks

```bash
# Get your frontend URL (Vercel or Firebase)
FRONTEND_URL="https://photo2profit.vercel.app"

# In Stripe Dashboard (https://dashboard.stripe.com/webhooks):
# 1. Create webhook endpoint: $API_URL/api/stripe-webhook
# 2. Select events:
#    - checkout.session.completed
#    - invoice.payment_succeeded
#    - customer.subscription.deleted
# 3. Copy webhook signing secret
# 4. Update Secret Manager:

echo -n "whsec_YOUR_WEBHOOK_SECRET" | \
  gcloud secrets versions add stripe-webhook-secret --data-file=-
```

### 8. Configure CORS for API

Update `api/server.js` CORS origins:

```javascript
app.use(
  cors({
    origin: [
      'https://photo2profit.vercel.app',
      'https://photo2profit-758851214311.web.app',
      'https://photo2profit-758851214311.firebaseapp.com',
      /^https:\/\/.*\.vercel\.app$/,
    ],
  })
);
```

Redeploy API:

```bash
cd api
gcloud builds submit --tag gcr.io/$PROJECT_ID/photo2profit-api
gcloud run deploy photo2profit-api \
  --image gcr.io/$PROJECT_ID/photo2profit-api \
  --region us-central1
```

## Post-Deployment Verification

### 9. Smoke Tests

```bash
# Test API health
curl -s $API_URL/health | jq

# Test AI analysis endpoint
curl -X POST $API_URL/api/analyze-product \
  -H 'Content-Type: application/json' \
  -d '{
    "prompt": "Vintage camera",
    "category": "electronics",
    "condition": "used"
  }' | jq

# Test frontend
curl -I https://photo2profit.vercel.app

# Test Firebase Storage rules
# Upload a test file via UI and verify access
```

### 10. End-to-End Testing

1. **Sign Up Flow**
   - Visit `https://photo2profit.vercel.app`
   - Create account with email/password
   - Verify Firebase Authentication works
   - Check Firestore user document created

2. **Photo Upload**
   - Upload a test photo
   - Verify Firebase Storage upload
   - Check Firestore photo metadata

3. **AI Listing Generation**
   - Click "Generate AI Listings"
   - Verify API call to `/api/analyze-product`
   - Check response format and quality

4. **Cross-Posting (Demo)**
   - Select platforms
   - Click "Cross-Post"
   - Verify API call to `/api/cross-post`
   - Check simulated responses

5. **Stripe Checkout**
   - Click "Upgrade to Pro"
   - Complete test payment (use Stripe test card: 4242 4242 4242 4242)
   - Verify webhook received
   - Check Firestore subscription updated

6. **Mobile/PWA**
   - Visit on mobile device
   - Install PWA
   - Test camera capture
   - Verify offline functionality

### 11. Monitoring Setup

```bash
# Enable Cloud Run logging
gcloud logging read "resource.type=cloud_run_revision \
  AND resource.labels.service_name=photo2profit-api" \
  --limit 50 \
  --format json

# Set up alerts
gcloud alpha monitoring channels create \
  --display-name="Photo2Profit Alerts" \
  --type=email \
  --channel-labels=email_address=alerts@photo2profit.app

# Monitor API performance
gcloud monitoring dashboards create \
  --config-from-file=monitoring-dashboard.json
```

### 12. Security Checklist

- [ ] Firebase Security Rules deployed (`firestore.rules`, `storage.rules`)
- [ ] API rate limiting configured
- [ ] Secrets stored in Secret Manager (not in code)
- [ ] CORS properly configured
- [ ] HTTPS enforced on all endpoints
- [ ] Service account permissions minimized
- [ ] Stripe webhook signature validation enabled
- [ ] User input validation on all endpoints
- [ ] Firebase Authentication required for protected routes

### 13. Performance Optimization

```bash
# Enable Cloud CDN for static assets
gcloud compute backend-services update photo2profit-backend \
  --enable-cdn \
  --global

# Set cache headers in vercel.json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}

# Optimize images
npm run generate-icons
```

## Production Readiness Checklist

### Critical (Must Have)

- [ ] Real Firebase credentials in `.env.production`
- [ ] Real Stripe keys (publishable + secret)
- [ ] API deployed to Cloud Run with health checks passing
- [ ] Frontend deployed to Vercel/Firebase
- [ ] Stripe webhook configured and tested
- [ ] CORS configured with production domains
- [ ] Firebase Security Rules deployed

### Important (Should Have)

- [ ] PWA icons generated and manifest updated
- [ ] Remove.bg API key for background removal
- [ ] Error monitoring (Sentry or similar)
- [ ] Analytics (Google Analytics or similar)
- [ ] Custom domain configured
- [ ] SSL certificate validated

### Nice to Have (Can Add Later)

- [ ] eBay OAuth for live cross-posting
- [ ] Facebook OAuth for direct posting
- [ ] Email notifications (SendGrid)
- [ ] Advanced analytics dashboard
- [ ] Automated backup strategy
- [ ] Multi-region deployment

## Rollback Procedures

### Rollback Frontend (Vercel)

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Rollback API (Cloud Run)

```bash
# List revisions
gcloud run revisions list --service photo2profit-api --region us-central1

# Route traffic to previous revision
gcloud run services update-traffic photo2profit-api \
  --region us-central1 \
  --to-revisions [PREVIOUS_REVISION]=100
```

## Support Contacts

- Firebase Console: https://console.firebase.google.com/
- Google Cloud Console: https://console.cloud.google.com/
- Stripe Dashboard: https://dashboard.stripe.com/
- Vercel Dashboard: https://vercel.com/dashboard

## Quick Reference Commands

```bash
# Check API status
curl -s https://photo2profit-api-uc.a.run.app/health | jq

# View API logs
gcloud run logs read photo2profit-api --region us-central1 --limit 50

# Check frontend status
curl -I https://photo2profit.vercel.app

# List secrets
gcloud secrets list

# View Firestore data
firebase firestore:indexes

# Monitor costs
gcloud billing accounts list
gcloud billing projects describe $PROJECT_ID
```

---

## 🎉 Launch Day Checklist

1. [ ] All production environment variables set
2. [ ] API deployed and health check passing
3. [ ] Frontend deployed and accessible
4. [ ] Test payment processed successfully
5. [ ] All Firebase services operational
6. [ ] Monitoring and alerts configured
7. [ ] Team notified and ready for support
8. [ ] Social media announcement prepared
9. [ ] Support email configured
10. [ ] Analytics tracking confirmed

**Estimated deployment time:** 45-60 minutes (excluding DNS propagation)

**Post-launch:** Monitor error rates, API performance, and user signups for first 24 hours.
