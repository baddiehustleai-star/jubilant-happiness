# 🧠 GitHub Copilot Instructions — Photo2Profit

## 🪩 Overview

This repository powers **Photo2Profit** — an AI resale automation SaaS that transforms product photos into professional listings, automatically generates titles/descriptions/prices, and cross-posts to major marketplaces (eBay, Poshmark, Mercari, Depop, and Facebook Shop).

The app is designed for **resellers and small businesses** who want to save time, scale sales, and automate listing creation through AI.

---

## ⚙️ Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Firebase (Firestore, Storage, Cloud Functions)
- **Payments:** Stripe Checkout ($1 Trial → $9.99/month recurring)
- **AI Services:** OpenAI / Gemini for listing generation
- **Background Removal:** remove.bg API
- **Automation Scripts:** Node.js cross-posting adapters for marketplaces
- **Deployment:** Vercel (frontend), Firebase Functions (backend)
- **Version Control:** GitHub

---

## 🧱 File & Folder Structure

_Note: This structure represents the intended architecture. Some directories and files may be added as features are developed._

```
.github/
├── agents/photo2profit.json          → Agent manifest
└── copilot-instructions.md           → Copilot behavior file (this one)

src/
├── assets/                           → Logos, brand visuals
├── components/                       → Reusable UI components
├── pages/                            → App screens (LandingPage, Dashboard, Upgrade)
├── aiListingGenerator.js             → AI logic for titles, descriptions, and pricing
├── firebaseUpload.js                 → Upload + Firestore integration
├── App.jsx                           → Routing between pages
├── index.css                         → Global Tailwind styling
└── main.jsx                          → React entry point

functions/                             → Firebase Cloud Functions (weekly export, email)
scripts/crosspost/                     → Marketplace posting adapters
api/create-checkout-session.js         → Stripe Checkout API (for Vercel)
```

---

## 🧠 Copilot Behavior Guidelines

1. **Understand the Goal:**
   - Convert user-uploaded photos into fully optimized, AI-generated listings.
   - Auto-generate descriptive titles, brand names, and price tiers.
   - Save all data to Firestore and make it cross-postable.

2. **Follow the Brand Tone:**
   - Use variable names and UI text that match the luxury brand vibe:
     > "rose-gold," "boss mode," "profit," "manifested," etc.

3. **Preferred Coding Style:**
   - Use **functional React components**.
   - Use **Tailwind CSS** for all styling.
   - Prefer **async/await** over `.then()` for async operations.
   - Keep components modular — no inline styles.
   - Write clean, readable code with clear naming conventions.

4. **Firebase Conventions:**
   - Use `users/{uid}/listings/{listingId}` structure.
   - Always validate upload limits (5 for trial users).
   - Store `isPro: true` flag for paid users.

5. **Stripe Integration:**
   - Use environment variables for secret keys.
   - `$1 trial` → converts to `$9.99/month` subscription.
   - On success: redirect to `/dashboard`.
   - On cancel: redirect to `/`.

6. **AI & Automation:**
   - Use OpenAI / Gemini models for titles & price ranges.
   - Use remove.bg for background cleanup.
   - Use Stagehand / Browserbase logic for cross-post automation scripts.

7. **Cross-Posting Scripts:**
   - Adapters in `/scripts/crosspost/` should export simple functions:
     ```js
     export async function postToEbay(listingData) {
       ...;
     }
     export async function generatePoshmarkCSV(listings) {
       ...;
     }
     ```
   - Each adapter should log output clearly and return success/failure flags.

8. **Security & Keys:**
   - Never commit API keys or secrets.
   - Use `.env` variables (`VITE_` prefix for frontend).

---

## 🧩 Pull Request Guidelines

- Branch naming: `feature/short-description` or `fix/issue-number`
- Commits: short, descriptive messages (e.g., `feat: add upload progress meter`)
- Always run `npm run dev` locally before pushing changes.
- PRs must include a description of what changed and screenshots (for UI updates).

---

## ✅ Copilot Mission

Copilot's purpose in this repo is to:

- Write and refactor code **for an AI-powered resale automation app**.
- Maintain brand consistency and technical accuracy.
- Suggest optimized React components, Firebase logic, and Stripe workflows.
- Prioritize code that is:
  - Secure 🔐
  - Reusable ♻️
  - Branded 💎
  - Profitable 💰

---

_Manifested by Baddie AI Hustle & Heal — "From Photo to Payday — Boss Mode."_
