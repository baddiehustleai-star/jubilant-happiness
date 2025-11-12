# Deploy & Quickstart (Photo2Profit)

## Automated Deployment Prerequisites

For automated deployments via GitHub Actions, first set up service accounts:

- 📘 See **[SERVICE_ACCOUNT_SETUP.md](./SERVICE_ACCOUNT_SETUP.md)** for complete setup instructions
- Required for Google Cloud Run (backend) and Firebase Hosting (frontend) deployments

## Local Development Setup

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
