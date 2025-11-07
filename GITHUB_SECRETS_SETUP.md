# 🔐 GitHub Secrets Setup Guide

To enable automatic deployment with the gatekeeper system, add these secrets to your GitHub repository.

## 📍 How to Add Secrets

1. Go to your GitHub repo: `https://github.com/baddiehustleai-star/jubilant-happiness`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each of these:

## 🔑 Required Secrets

### Firebase Configuration
| Secret Name | Value | Where to Find |
|-------------|-------|---------------|
| `VITE_FIREBASE_API_KEY` | `AIzaSy...` | Firebase Console → Project Settings → General |
| `VITE_FIREBASE_APP_ID` | `1:758851214311:web:...` | Firebase Console → Project Settings → General |
| `VITE_FIREBASE_PROJECT_ID` | `758851214311` | Firebase Console → Project Settings → General |

### Vercel Configuration
| Secret Name | Value | Where to Find |
|-------------|-------|---------------|
| `VERCEL_TOKEN` | `your_token_here` | Vercel Dashboard → Settings → Tokens |
| `ORG_ID` | `team_xxx` or `your_username` | Vercel Project → Settings → General |
| `PROJECT_ID` | `prj_xxx` | Vercel Project → Settings → General |

## 🎯 Quick Setup Commands

### Get Vercel IDs
```bash
# Install Vercel CLI
npm i -g vercel

# Login and get project info
vercel login
vercel ls
vercel project ls
```

### Get Firebase Config
```bash
# From Firebase Console
https://console.firebase.google.com/project/758851214311/settings/general
```

## ✅ Testing Your Setup

Once secrets are added, push any change to trigger the gatekeeper:

```bash
git add .
git commit -m "Test gatekeeper deployment"
git push origin main
```

You'll see in Actions:
1. 🛡️ **Verify Backend Health** - Tests Cloud Run endpoints
2. 🌟 **Deploy Frontend to Vercel** - Only runs if #1 passes
3. 🚨 **Gatekeeper Alert** - Shows if deployment was blocked

## 🎉 Expected Result

**If all endpoints are healthy:**
```
✅ Backend verification passed
🚀 Frontend deployed to Vercel
💎 Photo2Payday Baddie Mode is LIVE!
```

**If any endpoint fails:**
```
❌ Backend health check failed
🛡️ Vercel deployment cancelled for safety  
🚨 No broken code goes to production!
```

## 🔧 Troubleshooting

**Deployment blocked?** Check:
- Cloud Run service is running: `gcloud run services describe photo2profit-api`
- Endpoints respond: `npm run verify:prod`
- Secret Manager has all keys: `gcloud secrets list`

**Vercel deploy fails?** Check:
- All 3 Vercel secrets are set correctly
- Build completes locally: `npm run build`
- Environment variables are valid