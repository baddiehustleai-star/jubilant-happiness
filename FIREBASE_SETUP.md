# Photo2Profit Firebase Setup Guide 🔥

This guide will help you connect your Photo2Profit Agent to Firebase Cloud Firestore for live data storage and retrieval.

## 🚀 Quick Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** → Name it `photo2profit` 
3. Skip Google Analytics (optional)
4. Wait for project creation

### 2. Enable Firestore Database

1. In left menu → **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"**
4. Set location (e.g., `us-central`)
5. Click **"Enable"**

### 3. Get Firebase Configuration

1. In **Project Settings → General → Your Apps**
2. Click **"Add app" → Web**
3. Name it "Photo2Profit App"
4. Click **"Register app"**
5. Copy the config object that looks like this:

```js
const firebaseConfig = {
  apiKey: "AIzaSyAEXAMPLE123",
  authDomain: "photo2profit.firebaseapp.com", 
  projectId: "photo2profit",
  storageBucket: "photo2profit.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
```

### 4. Update Firebase Configuration

Open `scripts/firebase.js` and replace the placeholder values with your actual Firebase config:

```js
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "YOUR_ACTUAL_API_KEY",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "your-project.appspot.com", 
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};
```

## 🔐 Environment Variables (Recommended)

For security, create a `.env` file in your project root:

```env
FIREBASE_API_KEY=AIzaSyAEXAMPLE123
FIREBASE_AUTH_DOMAIN=photo2profit.firebaseapp.com
FIREBASE_PROJECT_ID=photo2profit
FIREBASE_STORAGE_BUCKET=photo2profit.appspot.com
FIREBASE_MESSAGING_SENDER_ID=1234567890
FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

**Note:** Add `.env` to your `.gitignore` file!

## 🧪 Test Your Setup

Run the daily ads script to test Firebase connection:

```bash
node scripts/generate-daily-ads.js
```

Expected output:
```
🚀 Running Photo2Profit Daily Automation...
🔥 Firebase connection successful!
📦 Fetched 2 listings from Firestore
📱 Generated 4 social media posts
✅ Daily report saved locally and to Firebase
```

## 📊 Firestore Collections Structure

Your Photo2Profit agent will create these collections in Firestore:

### `listings`
- **id**: Auto-generated document ID
- **title**: Item title
- **description**: Item description  
- **price**: Current price (string)
- **tags**: Array of tags
- **image**: Image URL
- **url**: Listing URL
- **dateAdded**: ISO timestamp
- **lastUpdated**: ISO timestamp
- **suggestedPrice**: AI-suggested price (added by monthly script)
- **lastPriceUpdate**: Last pricing analysis timestamp

### `reports` 
- **id**: Auto-generated document ID
- **type**: Report type (`daily_automation`, `weekly_analytics`, `monthly_pricing_refresh`)
- **date**: Report date
- **createdAt**: ISO timestamp
- **data**: Report content (varies by type)

### `social_posts`
- **id**: Auto-generated document ID
- **platform**: Social platform (`instagram`, `tiktok`, `facebook`)
- **item**: Related item title
- **caption**: Post caption
- **hashtags**: Array of hashtags
- **status**: Post status (`pending`, `posted`, `failed`)
- **listingId**: Reference to listings collection
- **scheduledTime**: When to post
- **createdAt**: ISO timestamp

### `pricing_history`
- **id**: Auto-generated document ID
- **listingId**: Reference to listings collection
- **suggestedPrice**: AI-suggested price
- **confidence**: Confidence level (`high`, `medium`, `low`)
- **priority**: Priority score (number)
- **recommendations**: Array of pricing recommendations
- **updatedAt**: ISO timestamp

### `analytics`
- **id**: Auto-generated document ID
- **type**: Analytics type (`weekly_kpis`, `performance_metrics`)
- **data**: Analytics data object
- **date**: Analytics date
- **createdAt**: ISO timestamp

## 🚀 GitHub Actions Setup

For automated runs, add Firebase secrets to GitHub:

1. Go to your repo → **Settings → Secrets and Variables → Actions**
2. Add these secrets:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN` 
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`

## 🔧 Troubleshooting

### "Firebase connection failed"
- Check your Firebase config values
- Ensure Firestore is enabled in Firebase Console
- Verify your project ID is correct

### "Permission denied" errors
- Your Firestore is in production mode
- For development, consider test mode (temporarily)
- Or set up proper security rules

### Scripts run but no data in Firestore
- Check Firebase Console → Firestore Database
- Look for new collections: `listings`, `reports`, `social_posts`
- Run scripts again to populate data

## 📱 Adding Your First Listings

You can add listings manually in Firebase Console or use this code:

```js
import { saveListing } from './scripts/firebase.js';

await saveListing(null, {
  title: "Vintage Denim Jacket",
  description: "Classic Levi's trucker jacket, size M. Great condition.",
  price: "$45",
  tags: ["vintage", "denim", "style"],
  image: "https://example.com/jacket.jpg",
  url: "https://poshmark.com/listing/123"
});
```

## ✨ What's Next?

With Firebase connected, your Photo2Profit agent can now:

- 📦 Store unlimited listings
- 📊 Track detailed analytics over time
- 📱 Manage social media posts queue
- 💰 Maintain pricing history
- 🔄 Sync data across all platforms

Your automation scripts will now read and write live data instead of local files, making your reselling business truly scalable! 🚀