# 💎 Photo2Profit — AI-Powered Resale Automation Platform

[![CI](https://github.com/baddiehustleai-star/jubilant-happiness/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/baddiehustleai-star/jubilant-happiness/actions/workflows/ci.yml)

> Note for automated contributors: see `/.github/COPILOT_CODING_AGENT.md` for repository-specific onboarding and guidance for Copilot coding agents.

A modern, luxe-themed SaaS platform built with **React 18 + Vite + Firebase** that helps resellers automate their listing creation with AI-powered descriptions, background removal, and multi-platform cross-posting.

## ✨ Features

### Core Platform
- 🎨 **Rose-Gold Theme** - Custom color palette with blush, rose, and gold tones
- 💎 **Luxe Design** - Cinzel Decorative + Montserrat typography
- ⚡ **Vite** - Lightning-fast dev server and optimized builds
- ⚛️ **React 18** - Modern React with hooks and Router
- 🎯 **TailwindCSS** - Utility-first styling with custom configuration
- 📱 **Responsive** - Mobile-first design approach

### Business Features
- 🔐 **Firebase Authentication** - Secure user signup and login
- 📸 **Photo Upload** - Drag-and-drop with progress tracking
- 🤖 **AI Listing Generation** - OpenAI/Gemini integration for smart descriptions
- ✂️ **Background Removal** - remove.bg API integration
- 💳 **Stripe Payment** - Subscription management ($1 trial, $14.99/mo Pro)
- 📊 **Usage Tracking** - Monitor uploads, AI calls, and storage
- 🌐 **Cross-Posting** - Export to eBay, Poshmark, Mercari, Depop, and more
- ☁️ **Cloud Functions** - Automated webhook handling and weekly exports

## 🚀 Quick Start

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Configure Environment Variables

Copy `.env.example` to `.env` and configure your API keys:

```bash
cp .env.example .env
```

Required for production:
```env
# Firebase (required)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Stripe (required for payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID_TRIAL=price_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Optional for enhanced features:
```env
# AI Services (for listing generation)
VITE_OPENAI_API_KEY=sk-...
VITE_GEMINI_API_KEY=...

# Background Removal
VITE_REMOVEBG_API_KEY=...

# eBay Integration
VITE_EBAY_APP_ID=...
VITE_EBAY_CERT_ID=...
VITE_EBAY_DEV_ID=...
VITE_EBAY_OAUTH_TOKEN=...

# SendGrid (for weekly emails)
SENDGRID_API_KEY=SG...
```

### 3️⃣ Start Development Server

```bash
npm run dev
```

Visit **[http://localhost:5173](http://localhost:5173)**

The app will work in demo mode even without API keys configured.

## 🔥 Firebase Setup

### Initial Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)

2. Enable the following services:
   - Authentication (Email/Password provider)
   - Firestore Database
   - Storage
   - Cloud Functions

3. Update `.firebaserc` with your project ID:
```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

4. Deploy Firestore rules and indexes:
```bash
firebase deploy --only firestore:rules,firestore:indexes
```

5. Deploy Storage rules:
```bash
firebase deploy --only storage
```

### Deploy Cloud Functions

```bash
cd functions
npm install
cd ..

# Configure Stripe secrets
firebase functions:config:set stripe.secret_key="sk_test_..."
firebase functions:config:set stripe.webhook_secret="whsec_..."
firebase functions:config:set sendgrid.key="SG..."

# Deploy functions
firebase deploy --only functions
```

### Deploy Frontend to Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

---

## 🌐 Alternative Deployment Options

### Vercel (Recommended for Frontend)

1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify

1. Connect your GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables

---

## 👨‍💻 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

### Project Structure

```
jubilant-happiness/
├── src/
│   ├── assets/           # Static assets (logos, images)
│   ├── components/       # React components
│   │   └── EnhancedPhotoUpload.jsx
│   ├── pages/            # Page components
│   │   ├── Landing.jsx   # Landing page
│   │   ├── Auth.jsx      # Login/Signup
│   │   ├── Dashboard.jsx # User dashboard
│   │   └── Pricing.jsx   # Pricing page
│   ├── services/         # Business logic services
│   │   ├── auth.js           # Firebase Auth
│   │   ├── upload.js         # File upload & processing
│   │   ├── payment.js        # Stripe integration
│   │   ├── listingGenerator.js # AI listing generation
│   │   ├── backgroundRemoval.js # remove.bg API
│   │   └── crossPosting.js   # Multi-platform export
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   ├── index.css        # Global styles
│   └── firebase.js      # Firebase config
├── functions/           # Firebase Cloud Functions
│   └── src/
│       └── index.ts     # Stripe webhooks & automation
├── tests/               # Test files
├── firebase.json        # Firebase configuration
├── firestore.rules      # Firestore security rules
├── storage.rules        # Storage security rules
└── package.json         # Dependencies & scripts
```

### Technology Stack

**Frontend:**
- React 18 with hooks
- Vite for blazing fast builds
- React Router for navigation
- TailwindCSS for styling
- Firebase SDK for backend

**Backend:**
- Firebase Authentication
- Firestore for database
- Firebase Storage for files
- Cloud Functions for serverless

**Integrations:**
- Stripe for payments
- OpenAI/Gemini for AI
- remove.bg for background removal
- eBay, Poshmark, Mercari APIs

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
