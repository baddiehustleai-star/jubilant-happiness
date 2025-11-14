# Deploy & Quickstart (Photo2Profit)

## 🌐 Deployment Architecture

Photo2Profit uses a subdomain-based deployment for clean separation:

| Component | Domain | Platform |
|-----------|--------|----------|
| Frontend | `photo2profit.app` | Firebase Hosting |
| Backend API | `api.photo2profit.app` | Google Cloud Run |

## 📋 Prerequisites

1. **Firebase CLI**: `npm install -g firebase-tools`
2. **Google Cloud SDK**: [Install gcloud](https://cloud.google.com/sdk/docs/install)
3. **GitHub Secrets**: Configure in repository settings

## 🚀 Quick Start

### 1. Environment Setup

Copy and configure environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Backend API URL
VITE_API_BASE_URL=https://api.photo2profit.app

# Firebase Configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=photo2profitbaddie.firebaseapp.com
FIREBASE_PROJECT_ID=photo2profitbaddie
FIREBASE_STORAGE_BUCKET=photo2profitbaddie.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Stripe
VITE_STRIPE_PRICE_ID=price_xxx
STRIPE_SECRET_KEY=sk_test_xxx

# Optional APIs
REMOVEBG_API_KEY=
EBAY_APP_ID=
SENDGRID_API_KEY=
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Local Development

```bash
npm run dev
# Open http://localhost:5173
```

### 4. Deploy to Production

#### Option A: Automatic (Recommended)

Push to `main` branch - GitHub Actions handles deployment:

```bash
git push origin main
```

Workflows will:
1. Build and test the code
2. Deploy backend to Cloud Run (`api.photo2profit.app`)
3. Deploy frontend to Firebase Hosting (`photo2profit.app`)

#### Option B: Manual Deployment

**Frontend (Firebase Hosting):**

```bash
npm run build
firebase deploy --only hosting
```

**Backend (Cloud Run):**

```bash
gcloud run deploy photo2profit-api \
  --source . \
  --region us-west2 \
  --platform managed \
  --allow-unauthenticated
```

## 🔐 GitHub Secrets Configuration

Required secrets (Settings → Secrets and variables → Actions):

| Secret | Description | Required |
|--------|-------------|----------|
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON | ✅ Yes |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | GCP service account key | ✅ Yes |
| `SLACK_WEBHOOK_URL` | Slack notification webhook | ⚠️ Optional |
| `CRON_SECRET` | SEO refresh endpoint secret | ⚠️ Optional |

## 🌐 DNS Configuration

Configure these DNS records in your domain registrar:

### Frontend Domain (photo2profit.app)

```
Type: A
Name: @
Value: 151.101.1.195
TTL: 3600

Type: A
Name: @
Value: 151.101.65.195
TTL: 3600
```

Or use CNAME:
```
Type: CNAME
Name: @
Value: photo2profitbaddie.web.app
TTL: 3600
```

### Backend API Domain (api.photo2profit.app)

```
Type: CNAME
Name: api
Value: ghs.googlehosted.com
TTL: 3600
```

Then map in Cloud Run:
1. Go to Cloud Run → photo2profit-api service
2. Click "Custom domains" tab
3. Add mapping for `api.photo2profit.app`

## 📦 What Gets Deployed

### Frontend (Firebase Hosting)
- Static React app built with Vite
- Global CDN distribution
- Automatic HTTPS/SSL
- SPA routing support

### Backend (Cloud Run)
- Node.js API endpoints
- Auto-scaling serverless containers
- HTTPS with custom domain
- Environment variable injection

## ✅ Verification

After deployment, verify everything works:

```bash
# Check backend health
curl https://api.photo2profit.app/api/health

# Check frontend
curl -I https://photo2profit.app
```

Expected responses:
- Backend: `{"status": "ok"}`
- Frontend: `HTTP/2 200`

## 📚 Additional Documentation

- [Firebase Setup Guide](./FIREBASE-SETUP.md) - Detailed Firebase Hosting setup
- [Deployment Status](./DEPLOYMENT-STATUS.md) - How to check deployment status
- [Main README](./README.md) - Project overview and features

---

## Legacy Instructions (Reference Only)

### Backup and apply changes (if using provided patches)

1. Backup and apply changes (if using provided patches).

2. Environment variables (required)
   - STRIPE_SECRET_KEY - your Stripe secret key (test key for dev)
   - SENTRY_DSN - optional Sentry DSN
   - FIREBASE config (if using Firebase): add as usual in client config
     - VITE_STRIPE_PRICE_ID - the Stripe Price ID to use for test checkout (set in Vercel as an env var so client can read it)

3. Install dependencies

```bash
npm install
# add tailwind plugins and stripe server SDK if not present:
npm install -D @tailwindcss/forms @tailwindcss/typography
npm install stripe
# remove jest if present:
npm uninstall -D jest
```

4. Run locally

```bash
npm run dev
# open http://localhost:5173 (or the address Vite prints)
```

5. Deploy

- Recommended: Vercel (link your GitHub repo; Vercel will run the CI and create previews).
- Make sure environment variables are set in Vercel dashboard (STRIPE_SECRET_KEY, SENTRY_DSN).

6. Stripe testing

- Use test price IDs from your Stripe dashboard.
- Use the `/api/create-checkout-session` endpoint to create sessions (client helper available at `src/lib/stripe.js`).

7. Notes

- The Upload demo is a client-side preview only; for production you should upload images to storage (S3/Firebase Storage) and serve optimized images via CDN or an image service.
- CI workflow is in `.github/workflows/ci.yml`.
