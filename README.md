# 💎 Photo2Profit — AI-Powered Resale Automation Platform

[![CI](https://github.com/baddiehustleai-star/jubilant-happiness/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/baddiehustleai-star/jubilant-happiness/actions/workflows/ci.yml)
[![API Health (prod)](https://img.shields.io/website?url=https%3A%2F%2Fphoto2profit-api-uc.a.run.app%2Fhealth&label=API%20Health%20(prod))](https://photo2profit-api-uc.a.run.app/health)
[![Open in Cloud Shell](https://gstatic.com/cloudssh/images/open-btn.png)](https://shell.cloud.google.com/cloudshell/open?cloudshell_git_repo=https://github.com/baddiehustleai-star/jubilant-happiness&cloudshell_print=echo%20%22💎%20Welcome%20to%20Photo2Profit%20Cloud%20Shell%20Session%22%20&&cloudshell_tutorial=CLOUD_SHELL_TUTORIAL.md)

> Note for automated contributors: see `/.github/COPILOT_CODING_AGENT.md` for repository-specific onboarding and guidance for Copilot coding agents.

A modern, luxe-themed React starter built with **Vite + TailwindCSS** featuring rose-gold branding and elegant typography.

> Quickly spin up a fully provisioned environment in your browser. See `CLOUD_SHELL_TUTORIAL.md` for manual steps.


## ✨ Features

- 🎨 **Rose-Gold Theme** - Custom color palette with blush, rose, and gold tones
- 💎 **Luxe Design** - Cinzel Decorative + Montserrat typography
- ⚡ **Vite** - Lightning-fast dev server and optimized builds
- ⚛️ **React 18** - Modern React with hooks
- 🎯 **TailwindCSS** - Utility-first styling with custom configuration
- 📱 **Responsive** - Mobile-first design approach

## 🚀 Quick Start

### Automated Setup (Recommended)
```bash
# One-command setup: installs deps, configures APIs, creates .env
./setup.sh

# Start both frontend + API servers
./start.sh all

# Or start frontend only
./start.sh

# Or start API only
./start.sh api
```

### Manual Setup
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

- Creates Firestore database
- Generates `.env` template with placeholders
- Installs frontend + API dependencies

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

## ☁️ Run in Google Cloud Shell

You can develop directly in the cloud without local installs:

1. Click the **Open in Cloud Shell** button above.
2. (Optional) Set your project: `export PROJECT_ID=your-project-id`.
3. Run the one-line setup script:
   ```bash
   ./cloudshell-setup.sh
   ```
4. Use Web Preview → port 5173 for the frontend.

Manual, granular steps and deployment guidance live in `CLOUD_SHELL_TUTORIAL.md`.

### What the Script Does
- Enables APIs (Secret Manager, Vertex AI, Firestore)
- Seeds placeholder secrets (Stripe, eBay, Facebook) if missing
- Installs dependencies root + API
- Generates a demo `.env`
- Starts API (port 8080) and Vite dev server (port 5173)

### API Base Configuration
Set `VITE_API_BASE` (added to demo `.env`) to point the frontend toward:
- Local dev API: `http://localhost:8080` (default in Cloud Shell)
- Cloud Run: `https://<your-cloud-run-service-url>`
If empty, the app will use same-origin requests.

### When to Customize
- Replace placeholder secrets with real values in Google Secret Manager.
- Adjust `server.js` origins/cors for your preview URL.
- Set `VITE_*` environment variables for production builds.

### Deploy API to Cloud Run (Optional)
See tutorial section "Deploy API to Cloud Run" for commands.

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
| **Next**       | OAuth integrations for live posting + Inventory Sync (webhooks) |
| **Pro**        | AI trend analytics, auto pricing, referral rewards |
| **Enterprise** | API for thrift stores & reseller networks          |

### 🔧 Database & Inventory Sync (New)

The platform now supports an optional Postgres + Prisma data layer (v2 API) for production-ready listing + channel mapping.

#### Why Prisma + Postgres
- Strong relational model (Listing ↔ ChannelListing) for multi-market control
- Transaction safety for publish flows
- Easier analytics & future platform expansion

#### Schema Overview
Models:
- User: accounts
- Listing: core product
- MarketplaceAccount: connected OAuth / tokens (unique per user+platform)
- ChannelListing: per-platform listing state & external ID

#### Getting Started
```bash
cd api
npm install prisma @prisma/client --save-dev
npx prisma init
# set DATABASE_URL in api/.env (or root .env exported)
# paste schema (see api/prisma/schema.prisma)
npx prisma migrate dev --name init
```

`api/prisma/schema.prisma` already included. Ensure `DATABASE_URL` is exported in your environment before starting the API to auto-enable `/api/v2` routes.

#### New V2 Routes (Conditional)
Mounted only if `process.env.DATABASE_URL` is set:
- POST /api/v2/listings/generate
- POST /api/v2/listings
- GET  /api/v2/listings
- GET  /api/v2/listings/:id
- POST /api/v2/listings/:id/publish
- POST /api/v2/integrations/ebay/auth

Auth: Provide `Authorization: Bearer <jwt>` or legacy `x-user-id` header (development). JWT must include `sub` field.

#### Webhooks & Sync
Inventory sync webhooks now land at:
- POST /api/webhooks/ebay
- POST /api/webhooks/facebook
- POST /api/webhooks/poshmark

On event `{ listing_id, event_type: 'sold' | 'price_change', new_price? }`:
1. Resolve listing (Prisma ChannelListing → Listing) or Firestore fallback.
2. If sold: mark sold + delist other channels.
3. If price_change: update price across remaining active channels.

Security: set `SHARED_WEBHOOK_SECRET` and send `X-Signature: <hex hmac>` where
`hex hmac = HMAC_SHA256(secret, raw_body_json)`. If unset, verification is skipped (local/dev).

#### Migration Strategy
1. Keep Firestore listings while rolling out Postgres.
2. Dual-resolution in sync service permits gradual switchover.
3. Once confident, backfill ChannelListing rows then remove Firestore crossPostResults.

#### Next DB Enhancements
- Unique constraint on ChannelListing (listingId+platform) — added
- AuditEvent table for webhook history — added
- BullMQ queue for publish jobs (inline fallback w/o Redis) — added
- Add soft-delete (status field) instead of hard deletes

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
