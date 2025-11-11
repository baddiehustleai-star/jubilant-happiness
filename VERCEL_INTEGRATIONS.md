# 💎 Photo2Profit — Vercel Integrations Setup Checklist

> Manifested by **Hustle & Heal™**  
> Streamline your AI-powered resale empire with these verified integrations.  
> All integrations below are **free to connect** — you only pay usage fees (Stripe %, API calls, etc.) as you grow.

---

## ⚙️ 1. GitHub (Continuous Deployment)

**Purpose:** Auto-deploy every time you push to `main`.  
**Install:** [https://vercel.com/integrations/github](https://vercel.com/integrations/github)

✅ Already added when you imported your repo.

---

## 🔥 2. Firebase (Auth, Storage, Listings)

**Purpose:** User sign-in, Firestore database, image storage.  
**Install:** [https://vercel.com/integrations/firebase](https://vercel.com/integrations/firebase)

**Environment Variables**

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## 💳 3. Stripe (Billing & $1 Trial)

**Purpose:** Handle subscriptions and payments securely.  
**Install:** [https://vercel.com/integrations/stripe](https://vercel.com/integrations/stripe)

**Environment Variables**

```bash
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

## 🧠 4. Google Cloud / Gemini AI

**Purpose:** AI product descriptions, price suggestions, smart captions.  
**Install:** [https://vercel.com/integrations/google-cloud](https://vercel.com/integrations/google-cloud)

**Environment Variables**

```bash
GEMINI_API_KEY=
GOOGLE_APPLICATION_CREDENTIALS=
```

---

## 🪄 5. Remove.bg

**Purpose:** Instantly remove photo backgrounds for clean product images.  
**Install:** No official Vercel integration — add API key manually.

**Environment Variables**

```bash
REMOVE_BG_API_KEY=
```

---

## ⚡ 6. Railway (Backend Functions)

**Purpose:** Host your background AI agent and cross-posting automations.  
**Install:** [https://vercel.com/integrations/railway](https://vercel.com/integrations/railway)

**Environment Variables**

```bash
RAILWAY_URL=
```

---

## 📊 7. Vercel Analytics

**Purpose:** Monitor traffic, conversions, and app performance.  
**Enable:** Project Settings → Analytics → "Enable Analytics" ✅  
Free starter plan available.

---

## 🛠️ 8. Optional Integrations

| Integration          | Purpose                                       | Link                                                                               |
| -------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------- |
| 🧩 **Sentry**        | Error tracking & logs                         | [https://vercel.com/integrations/sentry](https://vercel.com/integrations/sentry)   |
| ✉️ **Resend**        | Transactional email (e.g. "Listing is live!") | [https://vercel.com/integrations/resend](https://vercel.com/integrations/resend)   |
| ⚡ **Upstash Redis** | Cache AI results / API calls                  | [https://vercel.com/integrations/upstash](https://vercel.com/integrations/upstash) |

---

## 💎 Final Steps

1. Add all variables above to **Vercel → Settings → Environment Variables**
2. Click **Redeploy** to apply them
3. Test your app → Verify auth, payments, and AI features
4. 🎉 You're live — **your Photo2Profit empire is ready to scale**

---

> ✨ _Luxury is efficiency. Profit is automation._  
> — Photo2Profit™ Team 💎
