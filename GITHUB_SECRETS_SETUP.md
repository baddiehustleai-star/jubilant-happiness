# 🔐 GitHub Secrets Setup Guide

This guide explains how to configure GitHub Secrets for automated CI/CD deployments including:
- 🚀 **Google Cloud Run** - Backend API auto-deployment
- 🌟 **Vercel** - Frontend deployment with health gatekeeper
- 🔥 **Firebase** - Authentication and database configuration

## 📍 How to Add Secrets

1. Go to your GitHub repo: `https://github.com/baddiehustleai-star/jubilant-happiness`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each of these:

## 🔑 Required Secrets

### Firebase Configuration

| Secret Name                | Value                    | Where to Find                                 |
| -------------------------- | ------------------------ | --------------------------------------------- |
| `VITE_FIREBASE_API_KEY`    | `AIzaSy...`              | Firebase Console → Project Settings → General |
| `VITE_FIREBASE_APP_ID`     | `1:758851214311:web:...` | Firebase Console → Project Settings → General |
| `VITE_FIREBASE_PROJECT_ID` | `758851214311`           | Firebase Console → Project Settings → General |

### Google Cloud Run Configuration

| Secret Name                              | Value                       | Where to Find                                            |
| ---------------------------------------- | --------------------------- | -------------------------------------------------------- |
| `GCP_PROJECT_ID`                         | `photo2profitbaddie`        | Google Cloud Console → Project Info                      |
| `CLOUD_RUN_SERVICE`                      | `photo2profit-api`          | Cloud Run → Services (your service name)                 |
| `CLOUD_RUN_REGION`                       | `us-west2`                  | Cloud Run → Service Details                              |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON`    | `{...JSON key content...}`  | IAM → Service Accounts → Create Key (see steps below)    |
| `SLACK_WEBHOOK_URL` (optional)           | `https://hooks.slack.com/...` | Slack → Apps → Incoming Webhooks                       |

### Vercel Configuration

| Secret Name    | Value                         | Where to Find                        |
| -------------- | ----------------------------- | ------------------------------------ |
| `VERCEL_TOKEN` | `your_token_here`             | Vercel Dashboard → Settings → Tokens |
| `ORG_ID`       | `team_xxx` or `your_username` | Vercel Project → Settings → General  |
| `PROJECT_ID`   | `prj_xxx`                     | Vercel Project → Settings → General  |

## 🎯 Quick Setup Commands

### Create Google Service Account

To get the `GOOGLE_APPLICATION_CREDENTIALS_JSON` for Cloud Run deployments:

1. **Go to Google Cloud Console:**
   - Navigate to [IAM & Admin → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
   - Select your project: `photo2profitbaddie`

2. **Create Service Account:**
   - Click **+ CREATE SERVICE ACCOUNT**
   - Name: `github-actions-deployer`
   - Description: `Service account for GitHub Actions CI/CD`
   - Click **CREATE AND CONTINUE**

3. **Grant Required Roles:**
   - Add **Cloud Run Admin** role
   - Add **Service Account User** role
   - Add **Storage Admin** role (if using Cloud Storage)
   - Click **CONTINUE** then **DONE**

4. **Create JSON Key:**
   - Find your new service account in the list
   - Click the **⋮** menu → **Manage keys**
   - Click **ADD KEY** → **Create new key**
   - Choose **JSON** format
   - Click **CREATE** (downloads JSON file)

5. **Add to GitHub Secrets:**
   - Open the downloaded JSON file
   - Copy the **entire JSON content** (including curly braces)
   - Paste into GitHub secret `GOOGLE_APPLICATION_CREDENTIALS_JSON`

```bash
# Test your service account locally (optional)
gcloud auth activate-service-account --key-file=path/to/key.json
gcloud run services list --region=us-west2
```

### Get Vercel IDs

```bash
# Install Vercel CLI
npm i -g vercel

# Login and get project info
vercel login
vercel ls
vercel project ls
```

### Get Firebase Config

```bash
# From Firebase Console
https://console.firebase.google.com/project/758851214311/settings/general
```

## ✅ Testing Your Setup

### Test Cloud Run Deployment

Once Cloud Run secrets are added, push to main to trigger automatic deployment:

```bash
git add .
git commit -m "test: trigger Cloud Run auto-deploy"
git push origin main
```

Watch the **Actions** tab for the deployment workflow. You should see:

1. 🏗️ **Deploy to Cloud Run** - Builds and deploys to Google Cloud Run
2. 🔄 **SEO Refresh** - Triggers post-deployment SEO refresh
3. 💬 **Slack Notification** - Success/failure alert (if webhook configured)

### Test Vercel Deployment (with Gatekeeper)

Once secrets are added, push any change to trigger the gatekeeper:

```bash
git add .
git commit -m "Test gatekeeper deployment"
git push origin main
```

You'll see in Actions:

1. 🛡️ **Verify Backend Health** - Tests Cloud Run endpoints
2. 🌟 **Deploy Frontend to Vercel** - Only runs if #1 passes
3. 🚨 **Gatekeeper Alert** - Shows if deployment was blocked

## 🎉 Expected Result

### Cloud Run Deployment Success:

```
✅ Checkout repository
✅ Set up Node environment  
✅ Install dependencies
✅ Verify build
✅ Authenticate to Google Cloud
✅ Deploy to Cloud Run
✅ Trigger SEO refresh
✅ Slack notification sent
💎 Deployment complete for photo2profit-api in us-west2
```

### Vercel Gatekeeper Success:

**If all endpoints are healthy:**

```
✅ Backend verification passed
🚀 Frontend deployed to Vercel
💎 Photo2Payday Baddie Mode is LIVE!
```

**If any endpoint fails:**

```
❌ Backend health check failed
🛡️ Vercel deployment cancelled for safety
🚨 No broken code goes to production!
```

## 🔧 Troubleshooting

### Cloud Run Deployment Issues

**Authentication failed:**
- Verify `GOOGLE_APPLICATION_CREDENTIALS_JSON` contains valid JSON
- Check service account has required roles: Cloud Run Admin, Service Account User
- Ensure JSON is complete (starts with `{` and ends with `}`)

**Service not found:**
- Verify `CLOUD_RUN_SERVICE` matches your actual service name
- Check `CLOUD_RUN_REGION` is correct (e.g., `us-west2`)
- Ensure service exists: `gcloud run services list --region=us-west2`

**Build failed:**
- Check `package.json` has valid scripts
- Ensure all dependencies are listed (not just devDependencies)
- Test build locally: `npm run build`

**Slack notifications not working:**
- Verify `SLACK_WEBHOOK_URL` is set correctly in GitHub Secrets
- Test webhook: `curl -X POST -H 'Content-Type: application/json' -d '{"text":"test"}' YOUR_WEBHOOK_URL`
- Check Slack app has Incoming Webhooks enabled

### Vercel/Gatekeeper Issues

**Deployment blocked?** Check:

- Cloud Run service is running: `gcloud run services describe photo2profit-api`
- Endpoints respond: `npm run verify:prod`
- Secret Manager has all keys: `gcloud secrets list`

**Vercel deploy fails?** Check:

- All 3 Vercel secrets are set correctly
- Build completes locally: `npm run build`
- Environment variables are valid

### General Debugging

**View workflow logs:**
- Go to GitHub Actions tab
- Click on the failed workflow run
- Review step-by-step logs for error messages

**Test secrets locally:**
```bash
# Export secrets as environment variables
export GCP_PROJECT_ID=photo2profitbaddie
export CLOUD_RUN_SERVICE=photo2profit-api
export CLOUD_RUN_REGION=us-west2

# Test gcloud authentication
gcloud auth activate-service-account --key-file=service-account.json
gcloud run services list --project=$GCP_PROJECT_ID --region=$CLOUD_RUN_REGION
```
