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

- Recommended: Vercel (link your GitHub repo; Vercel will run the CI and create previews).
- Make sure environment variables are set in Vercel dashboard (STRIPE_SECRET_KEY, SENTRY_DSN).

### Google Cloud / Cloud Run Deployment

The repository includes an automated deployment workflow (`.github/workflows/deploy.yml`) that deploys the API to Google Cloud Run.

**⚠️ SECURITY: Setting up GitHub Secrets**

To deploy to Google Cloud Run, you need to configure the following GitHub secret:

1. **Create a Google Cloud Service Account**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to IAM & Admin > Service Accounts
   - Create a new service account with Cloud Run Admin and Service Account User roles
   - Create a JSON key for the service account

2. **Add the secret to GitHub**:
   - Go to your GitHub repository Settings > Secrets and variables > Actions
   - Click "New repository secret"
   - Name: `GOOGLE_APPLICATION_CREDENTIALS_JSON`
   - Value: Paste the entire contents of your service account JSON file
   - Click "Add secret"

3. **⚠️ NEVER commit service account credentials to your repository!**
   - Service account JSON files contain sensitive private keys
   - The `.gitignore` file is configured to exclude these files
   - Always use GitHub Secrets or environment variables for credentials

**Required GitHub Secrets for Cloud Run deployment:**
- `GOOGLE_APPLICATION_CREDENTIALS_JSON` - Full JSON service account key (required)
- `CRON_SECRET` - Optional secret for SEO refresh endpoint
- `SLACK_WEBHOOK_URL` - Optional Slack notification webhook

6. Stripe testing

- Use test price IDs from your Stripe dashboard.
- Use the `/api/create-checkout-session` endpoint to create sessions (client helper available at `src/lib/stripe.js`).

7. Notes

- The Upload demo is a client-side preview only; for production you should upload images to storage (S3/Firebase Storage) and serve optimized images via CDN or an image service.
- CI workflow is in `.github/workflows/ci.yml`.
