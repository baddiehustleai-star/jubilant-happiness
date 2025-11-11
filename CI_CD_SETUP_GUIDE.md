# 🚀 CI/CD Auto-Deploy Setup Guide for Photo2Profit

This guide will help you set up automated deployment of your Photo2Profit API to Google Cloud Run with CI/CD via GitHub Actions.

## 📋 Overview

The CI/CD pipeline automatically deploys your Photo2Profit API to Google Cloud Run whenever you push changes to the `main` branch. It includes:

- ✅ **Automated Deployment** on code changes
- ✅ **Manual Deployment** trigger option
- ✅ **Slack Notifications** (optional)
- ✅ **Email Notifications** (optional)
- ✅ **SEO Refresh** endpoint trigger
- ✅ **Smart Path Filtering** (only deploys when API changes)

## 🎯 Quick Start (5 Minutes)

### Step 1: Create Google Cloud Service Account

1. Go to [Google Cloud Console → IAM & Admin → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Select your project (e.g., `photo2profitbaddie` or `758851214311`)
3. Click **Create Service Account**
4. Fill in details:
   - **Name**: `github-actions-deployer`
   - **Description**: `Service account for GitHub Actions CI/CD`
5. Click **Create and Continue**
6. Grant the following roles:
   - `Cloud Run Admin`
   - `Service Account User`
   - `Artifact Registry Administrator`
   - `Storage Admin` (if using Cloud Storage)
7. Click **Continue** → **Done**
8. Find your new service account in the list and click on it
9. Go to **Keys** tab → **Add Key** → **Create new key**
10. Select **JSON** format → **Create**
11. Save the downloaded JSON file securely (you'll need it in Step 2)

### Step 2: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each of the following:

#### Required Secrets:

| Secret Name | Value | Example |
|------------|-------|---------|
| `GCP_PROJECT_ID` | Your GCP project ID | `photo2profitbaddie` or `758851214311` |
| `CLOUD_RUN_SERVICE` | Your Cloud Run service name | `photo2profit-api` |
| `CLOUD_RUN_REGION` | Your Cloud Run region | `us-west2` or `us-central1` |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | Full contents of the JSON key file | `{"type": "service_account", ...}` |

**Important:** For `GOOGLE_APPLICATION_CREDENTIALS_JSON`, paste the **entire contents** of the JSON file you downloaded in Step 1.

#### Optional Secrets (for Slack notifications):

| Secret Name | Value |
|------------|-------|
| `SLACK_WEBHOOK_URL` | Your Slack webhook URL (see [Slack Setup](#slack-notifications-setup)) |

#### Optional Secrets (for Email notifications):

| Secret Name | Value | Notes |
|------------|-------|-------|
| `NOTIFICATION_EMAIL` | `your-email@example.com` | Where to send notifications |
| `SMTP_USERNAME` | `your-smtp-user@gmail.com` | Gmail address for sending |
| `SMTP_PASSWORD` | `your-app-password` | Gmail App Password (see [Email Setup](#email-notifications-setup)) |

### Step 3: Enable Required Google Cloud APIs

Run these commands in your terminal (requires [gcloud CLI](https://cloud.google.com/sdk/docs/install)):

```bash
# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

### Step 4: Test Your Setup

#### Option A: Push a Change

```bash
# Make a small change to the API
cd api
echo "// CI/CD test" >> server.js

# Commit and push
git add api/server.js
git commit -m "test: trigger CI/CD deployment"
git push origin main
```

#### Option B: Manual Trigger

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **Deploy to Cloud Run** workflow
4. Click **Run workflow**
5. Select `main` branch
6. Click **Run workflow** button

### Step 5: Monitor Deployment

1. Go to **Actions** tab in your GitHub repository
2. Click on the running workflow
3. Watch the deployment progress in real-time
4. Check your Cloud Run console: [https://console.cloud.google.com/run](https://console.cloud.google.com/run)

## 📧 Email Notifications Setup

To receive email alerts for deployments:

### Using Gmail:

1. Go to your [Google Account Security page](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select **Mail** and your device
5. Click **Generate**
6. Copy the 16-character password
7. Add these GitHub secrets:
   - `NOTIFICATION_EMAIL`: Your email address to receive notifications
   - `SMTP_USERNAME`: Your Gmail address
   - `SMTP_PASSWORD`: The 16-character app password from step 6

### Using Other SMTP Providers:

You may need to modify the workflow file to use different SMTP settings. Edit `.github/workflows/deploy-cloudrun.yml` and update:
- `server_address` (default: `smtp.gmail.com`)
- `server_port` (default: `587`)

## 💬 Slack Notifications Setup

To receive Slack alerts for deployments:

1. Go to [Slack API - Incoming Webhooks](https://api.slack.com/messaging/webhooks)
2. Click **Create your Slack app**
3. Choose **From scratch**
4. Name your app (e.g., "Photo2Profit CI/CD")
5. Select your workspace
6. Click **Incoming Webhooks**
7. Toggle **Activate Incoming Webhooks** to On
8. Click **Add New Webhook to Workspace**
9. Select the channel to post to
10. Click **Allow**
11. Copy the Webhook URL (starts with `https://hooks.slack.com/services/`)
12. Add it as `SLACK_WEBHOOK_URL` secret in GitHub

## 🔍 Workflow Details

### When Does it Deploy?

The workflow is triggered when:
- Code in the `api/` directory is changed and pushed to `main`
- The workflow file itself (`.github/workflows/deploy-cloudrun.yml`) is updated
- Manually triggered via GitHub Actions UI

### What Happens During Deployment?

1. **Checkout Code** - Gets the latest code from the repository
2. **Authenticate** - Logs into Google Cloud using service account
3. **Build & Deploy** - Builds Docker image and deploys to Cloud Run with:
   - Port: 8080
   - Memory: 1Gi
   - CPU: 1 core
   - Max instances: 10
   - Environment: `NODE_ENV=production`
4. **SEO Refresh** - Triggers the SEO refresh endpoint (if successful)
5. **Notify** - Sends notifications to Slack/Email (if configured)

### Deployment Time

Typical deployment takes **3-5 minutes**:
- Checkout: ~10 seconds
- Authentication: ~5 seconds
- Build & Deploy: ~2-4 minutes
- Post-deploy hooks: ~10 seconds

## 🛠 Customization

### Change Resource Limits

Edit `.github/workflows/deploy-cloudrun.yml` and modify the `flags` parameter:

```yaml
flags: '--port=8080 --memory=2Gi --cpu=2 --max-instances=20 --set-env-vars=NODE_ENV=production'
```

### Add Environment Variables

Add to the `flags` parameter:

```yaml
flags: '--port=8080 --memory=1Gi --set-env-vars=NODE_ENV=production,MY_VAR=value'
```

### Change Trigger Conditions

Edit the `on.push.paths` section:

```yaml
on:
  push:
    branches:
      - main
      - staging  # Add more branches
    paths:
      - 'api/**'
      - 'shared/**'  # Add more paths
```

## 🐛 Troubleshooting

### Deployment Fails with "Authentication failed"

**Cause**: Invalid service account credentials

**Fix**:
1. Verify `GOOGLE_APPLICATION_CREDENTIALS_JSON` is valid JSON
2. Check the service account has required roles
3. Ensure the service account key hasn't been deleted or expired
4. Re-create the service account key if needed

### Deployment Fails with "Service not found"

**Cause**: Cloud Run service doesn't exist or name mismatch

**Fix**:
1. Check `CLOUD_RUN_SERVICE` matches the actual service name
2. Verify service exists in Cloud Run console
3. Create the service manually first:
   ```bash
   cd api
   ./deploy.sh
   ```

### Deployment Fails with "Permission denied"

**Cause**: Service account lacks required permissions

**Fix**:
1. Go to IAM & Admin in Google Cloud Console
2. Find your service account
3. Add missing roles:
   - Cloud Run Admin
   - Service Account User
   - Artifact Registry Administrator

### Workflow Doesn't Trigger

**Cause**: Changes not in the `api/` directory

**Fix**:
- Ensure your changes are in files under `api/`
- Or edit workflow to remove path filtering

### Email Notifications Not Working

**Cause**: SMTP credentials invalid or Gmail blocking

**Fix**:
1. Verify all three secrets are set correctly
2. For Gmail, ensure you're using an App Password, not your regular password
3. Check 2-Factor Authentication is enabled on your Google account
4. Try sending a test email manually to verify SMTP settings

### Slack Notifications Not Working

**Cause**: Invalid webhook URL

**Fix**:
1. Test the webhook manually:
   ```bash
   curl -X POST YOUR_WEBHOOK_URL \
     -H 'Content-Type: application/json' \
     -d '{"text":"test message"}'
   ```
2. Verify the webhook URL is correct and not expired
3. Check the Slack app has permission to post to the channel

### Build Takes Too Long

**Cause**: Large dependencies or slow build

**Fix**:
1. Optimize your Dockerfile
2. Use multi-stage builds
3. Leverage Docker layer caching
4. Consider increasing Cloud Run build resources

## 📊 Monitoring

### View Deployment History

1. Go to **Actions** tab in GitHub
2. Click **Deploy to Cloud Run** workflow
3. See all past runs with status, duration, and logs

### View Service Logs

```bash
# Stream logs
gcloud run logs tail photo2profit-api --region=us-west2

# View recent logs
gcloud run logs read photo2profit-api --region=us-west2 --limit=50
```

### Check Service Status

```bash
# Get service details
gcloud run services describe photo2profit-api --region=us-west2

# Test health endpoint
curl https://YOUR_SERVICE_URL/health
```

## 🔒 Security Best Practices

1. **Rotate Keys Regularly**
   - Rotate service account keys every 90 days
   - Set up calendar reminders

2. **Use Least Privilege**
   - Only grant necessary IAM roles
   - Use separate service accounts for different purposes

3. **Monitor Access**
   - Enable Cloud Audit Logs
   - Review service account usage regularly

4. **Secure Secrets**
   - Never commit secrets to Git
   - Use GitHub Secrets for all sensitive data
   - Rotate SMTP passwords periodically

5. **Enable Protection**
   - Enable branch protection on `main`
   - Require PR reviews before merging
   - Run CI checks before deployment

## 🎓 Learn More

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Run Deployment Guide](https://cloud.google.com/run/docs/deploying)
- [Slack Incoming Webhooks](https://api.slack.com/messaging/webhooks)

## 📞 Support

For issues or questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review workflow logs in GitHub Actions
- Check Cloud Build logs in GCP Console
- Contact: support@photo2profit.app

---

**Ready to Deploy? 🚀**

Follow the [Quick Start](#-quick-start-5-minutes) guide above and you'll be up and running in 5 minutes!
