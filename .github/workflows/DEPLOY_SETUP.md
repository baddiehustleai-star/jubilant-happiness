# 🚀 Cloud Run Auto-Deploy Setup

This workflow automatically deploys Photo2Profit API to Google Cloud Run on every push to `main` that modifies the `api` directory.

## Features

✅ **Automated Deployment** - Deploys on push to main (when api/* files change)  
✅ **Manual Trigger** - Deploy anytime via workflow_dispatch  
✅ **Slack Notifications** - Real-time deployment status (optional)  
✅ **Email Notifications** - Deployment alerts via email (optional)  
✅ **SEO Refresh** - Automatically triggers SEO refresh after deployment  
✅ **Smart Path Filtering** - Only deploys when API code changes  

## Required GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

```
GCP_PROJECT_ID=photo2profitbaddie
CLOUD_RUN_SERVICE=photo2profit-api
CLOUD_RUN_REGION=us-west2
GOOGLE_APPLICATION_CREDENTIALS_JSON=<your service account JSON key>
```

### Optional (for Slack notifications)

```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Optional (for Email notifications)

```
NOTIFICATION_EMAIL=your-email@example.com
SMTP_USERNAME=your-smtp-username@gmail.com
SMTP_PASSWORD=your-smtp-app-password
```

**Note for Gmail:** Use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password.

## Getting the Google Service Account JSON

1. Go to [Google Cloud Console → IAM & Admin → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Select your project: `photo2profitbaddie`
3. Click **Create Service Account**
4. Name: `github-actions-deployer`
5. Grant roles:
   - **Cloud Run Admin**
   - **Service Account User**
   - **Storage Admin** (if using Cloud Storage)
   - **Artifact Registry Administrator** (for container images)
6. Click **Create Key** → JSON
7. Copy the entire JSON content and paste into `GOOGLE_APPLICATION_CREDENTIALS_JSON` secret

## What Happens on Push to Main

The workflow is triggered when:
- Code in the `api/` directory changes
- The workflow file itself is updated
- Manual trigger via GitHub Actions UI

Steps executed:
1. ✅ Checkout code
2. ✅ Authenticate to Google Cloud
3. ✅ Build Docker image from `api/Dockerfile`
4. ✅ Deploy to Cloud Run with proper resource limits
5. ✅ Trigger SEO refresh endpoint (optional post-deploy hook)
6. ✅ Send Slack notification (if webhook configured)
7. ✅ Send Email notification (if SMTP configured)

## Testing the Workflow

### Automatic Trigger
```bash
# Make a change to the API
echo "// test change" >> api/server.js
git add api/server.js
git commit -m "test: trigger Cloud Run deploy"
git push origin main
```

### Manual Trigger
1. Go to **Actions** tab in GitHub
2. Select **Deploy to Cloud Run** workflow
3. Click **Run workflow** button
4. Select branch and click **Run workflow**

Then watch the **Actions** tab in GitHub for live logs.

## Manual Deploy (if needed)

If you need to deploy manually from your local machine:

```bash
cd api
./deploy.sh
```

Or using gcloud directly:

```bash
gcloud run deploy photo2profit-api \
  --source ./api \
  --region us-west2 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10
```

## Troubleshooting

### "Authentication failed"
- Verify `GOOGLE_APPLICATION_CREDENTIALS_JSON` is valid JSON
- Check service account has Cloud Run Admin role
- Ensure service account has Artifact Registry Administrator role

### "Service not found"
- Verify `CLOUD_RUN_SERVICE` matches your actual service name
- Check `CLOUD_RUN_REGION` is correct
- Ensure service exists in Cloud Run console

### "Build failed"
- Check `api/Dockerfile` is valid
- Ensure all dependencies are properly specified
- Check Cloud Build logs in GCP Console

### Slack notifications not working
- Verify `SLACK_WEBHOOK_URL` is set and valid
- Test webhook with: `curl -X POST -H 'Content-Type: application/json' -d '{"text":"test"}' YOUR_WEBHOOK_URL`

### Email notifications not working
- Verify all three email secrets are set (`NOTIFICATION_EMAIL`, `SMTP_USERNAME`, `SMTP_PASSWORD`)
- For Gmail, ensure you're using an App Password, not your regular password
- Check that "Less secure app access" is not blocking the connection

### Deployment not triggered
- Check that changes were made to files in the `api/` directory
- Review workflow run logs in Actions tab
- Verify workflow file syntax is valid

## Resource Configuration

The workflow deploys with these default settings:
- **Port**: 8080
- **Memory**: 1Gi
- **CPU**: 1 core
- **Max Instances**: 10
- **Environment**: `NODE_ENV=production`

To modify these, edit the `flags` parameter in `.github/workflows/deploy-cloudrun.yml`.

## Security Notes

- Never commit service account JSON to the repo
- Rotate keys every 90 days
- Use least-privilege IAM roles
- Store secrets only in GitHub Secrets (encrypted at rest)
- Use App Passwords for email (never your main password)
- Regularly audit service account permissions
