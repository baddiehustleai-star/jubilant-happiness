# 🔥 FIREBASE SETUP INSTRUCTIONS FOR PHOTO2PROFIT

# Project ID: photo2profit-758851214311

# ===================================================================

# STEP 1: GET THESE VALUES FROM FIREBASE CONSOLE

# ===================================================================

# 1. Go to: https://console.firebase.google.com/

# 2. Select project: photo2profit-758851214311

# 3. Project Settings → General → Your apps

# 4. Copy the values and replace below:

# Replace these with your ACTUAL values from Firebase Console:

VITE_FIREBASE_API_KEY=AIzaSyC... # ← Replace with real API key
VITE_FIREBASE_AUTH_DOMAIN=photo2profit-758851214311.firebaseapp.com # ← Should be correct
VITE_FIREBASE_PROJECT_ID=photo2profit-758851214311 # ← Should be correct
VITE_FIREBASE_STORAGE_BUCKET=photo2profit-758851214311.appspot.com # ← Should be correct
VITE_FIREBASE_MESSAGING_SENDER_ID=758851214311 # ← Should be correct
VITE_FIREBASE_APP_ID=1:758851214311:web:... # ← Replace with real App ID

# ===================================================================

# STEP 2: ENABLE THESE SERVICES IN FIREBASE CONSOLE

# ===================================================================

# □ Authentication → Enable Email/Password + Google

# □ Firestore Database → Create database (test mode)

# □ Storage → Get started (test mode)

# ===================================================================

# OPTIONAL APIS (can add later)

# ===================================================================

# Google AI Studio (FREE) - get from: https://aistudio.google.com/

VITE_GEMINI_API_KEY=your_gemini_key

# Stripe (for payments)

VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key

# Remove.bg (for background removal)

VITE_REMOVEBG_API_KEY=your_removebg_key

# ===================================================================

# QUICK TEST

# ===================================================================

# After updating, restart your dev server:

# npm run dev

#

# Then test:

# 1. Go to http://localhost:5173/login

# 2. Try to sign up with email/password

# 3. Should work without errors!
