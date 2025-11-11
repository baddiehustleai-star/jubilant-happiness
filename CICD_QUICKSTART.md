# 🚀 CI/CD Auto-Deploy Quick Start

Get your Photo2Profit deployment pipeline running in 5 minutes!

## ⚡ What You Get

Every push to `main` automatically:
- ✅ Deploys API to **Google Cloud Run**
- ✅ Refreshes SEO metadata
- ✅ Sends **Slack notifications**
- ✅ No manual deploys ever again!

## 📋 Prerequisites

- Google Cloud Platform account with billing enabled
- GitHub repository access
- (Optional) Slack workspace for notifications

## 🔧 Setup Steps

### 1. Create Google Service Account

```bash
# 1. Go to Google Cloud Console
https://console.cloud.google.com/iam-admin/serviceaccounts

# 2. Select project: photo2profitbaddie

# 3. Create Service Account
#    - Name: github-actions-deployer
#    - Roles: Cloud Run Admin, Service Account User, Storage Admin

# 4. Create JSON Key
#    - Actions → Manage Keys → Add Key → Create New Key → JSON
#    - Download the JSON file
```

### 2. Add GitHub Secrets

Go to: **Settings → Secrets and variables → Actions**

Add these secrets:

| Secret Name                           | Value                        |
| ------------------------------------- | ---------------------------- |
| `GCP_PROJECT_ID`                      | `photo2profitbaddie`         |
| `CLOUD_RUN_SERVICE`                   | `photo2profit-api`           |
| `CLOUD_RUN_REGION`                    | `us-west2`                   |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | `{...paste entire JSON...}`  |
| `SLACK_WEBHOOK_URL` _(optional)_      | `https://hooks.slack.com/...`|

### 3. Test the Workflow

```bash
# Push to main branch
git add .
git commit -m "test: trigger Cloud Run deploy"
git push origin main

# Watch GitHub Actions tab
# You should see: Deploy to Cloud Run ✅
```

## 📚 Full Documentation

For detailed setup instructions, troubleshooting, and advanced configuration:

- **Complete Guide:** [`GITHUB_SECRETS_SETUP.md`](./GITHUB_SECRETS_SETUP.md)
- **Workflow Details:** [`.github/workflows/DEPLOY_SETUP.md`](./.github/workflows/DEPLOY_SETUP.md)
- **Cloud Run Workflow:** [`.github/workflows/deploy-cloudrun.yml`](./.github/workflows/deploy-cloudrun.yml)

## 🎯 How It Works

The workflow (`.github/workflows/deploy-cloudrun.yml`) runs automatically:

1. **Trigger:** Push to `main` branch
2. **Build:** Installs dependencies and runs build
3. **Deploy:** Authenticates to GCP and deploys to Cloud Run
4. **Refresh:** Triggers SEO metadata refresh
5. **Notify:** Sends success/failure to Slack

## ✅ Verify Deployment

After deployment completes:

```bash
# Check service is running
curl https://photo2profit-api-$GCP_PROJECT_ID.$CLOUD_RUN_REGION.run.app/health

# Test API endpoint
curl https://photo2profit-api-$GCP_PROJECT_ID.$CLOUD_RUN_REGION.run.app/api/status
```

## 🆘 Quick Troubleshooting

**Authentication failed?**
- Check JSON key is complete (starts with `{`, ends with `}`)
- Verify service account has Cloud Run Admin role

**Service not found?**
- Confirm service name matches `CLOUD_RUN_SERVICE`
- Check region matches `CLOUD_RUN_REGION`

**Build failed?**
- Test locally: `npm run build`
- Check all dependencies are in `package.json`

**Need help?** See full troubleshooting guide in [`GITHUB_SECRETS_SETUP.md`](./GITHUB_SECRETS_SETUP.md#-troubleshooting)

## 🎉 What's Next?

Once CI/CD is working:
- Set up Slack notifications (see [`SLACK_NOTIFICATIONS_SETUP.md`](./SLACK_NOTIFICATIONS_SETUP.md))
- Configure Vercel frontend deployment
- Add Firebase secrets for full-stack deployment
- Enable automated testing in pipeline

---

**Ready to ship?** Push your code and watch it deploy automatically! 🚀
