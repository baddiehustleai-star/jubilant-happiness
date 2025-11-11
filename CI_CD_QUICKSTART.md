# 🚀 CI/CD Quick Reference Card

## Quick Start (1 Minute)

```bash
# Read the full guide
cat CI_CD_SETUP_GUIDE.md

# Test the deployment
cd api
echo "// test" >> server.js
git add .
git commit -m "test: CI/CD"
git push origin main
```

## Required Secrets

Add these to GitHub Settings → Secrets and variables → Actions:

| Secret | Example |
|--------|---------|
| `GCP_PROJECT_ID` | `photo2profitbaddie` |
| `CLOUD_RUN_SERVICE` | `photo2profit-api` |
| `CLOUD_RUN_REGION` | `us-west2` |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | `{"type": "service_account",...}` |

## Optional Secrets (Notifications)

**Slack:**
- `SLACK_WEBHOOK_URL` → https://hooks.slack.com/services/...

**Email:**
- `NOTIFICATION_EMAIL` → your-email@example.com
- `SMTP_USERNAME` → your-gmail@gmail.com
- `SMTP_PASSWORD` → 16-char app password

## How It Works

1. **Push** changes to `api/` directory on `main` branch
2. **GitHub Actions** automatically:
   - Authenticates with Google Cloud
   - Builds Docker image from `api/Dockerfile`
   - Deploys to Cloud Run
   - Triggers SEO refresh
   - Sends notifications (if configured)
3. **Done!** API is live in 3-5 minutes

## Manual Deployment

GitHub → Actions → "Deploy to Cloud Run" → Run workflow

## Monitor Deployment

- **GitHub**: Actions tab → Deploy to Cloud Run
- **Google Cloud**: https://console.cloud.google.com/run
- **Logs**: `gcloud run logs tail photo2profit-api --region=us-west2`

## Test Deployment

```bash
# Get service URL from Cloud Run console
curl https://YOUR-SERVICE-URL/health
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Authentication failed | Check `GOOGLE_APPLICATION_CREDENTIALS_JSON` is valid |
| Service not found | Verify `CLOUD_RUN_SERVICE` name matches |
| Build failed | Check `api/Dockerfile` is valid |
| No deployment triggered | Changes must be in `api/` directory |

## Resources

- 📖 **Full Guide**: `CI_CD_SETUP_GUIDE.md`
- 🔧 **Workflow Docs**: `.github/workflows/DEPLOY_SETUP.md`
- 🌐 **Google Cloud**: https://console.cloud.google.com/run
- 📊 **GitHub Actions**: https://github.com/YOUR-REPO/actions

## Support

Questions? Check the troubleshooting section in `CI_CD_SETUP_GUIDE.md` or contact support@photo2profit.app
