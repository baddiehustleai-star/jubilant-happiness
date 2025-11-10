# Stripe Webhook Setup

This document describes how to configure and use the Stripe webhook handler for processing payment events.

## Overview

The webhook handler (`/api/webhook.js`) processes Stripe payment events and updates the user database when payments are completed.

## Environment Variables

Set these environment variables in your deployment platform (Vercel, Cloud Run, etc.):

```bash
STRIPE_SECRET_KEY=sk_test_your_key_here
SHARED_WEBHOOK_SECRET=whsec_your_webhook_secret
DATABASE_URL=file:./dev.db  # or your production database URL
```

## Stripe Dashboard Configuration

1. Go to Stripe Dashboard → **Developers → Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to your deployed webhook:
   - Example: `https://your-domain.com/api/webhook`
4. Select events to send:
   - `checkout.session.completed`
   - `invoice.payment_failed`
5. Copy the **Signing secret** and set it as `SHARED_WEBHOOK_SECRET`

## Database Schema

The webhook uses a Prisma User model:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  paid      Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Event Handling

### checkout.session.completed

When a customer completes a checkout session:
1. Extracts the customer email from the session
2. Creates or updates the user in the database
3. Sets the `paid` flag to `true`

### invoice.payment_failed

Logs payment failures for monitoring purposes.

## Testing

Test the webhook locally:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Forward webhooks to localhost:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
3. Trigger test events:
   ```bash
   stripe trigger checkout.session.completed
   ```

## Optional: Firestore Integration

To sync data with Firestore, install `firebase-admin` and uncomment the Firestore code in `/api/webhook.js`:

```bash
npm install firebase-admin
```

## Deployment

### Vercel

Vercel automatically detects files in the `/api` directory as serverless functions.

```bash
vercel --prod
```

### Google Cloud Run

Deploy with environment variables:

```bash
gcloud run deploy photo2profit-api \
  --source ./api \
  --region us-west2 \
  --allow-unauthenticated \
  --set-env-vars "STRIPE_SECRET_KEY=sk_test_...,SHARED_WEBHOOK_SECRET=whsec_...,DATABASE_URL=..."
```

## Security Notes

- Always use webhook signature verification (enabled by default)
- Never log sensitive payment information
- Use environment variables for secrets
- Enable HTTPS for all webhook endpoints
- Regularly rotate webhook secrets
