# 📋 Quick Deploy Commands

**Three steps to deploy Photo2Profit v1.0:**

## 1. Redeploy Cloud Run

```bash
cd api
./final-deploy.sh
```

Or manually:

```bash
gcloud run deploy photo2profit-api \
  --source . \
  --region us-west2 \
  --platform managed \
  --allow-unauthenticated
```

## 2. Test SEO Refresh

```bash
./test-seo-refresh.sh
```

Or manually:

```bash
curl -X POST \
  -H "x-cron-secret: photo2profit-cron-secret" \
  https://photo2profit-api-758851214311.us-west2.run.app/api/seo/refresh
```

Expected response:
```json
{ "success": true, "refreshed": 10, "examined": 10, "errors": [] }
```

## 3. Tag the Release

```bash
git tag -a v1.0.1 -m "Production release with SEO refresh and email notifications"
git push origin v1.0.1
```

---

## Environment Variables Required

Before deploying, ensure these are set in Cloud Run:

```
JWT_SECRET=dev-jwt-secret
SHARED_WEBHOOK_SECRET=photo2profit-cron-secret
SMTP_USER=youremail@gmail.com
SMTP_PASS=your_app_password
NOTIFY_EMAIL=youremail@gmail.com
```

Update them with:

```bash
gcloud run services update photo2profit-api \
  --region us-west2 \
  --update-env-vars "JWT_SECRET=dev-jwt-secret,SHARED_WEBHOOK_SECRET=photo2profit-cron-secret,SMTP_USER=youremail@gmail.com,SMTP_PASS=your_app_password,NOTIFY_EMAIL=youremail@gmail.com"
```

---

## Verification

✅ **Health Check:**
```bash
curl https://photo2profit-api-758851214311.us-west2.run.app/health
```

✅ **SEO Report Email:**
Check your inbox for "Photo2Profit Monthly SEO Report"

✅ **GitHub Actions:**
```bash
gh run list --limit 5
```

Or visit: https://github.com/baddiehustleai-star/jubilant-happiness/actions

---

**Full Documentation:**
- Complete guide: [FINAL_DEPLOY.md](./FINAL_DEPLOY.md)
- Production checklist: [PRODUCTION_DEPLOYMENT_CHECKLIST.md](./PRODUCTION_DEPLOYMENT_CHECKLIST.md)
