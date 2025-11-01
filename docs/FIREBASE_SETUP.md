# Firebase Setup Guide for Photo2Profit

This guide walks you through setting up Firebase for the Photo2Profit application, including Authentication, Firestore, Storage, and Cloud Functions.

## Prerequisites

- Node.js 20+ installed
- Firebase CLI installed: `npm install -g firebase-tools`
- A Firebase project created at [console.firebase.google.com](https://console.firebase.google.com)

## Step 1: Firebase Project Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Add project"
   - Name it (e.g., "photo2profit-ai")
   - Enable Google Analytics (optional)

2. **Enable Firebase Services**
   
   Navigate to each section in the Firebase Console:

   - **Authentication** → Get Started → Enable providers:
     - Email/Password ✅
     - Google ✅
   
   - **Firestore Database** → Create Database → Start in production mode
   
   - **Storage** → Get Started → Start in production mode
   
   - **Functions** → Get Started (will be set up via CLI)

## Step 2: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to "Your apps" → Click web icon (`</>`)
3. Register your app (name: "Photo2Profit Web")
4. Copy the `firebaseConfig` object

## Step 3: Configure Environment Variables

1. **Frontend Configuration**
   
   Copy `.env.example` to `.env` in the project root:
   
   ```bash
   cp .env.example .env
   ```
   
   Fill in the Firebase values from your config.

2. **Functions Configuration**
   
   Copy `functions/.env.example` to `functions/.env`:
   
   ```bash
   cp functions/.env.example functions/.env
   ```

## Step 4: Deploy Firestore Security Rules

Deploy the security rules for Firestore and Storage:

```bash
firebase deploy --only firestore:rules,storage:rules
```

## Step 5: Set Up Firebase Functions

1. **Install Function Dependencies**
   
   ```bash
   cd functions
   npm install
   cd ..
   ```

2. **Build Functions**
   
   ```bash
   cd functions
   npm run build
   cd ..
   ```

3. **Deploy Functions**
   
   ```bash
   firebase deploy --only functions
   ```

For more details, see the complete documentation in this file.
