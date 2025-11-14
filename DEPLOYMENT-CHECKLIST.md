# 🚀 Photo2Profit Deployment Checklist

Use this checklist to ensure your Photo2Profit deployment is configured correctly for the subdomain architecture.

## ✅ Finalized Deployment Plan

| Component       | Subdomain / URL        | Platform       | Status |
| --------------- | ---------------------- | -------------- | ------ |
| **Frontend**    | `photo2profit.app`     | Firebase Hosting | ⬜ |
| **Backend API** | `api.photo2profit.app` | Cloud Run       | ⬜ |
| **Domain**      | `photo2profit.app`     | DNS Provider    | ⬜ |

---

## 📋 Pre-Deployment Setup

### 1. Repository & Development

- [ ] Clone repository locally
- [ ] Run `npm install` to install dependencies
- [ ] Run `npm run dev` to test frontend locally
- [ ] Run `npm run dev:api` to test backend locally
- [ ] Run `npm run build` to verify production build works
- [ ] Run `npm run lint` to ensure code quality
- [ ] Run `npm run test` to verify all tests pass

### 2. GitHub Secrets Configuration

Configure these in **Settings → Secrets and variables → Actions**:

- [ ] `FIREBASE_SERVICE_ACCOUNT` - Firebase service account JSON
  - Get from: Firebase Console → Project Settings → Service Accounts → Generate new private key
- [ ] `GOOGLE_APPLICATION_CREDENTIALS_JSON` - GCP service account key
  - Get from: Google Cloud Console → IAM & Admin → Service Accounts → Create key (JSON)
- [ ] `SLACK_WEBHOOK_URL` (Optional) - Slack notification webhook
  - Get from: Slack App settings → Incoming Webhooks
- [ ] `CRON_SECRET` (Optional) - SEO refresh endpoint secret
  - Generate: `openssl rand -hex 32`

### 3. Google Cloud Platform Setup

- [ ] Create or access GCP project: `photo2profitbaddie`
- [ ] Enable Cloud Run API
- [ ] Enable Cloud Build API
- [ ] Create service account with Cloud Run Admin role
- [ ] Download service account key (JSON)
- [ ] Set up billing (required for Cloud Run)

### 4. Firebase Setup

- [ ] Create Firebase project: `photo2profitbaddie`
- [ ] Enable Firebase Hosting
- [ ] Run `firebase login` locally
- [ ] Run `firebase init hosting` (if needed)
- [ ] Generate service account key for deployments
- [ ] Enable Blaze plan for custom domain support

---

## 🔧 Firebase Hosting Setup

### 1. Configure Firebase Hosting

- [x] `firebase.json` configuration file created
- [x] `.firebaserc` project configuration created
- [x] Custom error pages (404.html, 500.html) created
- [x] Frontend deploy workflow configured

### 2. Add Custom Domain

- [ ] Navigate to Firebase Console → Hosting → Add custom domain
- [ ] Enter domain: `photo2profit.app`
- [ ] Verify domain ownership (TXT record)
- [ ] Configure DNS records (A or CNAME)
- [ ] Wait for SSL certificate provisioning (10-15 minutes)
- [ ] Test: `curl -I https://photo2profit.app`

### 3. DNS Configuration for Frontend

Add these records in your DNS provider:

**Option A: A Records** (Recommended)
- [ ] Type: A, Name: @, Value: `151.101.1.195`, TTL: 3600
- [ ] Type: A, Name: @, Value: `151.101.65.195`, TTL: 3600

**Option B: CNAME**
- [ ] Type: CNAME, Name: @, Value: `photo2profitbaddie.web.app`, TTL: 3600

**www Subdomain:**
- [ ] Type: CNAME, Name: www, Value: `photo2profitbaddie.web.app`, TTL: 3600

---

## 🌐 Cloud Run Backend Setup

### 1. Deploy Backend API

- [x] Express server (`server.js`) created
- [x] Dockerfile created
- [x] Backend dependencies added to package.json
- [x] Backend deploy workflow configured

### 2. Initial Deployment

Deploy manually first to create the service:

```bash
# Authenticate
gcloud auth login
gcloud config set project photo2profitbaddie

# Deploy
gcloud run deploy photo2profit-api \
  --source . \
  --region us-west2 \
  --platform managed \
  --allow-unauthenticated
```

- [ ] Initial deployment successful
- [ ] Service URL obtained
- [ ] Health check passes: `curl https://[SERVICE-URL]/api/health`

### 3. Add Custom Domain to Cloud Run

- [ ] Go to Cloud Run → photo2profit-api service
- [ ] Click "Custom domains" tab
- [ ] Click "Add mapping"
- [ ] Enter domain: `api.photo2profit.app`
- [ ] Follow domain verification steps

### 4. DNS Configuration for Backend API

- [ ] Type: CNAME, Name: api, Value: `ghs.googlehosted.com`, TTL: 3600
- [ ] Wait for DNS propagation (up to 48 hours)
- [ ] Verify domain mapping in Cloud Run console
- [ ] Test: `curl https://api.photo2profit.app/api/health`

### 5. Environment Variables

Set in Cloud Run service:

```bash
gcloud run services update photo2profit-api \
  --region us-west2 \
  --set-env-vars "NODE_ENV=production,STRIPE_SECRET_KEY=sk_live_xxx"
```

Required variables:
- [ ] `NODE_ENV=production`
- [ ] `STRIPE_SECRET_KEY` (production key)
- [ ] Other optional keys as needed

---

## 🔄 Automation & Workflows

### 1. Frontend Deploy Workflow

File: `.github/workflows/frontend-deploy.yml`

- [x] Workflow file exists
- [x] Triggers on push to main (src/**, public/**)
- [x] Fetches Cloud Run URL
- [x] Creates production .env
- [x] Builds and deploys to Firebase Hosting
- [ ] Test: Push a change to `src/` and verify deployment

### 2. Backend Deploy Workflow

File: `.github/workflows/deploy.yml`

- [x] Workflow file exists
- [x] Triggers on push to main (api/**)
- [x] Deploys to Cloud Run
- [x] Verifies health endpoint
- [ ] Test: Push a change to `api/` and verify deployment

### 3. Preview Deploy Workflow

File: `.github/workflows/preview-deploy.yml`

- [x] Workflow file exists
- [x] Triggers on pull requests
- [x] Creates preview channel
- [x] Comments PR with preview URL
- [ ] Test: Create a PR and verify preview deployment

---

## 📚 Documentation

### Core Documentation

- [x] README.md - Updated with deployment architecture
- [x] README-DEPLOY.md - Deployment quickstart guide
- [x] FIREBASE-SETUP.md - Detailed Firebase setup
- [x] DEPLOYMENT-STATUS.md - Status check guide
- [x] .env.example - Environment variable template

### Optional Documentation

- [x] MONITORING.md - Uptime monitoring guide
- [x] ENVIRONMENTS.md - Environment separation guide
- [x] DEPLOYMENT-CHECKLIST.md - This file

---

## 🧪 Testing & Verification

### Local Testing

- [ ] Frontend runs: `npm run dev` → http://localhost:5173
- [ ] Backend runs: `npm run dev:api` → http://localhost:8080
- [ ] Health endpoint works: `curl http://localhost:8080/api/health`
- [ ] Build succeeds: `npm run build`
- [ ] Tests pass: `npm run test`
- [ ] Lint passes: `npm run lint`

### Production Testing

- [ ] Frontend accessible: https://photo2profit.app
- [ ] Backend accessible: https://api.photo2profit.app
- [ ] Health check: `curl https://api.photo2profit.app/api/health`
- [ ] Frontend health: `curl -I https://photo2profit.app`
- [ ] Custom error pages work (404, 500)
- [ ] HTTPS certificates active
- [ ] CORS configured correctly

### Workflow Testing

- [ ] CI passes on every commit
- [ ] Frontend deploys on push to main (when src/** changes)
- [ ] Backend deploys on push to main (when api/** changes)
- [ ] Preview deployments work for PRs
- [ ] Slack notifications sent (if configured)

---

## 🔐 Security Checklist

- [ ] GitHub secrets configured (never commit credentials)
- [ ] Service account keys secured
- [ ] CORS properly configured in backend
- [ ] HTTPS enforced on all endpoints
- [ ] Environment variables set in Cloud Run (not in code)
- [ ] Stripe using production keys in production
- [ ] CodeQL security scans passing
- [ ] Workflow permissions follow least privilege

---

## 🎯 Optional Enhancements

### Monitoring

- [ ] Set up UptimeRobot monitoring
- [ ] Configure Google Cloud Monitoring alerts
- [ ] Add Sentry for error tracking
- [ ] Set up performance monitoring

### Environment Separation

- [ ] Create staging environment
- [ ] Set up staging workflows
- [ ] Configure staging DNS
- [ ] Test staging deployment

### Additional Features

- [ ] Set up custom domain email (support@photo2profit.app)
- [ ] Configure CDN caching rules
- [ ] Add rate limiting to API
- [ ] Set up backup/disaster recovery plan
- [ ] Create status page (upptime.js.org)

---

## 📊 Post-Deployment

### Immediate Actions

- [ ] Monitor deployment logs for first 24 hours
- [ ] Test all critical user flows
- [ ] Verify analytics/tracking working
- [ ] Check error logs in Cloud Run
- [ ] Test Stripe integration end-to-end

### Regular Maintenance

- [ ] Weekly: Review Cloud Run logs
- [ ] Weekly: Check Firebase Hosting usage
- [ ] Monthly: Review and rotate secrets
- [ ] Monthly: Update dependencies
- [ ] Quarterly: Review and optimize costs

---

## 📞 Support & Resources

### Documentation

- Main README: [README.md](./README.md)
- Firebase Setup: [FIREBASE-SETUP.md](./FIREBASE-SETUP.md)
- Deployment Guide: [README-DEPLOY.md](./README-DEPLOY.md)
- Status Checks: [DEPLOYMENT-STATUS.md](./DEPLOYMENT-STATUS.md)
- Monitoring: [MONITORING.md](./MONITORING.md)
- Environments: [ENVIRONMENTS.md](./ENVIRONMENTS.md)

### External Resources

- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

### Getting Help

- Email: support@photo2profit.app
- GitHub Issues: [Create an issue](https://github.com/baddiehustleai-star/jubilant-happiness/issues)
- Documentation: Check all .md files in repository

---

## ✅ Final Verification

Once all items are checked:

- [ ] All services deployed and accessible
- [ ] DNS configured and propagated
- [ ] SSL certificates active
- [ ] GitHub workflows passing
- [ ] Monitoring configured
- [ ] Team notified of URLs
- [ ] Documentation reviewed

**Congratulations! Your Photo2Profit deployment is complete! 🎉**

---

*Last updated: 2025-11-14*
*Deployment Architecture: Subdomain Mode (photo2profit.app + api.photo2profit.app)*
