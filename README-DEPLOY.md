# Deploy & Quickstart (Photo2Profit)

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

## Automated Full-Stack Deployment (Cloud Run + Firebase Hosting)

The repository includes a GitHub Actions workflow (`.github/workflows/deploy-photo2profit.yml`) that automatically deploys both backend and frontend on every push to `main`.

### Required GitHub Secrets

Add these secrets in **GitHub → Settings → Secrets and variables → Actions → New repository secret**:

1. **`GCP_SA_KEY`** - JSON key for your Google Cloud service account
   - Create a service account in Google Cloud Console with Cloud Run Admin and Service Account User roles
   - Generate and download a JSON key
2. **`STRIPE_SECRET_KEY`** - Your Stripe API secret key (use test key for development)
3. **`FIREBASE_TOKEN`** - Firebase CI token
   - Run `firebase login:ci` locally to generate this token
   - Paste the resulting token string as the secret value

### What the Workflow Does

- ✅ Deploys backend API (`/api`) to **Google Cloud Run** (service: `photo2profit-api`, region: `us-west2`)
- ✅ Builds the React frontend with Vite
- ✅ Deploys frontend to **Firebase Hosting**
- ✅ Runs automatically on push to `main`
- ✅ Posts deployment logs in commit view

### Manual Deployment (Alternative)

- **Vercel**: Link your GitHub repo; Vercel will run the CI and create previews
- Make sure environment variables are set in Vercel dashboard (STRIPE_SECRET_KEY, SENTRY_DSN)

6. Stripe testing

- Use test price IDs from your Stripe dashboard.
- Use the `/api/create-checkout-session` endpoint to create sessions (client helper available at `src/lib/stripe.js`).

7. Notes

- The Upload demo is a client-side preview only; for production you should upload images to storage (S3/Firebase Storage) and serve optimized images via CDN or an image service.
- CI workflow is in `.github/workflows/ci.yml`.
