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
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Stripe (optional)
VITE_STRIPE_SECRET_KEY=
VITE_STRIPE_PRICE_ID=

# APIs (optional)
VITE_REMOVEBG_API_KEY=
VITE_EBAY_APP_ID=
VITE_EBAY_CERT_ID=
VITE_EBAY_DEV_ID=
VITE_EBAY_OAUTH_TOKEN=

# SendGrid (for weekly emails in Cloud Functions)
VITE_SENDGRID_API_KEY=
```

The API keys are managed centrally in `src/config/apiKeys.js` and can be imported throughout the application:

```javascript
import apiKeys from './config/apiKeys';

// Use Firebase config
const firebaseConfig = apiKeys.firebase;

// Use specific API keys
const removeBgKey = apiKeys.removeBg.apiKey;
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

Deploy your frontend with **Vercel** or **Firebase Hosting**:

- Connect your GitHub repo
- Add your `.env` variables
- Deploy the main branch

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
