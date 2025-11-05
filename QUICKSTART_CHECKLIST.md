# 🎯 Quick Start Checklist for Photo2Profit

Use this checklist to quickly set up your local development environment.

## ☐ Step 1: Initial Setup

- [ ] Clone the repository
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`: `cp .env.example .env`

## ☐ Step 2: Firebase Configuration

- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Create or select a project
- [ ] Navigate to Project Settings → Your apps
- [ ] Copy these values to your `.env` file:
  - [ ] `FIREBASE_API_KEY`
  - [ ] `FIREBASE_AUTH_DOMAIN`
  - [ ] `FIREBASE_PROJECT_ID`
  - [ ] `FIREBASE_STORAGE_BUCKET`
  - [ ] `FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `FIREBASE_APP_ID`

## ☐ Step 3: Stripe Setup

### Get Stripe Secret Key

- [ ] Go to [Stripe Dashboard](https://dashboard.stripe.com/)
- [ ] Navigate to Developers → API keys
- [ ] Copy your Secret Key (starts with `sk_test_`)
- [ ] Add to `.env` as `STRIPE_SECRET_KEY`

### Create Stripe Price

- [ ] In Stripe Dashboard, go to Products
- [ ] Click "Add product"
- [ ] Fill in details:
  - Name: "Photo2Profit Monthly"
  - Price: $9.99
  - Billing: Monthly
- [ ] Save and copy the Price ID (starts with `price_`)
- [ ] Add to `.env` as `VITE_STRIPE_PRICE_ID` (note the `VITE_` prefix!)

## ☐ Step 4: Validation

- [ ] Run `npm run validate-setup`
- [ ] Fix any errors reported
- [ ] All checks should pass ✓

## ☐ Step 5: Development

- [ ] Run `npm run dev`
- [ ] Open [http://localhost:5173](http://localhost:5173)
- [ ] Test the app is working

## ☐ Step 6: Deploy to Vercel (Optional)

- [ ] Push code to GitHub
- [ ] Connect repository in [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Add all environment variables from your `.env` to Vercel
- [ ] Deploy!

---

## 📚 Need More Details?

See **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for complete instructions and troubleshooting.

---

## ✅ You're Done!

Once you've completed this checklist, you're ready to build and deploy Photo2Profit! 🚀
