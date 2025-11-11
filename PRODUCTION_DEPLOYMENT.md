# 🚀 Photo2Profit Production Deployment Guide

This guide will take you from your current Codespace to a fully deployed mobile app on Google Cloud Platform.

## 📋 Prerequisites

1. **Google Cloud Account** with billing enabled
2. **Project 758851214311** (your Firebase project)
3. **Vercel Account** (free tier works)
4. **gcloud CLI** installed

## 🔧 Step 1: Install Google Cloud CLI

If you don't have gcloud installed:

```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Authenticate and set project
gcloud auth login
gcloud config set project 758851214311
```

## 🌟 Step 2: Deploy Cloud Run API

```bash
# Navigate to API directory
cd api

# Run deployment script
./deploy.sh
```

This will:

- ✅ Enable required Google Cloud APIs
- ✅ Build and deploy your AI service to Cloud Run
- ✅ Output your API URL (save this!)

Expected output:

```
✅ Deployment complete!
🌐 Service URL: https://photo2profit-api-[hash].a.run.app
```

## 📱 Step 3: Deploy Frontend to Vercel

1. **Connect to Vercel:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (first time will ask for setup)
vercel --prod
```

2. **Add Environment Variables in Vercel Dashboard:**

Go to your Vercel project → Settings → Environment Variables:

| Variable                | Value                                       | Notes                 |
| ----------------------- | ------------------------------------------- | --------------------- |
| `VITE_FIREBASE_API_KEY` | `AIzaSy...`                                 | From Firebase Console |
| `VITE_FIREBASE_APP_ID`  | `1:758851214311:web:...`                    | From Firebase Console |
| `VITE_API_BASE_URL`     | `https://photo2profit-api-[hash].a.run.app` | From Step 2           |

3. **Redeploy with env vars:**

```bash
vercel --prod
```

## 🔐 Step 4: Configure Google Cloud Secrets

Store sensitive API keys in Secret Manager:

```bash
# eBay API credentials
echo -n "your-ebay-client-id" | gcloud secrets create ebay-client-id --data-file=-
echo -n "your-ebay-secret" | gcloud secrets create ebay-client-secret --data-file=-

# Stripe keys
echo -n "sk_live_..." | gcloud secrets create stripe-secret-key --data-file=-

# Other API keys as needed
echo -n "your-openai-key" | gcloud secrets create openai-api-key --data-file=-
```

## 🧪 Step 5: Test Your Production App

1. **Test Cloud Run API:**

```bash
curl https://your-api-url.a.run.app/health
```

2. **Test Vercel Frontend:**
   - Visit your Vercel URL
   - Try the "Add to Home Screen" feature on mobile
   - Test photo upload and AI analysis

3. **Test PWA Installation:**
   - Open site on mobile browser
   - Look for "Install App" prompt
   - Add to home screen
   - Test offline functionality

## 🎯 Step 6: Monitor and Scale

### Cloud Run Monitoring:

```bash
# View logs
gcloud logs read --service=photo2profit-api --limit=50

# Check service status
gcloud run services describe photo2profit-api --region=us-central1
```

### Firebase Analytics:

- View user analytics in Firebase Console
- Monitor API usage and errors
- Track conversion funnel

## 📱 Step 7: Mobile App Store (Optional)

For native app store distribution:

1. **Install Capacitor:**

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init photo2profit com.baddiehustle.photo2profit
npx cap add android
```

2. **Build for Android:**

```bash
npm run build
npx cap copy
npx cap open android
```

3. **Generate Signed APK** in Android Studio
4. **Upload to Google Play Console**

## 🏗️ Architecture Overview

```
📱 Mobile PWA (Vercel)
   ↓ HTTPS
🔥 Firebase Auth/Firestore (758851214311)
   ↓
☁️ Cloud Run API (us-central1)
   ↓
🤖 Vertex AI (Gemini 1.5 Flash)
   ↓
🔐 Secret Manager (API keys)
```

## 💰 Cost Estimates

| Service       | Free Tier              | Paid Usage                 |
| ------------- | ---------------------- | -------------------------- |
| **Vercel**    | 100GB bandwidth        | $20/month Pro              |
| **Firebase**  | 1GB storage, 50K reads | $25/month Blaze            |
| **Cloud Run** | 2M requests            | $0.40 per 1M requests      |
| **Vertex AI** | $0.00125 per 1K tokens | ~$5/month for moderate use |

**Total estimated monthly cost:** ~$50-100 for a growing app

## 🚨 Troubleshooting

### Common Issues:

1. **"Permission denied" during deployment:**

```bash
gcloud auth application-default login
```

2. **PWA not installing:**
   - Check HTTPS is enabled
   - Verify manifest.json is accessible
   - Test on Chrome mobile first

3. **API errors:**
   - Check Cloud Run logs: `gcloud logs read --service=photo2profit-api`
   - Verify Firebase service account permissions

### Support:

- 📧 Check logs in Google Cloud Console
- 🔍 Test endpoints individually
- 📱 Use browser dev tools for PWA debugging

---

## ✅ Success Checklist

- [ ] Cloud Run API deployed and responding
- [ ] Vercel frontend deployed with PWA
- [ ] Firebase authentication working
- [ ] AI product analysis functional
- [ ] Mobile "Add to Home Screen" working
- [ ] Cross-posting simulation functional
- [ ] Environment variables secured
- [ ] Monitoring and logs accessible

**Your Photo2Profit app is now production-ready! 🎉**
