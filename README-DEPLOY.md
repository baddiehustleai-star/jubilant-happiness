# Deploy & Quickstart (Photo2Profit)

1. Backup and apply changes (if using provided patches).

2. Environment variables (required)
   - STRIPE_SECRET_KEY - your Stripe secret key (test key for dev)
   - STRIPE_WEBHOOK_SECRET - webhook signing secret from Stripe dashboard (for webhook verification)
   - SENDGRID_API_KEY - SendGrid API key for sending confirmation emails
   - DATABASE_URL - database connection string (e.g., "file:./dev.db" for SQLite)
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

7. Webhook Setup

The `/api/webhook` endpoint handles Stripe payment events and sends confirmation emails:

**Setup steps:**

a. Get your webhook signing secret from Stripe Dashboard → Developers → Webhooks → Add endpoint
   - Endpoint URL: `https://your-domain.com/api/webhook`
   - Events to send: `checkout.session.completed`

b. Set environment variable:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

c. Verify SendGrid email sender:
   - Go to SendGrid → Settings → Sender Authentication
   - Verify the sender email (no-reply@photo2profit.com or your domain)

d. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

**What the webhook does:**
- Verifies Stripe webhook signature
- Updates/creates user in database with `paid: true`
- Sends branded confirmation email via SendGrid

8. Notes

- The Upload demo is a client-side preview only; for production you should upload images to storage (S3/Firebase Storage) and serve optimized images via CDN or an image service.
- CI workflow is in `.github/workflows/ci.yml`.
