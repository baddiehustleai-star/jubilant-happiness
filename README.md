# 💎 Photo2Profit — AI-Powered Resale Automation Platform

[![CI](https://github.com/baddiehustleai-star/jubilant-happiness/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/baddiehustleai-star/jubilant-happiness/actions/workflows/ci.yml)
[![Backend Deploy](https://github.com/baddiehustleai-star/jubilant-happiness/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/baddiehustleai-star/jubilant-happiness/actions/workflows/deploy.yml)
[![Frontend Deploy](https://github.com/baddiehustleai-star/jubilant-happiness/actions/workflows/frontend-deploy.yml/badge.svg?branch=main)](https://github.com/baddiehustleai-star/jubilant-happiness/actions/workflows/frontend-deploy.yml)
[![Deployment Status](https://github.com/baddiehustleai-star/jubilant-happiness/actions/workflows/deployment-status.yml/badge.svg)](https://github.com/baddiehustleai-star/jubilant-happiness/actions/workflows/deployment-status.yml)

> Note for automated contributors: see `/.github/COPILOT_CODING_AGENT.md` for repository-specific onboarding and guidance for Copilot coding agents.

A modern, luxe-themed React starter built with **Vite + TailwindCSS** featuring rose-gold branding and elegant typography.

## ✨ Features

- 🎨 **Rose-Gold Theme** - Custom color palette with blush, rose, and gold tones
- 💎 **Luxe Design** - Cinzel Decorative + Montserrat typography
- ⚡ **Vite** - Lightning-fast dev server and optimized builds
- ⚛️ **React 18** - Modern React with hooks
- 🎯 **TailwindCSS** - Utility-first styling with custom configuration
- 📱 **Responsive** - Mobile-first design approach

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview

# Verify deployment readiness (recommended before deploying)
npm run verify:deploy
```

### 🔍 Pre-Deployment Verification

Before deploying to production, run the comprehensive deployment verification:

```bash
npm run verify:deploy
```

This command performs all pre-deployment checks:

- ✅ Linting (ESLint)
- ✅ Code formatting (Prettier)
- ✅ Unit tests (Vitest)
- ✅ Production build

The script provides colored output and a summary report. All checks must pass before deployment.

## 🔐 Environment variables

Copy `.env.example` to `.env` and fill in the values you plan to use (optional for local demo):

```env
# Firebase
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

# Stripe (optional)
STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=

# APIs (optional)
REMOVEBG_API_KEY=
EBAY_APP_ID=
EBAY_CERT_ID=
EBAY_DEV_ID=
EBAY_OAUTH_TOKEN=

# SendGrid (for weekly emails in Cloud Functions)
SENDGRID_API_KEY=
```

## 🔒 Required GitHub Secrets for Deployment

For automated deployments to work correctly, the following secrets **must** be configured in your GitHub repository settings (Settings → Secrets and variables → Actions):

| Secret Name                           | Required    | Purpose                                 | Where to Get It                                                                   |
| ------------------------------------- | ----------- | --------------------------------------- | --------------------------------------------------------------------------------- |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | ✅ Yes      | Authenticates Cloud Run deployments     | Google Cloud Console → IAM & Admin → Service Accounts → Create key (JSON format)  |
| `FIREBASE_SERVICE_ACCOUNT`            | ✅ Yes      | Deploys frontend to Firebase Hosting    | Firebase Console → Project Settings → Service Accounts → Generate new private key |
| `SLACK_WEBHOOK_URL`                   | ⚠️ Optional | Sends deployment notifications to Slack | Slack App settings → Incoming Webhooks                                            |
| `CRON_SECRET`                         | ⚠️ Optional | Secures the SEO refresh endpoint        | Generate a random string (e.g., `openssl rand -hex 32`)                           |

### Validating Your Secrets

Before merging to main, verify all required secrets are set:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Confirm both `GOOGLE_APPLICATION_CREDENTIALS_JSON` and `FIREBASE_SERVICE_ACCOUNT` exist
4. Optionally add `SLACK_WEBHOOK_URL` and `CRON_SECRET` for enhanced features

### Testing Deployment

After setting up secrets, you can test the deployment pipeline:

1. Push a small change to the `main` branch (e.g., update a comment in `/api/health.js`)
2. Check GitHub Actions logs for successful deployment
3. Visit the deployed Cloud Run URL and hit `/api/health` to verify backend
4. Check Firebase Hosting URL to verify frontend deployment
5. If configured, check Slack for deployment notifications

### 3️⃣ Firebase Setup

```bash
firebase login
firebase init functions
```

Deploy the weekly scheduler:

```bash
# Set your SendGrid key
firebase functions:config:set sendgrid.key="your_sendgrid_api_key"

# Deploy just this function
firebase deploy --only functions:weeklyExport
```

### 4️⃣ Local Development

```bash
npm run dev
```

Visit: **[http://localhost:5173](http://localhost:5173)**

---

## 🌐 Deployment

Photo2Profit supports **multiple deployment options**. Choose the one that best fits your needs:

### Option 1: Automated GitHub Actions → Cloud Run + Firebase

This project includes **automated deployments** via GitHub Actions:

- **Backend**: Auto-deploys to Google Cloud Run when `api/**` changes
- **Frontend**: Auto-deploys to Firebase Hosting when `src/**` changes
- **CI**: Runs linting, tests, and builds on every PR and push to `main`

📋 **Documentation:**

- **[GitHub Actions Review](./GITHUB-ACTIONS-REVIEW.md)** - Complete review of deployment workflows and what happens after merge
- **[Post-Deployment Checklist](./POST-DEPLOYMENT-CHECKLIST.md)** - Comprehensive checklist to verify deployment success and test all features

⚙️ **Required Setup:**

1. Configure GitHub Secrets (Settings → Secrets → Actions):
   - `GOOGLE_APPLICATION_CREDENTIALS_JSON` (Cloud Run deployment)
   - `FIREBASE_SERVICE_ACCOUNT` (Firebase Hosting deployment)
   - `SLACK_WEBHOOK_URL` (optional - deployment notifications)
   - `CRON_SECRET` (optional - SEO refresh endpoint)
2. Merge to `main` branch - deployments are automatic!

### Option 2: Vercel or Netlify Deployment

For simpler setup with custom domain `photo2profit.online`:

📋 **Documentation:**

- **[Vercel/Netlify Deployment Guide](./DEPLOYMENT-VERCEL-NETLIFY.md)** - Step-by-step guide for deploying to Vercel or Netlify with custom domain, environment variables, and Google OAuth setup

⚙️ **Quick Setup:**

1. Connect GitHub repo to Vercel or Netlify
2. Set custom domain: `photo2profit.online`
3. Add environment variables (see [DEPLOYMENT-VERCEL-NETLIFY.md](./DEPLOYMENT-VERCEL-NETLIFY.md))
4. Deploy automatically on push to `main`

### Additional Resources

- **[Deployment Guide](./README-DEPLOY.md)** - Quick start deployment guide
- **[DEPLOYMENT-READY.md](./DEPLOYMENT-READY.md)** - Summary of deployment readiness

Your weekly scheduler runs automatically from Firebase Cloud Functions.

### 🚀 Deployment Status Check

Verify your deployment status anytime:

- **Automated:** Trigger the [Deployment Status Check workflow](../../actions/workflows/deployment-status.yml) or comment `@github-actions deployment status` on any issue
- **Manual:** See [DEPLOYMENT-STATUS.md](./DEPLOYMENT-STATUS.md) for detailed verification steps

For full deployment documentation, see [README-DEPLOY.md](./README-DEPLOY.md).

---

## 🧩 Cross-Posting Supported Platforms

| Platform                 | Method                |
| ------------------------ | --------------------- |
| **eBay**                 | Full API integration  |
| **Poshmark**             | CSV export            |
| **Mercari**              | CSV export            |
| **Depop**                | CSV export            |
| **Facebook Shop**        | CSV export            |
| **Facebook Marketplace** | Copy-ready data       |
| **Instagram Shop**       | via Facebook Shop CSV |
| **Pinterest / TikTok**   | Optional social share |

---

## 🧠 Roadmap

| Phase          | Focus                                              |
| -------------- | -------------------------------------------------- |
| **MVP (Now)**  | AI listings, cross-posting, weekly exports         |
| **Next**       | OAuth integrations for live posting                |
| **Pro**        | AI trend analytics, auto pricing, referral rewards |
| **Enterprise** | API for thrift stores & reseller networks          |

---

## 💰 Monetization Plan

- $1 trial → $9.99/month
- Pro plan: $19.99/month (includes trend reports + advanced cross-posting)
- Affiliate commissions for referrals
- B2B tier for boutique resellers

---

## 🩷 Credits

Built with:

- React + Tailwind
- Firebase + Firestore
- Stripe
- SendGrid
- OpenAI / Gemini APIs
- Designed and manifested by **Baddie AI Hustle & Heal** ✨

---

## 📞 Support

For setup help or business collaboration:
📧 **[support@photo2profit.app](mailto:support@photo2profit.app)**
🌐 [photo2profit.app](https://photo2profit.app) _(coming soon)_

## 🤝 Contributing

Please see `/.github/COPILOT_CODING_AGENT.md` for repository-specific onboarding and CI expectations. Pull requests should pass lint, format:check, tests, and build.
