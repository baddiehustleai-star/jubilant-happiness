# 🎯 Cloud Run CI/CD Quick Reference

## Required GitHub Secrets

Add these at: **Settings → Secrets and variables → Actions**

```
GCP_PROJECT_ID=photo2profitbaddie
CLOUD_RUN_SERVICE=photo2profit-api
CLOUD_RUN_REGION=us-west2
GOOGLE_APPLICATION_CREDENTIALS_JSON=<paste entire JSON key>
```

Optional:
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

---

## Service Account Setup (One-Time)

1. Go to: [GCP Console → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Select project: `photo2profitbaddie`
3. Create service account: `github-deploy-bot`
4. Add roles:
   - Cloud Run Admin
   - Service Account User
   - Storage Admin (optional)
5. Create JSON key
6. Copy entire JSON → GitHub secret `GOOGLE_APPLICATION_CREDENTIALS_JSON`

---

## Deployment Process

```bash
# Push to main = automatic deployment
git add .
git commit -m "your message"
git push origin main
```

**Then:** Check **Actions** tab in GitHub for live deployment status

---

## Verify Deployment

```bash
curl https://photo2profit-api-photo2profitbaddie.us-west2.run.app/health
```

Expected: `{"status": "ok", ...}`

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| Authentication failed | Check JSON key is complete and valid |
| Service not found | Verify service name and region match |
| Build failed | Test locally: `npm run build` |
| Permission denied | Check service account has Cloud Run Admin role |

---

## Full Documentation

See: [CLOUD_RUN_CI_CD_SETUP.md](./CLOUD_RUN_CI_CD_SETUP.md)
