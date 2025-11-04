# 🚀 Quick Start Guide - Photo2Profit

Welcome to Photo2Profit! This guide will help you get your application up and running in minutes.

## 📋 Prerequisites

- Node.js 18+ installed
- A Google account for Firebase
- Access to Firebase project: **jubilant-happiness-11477832**

## 🎯 Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

#### Option A: Use the verification script
```bash
# Copy the environment template
cp .env.example .env

# Edit .env and add your Firebase credentials
# Then verify your setup
./verify-firebase-setup.sh
```

#### Option B: Manual setup
1. Open the `.env` file in your project root
2. Follow the instructions in [`GETTING_FIREBASE_API_KEYS.md`](./GETTING_FIREBASE_API_KEYS.md)
3. Update these two required values:
   - `VITE_FIREBASE_API_KEY` - Your Firebase API key
   - `VITE_FIREBASE_APP_ID` - Your Firebase App ID

### 3. Enable Firebase Services

Go to [Firebase Console](https://console.firebase.google.com/) and select **jubilant-happiness-11477832**:

1. **Authentication**
   - Navigate to: Build → Authentication → Get Started
   - Enable "Email/Password" sign-in method
   - (Optional) Enable "Google" sign-in method

2. **Firestore Database**
   - Navigate to: Build → Firestore Database → Create database
   - Select "Start in test mode"
   - Choose location: **us-central1**

3. **Storage**
   - Navigate to: Build → Storage → Get started
   - Select "Start in test mode"
   - Use the same location: **us-central1**

### 4. Start Development Server

```bash
npm run dev
```

Your app will be running at [http://localhost:5173](http://localhost:5173)

## ✅ Verify Your Setup

1. Open [http://localhost:5173/login](http://localhost:5173/login)
2. Try to create a new account with email/password
3. If successful, you're all set! 🎉

## 🎨 What's Included

- **Photo2Profit Branding** - Rose gold luxe theme with elegant typography
- **Firebase Authentication** - Secure user authentication with email/password and Google sign-in
- **Firestore Database** - Cloud NoSQL database for user data and listings
- **Firebase Storage** - Cloud storage for photos and images
- **Responsive Design** - Mobile-first, works on all devices
- **Modern Stack** - React 18, Vite, TailwindCSS

## 📚 Documentation

- [`GETTING_FIREBASE_API_KEYS.md`](./GETTING_FIREBASE_API_KEYS.md) - Detailed guide for Firebase credentials
- [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md) - Complete Firebase setup and usage guide
- [`README.md`](./README.md) - Full project documentation

## 🆘 Troubleshooting

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Firebase Not Configured
```bash
# Verify your configuration
./verify-firebase-setup.sh

# Check for missing values
cat .env | grep VITE_FIREBASE
```

### Development Server Issues
```bash
# Restart the dev server after changing .env
npm run dev
```

### "Permission Denied" in Firestore/Storage
- Make sure you've created the database/storage in test mode
- Check that you're authenticated (signed in)
- Test mode allows all reads/writes for 30 days

## 🔒 Security Notes

After testing in development:
1. Update Firestore security rules (see `firestore.rules`)
2. Update Storage security rules (see `storage.rules`)
3. Enable Firebase App Check for production
4. Never commit your `.env` file to git

## 🎯 Next Steps

Once your setup is working:

1. **Explore the Dashboard** at [/dashboard](http://localhost:5173/dashboard)
2. **Upload test photos** to try the photo upload feature
3. **Check the branding** - Notice the rose gold theme throughout
4. **Review the code** - See how Firebase is integrated
5. **Add optional features**:
   - Stripe for payments
   - Gemini API for AI features
   - Remove.bg for background removal

## 💰 Optional API Keys (Add Later)

You can add these to your `.env` file when ready:

```env
# Google Gemini (FREE) - for AI features
VITE_GEMINI_API_KEY=your_key

# Stripe - for payments
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Remove.bg - for background removal
VITE_REMOVEBG_API_KEY=your_key
```

## 📞 Need Help?

- Check the [Firebase Documentation](https://firebase.google.com/docs)
- Review the project documentation files
- Check browser console for error messages
- Ensure all Firebase services are enabled

## 🎉 You're Ready!

Your Photo2Profit application is now configured with:
- ✅ Firebase Authentication
- ✅ Firestore Database
- ✅ Firebase Storage
- ✅ Photo2Profit Branding
- ✅ Rose Gold Luxe Theme

Start building amazing features! 🚀
