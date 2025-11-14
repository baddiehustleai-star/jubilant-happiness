# Environment Separation Guide

This guide explains how to set up and manage separate staging and production environments for Photo2Profit.

## 🌍 Environment Architecture

Photo2Profit supports multiple deployment environments:

| Environment | Purpose | URL Pattern | Auto-Deploy |
|-------------|---------|-------------|-------------|
| **Production** | Live site for users | `photo2profit.app` | ✅ Main branch |
| **Staging** | Pre-production testing | `staging.photo2profit.app` | 🔄 Staging branch |
| **Preview** | PR testing | `pr-{number}--photo2profitbaddie.web.app` | 🔄 Pull requests |
| **Development** | Local development | `localhost:5173` | ⚙️ Manual |

## 🔧 Setting Up Staging Environment

### 1. Create Staging Branch

```bash
git checkout -b staging
git push origin staging
```

### 2. Firebase Hosting - Staging Channel

Firebase Hosting supports multiple channels for different environments:

```bash
# Create a staging channel
firebase hosting:channel:create staging

# Deploy to staging
npm run build
firebase deploy --only hosting:staging
```

Or configure in `firebase.json`:

```json
{
  "hosting": [
    {
      "target": "production",
      "public": "dist",
      "site": "photo2profitbaddie"
    },
    {
      "target": "staging", 
      "public": "dist",
      "site": "photo2profitbaddie-staging"
    }
  ]
}
```

### 3. Cloud Run - Staging Service

Create a separate Cloud Run service for staging:

```bash
# Deploy staging API
gcloud run deploy photo2profit-api-staging \
  --source . \
  --region us-west2 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=staging"

# Get staging URL
gcloud run services describe photo2profit-api-staging \
  --region us-west2 \
  --format='value(status.url)'
```

### 4. DNS Configuration for Staging

Add DNS records for staging subdomain:

```
Type: CNAME
Name: staging
Value: photo2profitbaddie-staging.web.app
TTL: 3600

Type: CNAME
Name: api-staging
Value: ghs.googlehosted.com
TTL: 3600
```

Then map in Cloud Run:
```bash
gcloud run services add-iam-policy-binding photo2profit-api-staging \
  --region us-west2 \
  --member="allUsers" \
  --role="roles/run.invoker"
```

## 🔐 Environment Variables

### Production Environment Variables

**Frontend (.env.production):**
```env
VITE_API_BASE_URL=https://api.photo2profit.app
NODE_ENV=production
VITE_STRIPE_PRICE_ID=price_xxx_live
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=photo2profitbaddie.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=photo2profitbaddie
```

**Backend (Cloud Run production):**
```bash
gcloud run services update photo2profit-api \
  --region us-west2 \
  --set-env-vars "NODE_ENV=production,STRIPE_SECRET_KEY=sk_live_xxx"
```

### Staging Environment Variables

**Frontend (.env.staging):**
```env
VITE_API_BASE_URL=https://api-staging.photo2profit.app
NODE_ENV=staging
VITE_STRIPE_PRICE_ID=price_xxx_test
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=photo2profitbaddie-staging.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=photo2profitbaddie-staging
```

**Backend (Cloud Run staging):**
```bash
gcloud run services update photo2profit-api-staging \
  --region us-west2 \
  --set-env-vars "NODE_ENV=staging,STRIPE_SECRET_KEY=sk_test_xxx"
```

### Development Environment Variables

**Frontend (.env.development or .env):**
```env
VITE_API_BASE_URL=http://localhost:8080
NODE_ENV=development
VITE_STRIPE_PRICE_ID=price_xxx_test
```

## 🤖 GitHub Actions - Multi-Environment Workflows

### Staging Deployment Workflow

Create `.github/workflows/staging-deploy.yml`:

```yaml
name: Deploy to Staging

on:
  push:
    branches:
      - staging
  workflow_dispatch:

env:
  PROJECT_ID: photo2profitbaddie
  REGION: us-west2
  SERVICE_NAME: photo2profit-api-staging

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Google Cloud SDK
        uses: google-github-actions/setup-gcloud@v2
        with:
          project_id: ${{ env.PROJECT_ID }}
          service_account_key: ${{ secrets.GOOGLE_APPLICATION_CREDENTIALS_JSON }}
      
      - name: Deploy to Cloud Run Staging
        run: |
          gcloud run deploy $SERVICE_NAME \
            --source . \
            --region $REGION \
            --platform managed \
            --allow-unauthenticated \
            --set-env-vars "NODE_ENV=staging"
      
      - name: Get Staging URL
        run: |
          STAGING_URL=$(gcloud run services describe $SERVICE_NAME \
            --region $REGION --format='value(status.url)')
          echo "STAGING_URL=$STAGING_URL" >> $GITHUB_ENV
          echo "🚀 Staging API: $STAGING_URL"

  deploy-frontend:
    needs: deploy-backend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Create staging .env
        run: |
          echo "VITE_API_BASE_URL=https://api-staging.photo2profit.app" > .env.production
          echo "NODE_ENV=staging" >> .env.production
      
      - name: Build for staging
        run: npm run build
      
      - name: Deploy to Firebase Staging Channel
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: staging
          projectId: photo2profitbaddie
          expires: 30d
      
      - name: Notify Slack
        if: ${{ secrets.SLACK_WEBHOOK_URL }}
        run: |
          curl -X POST -H 'Content-type: application/json' \
          --data '{"text":"🚀 Staging deployed! Frontend: https://staging.photo2profit.app"}' \
          ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Production Deployment Workflow

Update `.github/workflows/frontend-deploy.yml` and `.github/workflows/deploy.yml` to only deploy from `main` branch.

## 🔀 Deployment Strategy

### Recommended Flow

```
Development (local) → Feature Branch → PR Preview → Staging → Production
```

1. **Local Development:**
   ```bash
   npm run dev          # Frontend at localhost:5173
   npm run dev:api      # Backend at localhost:8080
   ```

2. **Feature Branch:**
   ```bash
   git checkout -b feature/new-feature
   # Make changes
   git push origin feature/new-feature
   # Create PR
   ```

3. **PR Preview:**
   - Automatic preview deployment created
   - Test in preview environment
   - Get team review

4. **Staging:**
   ```bash
   git checkout staging
   git merge feature/new-feature
   git push origin staging
   # Automatic deployment to staging
   ```
   - QA testing in staging
   - Smoke tests
   - User acceptance testing

5. **Production:**
   ```bash
   git checkout main
   git merge staging
   git push origin main
   # Automatic deployment to production
   ```

## 🧪 Testing Across Environments

### Development Testing

```bash
# Start local servers
npm run dev:api &
npm run dev

# Run tests
npm run test
npm run lint
```

### Staging Testing

```bash
# Test staging API
curl https://api-staging.photo2profit.app/api/health

# Test staging frontend
curl https://staging.photo2profit.app

# Run integration tests against staging
API_URL=https://api-staging.photo2profit.app npm run test:integration
```

### Production Testing

```bash
# Smoke tests
curl https://api.photo2profit.app/api/health
curl -I https://photo2profit.app

# Monitor logs
gcloud logging read "resource.type=cloud_run_revision" --limit 50
```

## 🔒 Security Considerations

### Separate Credentials Per Environment

| Service | Production | Staging | Development |
|---------|-----------|---------|-------------|
| Stripe | `sk_live_xxx` | `sk_test_xxx` | `sk_test_xxx` |
| Firebase | Prod project | Staging project | Dev project |
| OAuth | Prod client ID | Staging client ID | Dev client ID |
| API Keys | Prod keys | Test keys | Test keys |

### Access Control

**Production:**
- Limited team access
- Require PR approvals
- Branch protection rules
- Manual deployment approval (optional)

**Staging:**
- Full team access
- Auto-deploy on push to staging branch
- No branch protection required

**Development:**
- Local only
- Developer's own credentials
- No deployment automation

## 📊 Environment Comparison

```bash
# Script to compare environments
cat > compare-envs.sh << 'EOF'
#!/bin/bash

echo "🔍 Comparing Photo2Profit Environments"
echo

# Check Production
echo "🌐 PRODUCTION"
PROD_STATUS=$(curl -s https://api.photo2profit.app/api/health | jq -r '.status')
echo "  API Status: $PROD_STATUS"
echo "  Frontend: https://photo2profit.app"
echo

# Check Staging
echo "🚧 STAGING"
STAGING_STATUS=$(curl -s https://api-staging.photo2profit.app/api/health | jq -r '.status')
echo "  API Status: $STAGING_STATUS"
echo "  Frontend: https://staging.photo2profit.app"
echo

# Check Development
echo "💻 DEVELOPMENT"
echo "  API: http://localhost:8080"
echo "  Frontend: http://localhost:5173"
EOF

chmod +x compare-envs.sh
./compare-envs.sh
```

## 🚀 Quick Commands

### Deploy to Staging

```bash
# Deploy everything to staging
git checkout staging
git pull origin staging
git merge main
git push origin staging
```

### Promote Staging to Production

```bash
# After testing staging, promote to production
git checkout main
git merge staging
git push origin main
```

### Emergency Rollback

```bash
# Production rollback
gcloud run services update-traffic photo2profit-api \
  --to-revisions PREVIOUS_REVISION=100 \
  --region us-west2

firebase hosting:rollback --site photo2profitbaddie
```

## 📚 Additional Resources

- [Firebase Hosting Channels](https://firebase.google.com/docs/hosting/multisites)
- [Cloud Run Multi-Environment Setup](https://cloud.google.com/run/docs/configuring/environment-variables)
- [GitHub Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments)

---

**Need Help?** Contact support@photo2profit.app or see [README.md](./README.md) for more information.
