# Scripts Directory

This directory contains utility scripts for Photo2Profit deployment and verification.

## Deployment Scripts

### `deploy-and-verify.sh`
**Complete deployment automation script**

Handles the entire deployment process from start to finish:
- Checks prerequisites (gcloud, node)
- Configures Google Cloud project
- Enables required APIs
- Deploys API to Cloud Run
- Runs verification checklist
- Provides next steps

**Usage:**
```bash
# Run complete deployment
./scripts/deploy-and-verify.sh

# Or via npm
npm run deploy:full
```

**Requirements:**
- Google Cloud CLI (`gcloud`) installed
- Authenticated to Google Cloud: `gcloud auth login`
- Project configured: `gcloud config set project 758851214311`

### `final-deployment-checklist.js`
**Production readiness verification script**

Verifies that all components are production-ready:
- Environment variables configured
- API deployed and accessible
- SEO refresh endpoint functional
- Product pages loading correctly
- Critical endpoints responding

**Usage:**
```bash
# Set target URL
export CLOUD_RUN_URL="https://photo2profit-api-uc.a.run.app"

# Run verification
node scripts/final-deployment-checklist.js

# Or via npm
npm run deploy:checklist
```

**Environment Variables:**
- `CLOUD_RUN_URL` - Target API URL (required)
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `CRON_SECRET` - Secret for cron endpoints (optional)

**Exit Codes:**
- `0` - All checks passed
- `1` - Some checks failed

## Verification Scripts

### `verify-endpoints.js`
**API endpoint health check script**

Tests key API endpoints to verify they are responding correctly.

**Usage:**
```bash
# Test production API
npm run verify:prod

# Test custom URL
CLOUD_RUN_URL=https://your-api-url.com node scripts/verify-endpoints.js
```

**Tested Endpoints:**
- `/` - Root endpoint
- `/health` - Health check
- `/api/analyze-product` - AI analysis
- `/api/cross-post` - Cross-posting
- `/api/create-checkout-session` - Stripe checkout
- `/api/process-listing` - Listing processing

### `verify-env.js`
**Environment variables validation**

Checks that required environment variables are set before building.

**Usage:**
```bash
# Run verification
npm run verify:env

# Automatically runs before build
npm run build
```

**Checked Variables:**
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Script Workflows

### Development Workflow
```bash
# 1. Verify environment
npm run verify:env

# 2. Start development server
npm run dev
```

### Deployment Workflow
```bash
# 1. Run complete deployment
npm run deploy:full

# OR manual steps:

# 2a. Deploy API
cd api && ./deploy.sh

# 2b. Run verification
npm run deploy:checklist

# 3. Test endpoints
npm run verify:prod
```

### CI/CD Workflow
Automated via GitHub Actions (see `.github/workflows/final-deployment-checklist.yml`):
1. Push to `main` branch
2. Workflow triggers automatically
3. Deploys API to Cloud Run
4. Runs verification checklist
5. Reports results

## Troubleshooting

### Deployment Fails
```bash
# Check gcloud authentication
gcloud auth list

# Check project configuration
gcloud config get-value project

# View Cloud Run logs
gcloud run logs read photo2profit-api --region us-central1 --limit 50
```

### Verification Fails
```bash
# Test API health directly
curl https://photo2profit-api-uc.a.run.app/health

# Check environment variables
cat .env

# Run with verbose logging
DEBUG=* npm run deploy:checklist
```

### Permission Errors
```bash
# Ensure you have required roles
gcloud projects get-iam-policy 758851214311

# Add required permissions
gcloud projects add-iam-policy-binding 758851214311 \
  --member="user:your-email@example.com" \
  --role="roles/run.admin"
```

## Additional Resources

- [Full Deployment Guide](../FINAL_DEPLOYMENT_GUIDE.md)
- [Production Checklist](../PRODUCTION_DEPLOYMENT_CHECKLIST.md)
- [Troubleshooting Guide](../TROUBLESHOOTING_VERCEL.md)
- [GitHub Actions Workflows](../.github/workflows/)

## Support

For issues with scripts:
1. Check script output for specific errors
2. Review documentation above
3. Check logs: `gcloud run logs read photo2profit-api`
4. Contact: support@photo2profit.app

---

**Last Updated**: November 2024
**Scripts Version**: 1.0
