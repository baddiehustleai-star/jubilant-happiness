# Webhook Deployment Guide

This guide explains how to deploy and configure the Stripe webhook handler for automatic payment confirmation emails.

## Prerequisites

1. **SendGrid Account**
   - Sign up at [https://sendgrid.com](https://sendgrid.com)
   - Create an API Key with "Full Access" from: Settings → API Keys
   - (Optional) Verify your sender domain for better deliverability

2. **Stripe Account**
   - Have your Stripe Secret Key ready (`sk_test_...` or `sk_live_...`)
   - Access to Stripe Dashboard → Developers → Webhooks

## Deployment Steps

### Option 1: Cloud Run (Google Cloud)

```bash
# 1. Install dependencies (if not done yet)
cd api
npm install @sendgrid/mail

# 2. Deploy to Cloud Run
gcloud run deploy photo2profit-api \
  --source ./api \
  --region us-west2 \
  --allow-unauthenticated \
  --set-env-vars "\
STRIPE_SECRET_KEY=sk_live_xxxxx,\
STRIPE_WEBHOOK_SECRET=whsec_xxxxx,\
SENDGRID_API_KEY=SG.xxxxx,\
SENDGRID_FROM_EMAIL=no-reply@photo2profit.com,\
FRONTEND_URL=https://photo2profitbaddie.web.app"

# 3. Note the Cloud Run URL (e.g., https://photo2profit-api-xxxxx-uc.a.run.app)
```

### Option 2: Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel Dashboard:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET` 
   - `SENDGRID_API_KEY`
   - `SENDGRID_FROM_EMAIL`
   - `FRONTEND_URL`
3. Deploy - Vercel will automatically detect and deploy the serverless functions

### Option 3: Netlify

1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify Dashboard:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `SENDGRID_API_KEY`
   - `SENDGRID_FROM_EMAIL`
   - `FRONTEND_URL`
3. Deploy - Netlify will automatically detect and deploy the functions

## Configure Stripe Webhook

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL:
   - Cloud Run: `https://your-cloud-run-url.run.app/api/webhook`
   - Vercel: `https://your-app.vercel.app/api/webhook`
   - Netlify: `https://your-app.netlify.app/.netlify/functions/webhook`
4. Select events to listen to:
   - ✅ `checkout.session.completed`
5. Click "Add endpoint"
6. Copy the "Signing secret" (starts with `whsec_`)
7. Update your deployment with the `STRIPE_WEBHOOK_SECRET` environment variable

## Testing

### Test Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe
# or download from https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhook events to your local server
stripe listen --forward-to localhost:3000/api/webhook

# Trigger a test event
stripe trigger checkout.session.completed
```

### Test in Production

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on your webhook endpoint
3. Click "Send test webhook"
4. Select `checkout.session.completed` event
5. Click "Send test webhook"
6. Check the logs in your deployment platform

## Email Template Customization

To customize the confirmation email, edit `api/webhook.js`:

```javascript
const msg = {
  to: customerEmail,
  from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@photo2profit.com',
  subject: '🎉 Payment Received — Welcome to Photo2Profit Pro!',
  text: `Your custom plain text message`,
  html: `
    <h2>🎉 Payment Successful!</h2>
    <!-- Your custom HTML -->
  `,
};
```

## Monitoring

### Check Webhook Logs

**Cloud Run:**
```bash
gcloud run services logs read photo2profit-api --region us-west2 --limit 50
```

**Vercel:**
- Go to your deployment → Functions tab
- Click on the webhook function to view logs

**Netlify:**
- Go to your site → Functions tab
- Click on the webhook function to view logs

### Common Log Messages

- ✅ `Checkout completed for session: cs_xxx` - Payment received
- 📧 `Confirmation email sent to user@example.com` - Email sent successfully
- ⚠️ `No customer email found in session` - Session missing email
- ❌ `Email send error: ...` - SendGrid error (check API key and limits)
- ⚠️ `Webhook signature verification is disabled` - Missing `STRIPE_WEBHOOK_SECRET`

## Troubleshooting

### Emails Not Sending

1. **Check SendGrid API Key**: Ensure it has "Full Access" permissions
2. **Check SendGrid Sender**: Verify your sender email in SendGrid
3. **Check Rate Limits**: Free SendGrid accounts have sending limits
4. **Check Logs**: Look for "Email send error" in your deployment logs

### Webhook Not Receiving Events

1. **Check Stripe Dashboard**: Go to Webhooks → Your endpoint → Attempts
2. **Check URL**: Ensure the endpoint URL is correct and accessible
3. **Check Webhook Secret**: Verify `STRIPE_WEBHOOK_SECRET` is set correctly
4. **Check Logs**: Look for 400 errors indicating signature verification failures

## Security Best Practices

1. ✅ Always set `STRIPE_WEBHOOK_SECRET` in production
2. ✅ Use HTTPS for webhook endpoints (required by Stripe)
3. ✅ Keep API keys secure and never commit them to git
4. ✅ Monitor webhook attempts in Stripe Dashboard
5. ✅ Set up alerts for failed webhook deliveries

## Cost Considerations

- **SendGrid Free Tier**: 100 emails/day
- **SendGrid Essentials**: $19.95/month for 50,000 emails/month
- **Stripe Webhooks**: Free
- **Cloud Run**: Free tier includes 2 million requests/month
- **Vercel**: Free tier includes 100GB bandwidth/month
- **Netlify**: Free tier includes 100GB bandwidth/month
