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

## 🔐 Firebase Configuration

### Quick Setup
1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Get your Firebase credentials:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select project: **jubilant-happiness-11477832**
   - Navigate to: Project Settings → General → Your apps
   - Copy your `apiKey` and `appId` values
   - Update the `.env` file with these values

3. **Enable Firebase Services:**
   - Authentication (Email/Password + Google)
   - Firestore Database (test mode, location: us-central1)
   - Storage (test mode)

4. **Verify your setup:**
   ```bash
   ./verify-firebase-setup.sh
   ```

📚 **Detailed Instructions:** See [`GETTING_FIREBASE_API_KEYS.md`](./GETTING_FIREBASE_API_KEYS.md) for step-by-step guide

### Environment Variables

Your `.env` file should contain:

```env
# Firebase Configuration (REQUIRED)
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=jubilant-happiness-11477832.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=jubilant-happiness-11477832
VITE_FIREBASE_STORAGE_BUCKET=jubilant-happiness-11477832.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=758851214311
VITE_FIREBASE_APP_ID=your_app_id_here

# Stripe (optional)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
STRIPE_SECRET_KEY=sk_test_your_stripe_key

# APIs (optional)
VITE_GEMINI_API_KEY=your_gemini_key
VITE_REMOVEBG_API_KEY=your_removebg_key
```

### 3️⃣ Firebase Cloud Functions (Optional)

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

---

## 🚀 Multi-Platform Release Guide

Follow **[GOOGLE_PLAY_RELEASE.md](./GOOGLE_PLAY_RELEASE.md)** for Android  
*(works on Linux or Windows using Android Studio)*  

Follow **[APPLE_APP_STORE_RELEASE.md](./APPLE_APP_STORE_RELEASE.md)** for iOS  
*(requires macOS and Xcode)*  

Photo2Profit is ready to dominate web + mobile! 💎  
Manifested by **Hustle & Heal™**
