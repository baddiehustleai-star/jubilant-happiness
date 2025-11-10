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

Deploy your frontend with **Vercel** or **Firebase Hosting**:

- Connect your GitHub repo
- Add your `.env` variables
- Deploy the main branch

Your weekly scheduler runs automatically from Firebase Cloud Functions.

---

## 🔗 CORS Testing & Backend API

The Photo2Profit backend API runs on Google Cloud Run and requires proper CORS configuration to accept requests from the Firebase frontend.

### Testing CORS Connection

#### 🧠 Option 1: Browser Console Test

1. Open your Firebase frontend: https://photo2profitbaddie.web.app
2. Press **F12** to open **DevTools → Console**
3. Paste and run:

```javascript
fetch('https://photo2profit-api-758851214311.us-west2.run.app/api', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
  .then(res => res.text())
  .then(data => console.log('✅ Success:', data))
  .catch(err => console.error('❌ Error:', err));
```

**If CORS is working:**
- You'll see `✅ Success: {"message":"Photo2Profit API is alive!",...}`
- No red CORS warnings in console

**If it's not working:**
- You'll get `❌ Error: TypeError: Failed to fetch` plus CORS error
- Your Firebase domain isn't in the allowedOrigins list

#### ⚙️ Option 2: curl Test (Terminal/Cloud Shell)

Test CORS headers from command line:

```bash
curl -I -X GET \
  -H "Origin: https://photo2profitbaddie.web.app" \
  https://photo2profit-api-758851214311.us-west2.run.app/api
```

**Expected response includes:**
```
Access-Control-Allow-Origin: https://photo2profitbaddie.web.app
```

#### 🖥️ Option 3: Interactive Testing Page

Open `cors-test.html` in your browser for an interactive CORS testing interface with detailed diagnostics.

### Backend Deployment

See [`backend/README.md`](backend/README.md) for complete deployment instructions to Google Cloud Run.

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
