# Firebase Setup Guide - Photo2Profit Production

## Automated Setup Steps

### 1. Firebase Project Creation

- **Project Name**: `photo2profit-prod`
- **Project ID**: Will be auto-generated (like `photo2profit-prod-12345`)
- **Google Analytics**: Enable for production insights

### 2. Authentication Configuration

Enable these sign-in methods:

- ✅ **Email/Password** - Primary authentication
- ✅ **Google Sign-In** - Social login option
- ✅ **Anonymous** - For guest users/demos

### 3. Firestore Database Setup

- **Mode**: Production mode (secure by default)
- **Location**: `us-central1` (or closest to your users)
- **Security Rules**: Custom rules (we'll deploy them)

### 4. Storage Configuration

- **Location**: Same as Firestore (`us-central1`)
- **Security Rules**: Production mode initially

### 5. Required Configuration Keys

After setup, you'll need these from Firebase Console:

```javascript
// From Project Settings > General > Your apps > Web app config
const firebaseConfig = {
  apiKey: 'your-api-key',
  authDomain: 'photo2profit-prod.firebaseapp.com',
  projectId: 'photo2profit-prod',
  storageBucket: 'photo2profit-prod.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef123456',
};

// From Project Settings > Service accounts > Generate new private key
const serviceAccount = {
  // Full service account JSON for server-side admin SDK
};
```

### 6. Environment Variables for Vercel

```bash
# Client-side (VITE_ prefix for frontend)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=photo2profit-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=photo2profit-prod
VITE_FIREBASE_STORAGE_BUCKET=photo2profit-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Server-side (for admin functions)
FIREBASE_PROJECT_ID=photo2profit-prod
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc@photo2profit-prod.iam.gserviceaccount.com
```

## Next Steps After Firebase Setup

1. Get configuration keys from Firebase Console
2. Add environment variables to Vercel
3. Deploy updated Firestore security rules
4. Test authentication in production
