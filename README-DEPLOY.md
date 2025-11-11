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

### Option A: Vercel (Recommended for Frontend)

- Recommended: Vercel (link your GitHub repo; Vercel will run the CI and create previews).
- Make sure environment variables are set in Vercel dashboard (STRIPE_SECRET_KEY, SENTRY_DSN).

### Option B: Google Cloud Run (For API/Backend)

If you're deploying the Photo2Profit API to Google Cloud Run via GitHub Actions CI/CD pipeline, you'll need to set up a service account with appropriate permissions.

#### Setting up Google Cloud Service Account

**Via Google Cloud Console:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **IAM & Admin** > **Service Accounts**
3. Click **Create Service Account**
4. Fill in the details:
   - **Service account name:** `github-deploy-bot`
   - **Service account ID:** (auto-generated, e.g., `github-deploy-bot@photo2profitbaddie.iam.gserviceaccount.com`)
   - **Description:** `Deploys Photo2Profit API to Cloud Run via GitHub Actions CI/CD pipeline`
5. Click **Create and Continue**
6. Grant the following roles:
   - **Cloud Run Admin** - Deploy and manage Cloud Run services
   - **Service Account User** - Act as service accounts
   - **Storage Admin** - (optional, but helpful for build caching)
7. Click **Continue**, then **Done**
8. Click on the created service account
9. Go to the **Keys** tab
10. Click **Add Key** > **Create new key**
11. Select **JSON** format and click **Create**
12. Save the downloaded JSON file securely

**Via Cloud Shell (One Command):**

```bash
# Set your project ID
export PROJECT_ID="your-project-id"

# Create the service account
gcloud iam service-accounts create github-deploy-bot \
    --description="Deploys Photo2Profit API to Cloud Run via GitHub Actions CI/CD pipeline" \
    --display-name="github-deploy-bot" \
    --project=$PROJECT_ID

# Grant necessary roles
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-deploy-bot@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-deploy-bot@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-deploy-bot@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

# Create and download the JSON key
gcloud iam service-accounts keys create ~/github-deploy-bot-key.json \
    --iam-account=github-deploy-bot@${PROJECT_ID}.iam.gserviceaccount.com
```

#### Configuring GitHub Secret

1. Go to your GitHub repository settings
2. Navigate to **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Name: `GOOGLE_APPLICATION_CREDENTIALS_JSON`
5. Value: Paste the entire contents of the downloaded JSON key file
6. Click **Add secret**

**Security Note:** Never commit the service account JSON key to your repository. Always use GitHub Secrets for storing credentials.

6. Stripe testing

- Use test price IDs from your Stripe dashboard.
- Use the `/api/create-checkout-session` endpoint to create sessions (client helper available at `src/lib/stripe.js`).

7. Notes

- The Upload demo is a client-side preview only; for production you should upload images to storage (S3/Firebase Storage) and serve optimized images via CDN or an image service.
- CI workflow is in `.github/workflows/ci.yml`.
