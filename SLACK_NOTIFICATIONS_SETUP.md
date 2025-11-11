# 📢 Slack Notifications Setup for Render Deployments

This guide walks you through setting up automated Slack notifications for your GitHub Actions → Render deployment pipeline.

## 🎯 What You'll Get

Every time you push to `main` (or manually trigger a deployment), your Slack channel will receive a color-coded message showing:
- ✅ Success (green) or ❌ Failure (red)
- Repository name and branch
- Commit SHA
- Who triggered the deployment
- Timestamp

---

## 🧩 Step 1: Create a Slack Incoming Webhook

1. Go to your Slack workspace
2. Visit [https://api.slack.com/apps](https://api.slack.com/apps)
3. Click **"Create New App"** → **"From scratch"**
4. Name it: **Render Deployer Bot** (or whatever you prefer)
5. Select your workspace
6. In the left sidebar, go to **Features → Incoming Webhooks**
7. Toggle **"Activate Incoming Webhooks"** to **ON**
8. Click **"Add New Webhook to Workspace"**
9. Choose the channel where you want notifications (e.g., `#deployments` or `#dev`)
10. Click **Allow**
11. Copy the webhook URL (starts with `https://hooks.slack.com/services/...`)

---

## 🧩 Step 2: Add the Secret to GitHub

1. Go to your GitHub repository: [https://github.com/baddiehustleai-star/jubilant-happiness](https://github.com/baddiehustleai-star/jubilant-happiness)
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Set:
   - **Name:** `SLACK_WEBHOOK_URL`
   - **Secret:** Paste your webhook URL from Step 1
5. Click **"Add secret"**

---

## 🧩 Step 3: Test It

The workflow is already configured in `.github/workflows/deploy.yaml`.

To test:

```bash
git add .
git commit -m "Test Slack notification"
git push origin main
```

Within 1-2 minutes, you should see a message appear in your chosen Slack channel.

---

## 🔧 Troubleshooting

### No message appears in Slack

1. Check that `SLACK_WEBHOOK_URL` is set in GitHub Secrets (Settings → Secrets → Actions)
2. Verify the webhook URL is correct (starts with `https://hooks.slack.com/services/`)
3. Check the Actions tab in GitHub for the workflow run logs
4. Look for the "Notify Slack" step output

### Message format looks wrong

The workflow uses Slack's message attachments API. If you want simpler messages, you can modify `.github/workflows/deploy.yaml` and replace the payload with:

```json
{"text": "Render deployment $STATUS for commit $GITHUB_SHA"}
```

---

## 🎨 Customization

### Change the notification channel

Go back to your Slack app settings → Incoming Webhooks → click the webhook → click "Edit" → choose a different channel.

### Add more details

Edit the `text` field in `.github/workflows/deploy.yaml` to include:
- Build duration: `${{ steps.deploy.outputs.duration }}`
- PR number: `${{ github.event.pull_request.number }}`
- Deployment URL: Add your Render service URL

### Notify on specific events only

Change the workflow trigger in `deploy.yaml`:

```yaml
on:
  push:
    branches:
      - main
      - staging  # add staging notifications
  pull_request:
    types: [opened, synchronize]  # notify on PR updates
```

---

## 🚀 Next Steps (Optional)

- Add retry logic for failed deployments
- Include links to Render dashboard in messages
- Set up separate webhooks for staging vs production
- Add @ mentions for specific team members on failures

---

## 📚 Resources

- [Slack Incoming Webhooks Documentation](https://api.slack.com/messaging/webhooks)
- [GitHub Actions Contexts](https://docs.github.com/en/actions/learn-github-actions/contexts)
- [Render CLI Documentation](https://render.com/docs/cli)

---

**Setup complete!** You'll now get instant Slack notifications for every deployment. 🎉
