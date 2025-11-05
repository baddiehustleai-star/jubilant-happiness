# Firebase and Stripe Integration Guide

This guide will help you set up Firebase authentication and Stripe payment processing for Photo2Profit.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- A Firebase account
- A Stripe account

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project

### 2. Enable Authentication

1. In your Firebase project, go to **Build > Authentication**
2. Click "Get started"
3. Enable the following sign-in methods:
   - **Email/Password**: Click "Enable" and save
   - **Google**: Click "Enable", configure OAuth consent screen, and save

### 3. Set Up Firestore Database

1. Go to **Build > Firestore Database**
2. Click "Create database"
3. Choose "Start in production mode" or "Start in test mode" (for development)
4. Select your database location
5. Click "Enable"

### 4. Set Up Cloud Storage

1. Go to **Build > Storage**
2. Click "Get started"
3. Review security rules and click "Next"
4. Select your storage location and click "Done"

### 5. Get Your Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "Photo2Profit Web")
5. Copy the Firebase configuration values

### 6. Configure Environment Variables

Create a `.env` file in the root of your project (copy from `.env.example`):

```bash
cp .env.example .env
```

Add your Firebase configuration values to `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Stripe Setup

### 1. Create a Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up for a Stripe account if you don't have one
3. Complete your account setup

### 2. Get Your API Keys

1. In the Stripe Dashboard, go to **Developers > API keys**
2. Copy your **Publishable key** (starts with `pk_`)
3. Copy your **Secret key** (starts with `sk_`)

**Important**: 
- The **Publishable key** is safe to use in your frontend
- The **Secret key** must be kept secure and only used on your backend

### 3. Configure Environment Variables

Add your Stripe publishable key to `.env`:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

For backend integration (Cloud Functions), also set:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
```

### 4. Create Products and Prices

1. In Stripe Dashboard, go to **Products**
2. Click "Add product"
3. Create two products:
   - **Trial**: $1.00 one-time payment
   - **Pro Plan**: $9.99/month recurring subscription
4. Copy the **Price ID** for each product (starts with `price_`)

## Testing the Integration

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

### 3. Test Authentication

1. Navigate to `http://localhost:5173`
2. Click "Start Now" to go to the registration page
3. Create an account with email/password or Google
4. Verify that you're redirected to the dashboard

### 4. Test Stripe Integration (Frontend)

The current implementation includes:
- Subscription buttons on the Dashboard
- Stripe.js library loaded and ready

**Next Steps for Full Stripe Integration**:
1. Create a backend API endpoint (Firebase Cloud Function or your own backend)
2. Use the Stripe Secret Key on the backend to create Checkout Sessions
3. Update the `handleSubscribe` function in `src/pages/Dashboard.jsx` to call your backend
4. Redirect users to Stripe Checkout
5. Handle webhooks for successful payments

Example backend endpoint (Firebase Cloud Function):

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: data.priceId, // Pass from frontend
        quantity: 1,
      },
    ],
    mode: data.mode, // 'payment' for one-time, 'subscription' for recurring
    success_url: `${data.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: data.cancelUrl,
    customer_email: context.auth.token.email,
  });

  return { sessionId: session.id };
});
```

## Security Considerations

1. **Firebase Security Rules**: Update Firestore and Storage rules to restrict access
2. **Environment Variables**: Never commit `.env` to version control
3. **Stripe Keys**: Keep secret keys server-side only
4. **HTTPS**: Always use HTTPS in production
5. **Authentication**: Implement proper user verification for payments

## Firestore Security Rules Example

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read for products, admin-only write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Storage Security Rules Example

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can only upload to their own folders
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Troubleshooting

### Firebase Connection Issues

- Verify your API keys are correct in `.env`
- Check that Firebase services are enabled in the console
- Make sure you're using the correct project ID
- Ensure your app is registered in Firebase project settings

### Authentication Not Working

- Verify email/password and Google auth are enabled
- Check browser console for errors
- Make sure authorized domains are configured (Project Settings > Authorized domains)
- For Google auth, ensure OAuth consent screen is configured

### Stripe Integration Issues

- Verify your publishable key is correct
- Check browser console for Stripe.js loading errors
- For production, switch to live keys (starts with `pk_live_` and `sk_live_`)
- Test with Stripe test cards: https://stripe.com/docs/testing

## Testing with Stripe Test Cards

Use these test card numbers in test mode:

- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **Requires authentication**: 4000 0025 0000 3155

Any future expiry date and any 3-digit CVC will work.

## Production Deployment

Before deploying to production:

1. ✅ Switch to Firebase production security rules
2. ✅ Use Stripe live keys
3. ✅ Set up proper error handling and logging
4. ✅ Configure authorized domains in Firebase
5. ✅ Set up Stripe webhooks for payment confirmation
6. ✅ Implement proper user onboarding flow
7. ✅ Test all authentication and payment flows

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [React Router Documentation](https://reactrouter.com/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

## Support

For issues or questions, please contact:
- Email: support@photo2profit.app
- GitHub Issues: [Create an issue](https://github.com/baddiehustleai-star/jubilant-happiness/issues)
