# 🚀 Final Deployment Checklist - Quick Guide

This guide provides step-by-step instructions for deploying Photo2Profit to production and verifying all functionality.

## 📋 Overview

The final deployment checklist ensures:
1. ✅ Environment variables are properly configured
2. ✅ API is deployed to Cloud Run and accessible
3. ✅ SEO refresh endpoint is functional
4. ✅ Product pages load correctly
5. ✅ All critical endpoints are responding

## 🛠️ Prerequisites

Before running the deployment checklist:

- [ ] Google Cloud CLI (`gcloud`) installed
- [ ] Node.js 18+ installed
- [ ] Project configured: `gcloud config set project 758851214311`
- [ ] Authenticated: `gcloud auth login`
- [ ] Required APIs enabled (script will enable automatically)

## 🚀 Automated Deployment

### Option 1: Complete Deployment + Verification

Run the automated deployment script that handles everything:

```bash
# From repository root
./scripts/deploy-and-verify.sh
```

This script will:
1. Check prerequisites
2. Configure Google Cloud project
3. Enable required APIs
4. Deploy API to Cloud Run
5. Run complete verification checklist

### Option 2: Verification Only

If the API is already deployed, run only the verification:

```bash
# Set the Cloud Run URL
export CLOUD_RUN_URL="https://photo2profit-api-uc.a.run.app"

# Run verification
node scripts/final-deployment-checklist.js
```

### Option 3: Manual Deployment

Follow these steps for manual deployment:

#### Step 1: Deploy API

```bash
cd api

gcloud run deploy photo2profit-api \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --max-instances 10 \
  --set-env-vars PROJECT_ID=758851214311
```

#### Step 2: Get Service URL

```bash
gcloud run services describe photo2profit-api \
  --region us-central1 \
  --format 'value(status.url)'
```

#### Step 3: Test Health Endpoint

```bash
curl https://photo2profit-api-uc.a.run.app/health | jq
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-11-11T12:00:00.000Z"
}
```

#### Step 4: Test SEO Refresh Endpoint

```bash
curl -X POST https://photo2profit-api-uc.a.run.app/api/seo/refresh?limit=1 \
  -H "Content-Type: application/json" \
  -H "x-cron-secret: YOUR_SECRET"
```

Expected response:
```json
{
  "success": true,
  "refreshed": 1,
  "examined": 5,
  "errors": []
}
```

#### Step 5: Test Product Page

```bash
curl https://photo2profit-api-uc.a.run.app/share/test-product
```

Expected: HTML page or 404 (both indicate route is working)

## 🔐 Environment Variables Checklist

### Required Variables

Verify these are set in your environment:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=photo2profit-758851214311.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=photo2profit-758851214311
VITE_FIREBASE_STORAGE_BUCKET=photo2profit-758851214311.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=758851214311
VITE_FIREBASE_APP_ID=your_app_id

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# API Configuration
VITE_API_BASE=https://photo2profit-api-uc.a.run.app
```

### Optional Variables (for enhanced features)

```bash
# AI Services
VITE_GEMINI_API_KEY=your_gemini_key
VITE_REMOVEBG_API_KEY=your_removebg_key

# Cross-posting
EBAY_CLIENT_ID=your_ebay_id
EBAY_CLIENT_SECRET=your_ebay_secret
FACEBOOK_CATALOG_ID=your_fb_catalog
FACEBOOK_ACCESS_TOKEN=your_fb_token

# Secrets
CRON_SECRET=your_cron_secret
SHARED_WEBHOOK_SECRET=your_webhook_secret
```

## 📊 Verification Checklist

After deployment, verify each component:

### ✅ API Health
- [ ] `/health` endpoint returns 200 OK
- [ ] Response includes `"status": "healthy"`

### ✅ SEO Refresh
- [ ] `/api/seo/refresh` endpoint accessible
- [ ] Returns success with product count
- [ ] Properly secured with CRON_SECRET

### ✅ Product Pages
- [ ] `/share/:id` route responds
- [ ] Returns HTML with meta tags
- [ ] Images load correctly

### ✅ Critical Endpoints
- [ ] `/api/analyze-product` responds
- [ ] `/api/cross-post` responds
- [ ] `/api/create-checkout-session` responds

## 🤖 GitHub Actions

The deployment checklist runs automatically on push to `main` when API files change.

### Manual Trigger

Trigger the workflow manually from GitHub Actions tab:

1. Go to Actions → Final Deployment Checklist
2. Click "Run workflow"
3. Choose to skip deployment or redeploy

### Workflow Configuration

The workflow is located at `.github/workflows/final-deployment-checklist.yml`

Required secrets (optional for full automation):
- `GCP_SA_KEY` - Google Cloud service account key
- `FIREBASE_API_KEY` - Firebase API key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `CRON_SECRET` - Secret for cron endpoints

## 🔧 Troubleshooting

### API Not Responding

```bash
# Check deployment status
gcloud run services describe photo2profit-api --region us-central1

# View logs
gcloud run logs read photo2profit-api --region us-central1 --limit 50

# Check recent deployments
gcloud run revisions list --service photo2profit-api --region us-central1
```

### Environment Variables Not Loading

```bash
# Verify .env file exists
cat .env

# Check Cloud Run environment
gcloud run services describe photo2profit-api \
  --region us-central1 \
  --format 'value(spec.template.spec.containers[0].env)'
```

### SEO Endpoint Returns 403

This is expected if `CRON_SECRET` is not configured. Set it:

```bash
# In Cloud Run
gcloud run services update photo2profit-api \
  --region us-central1 \
  --set-env-vars CRON_SECRET=your_secret_here

# Or use Secret Manager
echo -n "your_secret" | gcloud secrets create cron-secret --data-file=-
```

### Product Pages Return 500

Check database connection:

```bash
# Verify Prisma/database is configured
cd api
npm run prisma:migrate:deploy

# Check database URL
echo $DATABASE_URL
```

## 📈 Next Steps After Deployment

1. **Update Frontend Environment**
   ```bash
   # In Vercel dashboard
   VITE_API_BASE=https://photo2profit-api-uc.a.run.app
   ```

2. **Configure Stripe Webhooks**
   - URL: `https://photo2profit-api-uc.a.run.app/api/stripe-webhook`
   - Events: `checkout.session.completed`, `invoice.payment_succeeded`

3. **Setup Monitoring**
   ```bash
   # Enable Cloud Run logging
   gcloud logging read "resource.type=cloud_run_revision" --limit 50
   ```

4. **Test End-to-End**
   - Sign up as new user
   - Upload a product
   - Generate AI listings
   - Test checkout flow
   - Verify email receipts

## 📚 Additional Resources

- [Full Deployment Guide](./PRODUCTION_DEPLOYMENT_CHECKLIST.md)
- [API Documentation](./api/README.md)
- [Troubleshooting Guide](./TROUBLESHOOTING_VERCEL.md)
- [GitHub Actions](../.github/workflows/)

## 🆘 Support

If you encounter issues:

1. Check logs: `gcloud run logs read photo2profit-api --region us-central1`
2. Review this checklist
3. Run verification: `node scripts/final-deployment-checklist.js`
4. Contact: support@photo2profit.app

---

**Last Updated**: November 2024  
**Version**: 1.0  
**Status**: Production Ready ✅
