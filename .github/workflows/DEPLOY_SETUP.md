# 🚀 Cloud Run Auto-Deploy Setup

This workflow automatically deploys Photo2Profit API to Google Cloud Run on every push to `main`.

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

## Getting the Google Service Account JSON

1. Go to [Google Cloud Console → IAM & Admin → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Select your project: `photo2profitbaddie`
3. Click **Create Service Account**
4. Name: `github-actions-deployer`
5. Grant roles:
   - **Cloud Run Admin**
   - **Service Account User**
   - **Storage Admin** (if using Cloud Storage)
6. Click **Create Key** → JSON
7. Copy the entire JSON content and paste into `GOOGLE_APPLICATION_CREDENTIALS_JSON` secret

## What Happens on Push to Main

1. ✅ Checkout code
2. ✅ Install Node 22 dependencies
3. ✅ Run build (if `npm run build` exists)
4. ✅ Authenticate to Google Cloud
5. ✅ Deploy to Cloud Run
6. ✅ Trigger SEO refresh endpoint (optional post-deploy hook)
7. ✅ Send Slack notification (if webhook configured)

## Testing the Workflow

```bash
git add .
git commit -m "test: trigger Cloud Run deploy"
git push origin main
```

Then watch the **Actions** tab in GitHub for live logs.

## Manual Deploy (if needed)

If you need to deploy manually from your local machine:

```bash
gcloud run deploy photo2profit-api \
  --source . \
  --region us-west2 \
  --platform managed \
  --allow-unauthenticated
```

## Troubleshooting

### "Authentication failed"

- Verify `GOOGLE_APPLICATION_CREDENTIALS_JSON` is valid JSON
- Check service account has Cloud Run Admin role

### "Service not found"

- Verify `CLOUD_RUN_SERVICE` matches your actual service name
- Check `CLOUD_RUN_REGION` is correct

### "Build failed"

- Check `package.json` scripts
- Ensure all dependencies are in `package.json` (not just dev)

### Slack notifications not working

- Verify `SLACK_WEBHOOK_URL` is set and valid
- Test webhook with: `curl -X POST -H 'Content-Type: application/json' -d '{"text":"test"}' YOUR_WEBHOOK_URL`

## Security Notes

- Never commit service account JSON to the repo
- Rotate keys every 90 days
- Use least-privilege IAM roles
- Store secrets only in GitHub Secrets (encrypted at rest)
