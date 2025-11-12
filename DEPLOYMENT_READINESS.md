# Deployment Readiness Checklist

This document provides a comprehensive checklist to ensure the Photo2Profit application is ready for production deployment.

## 📋 Pre-Deployment Checklist

### ✅ Service Account Configuration

- [ ] Google Cloud service account created for GitHub Actions
- [ ] Firebase service account created for Hosting deployments
- [ ] All required IAM roles granted to service accounts
- [ ] Service account JSON keys generated and securely stored
- [ ] Local service account key files deleted after upload to GitHub

### ✅ GitHub Secrets Configuration

- [ ] `GOOGLE_APPLICATION_CREDENTIALS_JSON` secret added
- [ ] `FIREBASE_SERVICE_ACCOUNT` secret added
- [ ] `SLACK_WEBHOOK_URL` secret added (if using Slack notifications)
- [ ] `CRON_SECRET` secret added (if using authenticated cron endpoints)
- [ ] All secrets verified for correct JSON formatting

### ✅ Code Quality & Testing

- [ ] All linting checks pass: `npm run lint`
- [ ] Code formatting verified: `npm run format:check`
- [ ] All tests pass: `npm test`
- [ ] Production build succeeds: `npm run build`
- [ ] No console errors in development mode
- [ ] No TypeScript/ESLint errors

### ✅ Environment Configuration

- [ ] `.env.example` is up to date with all required variables
- [ ] Production environment variables documented
- [ ] Sensitive credentials excluded from version control
- [ ] `.gitignore` properly configured
- [ ] No secrets in committed code (verified via code review)

### ✅ Backend (Cloud Run) Readiness

- [ ] `api/` directory contains valid Cloud Run application
- [ ] Health check endpoint `/api/health` implemented
- [ ] Health check returns 200 OK status
- [ ] Environment variables set in Cloud Run (if needed)
- [ ] CORS configuration allows frontend origin
- [ ] API authentication/authorization implemented (if required)
- [ ] Rate limiting configured (if applicable)
- [ ] Cloud Run region set to `us-west2`
- [ ] Service name configured as `photo2profit-api`

### ✅ Frontend (Firebase Hosting) Readiness

- [ ] Vite build configuration validated
- [ ] Production build outputs to `dist/` directory
- [ ] Firebase project ID set to `photo2profitbaddie`
- [ ] `firebase.json` configured for hosting (if present)
- [ ] API base URL environment variable configured
- [ ] Frontend can connect to backend API
- [ ] Static assets optimized (images, fonts, etc.)
- [ ] Meta tags configured for SEO
- [ ] Favicon and app icons included

### ✅ CI/CD Workflows

- [ ] `.github/workflows/ci.yml` passes on main branch
- [ ] `.github/workflows/deploy.yml` configured correctly
- [ ] `.github/workflows/frontend-deploy.yml` configured correctly
- [ ] Workflow triggers are appropriate (push to main)
- [ ] Workflow paths filters are correct
- [ ] All required secrets referenced in workflows exist

### ✅ Security Review

- [ ] No hardcoded secrets in code
- [ ] No API keys in frontend code
- [ ] Sensitive data encrypted in transit (HTTPS)
- [ ] Authentication implemented where required
- [ ] Authorization checks in place for protected routes
- [ ] Input validation on all user inputs
- [ ] SQL injection prevention (if using database)
- [ ] XSS protection enabled
- [ ] CSRF protection enabled (if applicable)
- [ ] Security headers configured
- [ ] Dependencies audited: `npm audit`

### ✅ Documentation

- [ ] README.md updated with current information
- [ ] SERVICE_ACCOUNT_SETUP.md reviewed and accurate
- [ ] DEPLOYMENT_READINESS.md completed
- [ ] API documentation available (if applicable)
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Troubleshooting guide available

---

## 🧪 Testing Phase

### Backend Testing

- [ ] **Local Testing**

  ```bash
  cd api
  # Run backend locally
  # Test all endpoints
  ```

- [ ] **Cloud Run Testing**

  ```bash
  # Deploy to Cloud Run
  gcloud run deploy photo2profit-api \
    --source . \
    --region us-west2 \
    --platform managed \
    --allow-unauthenticated

  # Test deployed service
  SERVICE_URL=$(gcloud run services describe photo2profit-api \
    --region us-west2 \
    --format='value(status.url)')
  curl $SERVICE_URL/api/health
  ```

- [ ] Health check endpoint responds with 200 OK
- [ ] All API endpoints return expected responses
- [ ] Error handling works correctly
- [ ] Logs are accessible in Cloud Console

### Frontend Testing

- [ ] **Local Development**

  ```bash
  npm run dev
  # Test at http://localhost:5173
  ```

- [ ] **Production Build**

  ```bash
  npm run build
  npm run preview
  # Test at http://localhost:4173
  ```

- [ ] All pages load without errors
- [ ] API calls to backend succeed
- [ ] Forms submit correctly
- [ ] Images load properly
- [ ] Responsive design works on mobile
- [ ] Browser console has no errors
- [ ] Performance is acceptable (Lighthouse score)

### Integration Testing

- [ ] Frontend successfully connects to backend API
- [ ] Authentication flow works end-to-end (if applicable)
- [ ] Data flows correctly between frontend and backend
- [ ] Error messages display properly
- [ ] Loading states work correctly
- [ ] Edge cases handled gracefully

---

## 🚀 Deployment Validation

### GitHub Actions Workflow Runs

- [ ] **CI Workflow** (`.github/workflows/ci.yml`)
  - [ ] Runs on push to main branch
  - [ ] All jobs complete successfully
  - [ ] No failing tests
  - [ ] Build artifacts created

- [ ] **Backend Deploy Workflow** (`.github/workflows/deploy.yml`)
  - [ ] Triggers on push to main (when api/ files change)
  - [ ] Google Cloud SDK authenticates successfully
  - [ ] Cloud Run deployment succeeds
  - [ ] Service URL is obtained
  - [ ] SEO refresh endpoint called successfully (if applicable)
  - [ ] Slack notification sent (if configured)

- [ ] **Frontend Deploy Workflow** (`.github/workflows/frontend-deploy.yml`)
  - [ ] Triggers on push to main (when frontend files change)
  - [ ] Dependencies install successfully
  - [ ] Cloud Run API URL retrieved
  - [ ] Backend health check passes
  - [ ] Production build succeeds
  - [ ] Firebase Hosting deployment succeeds
  - [ ] Slack notification sent (if configured)

### Post-Deployment Verification

- [ ] **Backend Service**
  - [ ] Cloud Run service is running
  - [ ] Service URL is accessible: `https://photo2profit-api-*.run.app`
  - [ ] Health check returns 200 OK
  - [ ] API endpoints respond correctly
  - [ ] Logs show no critical errors

- [ ] **Frontend Service**
  - [ ] Firebase Hosting site is live
  - [ ] Custom domain resolves correctly (if configured)
  - [ ] Site loads without errors
  - [ ] API calls to backend succeed
  - [ ] Performance is acceptable

- [ ] **Monitoring & Logs**
  - [ ] Cloud Run logs accessible
  - [ ] Firebase Hosting analytics enabled
  - [ ] Error tracking configured (Sentry, if used)
  - [ ] No critical errors in logs

---

## 🔄 Rollback Plan

In case of deployment issues:

### Backend Rollback

```bash
# List revisions
gcloud run revisions list --service=photo2profit-api --region=us-west2

# Rollback to previous revision
gcloud run services update-traffic photo2profit-api \
  --region=us-west2 \
  --to-revisions=PREVIOUS_REVISION=100
```

### Frontend Rollback

```bash
# List hosting releases
firebase hosting:channel:list --project=photo2profitbaddie

# Rollback to previous release (manual)
# Redeploy previous version from git history
git checkout PREVIOUS_COMMIT
npm run build
firebase deploy --only hosting --project=photo2profitbaddie
```

---

## 🎯 Post-Deployment Actions

- [ ] Announce deployment to team
- [ ] Update deployment log/changelog
- [ ] Monitor error rates for 24 hours
- [ ] Verify analytics are tracking correctly
- [ ] Test critical user flows in production
- [ ] Update status page (if applicable)
- [ ] Archive deployment artifacts

---

## 📊 Monitoring Checklist (First 24 Hours)

- [ ] Monitor Cloud Run metrics (requests, latency, errors)
- [ ] Monitor Firebase Hosting traffic
- [ ] Check error logs every 2-4 hours
- [ ] Verify no spike in 4xx/5xx errors
- [ ] Monitor backend response times
- [ ] Check frontend performance metrics
- [ ] Verify Slack notifications are working
- [ ] Review user feedback/reports

---

## 🔒 Security Post-Deployment

- [ ] Verify HTTPS is enforced
- [ ] Check security headers are present
- [ ] Confirm secrets are not exposed in logs
- [ ] Review IAM permissions are least-privilege
- [ ] Verify API rate limiting is working
- [ ] Check for any security alerts in GCP Console

---

## 📝 Notes

### Known Issues

- Document any known issues or limitations
- Include workarounds if available

### Future Improvements

- List planned improvements or technical debt
- Note any temporary solutions that need refinement

---

## ✅ Final Sign-Off

**Deployment approved by:** **\*\*\*\***\_\_\_**\*\*\*\***  
**Date:** **\*\*\*\***\_\_\_**\*\*\*\***  
**Deployment successful:** [ ] Yes [ ] No  
**Rollback required:** [ ] Yes [ ] No

---

**Last Updated:** 2025-11-12  
**Version:** 1.0  
**Project:** Photo2Profit (photo2profitbaddie)
