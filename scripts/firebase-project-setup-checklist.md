# Firebase Project Setup Checklist - photo2profit-prod

## Prerequisites

- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Logged into Firebase CLI (`firebase login`)
- [ ] Flutter CLI installed (if using Flutter)

## Firebase Console Setup

### 1. Create Firebase Project

- [ ] Go to [Firebase Console](https://console.firebase.google.com)
- [ ] Click "Create a project"
- [ ] Project name: `photo2profit-prod`
- [ ] Click "Continue"
- [ ] Enable Google Analytics: **YES** (default account is fine)
- [ ] Click "Create project"
- [ ] Wait for project initialization to complete

### 2. Authentication Setup

- [ ] Click "Authentication" in left sidebar
- [ ] Click "Get started"
- [ ] Go to "Sign-in method" tab
- [ ] Enable Email/Password sign-in:
  - [ ] Click "Email/Password"
  - [ ] Toggle "Enable" ON
  - [ ] Click "Save"
- [ ] Enable Google Sign-In:
  - [ ] Click "Google"
  - [ ] Toggle "Enable" ON
  - [ ] Enter project support email
  - [ ] Click "Save"
- [ ] Enable Anonymous auth:
  - [ ] Click "Anonymous"
  - [ ] Toggle "Enable" ON
  - [ ] Click "Save"

### 3. Firestore Setup

- [ ] Click "Firestore Database" in left sidebar
- [ ] Click "Create database"
- [ ] Select "Start in production mode"
- [ ] Click "Next"
- [ ] Choose location: `us-central1`
- [ ] Click "Enable"
- [ ] Wait for database creation

### 4. Storage Setup

- [ ] Click "Storage" in left sidebar
- [ ] Click "Get started"
- [ ] Select "Start in production mode"
- [ ] Click "Next"
- [ ] Location: Should auto-select `us-central1` (same as Firestore)
- [ ] Click "Done"

### 5. Web App Setup

- [ ] Click the gear icon ⚙️ next to "Project Overview"
- [ ] Click "Project settings"
- [ ] Scroll down to "Your apps" section
- [ ] Click the "</>" (Web) icon
- [ ] App nickname: `photo2profit-web`
- [ ] Check "Also set up Firebase Hosting" ✅
- [ ] Click "Register app"
- [ ] Copy the Firebase config object (save for later)
- [ ] Click "Continue to console"

## Local Project Setup

### 6. Initialize Firebase in Project

- [ ] Run `firebase init` in project root
- [ ] Select features:
  - [ ] Firestore: Configure security rules and indexes files
  - [ ] Hosting: Configure files for Firebase Hosting
  - [ ] Storage: Configure security rules file
- [ ] Select existing project: `photo2profit-prod`
- [ ] Configure Firestore rules file: `firestore.rules`
- [ ] Configure Firestore indexes file: `firestore.indexes.json`
- [ ] Configure Hosting public directory: `dist`
- [ ] Configure as single-page app: **Yes**
- [ ] Configure GitHub deploys: **No** (for now)
- [ ] Configure Storage rules file: `storage.rules`

### 7. Deploy Firebase Configuration

- [ ] Run `firebase deploy --only firestore:rules`
- [ ] Run `firebase deploy --only storage:rules`
- [ ] Run `firebase deploy --only hosting` (if ready)

## Verification Steps

- [ ] Test authentication in Firebase Console > Authentication > Users
- [ ] Test Firestore read/write in Console > Firestore Database
- [ ] Test Storage upload in Console > Storage
- [ ] Verify hosting deployment at your-project.web.app

## Optional: Setup Emulators

- [ ] Run `firebase init emulators`
- [ ] Select emulators: Authentication, Firestore, Storage, Hosting
- [ ] Accept default ports
- [ ] Run `firebase emulators:start` to test locally

## Configuration Files Generated

- [ ] `firebase.json` - Firebase project configuration
- [ ] `.firebaserc` - Project aliases
- [ ] `firestore.rules` - Firestore security rules
- [ ] `storage.rules` - Storage security rules
- [ ] `firebaseConfig.js` - Web SDK configuration
- [ ] `firebase_options.dart` - Flutter SDK configuration (if using Flutter)
