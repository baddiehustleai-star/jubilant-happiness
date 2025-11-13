# 💎 Photo2Profit — AI-Powered Resale Automation Platform

[![CI](https://github.com/baddiehustleai-star/jubilant-happiness/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/baddiehustleai-star/jubilant-happiness/actions/workflows/ci.yml)

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
```

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
