# Service Account Setup Guide

This guide walks you through setting up Google Cloud service accounts required for automated deployments of Photo2Profit to Google Cloud Run (backend) and Firebase Hosting (frontend).

## Prerequisites

- Google Cloud project: `photo2profitbaddie` (or your project ID)
- Project number: `758851214311` (visible in GCP Console → Project Settings)
- Admin access to the Google Cloud project
- Admin access to the GitHub repository settings

## Overview

The deployment workflows require two service account credentials:

1. **GOOGLE_APPLICATION_CREDENTIALS_JSON** - For Google Cloud Run deployments (backend)
2. **FIREBASE_SERVICE_ACCOUNT** - For Firebase Hosting deployments (frontend)

## Part 1: Google Cloud Service Account for Cloud Run

### Step 1: Create a Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `photo2profitbaddie`
3. Navigate to **IAM & Admin** → **Service Accounts**
4. Click **+ CREATE SERVICE ACCOUNT**
5. Fill in the details:
   - **Service account name**: `github-actions-deploy`
   - **Service account ID**: `github-actions-deploy` (auto-generated)
   - **Description**: `Service account for GitHub Actions to deploy to Cloud Run`
6. Click **CREATE AND CONTINUE**

### Step 2: Grant Required Roles

Grant the following roles to the service account:

1. **Cloud Run Admin** (`roles/run.admin`)
   - Required to deploy and manage Cloud Run services
2. **Service Account User** (`roles/iam.serviceAccountUser`)
   - Required to deploy Cloud Run services as other service accounts
3. **Storage Admin** (`roles/storage.admin`)
   - Required for Cloud Build to store artifacts
4. **Cloud Build Service Account** (`roles/cloudbuild.builds.builder`)
   - Required to trigger builds from source code

Click **CONTINUE** after adding roles.

### Step 3: Create and Download Service Account Key

1. Click **DONE** to finish creating the service account
2. Find your service account in the list and click on it
3. Go to the **KEYS** tab
4. Click **ADD KEY** → **Create new key**
5. Select **JSON** format
6. Click **CREATE**
7. The key file will download automatically (e.g., `photo2profitbaddie-abc123def456.json`)
8. ⚠️ **IMPORTANT**: Keep this file secure and never commit it to version control

### Step 4: Format the Key for GitHub Secrets

The JSON key needs to be added as a GitHub secret. You can use it as-is (multiline JSON).

Example key structure:

```json
{
  "type": "service_account",
  "project_id": "photo2profitbaddie",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "github-actions-deploy@photo2profitbaddie.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

## Part 2: Firebase Service Account for Hosting

### Option A: Use Existing Service Account (Recommended)

If you already created the service account above, you can reuse it:

1. Go to your service account in **IAM & Admin** → **Service Accounts**
2. Add the **Firebase Admin** role (`roles/firebase.admin`)
3. Use the same JSON key from Part 1, Step 4

### Option B: Create Separate Service Account

Follow the same steps as Part 1, but:

- Name: `github-actions-firebase`
- Roles needed:
  - **Firebase Admin** (`roles/firebase.admin`)
  - **Firebase Hosting Admin** (`roles/firebasehosting.admin`)

## Part 3: Enable Required APIs

Enable these APIs in your Google Cloud project:

1. Go to **APIs & Services** → **Library**
2. Search for and enable each:
   - **Cloud Run API**
   - **Cloud Build API**
   - **Firebase Hosting API**
   - **Firebase Management API**
   - **Service Usage API**

Or use gcloud CLI:

```bash
gcloud services enable run.googleapis.com \
  cloudbuild.googleapis.com \
  firebasehosting.googleapis.com \
  firebase.googleapis.com \
  serviceusage.googleapis.com \
  --project=photo2profitbaddie
```

## Part 4: Configure GitHub Actions Secrets

### Step 1: Add Secrets to GitHub Repository

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### Step 2: Add GOOGLE_APPLICATION_CREDENTIALS_JSON

- **Name**: `GOOGLE_APPLICATION_CREDENTIALS_JSON`
- **Value**: Paste the entire JSON key file content from Part 1, Step 4
- Click **Add secret**

### Step 3: Add FIREBASE_SERVICE_ACCOUNT

- **Name**: `FIREBASE_SERVICE_ACCOUNT`
- **Value**: Paste the entire JSON key file content (same as above if using Option A)
- Click **Add secret**

### Step 4: Optional Secrets

For complete functionality, also add:

- **SLACK_WEBHOOK_URL** (optional): For deployment notifications
  - Get from Slack: Create an Incoming Webhook in your workspace
- **CRON_SECRET** (optional): For securing the SEO refresh endpoint
  - Generate a random string: `openssl rand -hex 32`

## Part 5: Grant Cloud Build Service Account Permissions

The Cloud Build default service account needs permissions to deploy:

1. Go to **IAM & Admin** → **IAM**
2. Find the service account: `758851214311@cloudbuild.gserviceaccount.com`
   - This is automatically created when Cloud Build is enabled
3. Click the **Edit** (pencil) icon
4. Add these roles if not present:
   - **Cloud Run Admin** (`roles/run.admin`)
   - **Service Account User** (`roles/iam.serviceAccountUser`)
5. Click **SAVE**

## Verification

### Test Backend Deployment

1. Push a change to the `api/` directory on the `main` branch
2. Check **Actions** tab in GitHub to see the workflow run
3. Verify deployment in [Cloud Run Console](https://console.cloud.google.com/run?project=photo2profitbaddie)

### Test Frontend Deployment

1. Push a change to the `src/` directory on the `main` branch
2. Check **Actions** tab in GitHub to see the workflow run
3. Verify deployment in [Firebase Console](https://console.firebase.google.com/project/photo2profitbaddie/hosting)

## Troubleshooting

### "Permission denied" errors

- Verify all required roles are granted to the service account
- Check that APIs are enabled
- Ensure the service account key is correctly formatted in GitHub secrets

### "Service account does not have permission to act as"

- Add **Service Account User** role to your service account
- Ensure Cloud Build service account has necessary permissions

### "Cannot find service"

- Verify the service name matches: `photo2profit-api`
- Check the region matches: `us-west2`
- Ensure Cloud Run API is enabled

### "Firebase project not found"

- Verify the project ID: `photo2profitbaddie`
- Ensure Firebase is enabled for your Google Cloud project
- Check that Firebase Hosting API is enabled

## Security Best Practices

1. ✅ **Never commit service account keys** to version control
2. ✅ **Use repository secrets** for all credentials
3. ✅ **Rotate keys regularly** (every 90 days recommended)
4. ✅ **Grant minimum required permissions** (principle of least privilege)
5. ✅ **Monitor service account usage** in Cloud Console → IAM → Service Accounts
6. ✅ **Enable audit logs** to track service account activity

## Additional Resources

- [Google Cloud IAM Documentation](https://cloud.google.com/iam/docs)
- [Cloud Run Deployment](https://cloud.google.com/run/docs/deploying)
- [Firebase Hosting GitHub Action](https://github.com/FirebaseExtended/action-hosting-deploy)
- [Managing Service Account Keys](https://cloud.google.com/iam/docs/creating-managing-service-account-keys)

## Support

For issues or questions:

- 📧 Email: [support@photo2profit.app](mailto:support@photo2profit.app)
- 🐛 GitHub Issues: [Create an issue](https://github.com/baddiehustleai-star/jubilant-happiness/issues)
