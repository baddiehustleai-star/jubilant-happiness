# 🔥 Firebase Configuration Guide for Photo2Profit

This guide will help you set up Firebase for your Photo2Profit application.

## 📋 Prerequisites

1. **Firebase CLI installed:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase account** with a project created

## 🚀 Step-by-Step Setup

### 1. Login to Firebase

```bash
firebase login
```

### 2. Initialize Firebase (if not already done)

```bash
firebase init
```

**Select these options:**
- ✅ Firestore: Configure security rules and indexes files
- ✅ Functions: Configure a Cloud Functions directory
- ✅ Hosting: Configure files for Firebase Hosting
- ✅ Storage: Configure a security rules file for Cloud Storage

**Important answers:**
- Project: `photo2profit-ai` (or create new one)
- Firestore rules file: `firestore.rules` ✅
- Firestore indexes file: `firestore.indexes.json` ✅
- Functions language: `JavaScript`
- Storage rules file: `storage.rules` ✅
- Public directory: `dist` ✅
- Single-page app: `Yes` ✅
- Automatic builds/deploys: `No` (we'll use GitHub Actions)

### 3. Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`photo2profit-ai`)
3. Click **Project Settings** (gear icon)
4. Scroll to **Your apps** section
5. Click **Add app** → **Web** (if not already created)
6. Register app name: `Photo2Profit`
7. Copy the config object

### 4. Create Local Environment File

Create `.env` file in project root:

```bash
cp .env.example .env
```

**Fill in your Firebase config values:**

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=photo2profit-ai.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=photo2profit-ai
VITE_FIREBASE_STORAGE_BUCKET=photo2profit-ai.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_here
STRIPE_PRICE_ID_TRIAL=price_your_trial_price_id
STRIPE_PRICE_ID_PRO=price_your_pro_price_id
```

### 5. Enable Firebase Services

In Firebase Console, enable these services:

#### Authentication
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** (optional)

#### Firestore Database
1. Go to **Firestore Database**
2. Click **Create database**
3. Start in **test mode** (we have security rules)
4. Choose location (us-central1 recommended)

#### Storage
1. Go to **Storage**
2. Click **Get started**
3. Start in **test mode** (we have security rules)

### 6. Deploy Security Rules

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules  
firebase deploy --only storage
```

### 7. Test Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` and test:
- ✅ Landing page loads
- ✅ Sign up/login works
- ✅ Dashboard loads after authentication

### 8. Set up GitHub Actions (for automated deployment)

#### Create Firebase Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **IAM & Admin** → **Service Accounts**
4. Click **Create Service Account**
5. Name: `github-actions`
6. Grant roles:
   - **Firebase Admin**
   - **Service Account User**
7. Create and download JSON key

#### Add GitHub Secrets

In your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:

```
FIREBASE_SERVICE_ACCOUNT_PHOTO2PROFIT_AI = [paste entire JSON content]
VITE_FIREBASE_API_KEY = your_api_key
VITE_FIREBASE_AUTH_DOMAIN = photo2profit-ai.firebaseapp.com  
VITE_FIREBASE_PROJECT_ID = photo2profit-ai
VITE_FIREBASE_STORAGE_BUCKET = photo2profit-ai.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID = your_sender_id
VITE_FIREBASE_APP_ID = your_app_id
VITE_STRIPE_PUBLISHABLE_KEY = pk_test_your_key
```

### 9. Deploy to Firebase Hosting

**Manual deployment:**
```bash
npm run build
firebase deploy --only hosting
```

**Automatic deployment:**
- Push to `main` branch
- GitHub Actions will automatically build and deploy

## 🎯 Testing Checklist

After setup, test these flows:

- [ ] Landing page loads correctly
- [ ] User can sign up with email/password
- [ ] User can sign in with existing account
- [ ] Dashboard loads after authentication
- [ ] Photo upload works (may need Firebase Storage enabled)
- [ ] User can sign out

## 🔧 Troubleshooting

### Common Issues:

1. **"Permission denied" on Firestore:**
   - Check if Authentication is enabled
   - Verify security rules are deployed

2. **"Network Error" on upload:**
   - Check if Storage is enabled
   - Verify storage rules are deployed

3. **"Invalid API key":**
   - Double-check `.env` file values
   - Ensure `VITE_` prefix is used

4. **Build fails in GitHub Actions:**
   - Verify all secrets are added to GitHub
   - Check secret names match workflow file

## 📞 Support

If you need help:
1. Check Firebase Console for error messages
2. Check browser console for JavaScript errors
3. Check GitHub Actions logs for deployment issues

**Your Firebase app should be live at:**
`https://photo2profit-ai.web.app`