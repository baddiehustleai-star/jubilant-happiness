# 🚀 Vercel Deployment Troubleshooting — Photo2Profit

> If your project isn't showing at https://vercel.com/baddiehustle

---

## 🔍 Common Reasons & Fixes

### 1️⃣ Project Not Linked Yet

**Symptom:** Dashboard is empty or only shows other projects.

**Fix:**

```bash
# Login to Vercel (if not already)
vercel login

# Link this repository to Vercel
cd /workspaces/jubilant-happiness
vercel link

# Follow prompts:
# - Select scope: baddiehustle (or your team)
# - Link to existing project? No (create new)
# - Project name: photo2profit (or jubilant-happiness)
# - Directory: ./ (default)
```

After linking, `.vercel/` directory will be created with `project.json` containing your PROJECT_ID.

---

### 2️⃣ Wrong Vercel Account/Team Context

**Symptom:** Logged into personal account but project was created under a team.

**Check active account:**

```bash
vercel whoami
# Should show: baddiehustle
```

**Switch teams:**

```bash
vercel switch
# Select the correct team/scope
```

**Check in dashboard:**

- Go to https://vercel.com/baddiehustle
- Top-left dropdown: ensure "baddiehustle" team is selected
- If you see "Personal Account" instead, switch to your team

---

### 3️⃣ GitHub Integration Not Connected

**Symptom:** Manual CLI deployments work, but GitHub pushes don't trigger deploys.

**Fix:**

1. Go to https://vercel.com/dashboard
2. Click your avatar → **Settings**
3. Go to **Git Integrations** → **GitHub**
4. Click **Install** or **Configure**
5. Grant access to `baddiehustleai-star/jubilant-happiness` repo
6. Return to https://vercel.com/baddiehustle
7. Click **Add New... → Project**
8. Import `baddiehustleai-star/jubilant-happiness`

---

### 4️⃣ Project Exists But Hidden by Filters

**Check:**

- In dashboard, clear any search/filter boxes
- Check "Archived" tab (projects can be accidentally archived)
- Check all team scopes (personal vs team accounts)

---

### 5️⃣ GitHub Actions Deployment Not Set Up

**Symptom:** No automatic deployments on push to `main`.

Your repo already has `.github/workflows/deploy-vercel.yml`, but it needs secrets:

**Required GitHub Secrets:**
Go to: https://github.com/baddiehustleai-star/jubilant-happiness/settings/secrets/actions

Add these:

- `VERCEL_TOKEN` — Get from https://vercel.com/account/tokens
- `ORG_ID` — Found in team settings or `.vercel/project.json`
- `PROJECT_ID` — Found in `.vercel/project.json` after linking
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_PROJECT_ID`

**Get ORG_ID and PROJECT_ID:**

```bash
# After running `vercel link`:
cat .vercel/project.json
# Copy orgId and projectId values
```

---

### 6️⃣ First Deployment Never Triggered

**Quick deploy to make project visible:**

```bash
# Deploy immediately (preview)
vercel

# Deploy to production
vercel --prod
```

This creates the project in your dashboard and makes it visible.

---

## 🎯 Step-by-Step: Fresh Setup

If starting from scratch:

### Step 1: Login & Link

```bash
vercel login
cd /workspaces/jubilant-happiness
vercel link
```

### Step 2: Set Environment Variables

```bash
# Add all required vars (Vercel will prompt for value and scope)
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID
vercel env add VITE_API_BASE_URL
vercel env add VITE_STRIPE_PUBLISHABLE_KEY
vercel env add VITE_STRIPE_PRICE_ID_TRIAL
vercel env add VITE_STRIPE_PRICE_ID_PRO
```

Or bulk-add via dashboard:

1. Go to https://vercel.com/baddiehustle/photo2profit/settings/environment-variables
2. Click **Add New**
3. Paste key-value pairs from your `.env` file
4. Select environments: Production, Preview, Development

### Step 3: Deploy

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

### Step 4: Connect GitHub (for auto-deploy)

1. Dashboard → Import Project → Select `jubilant-happiness`
2. Or go to project settings → Git → Connect Repository

### Step 5: Add GitHub Secrets (for Actions)

```bash
# Get project details
cat .vercel/project.json

# Add to GitHub:
# https://github.com/baddiehustleai-star/jubilant-happiness/settings/secrets/actions
# - VERCEL_TOKEN
# - ORG_ID (from project.json)
# - PROJECT_ID (from project.json)
```

---

## 🛠️ Diagnostic Commands

### Check Login Status

```bash
vercel whoami
# Should output: baddiehustle
```

### List Projects

```bash
vercel list
# Shows all projects in current scope
```

### Check Project Link

```bash
cat .vercel/project.json
# Should show orgId and projectId
```

### View Deployments

```bash
vercel ls
# Lists all deployments for this project
```

### Get Project URL

```bash
vercel inspect
# Shows production URL and project details
```

---

## 🔐 Generate Vercel Token (for GitHub Actions)

1. Go to https://vercel.com/account/tokens
2. Click **Create Token**
3. Name: `GitHub Actions - Photo2Profit`
4. Scope: Full Account (or specific team)
5. Expiration: No expiration (or set custom)
6. Copy token immediately (shown only once)
7. Add to GitHub secrets: `VERCEL_TOKEN`

---

## 🌐 Access Project in Dashboard

After first deployment, your project will be visible at:

**Team Dashboard:**
https://vercel.com/baddiehustle

**Direct Project Link:**
https://vercel.com/baddiehustle/photo2profit

**Settings:**
https://vercel.com/baddiehustle/photo2profit/settings

**Deployments:**
https://vercel.com/baddiehustle/photo2profit/deployments

---

## 🚨 Still Not Showing?

### Check Team Membership

- Verify you're a member of `baddiehustle` team
- Go to https://vercel.com/teams/baddiehustle/settings/members
- Ensure your account has proper permissions

### Try Alternative Import

1. Go to https://vercel.com/new
2. Select **Import Git Repository**
3. Choose GitHub
4. Search for `jubilant-happiness`
5. Click **Import**
6. Configure build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Manual Project Creation

If Git import fails:

1. Dashboard → **Add New... → Project**
2. Select **Import Third-Party Git Repository**
3. Enter: `https://github.com/baddiehustleai-star/jubilant-happiness`
4. Click **Continue**

---

## 📞 Support Resources

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Photo2Profit Deployment Guide: See `VERCEL_DEPLOYMENT.md` in repo

---

## ✅ Success Checklist

After setup, verify:

- [ ] Project visible at https://vercel.com/baddiehustle
- [ ] `.vercel/project.json` exists locally
- [ ] Environment variables set in dashboard
- [ ] GitHub repository connected
- [ ] GitHub secrets configured (VERCEL_TOKEN, ORG_ID, PROJECT_ID)
- [ ] First deployment succeeded
- [ ] Production URL accessible
- [ ] PWA manifest loads correctly
- [ ] Firebase auth works on deployed site

---

> 💎 **Manifested by Hustle & Heal™**  
> Photo2Profit — Turn photos into profit with AI automation
