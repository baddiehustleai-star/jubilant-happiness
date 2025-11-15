# 🚀 Photo2Profit Launch Checklist

Complete guide to deploy Photo2Profit from setup to launch. This checklist consolidates key steps from the detailed deployment documentation.

---

## ✅ Pre-Deployment Setup

### 1. Environment Variables Configuration

Configure these in your deployment platform (Vercel/Netlify) or GitHub Secrets:

#### Stripe (Required)

```env
STRIPE_SECRET_KEY=sk_live_xxx
VITE_STRIPE_PUBLIC_KEY=pk_live_xxx
VITE_STRIPE_PRICE_ID_STARTER=price_xxx
VITE_STRIPE_PRICE_ID_PRO=price_xxx
VITE_STRIPE_SUCCESS_URL=https://photo2profit.online/success
VITE_STRIPE_CANCEL_URL=https://photo2profit.online/cancel
```

#### Google OAuth (Required)

```env
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
```

#### Optional

```env
VITE_DEMO_VIDEO_URL=https://yourlink.com/demo.mp4
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Status:** [ ] Environment variables configured

---

### 2. Google OAuth Setup

Complete in [Google Cloud Console](https://console.cloud.google.com/):

- [ ] Create/select project: `Photo2Profit`
- [ ] Enable **Google Identity Services** API
  - Go to APIs & Services → Library
  - Search for "Google Identity Services"
  - Click Enable
- [ ] Configure OAuth Consent Screen
  - Select External user type
  - App name: Photo2Profit
  - Add authorized domain: `photo2profit.online`
  - Add scopes: `profile`, `email`
- [ ] Create OAuth 2.0 Client ID
  - Application type: Web application
  - Name: Photo2Profit OAuth
  - Add redirect URIs:
    - `https://photo2profit.online/api/auth/callback/google`
    - `http://localhost:3000/api/auth/callback/google`
- [ ] Copy Client ID and Client Secret to environment variables

**Reference:** See [DEPLOYMENT-VERCEL-NETLIFY.md](./DEPLOYMENT-VERCEL-NETLIFY.md) for detailed instructions

---

### 3. Stripe Configuration

Complete in [Stripe Dashboard](https://dashboard.stripe.com/):

- [ ] Create pricing plans/products:
  - [ ] Starter plan ($X/month)
  - [ ] Pro plan ($X/month)
  - [ ] Optional: Power plan
- [ ] Copy Price IDs to environment variables
- [ ] Switch to Live Mode (when ready for production)
- [ ] Test checkout flow with test cards in test mode
- [ ] Configure webhooks (if needed)

**Status:** [ ] Stripe fully configured

---

### 4. Domain & DNS Setup

On your domain registrar (e.g., GoDaddy):

- [ ] Access DNS Management for `photo2profit.online`
- [ ] Add DNS records (provided by Vercel/Netlify):
  - For Vercel: CNAME record pointing to `cname.vercel-dns.com`
  - For Netlify: A record or CNAME as instructed
- [ ] Wait 15-30 minutes for DNS propagation

**Status:** [ ] DNS configured

---

## 🚀 Deployment

### Option A: Vercel Deployment (Recommended)

- [ ] Visit [vercel.com](https://vercel.com) and sign in
- [ ] Click "New Project"
- [ ] Import GitHub repository: `baddiehustleai-star/jubilant-happiness`
- [ ] Vercel auto-detects Vite configuration
- [ ] Add environment variables (from step 1)
- [ ] Add custom domain: `photo2profit.online`
- [ ] Deploy!

**Reference:** [DEPLOYMENT-VERCEL-NETLIFY.md](./DEPLOYMENT-VERCEL-NETLIFY.md)

### Option B: Netlify Deployment

- [ ] Visit [netlify.com](https://netlify.com) and sign in
- [ ] Click "Add new site" → "Import an existing project"
- [ ] Connect to GitHub repository
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Add environment variables (from step 1)
- [ ] Add custom domain: `photo2profit.online`
- [ ] Deploy!

### Option C: Cloud Run + Firebase (Automated via GitHub Actions)

- [ ] Configure GitHub Secrets:
  - [ ] `GOOGLE_APPLICATION_CREDENTIALS_JSON`
  - [ ] `FIREBASE_SERVICE_ACCOUNT`
  - [ ] `SLACK_WEBHOOK_URL` (optional)
  - [ ] `CRON_SECRET` (optional)
- [ ] Merge PR to `main` branch
- [ ] GitHub Actions automatically deploys
- [ ] Monitor deployment in Actions tab

**Reference:** [GITHUB-ACTIONS-REVIEW.md](./GITHUB-ACTIONS-REVIEW.md)

**Deployment Status:** [ ] Successfully deployed

---

## ✅ Post-Deployment Verification

### 5. Basic Functionality Tests

- [ ] **Homepage loads** at `https://photo2profit.online`
- [ ] **SSL certificate** is active (padlock icon in browser)
- [ ] **Mobile responsiveness** - test on phone/tablet
- [ ] **All images load** correctly
- [ ] **Navigation works** - test all menu items and links

**Status:** [ ] Basic functionality verified

---

### 6. Authentication & User Flows

- [ ] **Google Sign-In works**
  - Click "Sign in with Google"
  - Complete OAuth flow
  - Verify successful login
- [ ] **User session persists** across page reloads
- [ ] **Logout functionality** works correctly

**Status:** [ ] Authentication verified

---

### 7. Payment Integration Tests

- [ ] **Checkout flow works**
  - Navigate to pricing page
  - Click subscribe/purchase button
  - Redirected to Stripe Checkout
- [ ] **Test payment succeeds**
  - Use test card: `4242 4242 4242 4242`
  - Verify redirect to success page
  - Check Stripe Dashboard for test payment
- [ ] **Success URL works**: `https://photo2profit.online/success`
- [ ] **Cancel URL works**: `https://photo2profit.online/cancel`

**Production Test:**

- [ ] Process real payment with actual card (small amount)
- [ ] Verify payment appears in Stripe Dashboard

**Status:** [ ] Payment integration verified

---

### 8. Analytics Tracking

- [ ] **Replace GA4 placeholder** in `index.html`:
  - Find `G-XXXXXXXXXX`
  - Replace with real GA4 Measurement ID
- [ ] **Verify events fire** in GA4 Real-Time view:
  - [ ] `cta_click`
  - [ ] `checkout_initiated`
  - [ ] `opt_in_submit`
  - [ ] Page views tracked
- [ ] **Test conversion tracking**

**Status:** [ ] Analytics configured and tracking

---

### 9. Email Opt-In (If Applicable)

- [ ] **Test opt-in form submission**
  - Enter email address
  - Submit form
  - Verify no errors
- [ ] **Choose Email Service Provider:**
  - [ ] Resend (recommended - fast & free)
  - [ ] Mailchimp (list building)
  - [ ] Postmark (transactional)
- [ ] **Configure backend integration** for chosen ESP
- [ ] **Test email delivery**
  - Submit test email
  - Verify received in inbox
  - Check ESP dashboard for new subscriber

**Status:** [ ] Email opt-in working

---

### 10. SEO & Social Sharing

- [ ] **Verify meta tags** in source code:
  - Open Graph tags present
  - Twitter Card tags present
  - Title and description correct
- [ ] **Test social previews:**
  - Share link on Twitter - verify preview
  - Share link on Facebook - verify preview
  - Use [opengraph.xyz](https://www.opengraph.xyz/) to test
- [ ] **Verify favicon** appears in browser tab
- [ ] **Confirm og-preview image** exists at `/public/og-preview.png`

**Status:** [ ] SEO and social sharing optimized

---

## 📊 Monitoring & Optimization

### 11. Performance Check

- [ ] **Run PageSpeed Insights**
  - Visit [pagespeed.web.dev](https://pagespeed.web.dev/)
  - Test `https://photo2profit.online`
  - Target: >90 score
- [ ] **Check Core Web Vitals:**
  - LCP (Largest Contentful Paint) < 2.5s
  - FID (First Input Delay) < 100ms
  - CLS (Cumulative Layout Shift) < 0.1

**Status:** [ ] Performance acceptable

---

### 12. Error Monitoring

- [ ] **Check browser console** for errors (F12 → Console)
- [ ] **Review deployment logs** for warnings
- [ ] **Set up Sentry** (optional):
  - Create Sentry project
  - Add `VITE_SENTRY_DSN` to environment variables
  - Test error tracking

**Status:** [ ] No critical errors

---

### 13. Security Review

- [ ] **Verify HTTPS** is enforced (no mixed content)
- [ ] **Check environment variables**:
  - No secrets exposed in client-side code
  - `GOOGLE_CLIENT_SECRET` only used server-side
  - `STRIPE_SECRET_KEY` only used server-side
- [ ] **Test CORS** - frontend can communicate with backend
- [ ] **Verify OAuth consent screen** is published (not in testing mode)

**Status:** [ ] Security verified

---

## 🎉 Launch Preparation

### 14. Pre-Launch Checklist

- [ ] **Full user flow test**:
  - [ ] Visit homepage → Sign up → Upload → Checkout → Success
  - [ ] Test on desktop
  - [ ] Test on mobile
  - [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] **Verify all CTA buttons work**
- [ ] **Check all form submissions**
- [ ] **Test all external links**
- [ ] **Spell check all copy**

**Status:** [ ] Ready for launch

---

### 15. Launch Day Tasks

- [ ] **Announce on social media**
  - [ ] Twitter/X post
  - [ ] LinkedIn post
  - [ ] Instagram story/post
  - [ ] TikTok (if applicable)
- [ ] **Submit to Product Hunt** (optional)
- [ ] **Email existing list** (if you have one)
- [ ] **Update status page** or "Coming Soon" to "Live"
- [ ] **Monitor analytics** for first 24 hours
- [ ] **Respond to user feedback** promptly

**Status:** [ ] Launched! 🚀

---

### 16. Post-Launch Monitoring (First 48 Hours)

- [ ] **Check analytics every 4-6 hours**
  - Monitor traffic sources
  - Track conversion rates
  - Identify drop-off points
- [ ] **Monitor error logs**
  - Check for new errors
  - Address critical issues immediately
- [ ] **Test payment processing**
  - Verify payments are processing
  - Check for failed transactions
- [ ] **Gather user feedback**
  - Monitor social media mentions
  - Read support emails
  - Track feature requests

**Status:** [ ] Actively monitoring

---

## 📚 Reference Documentation

- **[DEPLOYMENT-VERCEL-NETLIFY.md](./DEPLOYMENT-VERCEL-NETLIFY.md)** - Detailed Vercel/Netlify deployment guide
- **[GITHUB-ACTIONS-REVIEW.md](./GITHUB-ACTIONS-REVIEW.md)** - CI/CD workflow documentation
- **[POST-DEPLOYMENT-CHECKLIST.md](./POST-DEPLOYMENT-CHECKLIST.md)** - Comprehensive 19-step verification
- **[DEPLOYMENT-READY.md](./DEPLOYMENT-READY.md)** - Quick reference summary
- **[README.md](./README.md)** - Project overview and quick start

---

## 🆘 Troubleshooting

### Common Issues

**OAuth Login Fails:**

- Verify Google Identity Services API is enabled
- Check redirect URIs match exactly
- Ensure OAuth consent screen is published

**Stripe Checkout Doesn't Load:**

- Verify public key is correct
- Check price IDs match Stripe dashboard
- Ensure Stripe is in correct mode (test vs live)

**DNS Not Resolving:**

- Wait 24-48 hours for full propagation
- Check DNS records at [dnschecker.org](https://dnschecker.org)
- Verify records match platform instructions

**Build Fails:**

- Run `npm run build` locally to debug
- Check for missing environment variables
- Review build logs for specific errors

---

## ✅ Completion Summary

**Pre-Deployment:** [ ] Complete  
**Deployment:** [ ] Complete  
**Post-Deployment:** [ ] Complete  
**Launch:** [ ] Complete

---

**Last Updated:** 2025-11-13  
**Version:** 1.0  
**Status:** Ready for launch! 🎉

---

**Need Help?**

- Review detailed docs in the repository
- Check troubleshooting section above
- Reach out to your development team
