# 🚀 Alternative Deployment: Vercel/Netlify with Custom Domain

This guide covers deploying Photo2Profit to **Vercel** or **Netlify** with the custom domain `photo2profit.online`.

> **Note:** This is an alternative to the Cloud Run/Firebase Hosting deployment documented in [GITHUB-ACTIONS-REVIEW.md](./GITHUB-ACTIONS-REVIEW.md). Choose the deployment method that best fits your needs.

---

## 📊 Deployment Comparison

| Feature              | Cloud Run + Firebase         | Vercel/Netlify             |
| -------------------- | ---------------------------- | -------------------------- |
| **Backend**          | Cloud Run (containerized)    | Serverless functions       |
| **Frontend**         | Firebase Hosting             | Vercel/Netlify CDN         |
| **Deployment**       | Automated via GitHub Actions | Auto-deploy from Git       |
| **Custom Domain**    | Firebase custom domain       | Built-in domain management |
| **Setup Complexity** | Medium                       | Low                        |
| **Cost**             | Google Cloud pricing         | Free tier available        |

---

## 🎯 Vercel Deployment (Recommended for Vite)

### Step 1: Connect Repository

1. Visit [vercel.com](https://vercel.com) and sign up/login
2. Click **"New Project"**
3. Import your GitHub repository: `baddiehustleai-star/jubilant-happiness`
4. Vercel will auto-detect Vite configuration

### Step 2: Configure Build Settings

Vercel should automatically detect:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

If not, set these manually in the project settings.

### Step 3: Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

#### Required Variables:

```bash
# Stripe (Frontend)
VITE_STRIPE_PUBLIC_KEY=pk_live_xxx  # or pk_test_xxx for testing
VITE_STRIPE_PRICE_ID_STARTER=price_xxx
VITE_STRIPE_PRICE_ID_PRO=price_xxx
VITE_STRIPE_SUCCESS_URL=https://photo2profit.online/success
VITE_STRIPE_CANCEL_URL=https://photo2profit.online/cancel

# Firebase (Frontend)
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx

# Backend API (if using Cloud Run backend)
VITE_API_BASE_URL=https://photo2profit-api-xxx.run.app
```

#### Optional Variables:

```bash
# Google OAuth (if using Google login)
VITE_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com

# Other integrations
VITE_REMOVEBG_API_KEY=xxx
VITE_SENTRY_DSN=xxx
```

> **Note:** All frontend environment variables in Vite must be prefixed with `VITE_` to be accessible in the browser.

### Step 4: Configure Custom Domain

1. Go to Vercel Dashboard → Settings → Domains
2. Add domain: `photo2profit.online`
3. Vercel will provide DNS configuration instructions

#### DNS Setup (GoDaddy or your registrar):

**Option A: CNAME (recommended)**

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Option B: A Record**

```
Type: A
Name: @
Value: 76.76.21.21
```

Add these additional records:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

4. Wait 15-30 minutes for DNS propagation
5. Verify at [dnschecker.org](https://dnschecker.org)

### Step 5: Deploy

Once configured:

1. Push to `main` branch (or your production branch)
2. Vercel automatically builds and deploys
3. Visit `photo2profit.online` to verify

---

## 🌐 Netlify Deployment

### Step 1: Connect Repository

1. Visit [netlify.com](https://netlify.com) and sign up/login
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select: `baddiehustleai-star/jubilant-happiness`

### Step 2: Configure Build Settings

Set the following:

- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Base Directory:** (leave empty)

### Step 3: Add Environment Variables

In Netlify Dashboard → Site Settings → Environment Variables:

Add the same variables as listed in the Vercel section above. All `VITE_` prefixed variables are required.

### Step 4: Configure Custom Domain

1. Go to Site Settings → Domain Management
2. Add custom domain: `photo2profit.online`
3. Netlify will provide DNS instructions

#### DNS Setup:

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: [your-site].netlify.app
```

4. Wait for DNS propagation

### Step 5: Deploy

1. Netlify automatically builds on every push to `main`
2. Visit `photo2profit.online` to verify

---

## 🔐 Google OAuth Setup

If you're using Google login or Google APIs:

### Step 1: Create Google Cloud Project

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing: `photo2profitbaddie`

### Step 2: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type
3. Fill in application details:
   - App name: **Photo2Profit**
   - User support email: your email
   - Developer contact: your email
4. Add **Authorized domains:**
   - `photo2profit.online`
   - `vercel.app` (if using Vercel)
   - `netlify.app` (if using Netlify)

### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Add **Authorized JavaScript origins:**
   - `https://photo2profit.online`
   - `http://localhost:5173` (for local dev)
5. Add **Authorized redirect URIs:**
   - `https://photo2profit.online/auth/callback`
   - `http://localhost:5173/auth/callback`
6. Save and copy your **Client ID** and **Client Secret**

### Step 4: Add to Environment Variables

Add to Vercel/Netlify:

```bash
VITE_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
```

If you have a backend, also add:

```bash
GOOGLE_CLIENT_SECRET=xxx
```

> **Security:** Never expose `GOOGLE_CLIENT_SECRET` in frontend code!

---

## ✅ Deployment Verification Checklist

After deployment, verify:

- [ ] **Homepage loads** on `https://photo2profit.online`
- [ ] **SSL certificate** is active (https works)
- [ ] **Stripe checkout** redirects correctly
- [ ] **Success/Cancel URLs** work properly
- [ ] **Google login** functions (if enabled)
- [ ] **API calls** to backend work
- [ ] **Image uploads** function correctly
- [ ] **Email opt-in** works
- [ ] **Social share previews** look good (check with [opengraph.xyz](https://www.opengraph.xyz/))

---

## 🎨 Post-Deployment Optimization

### 1. Analytics Setup

**Google Analytics 4:**

```bash
# Add to .env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Plausible (privacy-friendly alternative):**

```bash
# Add to .env
VITE_PLAUSIBLE_DOMAIN=photo2profit.online
```

### 2. SEO & Social Media

Ensure these meta tags are in your `index.html`:

```html
<meta property="og:title" content="Photo2Profit - AI-Powered Resale Automation" />
<meta property="og:description" content="Transform photos into profit-ready listings with AI" />
<meta property="og:image" content="https://photo2profit.online/og-image.png" />
<meta property="og:url" content="https://photo2profit.online" />
<meta name="twitter:card" content="summary_large_image" />
```

### 3. Favicon

Add favicon files to `/public/`:

- `favicon.ico` (32x32)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)

### 4. Performance Monitoring

**Vercel Analytics:** Enable in Vercel Dashboard → Analytics

**Netlify Analytics:** Enable in Netlify Dashboard → Analytics

---

## 🔄 Comparison with Cloud Run/Firebase

### When to Use Vercel/Netlify:

✅ Simpler setup and configuration
✅ Better developer experience for frontend-only or JAMstack apps
✅ Generous free tiers
✅ Built-in domain management
✅ Automatic preview deployments for PRs
✅ Edge functions for simple backend needs

### When to Use Cloud Run/Firebase:

✅ Need containerized backend with complex dependencies
✅ Already invested in Google Cloud ecosystem
✅ Need more control over backend infrastructure
✅ Require Firebase features (Firestore, Auth, Cloud Functions)
✅ Need to scale backend independently

### Can You Use Both?

Yes! You can:

- **Frontend:** Deploy to Vercel/Netlify
- **Backend:** Keep on Cloud Run
- **Database:** Firebase Firestore
- **Auth:** Firebase Authentication

Just point your frontend to the Cloud Run backend URL using `VITE_API_BASE_URL`.

---

## 🆘 Troubleshooting

### Domain Not Resolving

- Check DNS propagation: [dnschecker.org](https://dnschecker.org)
- Wait 24-48 hours for full propagation
- Clear browser cache and DNS cache
- Verify DNS records are correct in your registrar

### Environment Variables Not Working

- Ensure all frontend vars are prefixed with `VITE_`
- Redeploy after adding environment variables
- Check browser console for undefined variables
- Verify variables are set in deployment platform, not just `.env`

### Stripe Checkout Fails

- Verify `VITE_STRIPE_PUBLIC_KEY` is correct
- Check success/cancel URLs match your domain
- Test with Stripe test card: `4242 4242 4242 4242`
- Check Stripe dashboard for error logs

### Google OAuth Fails

- Verify authorized domains include your production domain
- Check redirect URIs exactly match your routes
- Ensure OAuth consent screen is published (not in testing mode)
- Check browser console for detailed error messages

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

---

## 🎉 Ready to Launch?

Once deployed and verified:

1. ✅ Set up analytics (GA4 or Plausible)
2. ✅ Create launch content (tweet, social posts)
3. ✅ Submit to Product Hunt
4. ✅ Update documentation with production URLs
5. ✅ Monitor for the first 24-48 hours

---

**Deployment Platform:** Vercel or Netlify  
**Domain:** photo2profit.online  
**Last Updated:** 2025-11-13  
**Status:** ✅ Ready for production deployment
