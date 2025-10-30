# 💎 Photo2Profit — AI-Powered Resale Automation Platform

> Note for automated contributors: see `/.github/COPILOT_CODING_AGENT.md` for repository-specific onboarding and guidance for Copilot coding agents.

> **Turn Any Photo Into Profit.**  
> Upload a product photo, let AI generate a perfect listing (title, description, and price), then automatically cross-post to top marketplaces like eBay, Poshmark, Mercari, Depop, and Facebook Shop.

---

## 🚀 Overview

Photo2Profit is an AI resale automation platform that helps resellers, thrift sellers, and small businesses turn photos into polished listings instantly.

✅ Remove backgrounds  
✅ Generate titles and descriptions  
✅ Suggest prices (Thrift → Market → Boutique)  
✅ Cross-post to multiple marketplaces  
✅ Export ready-to-upload CSVs  
✅ Automated weekly updates + email exports  

---

## 🧠 Key Features

| Feature | Description |
|----------|-------------|
| 🪄 **AI Listing Generator** | Instantly creates SEO-optimized titles, descriptions, and price tiers |
| 🧺 **Cross-Posting Automation** | Supports eBay, Poshmark, Mercari, Depop, Facebook Shop, and more |
| 💾 **Firebase Integration** | Secure Storage + Firestore database for user listings |
| 📊 **Export History Center** | View and re-download generated CSVs anytime |
| 📬 **Weekly Scheduler** | Automatically refreshes prices and emails new CSV exports |
| 💳 **Stripe Billing Ready** | Built to integrate with $1 trial → monthly plan |

---

## 🏗️ Project Structure

```

photo2profit/
├── .github/agents/photo2profit.json       # Agent manifest for Copilot or GitHub AI
├── functions/index.js                     # Weekly export Cloud Function
├── scripts/crosspost/                     # Platform adapters (eBay, Poshmark, etc.)
├── src/pages/Photo2ProfitDashboard.jsx    # Main web app UI
├── src/components/ExportHistory.jsx       # Export history & download center
├── src/aiListingGenerator.js              # AI listing generation logic
├── src/firebaseUpload.js                  # Firebase upload + Firestore save
└── .env.example                           # Environment template

```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone & Install
```bash
git clone https://github.com/yourusername/photo2profit.git
cd photo2profit
npm install
```

### 2️⃣ Configure Environment Variables

Copy `.env.example` → `.env` and fill in your keys:

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

# APIs
REMOVEBG_API_KEY=
EBAY_APP_ID=
EBAY_CERT_ID=
EBAY_DEV_ID=
EBAY_OAUTH_TOKEN=

# SendGrid (for weekly emails)
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

* Connect your GitHub repo
* Add your `.env` variables
* Deploy the main branch

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

* $1 trial → $9.99/month
* Pro plan: $19.99/month (includes trend reports + advanced cross-posting)
* Affiliate commissions for referrals
* B2B tier for boutique resellers

---

## 🩷 Credits

Built with:

* React + Tailwind
* Firebase + Firestore
* Stripe
* SendGrid
* OpenAI / Gemini APIs
* Designed and manifested by **Baddie AI Hustle & Heal** ✨

---

## 📞 Support

For setup help or business collaboration:
📧 **[support@photo2profit.app](mailto:support@photo2profit.app)**
🌐 [photo2profit.app](https://photo2profit.app) *(coming soon)*

```
## 🔄 Automation Workflows
