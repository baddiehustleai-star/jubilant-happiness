# Service Account Setup Guide

This document provides step-by-step instructions for setting up the required service accounts and GitHub secrets for deploying the Photo2Profit application.

## Overview

Photo2Profit uses two primary deployment pipelines:

1. **Backend API** → Google Cloud Run (via `.github/workflows/deploy.yml`)
2. **Frontend** → Firebase Hosting (via `.github/workflows/frontend-deploy.yml`)

Both pipelines require service accounts with specific permissions to deploy successfully.

---

## 🔐 Required GitHub Secrets

The following secrets must be configured in your GitHub repository at **Settings → Secrets and variables → Actions**:

| Secret Name                           | Required For       | Description                                                         |
| ------------------------------------- | ------------------ | ------------------------------------------------------------------- |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | Backend & Frontend | Google Cloud service account JSON key for gcloud SDK authentication |
| `FIREBASE_SERVICE_ACCOUNT`            | Frontend           | Firebase service account JSON key for Firebase Hosting deployment   |
| `SLACK_WEBHOOK_URL`                   | Both (optional)    | Slack webhook URL for deployment notifications                      |
| `CRON_SECRET`                         | Backend (optional) | Secret token for authenticated cron/scheduled job endpoints         |

---

## 📋 Google Cloud Service Account Setup

### Prerequisites

- Google Cloud Project: `photo2profitbaddie`
- gcloud CLI installed (for local testing)
- Owner or Editor permissions on the GCP project

### Step 1: Create the Service Account

```bash
# Set your project ID
export PROJECT_ID="photo2profitbaddie"

# Create a service account for GitHub Actions
gcloud iam service-accounts create github-actions-deployer \
  --display-name="GitHub Actions Deployer" \
  --description="Service account for deploying from GitHub Actions" \
  --project=$PROJECT_ID
```

### Step 2: Grant Required Permissions

The service account needs the following IAM roles for Cloud Run deployment:

```bash
# Get the service account email
export SA_EMAIL="github-actions-deployer@${PROJECT_ID}.iam.gserviceaccount.com"

# Grant Cloud Run Admin role (for deploying services)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/run.admin"

# Grant Service Account User role (required to deploy as a service)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/iam.serviceAccountUser"

# Grant Storage Admin role (for Cloud Build artifacts)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/storage.admin"

# Grant Cloud Build Editor role (for building containers)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/cloudbuild.builds.editor"

# Grant Artifact Registry Writer role (for pushing container images)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/artifactregistry.writer"
```

### Step 3: Create and Download Service Account Key

```bash
# Create a JSON key file
gcloud iam service-accounts keys create github-actions-key.json \
  --iam-account=$SA_EMAIL \
  --project=$PROJECT_ID

# View the key (DO NOT commit this file!)
cat github-actions-key.json
```

### Step 4: Add to GitHub Secrets

1. Copy the **entire contents** of `github-actions-key.json`
2. Go to your GitHub repository
3. Navigate to **Settings → Secrets and variables → Actions**
4. Click **New repository secret**
5. Name: `GOOGLE_APPLICATION_CREDENTIALS_JSON`
6. Value: Paste the JSON key contents
7. Click **Add secret**

**⚠️ Security Note:** Delete the local `github-actions-key.json` file after uploading to GitHub:

```bash
rm github-actions-key.json
```

---

## 🔥 Firebase Service Account Setup

### Prerequisites

- Firebase project: `photo2profitbaddie`
- Firebase CLI installed
- Firebase project linked to the same GCP project

### Step 1: Create Firebase Service Account

You can create a Firebase service account using either the Firebase Console or gcloud CLI.

#### Option A: Using Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `photo2profitbaddie`
3. Click the gear icon → **Project settings**
4. Navigate to **Service accounts** tab
5. Click **Generate new private key**
6. Download the JSON file (e.g., `firebase-service-account.json`)

#### Option B: Using gcloud CLI

```bash
# Create a service account for Firebase
gcloud iam service-accounts create firebase-deployer \
  --display-name="Firebase Hosting Deployer" \
  --description="Service account for deploying to Firebase Hosting" \
  --project=$PROJECT_ID

# Get the service account email
export FIREBASE_SA_EMAIL="firebase-deployer@${PROJECT_ID}.iam.gserviceaccount.com"

# Grant Firebase Hosting Admin role
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${FIREBASE_SA_EMAIL}" \
  --role="roles/firebasehosting.admin"

# Grant Service Usage Consumer role (for Firebase APIs)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${FIREBASE_SA_EMAIL}" \
  --role="roles/serviceusage.serviceUsageConsumer"

# Create a JSON key file
gcloud iam service-accounts keys create firebase-service-account.json \
  --iam-account=$FIREBASE_SA_EMAIL \
  --project=$PROJECT_ID
```

### Step 2: Add to GitHub Secrets

1. Copy the **entire contents** of the Firebase service account JSON file
2. Go to your GitHub repository
3. Navigate to **Settings → Secrets and variables → Actions**
4. Click **New repository secret**
5. Name: `FIREBASE_SERVICE_ACCOUNT`
6. Value: Paste the JSON key contents
7. Click **Add secret**

**⚠️ Security Note:** Delete the local service account JSON file:

```bash
rm firebase-service-account.json
```

---

## 🔔 Optional: Slack Notifications Setup

To receive deployment notifications in Slack:

### Step 1: Create Slack Webhook

1. Go to your Slack workspace
2. Navigate to [Slack API Apps](https://api.slack.com/apps)
3. Click **Create New App** → **From scratch**
4. Name: "Photo2Profit Deployments"
5. Select your workspace
6. Navigate to **Incoming Webhooks**
7. Activate **Incoming Webhooks**
8. Click **Add New Webhook to Workspace**
9. Select the channel for notifications
10. Copy the webhook URL (looks like: `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX`)

### Step 2: Add to GitHub Secrets

1. Go to **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Name: `SLACK_WEBHOOK_URL`
4. Value: Paste the webhook URL
5. Click **Add secret**

---

## 🔑 Optional: CRON_SECRET Setup

The backend API has protected cron endpoints (e.g., `/api/seo/refresh`) that require authentication.

### Step 1: Generate a Secure Secret

```bash
# Generate a random 32-character secret
openssl rand -hex 32
```

### Step 2: Add to GitHub Secrets

1. Go to **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Name: `CRON_SECRET`
4. Value: Paste the generated secret
5. Click **Add secret**

### Step 3: Configure in Cloud Run (if needed)

If your API validates this secret, you may need to set it as an environment variable in Cloud Run:

```bash
gcloud run services update photo2profit-api \
  --region=us-west2 \
  --set-env-vars="CRON_SECRET=your-generated-secret"
```

---

## ✅ Verification Checklist

Before merging this branch, ensure:

- [ ] **Google Cloud Service Account** is created with all required roles
- [ ] **Firebase Service Account** is created with Firebase Hosting Admin role
- [ ] **GitHub Secret**: `GOOGLE_APPLICATION_CREDENTIALS_JSON` is configured
- [ ] **GitHub Secret**: `FIREBASE_SERVICE_ACCOUNT` is configured
- [ ] **GitHub Secret**: `SLACK_WEBHOOK_URL` is configured (optional)
- [ ] **GitHub Secret**: `CRON_SECRET` is configured (optional)
- [ ] Backend deployment workflow (`.github/workflows/deploy.yml`) runs successfully
- [ ] Frontend deployment workflow (`.github/workflows/frontend-deploy.yml`) runs successfully
- [ ] Cloud Run service is accessible at the expected URL
- [ ] Firebase Hosting site is live and displays correctly
- [ ] Backend health check endpoint (`/api/health`) returns 200 OK
- [ ] No secrets are committed to the repository

---

## 🧪 Testing the Setup

### Test Backend Deployment Locally

```bash
# Authenticate with the service account
gcloud auth activate-service-account --key-file=github-actions-key.json

# Set the project
gcloud config set project photo2profitbaddie

# Deploy to Cloud Run (from the api directory)
cd api
gcloud run deploy photo2profit-api \
  --source . \
  --region us-west2 \
  --platform managed \
  --allow-unauthenticated

# Test the deployed service
SERVICE_URL=$(gcloud run services describe photo2profit-api \
  --region us-west2 \
  --format='value(status.url)')
curl $SERVICE_URL/api/health
```

### Test Frontend Deployment Locally

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login with the service account
export GOOGLE_APPLICATION_CREDENTIALS=firebase-service-account.json
firebase login:ci

# Deploy to Firebase Hosting
npm run build
firebase deploy --only hosting --project photo2profitbaddie
```

---

## 🐛 Troubleshooting

### Issue: "Permission denied" during Cloud Run deployment

**Solution:** Verify the service account has all required roles:

```bash
gcloud projects get-iam-policy photo2profitbaddie \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:github-actions-deployer@photo2profitbaddie.iam.gserviceaccount.com"
```

### Issue: "Invalid service account JSON" in GitHub Actions

**Solution:**

- Ensure you copied the **entire** JSON content including opening `{` and closing `}`
- Verify there are no extra spaces or newlines
- The JSON should be a single-line or properly formatted JSON object

### Issue: Firebase deployment fails with "Insufficient permissions"

**Solution:**

- Verify the Firebase service account has `roles/firebasehosting.admin`
- Ensure the service account is from the correct project
- Check that Firebase Hosting is enabled in the Firebase Console

### Issue: "Backend health check failed" in frontend deployment

**Solution:**

- Ensure the backend (Cloud Run) is deployed first
- Check Cloud Run service status: `gcloud run services describe photo2profit-api --region us-west2`
- Verify the `/api/health` endpoint is implemented and returns 200 OK
- Check Cloud Run logs: `gcloud run logs read --service photo2profit-api --region us-west2`

### Issue: Slack notifications not working

**Solution:**

- Verify the webhook URL is correct and active
- Test the webhook manually:
  ```bash
  curl -X POST -H 'Content-type: application/json' \
    --data '{"text":"Test notification"}' \
    $SLACK_WEBHOOK_URL
  ```
- Ensure the secret name is exactly `SLACK_WEBHOOK_URL`

---

## 🔒 Security Best Practices

1. **Never commit service account keys** to version control
2. **Rotate keys regularly** (every 90 days recommended)
3. **Use least privilege principle** - only grant necessary permissions
4. **Monitor service account usage** via GCP Cloud Audit Logs
5. **Enable key expiration** if your organization policy requires it
6. **Store backups securely** in a password manager or secure vault
7. **Revoke compromised keys immediately**:
   ```bash
   gcloud iam service-accounts keys delete KEY_ID \
     --iam-account=SERVICE_ACCOUNT_EMAIL
   ```

---

## 📚 Additional Resources

- [Google Cloud Service Accounts Documentation](https://cloud.google.com/iam/docs/service-accounts)
- [Cloud Run IAM Permissions](https://cloud.google.com/run/docs/reference/iam/roles)
- [Firebase Service Accounts](https://firebase.google.com/docs/admin/setup#initialize-sdk)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Slack Incoming Webhooks](https://api.slack.com/messaging/webhooks)

---

## 📞 Support

For issues or questions related to service account setup:

- Open an issue in this repository
- Contact: support@photo2profit.app
- Check GitHub Actions logs for detailed error messages

---

**Last Updated:** 2025-11-12  
**Project:** Photo2Profit (photo2profitbaddie)  
**Region:** us-west2
