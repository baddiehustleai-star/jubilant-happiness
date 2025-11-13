# 📋 Photo2Profit Launch Playbook

This playbook guides you through the complete launch process for Photo2Profit, from local verification to post-deployment monitoring.

## ■ 1. Local System Check

Run the automated deployment verification script:

```bash
npm run verify:deploy
```

This command confirms:

- ✅ `.env` is configured with required variables
- ✅ Firebase and Cloud Run config exists
- ✅ Lint, tests, build all pass
- ✅ Dependencies are installed
- ✅ API health routes are live

### What the Script Checks

#### Environment Configuration

- Verifies `.env.example` exists
- Checks if `.env` is configured
- Validates required environment variables:
  - `FIREBASE_API_KEY`
  - `FIREBASE_PROJECT_ID`
  - `STRIPE_SECRET_KEY`
- Checks optional variables:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `STRIPE_PRICE_ID`

#### Deployment Configuration

- Firebase config (`firebase.json` - optional)
- GitHub Actions workflows (CI, backend deploy, frontend deploy)
- API directory structure

#### Code Quality

- Runs linting (`npm run lint`)
- Runs all tests (`npm run test`)
- Builds the project (`npm run build`)
- Verifies build artifacts in `dist/`

#### API Health

- Checks `/api/health.js` endpoint exists
- Verifies handler function is exported
- Checks optional `/api/seo/refresh.js` endpoint

### Fixing Common Issues

If verification fails, address the issues reported:

**Missing .env file:**

```bash
cp .env.example .env
# Then edit .env with your actual values
```

**Missing dependencies:**

```bash
npm install
```

**Lint errors:**

```bash
npm run lint -- --fix
```

**Build failures:**

```bash
npm run build
# Review error messages and fix source code
```

---

## ■ 2. Domain & Hosting

### DNS Configuration

Verify your domain is properly configured:

**For Firebase Hosting:**

```bash
# Check current hosting configuration
firebase hosting:sites:list

# Connect custom domain (if not already done)
firebase hosting:sites:create photo2profit-production
firebase target:apply hosting production photo2profit-production
```

**For Vercel:**

- Go to Vercel Dashboard → Your Project → Domains
- Add your custom domain (e.g., `photo2profit.online`)
- Update your DNS records as instructed by Vercel

**For Netlify:**

- Go to Netlify Dashboard → Site settings → Domain management
- Add custom domain
- Configure DNS records

### HTTPS Verification

Ensure HTTPS is enabled:

```bash
# Test HTTPS
curl -I https://your-domain.com

# Expected: HTTP/2 200 OK (or HTTP/1.1 200 OK)
```

Both Firebase and Vercel automatically provision SSL certificates. Verify that:

- ✅ HTTPS redirects are working
- ✅ SSL certificate is valid
- ✅ No mixed content warnings

---

## ■ 3. Secrets & Auth

### Environment Variables

Verify all required secrets are configured in your deployment platform.

**GitHub Secrets (for CI/CD):**

Navigate to: `Settings → Secrets and variables → Actions`

Required secrets:

- `GOOGLE_APPLICATION_CREDENTIALS_JSON` - Cloud Run authentication
- `FIREBASE_SERVICE_ACCOUNT` - Firebase deployment

Optional secrets:

- `SLACK_WEBHOOK_URL` - Deployment notifications
- `CRON_SECRET` - SEO refresh endpoint security

**Deployment Platform Secrets:**

For Vercel/Netlify, configure in the dashboard:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_STRIPE_PRICE_ID`

For Cloud Run (backend):

- `STRIPE_SECRET_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- Other API keys as needed

### OAuth Setup

**Google OAuth Configuration:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your project
3. Click "Create Credentials" → "OAuth 2.0 Client ID"
4. Add authorized redirect URIs:
   - `https://your-domain.com/api/auth/callback/google`
   - `http://localhost:5173/api/auth/callback/google` (for local testing)
5. Enable required APIs:
   - Google Identity Toolkit API
   - Google+ API (if using legacy auth)

**Stripe Setup:**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Get your API keys:
   - Publishable key (starts with `pk_test_` or `pk_live_`)
   - Secret key (starts with `sk_test_` or `sk_live_`)
3. Create pricing:
   - Go to Products → Add product
   - Set price to $9.99/month (or your chosen amount)
   - Copy the Price ID (starts with `price_`)
4. Set up webhooks:
   - Go to Developers → Webhooks
   - Add endpoint: `https://your-domain.com/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `customer.subscription.deleted`

---

## ■ 4. Final Deploy Steps

### Option A: Firebase Hosting + Cloud Run

Deploy both frontend and backend:

```bash
# Deploy backend to Cloud Run (via GitHub Actions)
git add .
git commit -m "chore: trigger backend deployment"
git push origin main

# Or manually via gcloud:
gcloud run deploy photo2profit-api \
  --source . \
  --region us-west2 \
  --platform managed \
  --allow-unauthenticated

# Deploy frontend to Firebase
npm run build
firebase deploy --only hosting
```

### Option B: Netlify

```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist

# Or use Netlify CLI for initial setup:
netlify init
netlify deploy --prod
```

### Option C: Vercel

```bash
# Deploy to production
vercel --prod

# Or link and deploy:
vercel link
vercel --prod
```

### Automated Deployments

The repository includes GitHub Actions workflows that automatically deploy when you push to `main`:

- **Backend (`deploy.yml`)**: Triggers on changes to `api/**`
- **Frontend (`frontend-deploy.yml`)**: Triggers on changes to `src/**`, `public/**`, etc.
- **CI (`ci.yml`)**: Runs on all PRs and pushes to main

---

## ■ 5. Post-Deploy Checks

After deployment, verify everything works:

### 1. Homepage Loads

```bash
curl -I https://your-domain.com
# Expected: HTTP 200 OK
```

Visit in browser and verify:

- ✅ Page loads without errors
- ✅ Styling is correct (rose-gold theme)
- ✅ Images load
- ✅ Logo displays

### 2. OAuth Login Works

1. Click "Sign In" or "Login with Google"
2. Complete OAuth flow
3. Verify you're redirected back to the app
4. Check that user session is maintained

### 3. Stripe Checkout Works

1. Click "Subscribe" or pricing button
2. Verify Stripe checkout page opens
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify redirect back to app with success message

### 4. Dashboard Loads Correctly

1. Navigate to dashboard/app section
2. Verify user data loads
3. Test core features (upload, listing generation, etc.)
4. Check for any console errors

### 5. Mobile View OK

Test on mobile devices or browser devtools:

- ✅ Responsive design works
- ✅ Touch interactions work
- ✅ Navigation is accessible
- ✅ Forms are usable

### 6. No Console Errors

Open browser DevTools (F12):

- Check Console tab for JavaScript errors
- Check Network tab for failed requests
- Verify no 404s or 500s

### Automated Health Checks

```bash
# Backend health check
curl https://your-cloud-run-url/api/health
# Expected: {"status":"ok","service":"photo2profit-api","timestamp":"..."}

# Frontend check
curl -I https://your-domain.com
# Expected: HTTP 200 OK
```

---

## ■ 6. Announce

Once everything is verified, announce your launch:

### Social Media

**Twitter/X Teaser:**

```
🚀 Excited to launch Photo2Profit!

Turn your product photos into profitable listings with AI.
Cross-post to eBay, Poshmark, Mercari & more.

✨ Try it now: [your-link]
$1 trial → $9.99/month

#Reselling #SideHustle #AI
```

**LinkedIn Post:**

```
I'm thrilled to announce the launch of Photo2Profit! 🎉

After [X months] of development, we've built an AI-powered platform
that helps resellers automate their listing process.

Key features:
• AI-generated descriptions
• Multi-platform cross-posting
• Background removal
• Price optimization

Try it free: [your-link]

#Entrepreneurship #AI #Ecommerce
```

### Email Launch

Send to your mailing list:

**Subject:** "Photo2Profit is Live! 🎉 Get Your $1 Trial"

**Body:**

```
Hi [Name],

Great news! Photo2Profit is officially live and ready to transform
how you create resale listings.

What you get:
✓ AI-powered listing descriptions
✓ Automatic background removal
✓ Cross-posting to 8+ platforms
✓ CSV exports for bulk uploads
✓ Weekly automated reports

Special Launch Offer:
🎁 $1 trial for your first week
💎 Then just $9.99/month
🚀 Cancel anytime

Get started: [CTA button]

Questions? Reply to this email.

Cheers,
[Your Name]
```

### Social Previews

Ensure your Open Graph tags are set up:

**Verify social preview cards:**

- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### Product Hunt (Optional)

If launching on Product Hunt:

1. Prepare assets:
   - 260x260 thumbnail
   - Cover image (1270x760)
   - Gallery images
   - Product video/GIF

2. Schedule launch:
   - Launch at 12:01 AM PST for maximum visibility
   - Prepare 1-2 sentence tagline
   - Write compelling description

3. Rally support:
   - Email your list
   - Post on social media
   - Engage with comments

---

## ■ 7. Maintenance

### Setup Monitoring

**Error Tracking:**

1. Set up Sentry or similar:

```bash
npm install @sentry/react @sentry/node
```

2. Add to `src/main.jsx`:

```javascript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

**Uptime Monitoring:**

Use services like:

- [UptimeRobot](https://uptimerobot.com/) (free)
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

Monitor these endpoints:

- `https://your-domain.com` (homepage)
- `https://your-cloud-run-url/api/health` (backend)

### Enable Error Logging

**Cloud Run Logging:**

```bash
# View recent logs
gcloud logging read "resource.type=cloud_run_revision \
  AND resource.labels.service_name=photo2profit-api" \
  --limit 50 --format json

# Set up log-based alerts
gcloud logging sinks create error-alerts \
  pubsub.googleapis.com/projects/[PROJECT_ID]/topics/error-alerts \
  --log-filter='severity>=ERROR'
```

**Firebase Crashlytics:**

```bash
# Add to your project
npm install firebase
firebase crashlytics:symbols:upload
```

### Backup Stripe Webhooks

Keep webhook signing secrets secure:

1. Store in password manager
2. Document in team wiki
3. Add to GitHub Secrets for disaster recovery

**Webhook endpoint:** `https://your-domain.com/api/stripe/webhook`

**Important events to monitor:**

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.deleted`
- `invoice.payment_failed`

### Weekly CI: verify:deploy

Add to your calendar or create a GitHub Action:

**.github/workflows/weekly-verify.yml:**

```yaml
name: Weekly Verification

on:
  schedule:
    - cron: '0 10 * * 1' # Every Monday at 10 AM UTC
  workflow_dispatch: # Allow manual trigger

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run verify:deploy
```

### Regular Tasks

**Daily:**

- Monitor error logs
- Check uptime status
- Review Stripe dashboard for failed payments

**Weekly:**

- Run `npm run verify:deploy`
- Review analytics (users, revenue, churn)
- Check for security updates: `npm audit`
- Review customer feedback

**Monthly:**

- Update dependencies: `npm update`
- Review and optimize cloud costs
- Backup database (if applicable)
- Test disaster recovery procedures

**Quarterly:**

- Security audit
- Performance optimization
- Feature planning based on user feedback
- Marketing campaign review

---

## 🚨 Troubleshooting

### Deployment Fails

**Check GitHub Actions logs:**

1. Go to Actions tab
2. Click on failed workflow
3. Review error messages

**Common issues:**

- Missing secrets → Add in repository settings
- Build errors → Test locally with `npm run build`
- Permission errors → Check service account permissions

### Site Not Loading

1. Check DNS: `nslookup your-domain.com`
2. Verify deployment: Check hosting dashboard
3. Review logs: Cloud Run or hosting platform logs
4. Test different browsers/incognito mode

### OAuth Not Working

1. Verify redirect URI matches exactly
2. Check OAuth credentials are correct
3. Ensure APIs are enabled in Google Cloud Console
4. Review browser console for CORS errors

### Stripe Issues

1. Verify webhook endpoint is accessible
2. Check webhook signing secret matches
3. Review Stripe dashboard logs
4. Ensure Price ID is correct and active

---

## 📊 Success Metrics

Track these KPIs post-launch:

- **Activation Rate:** % of signups who complete onboarding
- **Trial Conversion:** % of trials that convert to paid
- **Monthly Recurring Revenue (MRR)**
- **Churn Rate:** % of users who cancel
- **Customer Lifetime Value (LTV)**
- **Customer Acquisition Cost (CAC)**

---

## 🎯 Next Steps

After successful launch:

1. **Gather feedback:** Set up feedback mechanisms (surveys, user interviews)
2. **Iterate quickly:** Release small improvements weekly
3. **Build community:** Create Discord/Slack for users
4. **Content marketing:** Blog posts, tutorials, case studies
5. **Partnerships:** Reach out to influencers in reselling space

---

## 📚 Additional Resources

- [README.md](../README.md) - Project overview
- [README-DEPLOY.md](../README-DEPLOY.md) - Detailed deployment guide
- [DEPLOYMENT-STATUS.md](../DEPLOYMENT-STATUS.md) - Status check procedures
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines

---

## 🆘 Support

Need help? Reach out:

- 📧 Email: support@photo2profit.app
- 💬 GitHub Issues: [Create an issue](https://github.com/baddiehustleai-star/jubilant-happiness/issues/new)
- 📖 Documentation: [Full docs](https://github.com/baddiehustleai-star/jubilant-happiness)

---

**Good luck with your launch! 🚀**
