# 🚀 Photo2Profit Final Deploy Checklist

## Prerequisites

Before deploying, ensure you have:

- Google Cloud SDK installed and authenticated
- Access to project `photo2profit-758851214311`
- Environment variables configured
- Latest code committed and pushed

## 1. Verify Environment Variables

### Required Cloud Run Variables

Make sure these exist in your Cloud Run service (under _Cloud Run → Variables & Secrets_):

```bash
JWT_SECRET=dev-jwt-secret
SHARED_WEBHOOK_SECRET=photo2profit-cron-secret
SMTP_USER=youremail@gmail.com
SMTP_PASS=your_app_password
NOTIFY_EMAIL=youremail@gmail.com
```

### Check Current Variables

```bash
# View current environment variables
gcloud run services describe photo2profit-api \
  --region us-west2 \
  --format="value(spec.template.spec.containers[0].env)"
```

### Update Variables (if needed)

```bash
gcloud run services update photo2profit-api \
  --region us-west2 \
  --update-env-vars "JWT_SECRET=dev-jwt-secret,SHARED_WEBHOOK_SECRET=photo2profit-cron-secret,SMTP_USER=youremail@gmail.com,SMTP_PASS=your_app_password,NOTIFY_EMAIL=youremail@gmail.com"
```

## 2. Redeploy the API

### Option A: Using the deployment script

```bash
cd api
./final-deploy.sh
```

### Option B: Manual deployment

```bash
gcloud run deploy photo2profit-api \
  --source . \
  --region us-west2 \
  --platform managed \
  --allow-unauthenticated
```

**Expected Output:**

```
✓ Building using Dockerfile and deploying container to Cloud Run service [photo2profit-api]
✓ Deploying new service... Done.
  https://photo2profit-api-758851214311.us-west2.run.app
```

## 3. Test SEO Refresh Endpoint

Once deployment finishes, test the SEO refresh functionality:

```bash
curl -X POST \
  -H "x-cron-secret: photo2profit-cron-secret" \
  https://photo2profit-api-758851214311.us-west2.run.app/api/seo/refresh
```

**Expected Success Response:**

```json
{
  "success": true,
  "refreshed": 10,
  "examined": 10,
  "errors": []
}
```

**What This Does:**

- Refreshes SEO metadata for up to 10 products
- Sends an email report titled "Photo2Profit Monthly SEO Report"
- Updates Firestore with new SEO scores

**Check Your Email:**
Within a few seconds, you should receive an email at `NOTIFY_EMAIL` with the SEO report.

## 4. Confirm Product Pages Load

Test that your product pages are accessible:

```bash
# Health check
curl https://photo2profit-api-758851214311.us-west2.run.app/health

# Expected: {"status":"healthy","timestamp":"2024-11-11T..."}
```

Visit your main app URL in the browser:

- Frontend should be pulling from the deployed API
- Product listings should display
- Image uploads should work

## 5. Verify GitHub Actions (Optional)

Go to **GitHub → Actions** and verify:

- ✅ CI workflow passing
- ✅ Deploy workflow completed (if configured)
- ✅ No failed checks

```bash
# View latest workflow runs
gh run list --limit 5

# Or visit: https://github.com/baddiehustleai-star/jubilant-happiness/actions
```

## 6. Tag the Release

Once everything is verified and working:

```bash
# Ensure you're on main branch
git checkout main
git pull origin main

# Create and push v1.0 tag (if it doesn't exist)
git tag -a v1.0 -m "Production release v1.0 - SEO refresh, email reports, AI services"
git push origin v1.0

# Or create a new version tag
git tag -a v1.0.1 -m "Production release v1.0.1 - Final deployment"
git push origin v1.0.1
```

## 🎉 Post-Deployment Checklist

- [ ] API deployed to Cloud Run successfully
- [ ] Health endpoint returns 200 OK
- [ ] SEO refresh endpoint tested and working
- [ ] Email notification received
- [ ] Product pages loading correctly
- [ ] GitHub Actions showing green checks
- [ ] Release tagged in Git
- [ ] Team notified of deployment

## 🔍 Troubleshooting

### SEO Endpoint Returns 403

**Issue:** Missing or incorrect `x-cron-secret` header

**Fix:**

```bash
# Check the secret value in Cloud Run
gcloud run services describe photo2profit-api --region us-west2 \
  --format="value(spec.template.spec.containers[0].env)" | grep SHARED_WEBHOOK_SECRET
```

### No Email Received

**Issue:** SMTP credentials not configured or incorrect

**Fix:**

```bash
# Verify SMTP variables are set
gcloud run services describe photo2profit-api --region us-west2 \
  --format="value(spec.template.spec.containers[0].env)" | grep SMTP

# Update if needed
gcloud run services update photo2profit-api --region us-west2 \
  --update-env-vars "SMTP_USER=your-email@gmail.com,SMTP_PASS=your-app-password"
```

### Deployment Fails

**Common causes:**

1. Missing Dockerfile in api directory
2. Insufficient permissions
3. API not enabled

**Fix:**

```bash
# Enable required APIs
gcloud services enable cloudbuild.googleapis.com run.googleapis.com

# Check IAM permissions
gcloud projects get-iam-policy photo2profit-758851214311
```

## 📊 Monitoring

After deployment, monitor your service:

```bash
# View logs
gcloud run services logs read photo2profit-api --region us-west2 --limit 50

# Monitor metrics
gcloud run services describe photo2profit-api --region us-west2 \
  --format="table(status.conditions[0].message)"
```

## 🔄 Next Steps

After successful deployment:

1. **Set up Cloud Scheduler** for automated monthly SEO refreshes
2. **Configure monitoring alerts** for API health
3. **Enable backup strategy** for Firestore data
4. **Document API endpoints** for team reference
5. **Plan next features** (see ROADMAP.md)

---

**Congratulations!** 🎊 You've successfully deployed Photo2Profit v1.0 to production!

**Support:** For issues or questions, contact support@photo2profit.app
