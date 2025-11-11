# 🚀 Deployment Pipeline Summary

Complete CI/CD setup for Photo2Profit with automated deployments and notifications.

## ✅ What's Configured

### 1. Render Infrastructure (`render.yaml`)

- **Postgres database** (free tier)
- **API service** (Express + Prisma + BullMQ)
- **Dashboard** (Vite static site)
- **Worker service** (optional, for queue processing)

Auto-wired environment variables:

- `DATABASE_URL` → from Postgres
- `VITE_API_BASE` → from API service URL
- Manual: `REDIS_URL` (Upstash), `JWT_SECRET`, `SHARED_WEBHOOK_SECRET`

### 2. GitHub Actions Workflow (`.github/workflows/deploy.yaml`)

Triggers on:

- Push to `main` branch
- Manual workflow dispatch

Steps:

1. ✅ Checkout code
2. ✅ Install Render CLI
3. ✅ Authenticate with Render API
4. ✅ Deploy all services from blueprint
5. ✅ Send Slack notification (success or failure)

### 3. Slack Notifications

- Color-coded messages (green = success, red = failure)
- Rich context: repo, branch, commit, actor, timestamp
- Optional (gracefully skips if `SLACK_WEBHOOK_URL` not set)
- Setup guide: [SLACK_NOTIFICATIONS_SETUP.md](./SLACK_NOTIFICATIONS_SETUP.md)

### 4. BullMQ Queue Worker (`api/queue/worker.js`)

- Separate background processor for publish jobs
- Logs to Prisma audit events
- Can run as dedicated Render worker service

### 5. Queue Dashboard

- Live job monitoring at `/admin/queues`
- Powered by bull-board
- Only mounts when `REDIS_URL` is set

---

## 🎯 Required GitHub Secrets

Set these in: **Settings → Secrets and variables → Actions**

| Secret Name         | Required    | Purpose                                 |
| ------------------- | ----------- | --------------------------------------- |
| `RENDER_API_KEY`    | ✅ Yes      | Authenticate GitHub Actions with Render |
| `SLACK_WEBHOOK_URL` | ⚠️ Optional | Send deployment notifications to Slack  |

---

## 📋 Deployment Checklist

### First-Time Setup

- [ ] Create Render account and connect GitHub repo
- [ ] Generate Render API key (Account Settings → API Keys)
- [ ] Add `RENDER_API_KEY` to GitHub Secrets
- [ ] (Optional) Create Upstash Redis and add `REDIS_URL` to Render env
- [ ] (Optional) Set up Slack webhook and add `SLACK_WEBHOOK_URL` to GitHub Secrets

### Deploy

- [ ] Push to `main` branch (or click "Run workflow" in Actions tab)
- [ ] Monitor GitHub Actions run
- [ ] Check Slack for notification (if configured)
- [ ] Verify API health: `curl https://<your-api>.onrender.com/health`
- [ ] Visit dashboard: `https://<your-dashboard>.onrender.com`
- [ ] (Optional) Check queue dashboard: `https://<your-api>.onrender.com/admin/queues`

---

## 🔧 Local Testing

Before pushing to production:

```bash
# Run tests
npm test

# Lint check
npm run lint

# Start API locally
cd api
npm start

# Start dashboard locally
npm run dev
```

---

## 🚨 Troubleshooting

### Deployment fails with "Render CLI not found"

- The workflow installs it automatically; check GitHub Actions logs for network issues.

### Slack notification doesn't appear

- Verify `SLACK_WEBHOOK_URL` is set in GitHub Secrets (not just Render env vars)
- Check the webhook URL starts with `https://hooks.slack.com/services/`

### Queue dashboard shows "Connection refused"

- Ensure `REDIS_URL` is set in Render environment variables
- Verify Upstash Redis URL is correct

### API returns 500 errors after deploy

- Check Render service logs for errors
- Verify `DATABASE_URL` is correctly wired
- Run `npx prisma db push` manually if schema changed

---

## 📚 Documentation

- [Render deployment guide](./README.md#-deployment)
- [Slack notifications setup](./SLACK_NOTIFICATIONS_SETUP.md)
- [Database seeding](./README.md#seeding-demo-data-postgres)
- [V2 API routes](./README.md#new-v2-routes-conditional)

---

## 🎉 Success Criteria

✅ GitHub Actions run completes without errors  
✅ API responds at `/health` endpoint  
✅ Dashboard loads and displays listings  
✅ Slack notification arrives (if configured)  
✅ Tests pass locally and in CI

---

**You're production-ready.** Push to `main` and watch the magic happen. 🚀
