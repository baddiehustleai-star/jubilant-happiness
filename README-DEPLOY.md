# Deploy & Quickstart (Photo2Profit)

1. Backup and apply changes (if using provided patches).

2. Environment variables (required)
   - STRIPE_SECRET_KEY - your Stripe secret key (test key for dev)
   - SENTRY_DSN - optional Sentry DSN
   - FIREBASE config (if using Firebase): add as usual in client config
     <<<<<<< HEAD - VITE_STRIPE_PRICE_ID - the Stripe Price ID to use for test checkout (set in Vercel as an env var so client can read it)
     ======= - VITE_STRIPE_PRICE_ID - the Stripe Price ID to use for test checkout (set in Vercel as an env var so client can read it)

   Local development notes
   1. Copy `.env.example` to `.env.local` and replace placeholder values with your test keys. `.env.local` is ignored by git and safe to use for local testing.

   2. Vite will automatically expose variables prefixed with `VITE_` to the client (for example `VITE_STRIPE_PRICE_ID`). Server-side functions (like `api/create-checkout-session.js`) will read `STRIPE_SECRET_KEY` from `process.env` in the deployment environment (Vercel/Netlify). For local Node-based testing of serverless functions, use your environment or tools like `vercel dev` which load `.env` files.

   ````markdown
   # Deploy & Quickstart (Photo2Profit)

   This document explains how to run the project locally, configure environment variables, and automate creating a Stripe Price + setting the Vercel env var.

   1. Required environment variables
      - STRIPE*SECRET_KEY — your Stripe secret key (use test keys like `sk_test*...` for development)
      - VITE_STRIPE_PRICE_ID — Stripe Price ID used by the client (set in Vercel or in `.env.local` for local dev)
      - SENTRY_DSN — optional Sentry DSN

      Local development notes
      - Copy `.env.example` to `.env.local` and replace placeholder values with your test keys. `.env.local` is ignored by git and safe to use for local testing.
      - Vite exposes variables prefixed with `VITE_` to the client (for example `VITE_STRIPE_PRICE_ID`). Server-side functions (like `api/create-checkout-session.js`) read `STRIPE_SECRET_KEY` from `process.env`.
      - For local serverless testing use `vercel dev` (Vercel CLI) or run a Node process that loads `dotenv` from `.env.local`.

   2. Vercel deployment (recommended)
      1. Create a Vercel account and connect your GitHub repository.
      2. In the Vercel dashboard for your project, add the following Environment Variables under "Settings → Environment Variables":
         - `STRIPE_SECRET_KEY` — your Stripe Secret Key (set for Preview & Production as appropriate)
         - `VITE_STRIPE_PRICE_ID` — the price ID you created in Stripe (client-facing)
         - `SENTRY_DSN` — optional Sentry DSN
      3. Deploy the `main` branch. Serverless endpoints (`/api/*`) will have `process.env.STRIPE_SECRET_KEY` available in Vercel.

   3. Automated setup: create Stripe price and set Vercel env via GitHub Actions

      There's a manual GitHub Action workflow that can create a Stripe Product + Price and set the `VITE_STRIPE_PRICE_ID` env var on your Vercel project.

      Steps to run the workflow:
      - Add the following repository secrets in GitHub (Settings → Secrets and variables → Actions):
        - `STRIPE_SECRET_KEY` (Stripe test secret key)
        - `VERCEL_TOKEN` (a Vercel personal token with `Project` scope — create at https://vercel.com/account/tokens)
        - `VERCEL_PROJECT_ID` (your Vercel project ID — find it in project settings or via the Vercel CLI)
      - Open the "Actions" tab, pick the "Setup Stripe Price & Vercel Env" workflow and click "Run workflow" → choose `main`.

      The workflow will run `scripts/create-stripe-price.js` to create a Stripe product and recurring monthly price (default $9.90), then run `scripts/set-vercel-env.js` to set the `VITE_STRIPE_PRICE_ID` env var on your Vercel project. Review the scripts before running; they create resources in your Stripe account.

   4. Testing Stripe locally
      - Use Stripe test keys (start with `sk_test_...`). Create a Price in the Stripe Dashboard and put the Price ID into `VITE_STRIPE_PRICE_ID` in your `.env.local`.
      - To test serverless functions locally use `vercel dev` from the Vercel CLI (it loads `.env.local`) or run a local Node process that uses `dotenv` to load `.env.local`.

   5. Install dependencies

   ```bash
   npm install
   # add tailwind plugins and stripe server SDK if not present:
   npm install -D @tailwindcss/forms @tailwindcss/typography
   npm install stripe
   # remove jest if present:
   npm uninstall -D jest
   ```
   ````

   6. Run locally

   ```bash
   npm run dev
   # open http://localhost:5173 (or the address Vite prints)
   ```

   7. Deploy
   - Recommended: Vercel (link your GitHub repo; Vercel will run the CI and create previews).
   - Make sure environment variables are set in Vercel dashboard (STRIPE_SECRET_KEY, VITE_STRIPE_PRICE_ID, SENTRY_DSN).
   8. Stripe testing
   - Use test price IDs from your Stripe dashboard.
   - Use the `/api/create-checkout-session` endpoint to create sessions (client helper available at `src/lib/stripe.js`).
   9. Notes
   - The Upload demo is a client-side preview only; for production you should upload images to storage (S3/Firebase Storage) and serve optimized images via CDN or an image service.
   - CI workflow is in `.github/workflows/ci.yml`.

   ```

   ```
