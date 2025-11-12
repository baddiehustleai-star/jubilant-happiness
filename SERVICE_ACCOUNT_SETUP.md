# Service Account Setup Guide

This guide explains how to set up service accounts and secrets for deploying the Photo2Profit application to Google Cloud Run and Firebase Hosting.

## Prerequisites

- Google Cloud Platform account
- Firebase project
- GitHub repository with Actions enabled
- Access to Google Cloud Console and Firebase Console

## Step 1: Google Cloud Service Account Setup

### 1.1 Create a Service Account

1. Navigate to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `photo2profitbaddie`
3. Go to **IAM & Admin** → **Service Accounts**
4. Click **+ CREATE SERVICE ACCOUNT**
5. Fill in the details:
   - **Service account name**: `github-actions-deployer`
   - **Service account ID**: `github-actions-deployer`
   - **Description**: "Service account for GitHub Actions CI/CD deployments"
6. Click **CREATE AND CONTINUE**

### 1.2 Assign Required Roles

Assign the following roles to the service account:

- **Cloud Run Admin** (`roles/run.admin`) - For deploying to Cloud Run
- **Service Account User** (`roles/iam.serviceAccountUser`) - For acting as service accounts
- **Storage Admin** (`roles/storage.admin`) - For managing Cloud Storage
- **Artifact Registry Administrator** (`roles/artifactregistry.admin`) - For managing container images

Click **CONTINUE** then **DONE**.

### 1.3 Create and Download Service Account Key

1. Click on the newly created service account
2. Go to the **KEYS** tab
3. Click **ADD KEY** → **Create new key**
4. Select **JSON** format
5. Click **CREATE**
6. The JSON key file will be downloaded automatically - **keep this file secure!**

## Step 2: Firebase Service Account Setup

### 2.1 Create Firebase Service Account

1. Navigate to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `photo2profitbaddie`
3. Click the gear icon ⚙️ → **Project settings**
4. Go to the **Service accounts** tab
5. Click **Generate new private key**
6. Download the JSON file - **keep this file secure!**

## Step 3: Add Secrets to GitHub Repository

### 3.1 Navigate to Repository Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### 3.2 Add Required Secrets

Add the following secrets:

#### GOOGLE_APPLICATION_CREDENTIALS_JSON
- **Name**: `GOOGLE_APPLICATION_CREDENTIALS_JSON`
- **Value**: Copy the entire contents of the Google Cloud service account JSON key file
- **Usage**: Used for authenticating with Google Cloud Run

#### FIREBASE_SERVICE_ACCOUNT
- **Name**: `FIREBASE_SERVICE_ACCOUNT`
- **Value**: Copy the entire contents of the Firebase service account JSON key file
- **Usage**: Used for deploying to Firebase Hosting

#### SLACK_WEBHOOK_URL (Optional)
- **Name**: `SLACK_WEBHOOK_URL`
- **Value**: Your Slack incoming webhook URL (e.g., `https://hooks.slack.com/services/...`)
- **Usage**: Sends deployment notifications to Slack

#### CRON_SECRET (Optional)
- **Name**: `CRON_SECRET`
- **Value**: A secure random string for authenticating cron endpoints
- **Usage**: Protects cron endpoints from unauthorized access

## Step 4: Verify Setup

### 4.1 Test Workflow Configuration

1. Push a change to the `main` branch that triggers the workflows:
   - Changes to `src/**`, `public/**`, or `vite.config.js` trigger frontend deployment
   - Changes to `api/**` trigger backend deployment

2. Monitor the GitHub Actions workflow runs:
   - Go to **Actions** tab in your GitHub repository
   - Check that the workflows complete successfully

### 4.2 Verify Deployments

#### Backend (Cloud Run)
```bash
# Get the Cloud Run service URL
gcloud run services describe photo2profit-api \
  --region us-west2 \
  --format='value(status.url)'

# Test the health endpoint
curl https://your-service-url.run.app/api/health
```

#### Frontend (Firebase Hosting)
```bash
# Visit your Firebase Hosting URL
# https://photo2profitbaddie.web.app (or your custom domain)
```

## Troubleshooting

### Authentication Errors

If you see authentication errors in GitHub Actions:

1. **Verify secret values**:
   - Ensure the entire JSON key is copied (including `{` and `}`)
   - Check for no extra spaces or newlines
   - Make sure the secret name matches exactly

2. **Check service account permissions**:
   - Verify the service account has the required roles
   - Ensure the service account is enabled

3. **Validate JSON format**:
   ```bash
   # Validate your JSON key locally
   cat service-account-key.json | jq .
   ```

### Cloud Run Deployment Fails

If Cloud Run deployment fails:

1. **Check project ID**: Ensure `PROJECT_ID` matches your GCP project
2. **Verify region**: Ensure `REGION` is correct (default: `us-west2`)
3. **Check quotas**: Verify you haven't exceeded GCP quotas
4. **Review logs**: Check Cloud Run logs in GCP Console

### Firebase Deployment Fails

If Firebase deployment fails:

1. **Verify Firebase project**: Ensure `projectId` in workflow matches your Firebase project
2. **Check service account**: Ensure the Firebase service account has Hosting permissions
3. **Review Firebase config**: Check that `firebase.json` or `.firebaserc` exists if needed

## Security Best Practices

1. **Never commit service account keys** to your repository
2. **Rotate keys regularly** (every 90 days recommended)
3. **Use least privilege**: Only grant necessary permissions
4. **Monitor usage**: Regularly review service account activity in GCP audit logs
5. **Use separate service accounts** for different environments (dev, staging, prod)

## Additional Resources

- [Google Cloud IAM Documentation](https://cloud.google.com/iam/docs)
- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)
- [GitHub Actions Security Hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Cloud Run Deployment Documentation](https://cloud.google.com/run/docs/deploying)
- [Firebase Hosting Deployment](https://firebase.google.com/docs/hosting/github-integration)

## Maintenance

### Updating Service Account Keys

When rotating keys:

1. Create a new key in GCP/Firebase Console
2. Update the secret in GitHub repository settings
3. Test the deployment
4. Delete the old key from GCP/Firebase Console

### Monitoring Deployments

Set up monitoring for:
- Deployment success/failure rates
- Cloud Run service health
- Firebase Hosting availability
- GitHub Actions workflow duration

---

**Last Updated**: 2025-11-12  
**Version**: 1.0  
**Maintainer**: Photo2Profit DevOps Team
