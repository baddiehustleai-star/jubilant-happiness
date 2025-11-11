# 🚀 CI/CD Auto-Deploy Setup Guide for Cloud Run

This guide walks you through setting up automated deployment of your Photo2Profit API to Google Cloud Run whenever you push to the `main` branch.

## 📋 Prerequisites

Before setting up the CI/CD pipeline, ensure you have:

- A Google Cloud Project (current: `758851214311`)
- A GitHub repository with admin access
- The Photo2Profit API code in the `/api` folder

## 🔐 Step 1: Create Google Cloud Service Account

1. **Open Google Cloud Console**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project: `758851214311`

2. **Create Service Account**
   ```bash
   # Via gcloud CLI (recommended)
   gcloud iam service-accounts create github-actions-deployer \
     --display-name="GitHub Actions Deployer" \
     --project=758851214311
   ```
   
   Or via Console:
   - Navigate to **IAM & Admin** → **Service Accounts**
   - Click **+ CREATE SERVICE ACCOUNT**
   - Name: `github-actions-deployer`
   - Description: `Service account for GitHub Actions CI/CD`

3. **Grant Required Roles**
   
   The service account needs these roles:
   
   ```bash
   # Cloud Run Admin (to deploy services)
   gcloud projects add-iam-policy-binding 758851214311 \
     --member="serviceAccount:github-actions-deployer@758851214311.iam.gserviceaccount.com" \
     --role="roles/run.admin"
   
   # Service Account User (to deploy as service account)
   gcloud projects add-iam-policy-binding 758851214311 \
     --member="serviceAccount:github-actions-deployer@758851214311.iam.gserviceaccount.com" \
     --role="roles/iam.serviceAccountUser"
   
   # Storage Admin (for container images)
   gcloud projects add-iam-policy-binding 758851214311 \
     --member="serviceAccount:github-actions-deployer@758851214311.iam.gserviceaccount.com" \
     --role="roles/storage.admin"
   
   # Cloud Build Editor (to build containers)
   gcloud projects add-iam-policy-binding 758851214311 \
     --member="serviceAccount:github-actions-deployer@758851214311.iam.gserviceaccount.com" \
     --role="roles/cloudbuild.builds.editor"
   
   # Artifact Registry Administrator (to push images)
   gcloud projects add-iam-policy-binding 758851214311 \
     --member="serviceAccount:github-actions-deployer@758851214311.iam.gserviceaccount.com" \
     --role="roles/artifactregistry.admin"
   ```
   
   Or via Console:
   - Go to **IAM & Admin** → **IAM**
   - Find your service account
   - Click **Edit** (pencil icon)
   - Add these roles:
     - `Cloud Run Admin`
     - `Service Account User`
     - `Storage Admin`
     - `Cloud Build Editor`
     - `Artifact Registry Administrator`

4. **Create and Download JSON Key**
   
   ```bash
   # Via gcloud CLI
   gcloud iam service-accounts keys create github-actions-key.json \
     --iam-account=github-actions-deployer@758851214311.iam.gserviceaccount.com
   ```
   
   Or via Console:
   - Navigate to **IAM & Admin** → **Service Accounts**
   - Click on `github-actions-deployer`
   - Go to **Keys** tab
   - Click **ADD KEY** → **Create new key**
   - Choose **JSON** format
   - Click **CREATE** (file will download automatically)

   ⚠️ **Important**: Keep this JSON file secure! It provides full access to your GCP resources.

## 🔑 Step 2: Add GitHub Secrets

1. **Navigate to Repository Settings**
   - Go to: `https://github.com/baddiehustleai-star/jubilant-happiness`
   - Click **Settings** → **Secrets and variables** → **Actions**

2. **Add Required Secrets**
   
   Click **New repository secret** for each of these:

   | Secret Name | Value | Description |
   |------------|-------|-------------|
   | `GCP_PROJECT_ID` | `758851214311` | Your Google Cloud Project ID |
   | `CLOUD_RUN_SERVICE` | `photo2profit-api` | Name of your Cloud Run service |
   | `CLOUD_RUN_REGION` | `us-central1` | Cloud Run deployment region |
   | `GOOGLE_APPLICATION_CREDENTIALS_JSON` | Contents of JSON key file | Service account credentials (paste entire JSON) |

3. **Add Optional Slack Secret**
   
   For deployment notifications (recommended):
   
   | Secret Name | Value | Description |
   |------------|-------|-------------|
   | `SLACK_WEBHOOK_URL` | `https://hooks.slack.com/services/...` | Slack incoming webhook URL |

   To create a Slack webhook:
   - Go to [Slack API](https://api.slack.com/apps)
   - Create new app → Select **Incoming Webhooks**
   - Activate webhooks and add to your channel
   - Copy the webhook URL

## 📝 Step 3: Verify Workflow Configuration

The workflow file at `.github/workflows/deploy-cloudrun.yml` should already be configured. Here's what it does:

### Workflow Triggers
- **Automatic**: Triggers on every push to `main` branch
- **Manual**: Can be triggered manually from GitHub Actions tab

### Deployment Steps
1. ✅ **Checkout code**: Gets the latest code from repository
2. ✅ **Setup Node.js**: Installs Node.js 22
3. ✅ **Install dependencies**: Runs `npm ci` to install packages
4. ✅ **Verify build**: Ensures frontend builds successfully
5. ✅ **Authenticate with GCP**: Uses service account credentials
6. ✅ **Deploy to Cloud Run**: Deploys API from `/api` folder
7. ✅ **Trigger SEO refresh**: Calls optional SEO refresh endpoint
8. ✅ **Slack notifications**: Sends success/failure alerts

### Environment Variables Injected
- `NODE_ENV=production`
- `PROJECT_ID` (from GCP_PROJECT_ID secret)

## 🧪 Step 4: Test the Deployment

1. **Make a Test Change**
   
   ```bash
   # Make a small change to trigger deployment
   echo "# CI/CD Test" >> README.md
   git add README.md
   git commit -m "test: trigger CI/CD deployment"
   git push origin main
   ```

2. **Monitor Deployment**
   
   - Go to GitHub repository → **Actions** tab
   - Click on the running workflow
   - Watch each step complete
   - Check for any errors in the logs

3. **Verify Deployment**
   
   Once deployment completes:
   
   ```bash
   # Check service health
   curl https://photo2profit-api-758851214311.us-central1.run.app/health
   
   # Should return:
   # {"status":"healthy","timestamp":"..."}
   ```

4. **Check Slack Notification**
   
   If configured, you should receive a message like:
   
   ```
   ✅ Cloud Run Deploy Successful
   Service: photo2profit-api
   Region: us-central1
   Branch: main
   Commit: abc1234...
   ```

## 🔍 Step 5: Verify Service in GCP Console

1. **Navigate to Cloud Run**
   - Go to [Cloud Run Console](https://console.cloud.google.com/run)
   - Select your project: `758851214311`
   - Find service: `photo2profit-api`

2. **Check Service Details**
   - **Status**: Should show green "Receiving traffic"
   - **URL**: Your service endpoint
   - **Last deployed**: Should match your latest commit time
   - **Revisions**: Latest revision should be serving 100% traffic

3. **View Logs**
   - Click on **LOGS** tab
   - Check for any startup errors or warnings
   - Verify successful container startup

## 🎯 What Happens on Each Push to Main

1. GitHub Actions workflow triggers automatically
2. Code is checked out and dependencies installed
3. Frontend build is verified (catches build errors early)
4. Service account authenticates with Google Cloud
5. Docker image is built from `/api` folder
6. Image is pushed to Artifact Registry
7. Cloud Run service is updated with new image
8. Health check endpoint is verified
9. SEO refresh is triggered (optional)
10. Slack notification is sent with deployment status

## 🔧 Troubleshooting

### Deployment Fails with Authentication Error

**Problem**: `ERROR: (gcloud.auth.activate-service-account) Could not activate service account`

**Solution**:
- Verify `GOOGLE_APPLICATION_CREDENTIALS_JSON` secret contains valid JSON
- Ensure you pasted the entire JSON file content
- Check that service account still exists in GCP

### Deployment Fails with Permission Denied

**Problem**: `Permission denied on resource project [758851214311]`

**Solution**:
- Verify service account has all required roles (see Step 1)
- Wait 60 seconds after granting roles (IAM propagation delay)
- Check IAM policy: `gcloud projects get-iam-policy 758851214311`

### Build Fails with "Source does not contain required file"

**Problem**: Dockerfile not found

**Solution**:
- Ensure Dockerfile exists at `/api/Dockerfile`
- Check workflow uses `source: ./api`

### Deployment Succeeds but Service Returns 500

**Problem**: Application errors after deployment

**Solution**:
- Check Cloud Run logs: `gcloud run services logs read photo2profit-api`
- Verify environment variables are set correctly
- Check for missing dependencies in package.json
- Ensure port 8080 is used (Cloud Run requirement)

### No Slack Notification Received

**Problem**: Workflow completes but no Slack message

**Solution**:
- Verify `SLACK_WEBHOOK_URL` secret is set correctly
- Test webhook URL manually:
  ```bash
  curl -X POST YOUR_WEBHOOK_URL \
    -H "Content-Type: application/json" \
    -d '{"text":"Test message"}'
  ```
- Check webhook is still active in Slack settings

## 📚 Additional Resources

- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Deploy Cloud Run GitHub Action](https://github.com/google-github-actions/deploy-cloudrun)
- [Service Account Best Practices](https://cloud.google.com/iam/docs/best-practices-service-accounts)

## 🎉 Success Checklist

Once everything is set up correctly, you should have:

- [x] Service account created with proper roles
- [x] GitHub secrets configured
- [x] Workflow file in repository
- [x] Successful test deployment
- [x] Service accessible at Cloud Run URL
- [x] Slack notifications working (if configured)
- [x] Automatic deployments on push to main

## 🔐 Security Best Practices

1. **Never commit the service account JSON key** to your repository
2. **Use GitHub Secrets** for all sensitive credentials
3. **Limit service account permissions** to only what's needed
4. **Rotate service account keys** periodically (every 90 days)
5. **Enable Cloud Audit Logs** to track deployments
6. **Use branch protection rules** on main branch
7. **Require pull request reviews** before merging to main

## 🚀 Next Steps

After CI/CD is set up:

1. **Set up staging environment**: Create separate service for testing
2. **Add health checks**: Implement `/health` endpoint monitoring
3. **Configure auto-scaling**: Adjust min/max instances based on traffic
4. **Set up Cloud Monitoring**: Create alerts for errors and latency
5. **Implement rollback strategy**: Quick revert to previous revision
6. **Add deployment approval**: Require manual approval for production

---

**Need Help?** Check the [troubleshooting section](#-troubleshooting) or review the workflow logs in GitHub Actions.
