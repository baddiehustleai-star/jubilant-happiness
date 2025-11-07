# 🔐 Photo2Profit GitHub Secrets Setup Reference

> **Manifested by Hustle & Heal™**  
> Keep your deployment pipeline secure with these GitHub Secrets.

---

## 🎯 Required Secrets for Automated Deployment

Add these secrets to enable automatic Vercel deployments and notifications:

**Location:** https://github.com/baddiehustleai-star/jubilant-happiness/settings/secrets/actions

---

## 1️⃣ Vercel Deployment Secrets

### `VERCEL_TOKEN`
**Purpose:** Authorizes GitHub Actions to deploy to Vercel  
**How to get:**
1. Visit: [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click **"Create Token"**
3. Name: `photo2profit-deploy-token`
4. Copy the token (starts with `V3R1CEL...`)

**Format:** `V3R1CEL.xxxxxxxxxxxxxxxxxxxxxxxxx`

---

### `VERCEL_PROJECT_ID`
**Purpose:** Identifies your Photo2Profit project  
**How to get:**
1. Open your project in Vercel Dashboard
2. Go to **Settings** → **General**
3. Find **Project ID** (starts with `prj_`)

**Format:** `prj_abcdef1234567890`

---

### `VERCEL_ORG_ID`
**Purpose:** Identifies your Vercel team (baddiehustle Pro)  
**How to get:**
1. Click your avatar → **Settings** → **Teams**
2. Select your team (baddiehustle)
3. Look in the URL bar for `teamId=team_...`
4. Copy the `team_...` value

**Format:** `team_123abcXYZ` or just your username if personal account

**Alternative:** Use the org ID from your Vercel CLI:
```bash
vercel teams ls
```

---

## 2️⃣ Firebase Configuration Secrets

### `VITE_FIREBASE_API_KEY`
**Purpose:** Firebase Web API key  
**How to get:** Firebase Console → Project Settings → General → Web API Key

---

### `VITE_FIREBASE_APP_ID`
**Purpose:** Firebase Web App ID  
**How to get:** Firebase Console → Project Settings → Your Apps → App ID

**Format:** `1:758851214311:web:...`

---

### `VITE_FIREBASE_PROJECT_ID`
**Purpose:** Firebase Project identifier  
**Value:** `758851214311`

---

## 3️⃣ Optional Notification Secrets

### `DISCORD_WEBHOOK`
**Purpose:** Send deployment alerts to Discord  
**How to get:**
1. Discord Server → Settings → Integrations → Webhooks
2. Create webhook named "Photo2Profit Deploys"
3. Copy webhook URL

**Format:** `https://discord.com/api/webhooks/...`

---

### `SLACK_WEBHOOK`
**Purpose:** Send deployment alerts to Slack  
**How to get:**
1. Visit: [api.slack.com/messaging/webhooks](https://api.slack.com/messaging/webhooks)
2. Create Incoming Webhook
3. Choose channel (e.g., #deployments)
4. Copy webhook URL

**Format:** `https://hooks.slack.com/services/...`

---

## ✅ Quick Setup Checklist

- [ ] `VERCEL_TOKEN` - Deploy authorization
- [ ] `VERCEL_PROJECT_ID` - Project identifier
- [ ] `VERCEL_ORG_ID` - Team identifier
- [ ] `VITE_FIREBASE_API_KEY` - Firebase auth
- [ ] `VITE_FIREBASE_APP_ID` - Firebase app
- [ ] `VITE_FIREBASE_PROJECT_ID` - Firebase project
- [ ] `DISCORD_WEBHOOK` (optional) - Discord alerts
- [ ] `SLACK_WEBHOOK` (optional) - Slack alerts

---

## 🧪 Test Your Setup

After adding all secrets:

1. Go to **Actions** tab in your repo
2. Select **"🪩 Notifications"** workflow
3. Click **"Run workflow"** → **"Run workflow"**
4. Wait for completion ✅

**Expected result:**
```
🚀 Photo2Profit deployment triggered on branch 'main'
✨ Notification workflow completed successfully!
```

---

## 🔒 Security Best Practices

✅ **Never commit secrets** to your repository  
✅ **Use GitHub Secrets** for all sensitive values  
✅ **Rotate tokens** every 90 days for security  
✅ **Use Vercel environment variables** for production-only secrets  
✅ **Keep `.env` in `.gitignore`** (already configured)

---

## 🚀 After Setup

Once all secrets are configured:

1. **Push to `main`** → Triggers automatic deployment
2. **Merge PR** → Auto-deploys to production
3. **Check Actions tab** → View deployment logs
4. **Get notifications** → Discord/Slack alerts (if configured)

---

> 💎 *Your Photo2Profit empire is now fully automated and secure!*  
> — Hustle & Heal™ Team

**Questions?** Check:
- [VERCEL_INTEGRATIONS.md](./VERCEL_INTEGRATIONS.md)
- [NOTIFICATIONS_SETUP.md](./NOTIFICATIONS_SETUP.md)
- [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)