# 🔑 Getting Your Firebase API Keys for Photo2Profit

## Your Project Information
- **Project Name**: jubilant-happiness-11477832
- **Project Number**: 758851214311
- **Project Location**: us-central1

## 📋 Step-by-Step Guide to Get Your API Keys

### Step 1: Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Sign in with your Google account
3. You should see your project: **jubilant-happiness-11477832**
4. Click on the project to open it

### Step 2: Get Your Web App Configuration
1. In the Firebase Console, click the **⚙️ Settings icon** (gear icon) in the left sidebar
2. Select **Project Settings**
3. Scroll down to the **"Your apps"** section
4. If you see a web app already registered:
   - Click on the web app to expand it
   - You'll see the Firebase configuration object
5. If you DON'T see a web app:
   - Click **"Add app"** button
   - Select the **Web platform** icon (`</>`)
   - Enter app nickname: `Photo2Profit Web App`
   - Check "Also set up Firebase Hosting" if you want (optional)
   - Click **"Register app"**

### Step 3: Copy Your Configuration Values
You'll see a configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",  // ← Copy this value
  authDomain: "jubilant-happiness-11477832.firebaseapp.com",
  projectId: "jubilant-happiness-11477832",
  storageBucket: "jubilant-happiness-11477832.appspot.com",
  messagingSenderId: "758851214311",
  appId: "1:758851214311:web:..."  // ← Copy this value
};
```

### Step 4: Update Your .env File
1. Open the `.env` file in the root of your project
2. Replace the placeholder values:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyC...  # Paste your actual apiKey here
   VITE_FIREBASE_AUTH_DOMAIN=jubilant-happiness-11477832.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=jubilant-happiness-11477832
   VITE_FIREBASE_STORAGE_BUCKET=jubilant-happiness-11477832.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=758851214311
   VITE_FIREBASE_APP_ID=1:758851214311:web:...  # Paste your actual appId here
   ```

### Step 5: Enable Firebase Services

#### Enable Authentication
1. In Firebase Console, go to **Build** → **Authentication**
2. Click **Get Started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"
5. (Optional) Enable **Google Sign-In**:
   - Click on "Google"
   - Toggle "Enable" to ON
   - Enter your project support email
   - Click "Save"

#### Create Firestore Database
1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (recommended for development)
   - Test mode allows read/write access for 30 days
   - You can update security rules later
4. Select location: **us-central1** (or your preferred location)
5. Click **Enable**

#### Enable Storage
1. In Firebase Console, go to **Build** → **Storage**
2. Click **Get started**
3. Choose **Start in test mode** (recommended for development)
4. Use the same location as Firestore: **us-central1**
5. Click **Done**

### Step 6: Verify Setup
1. Make sure your `.env` file has the correct values
2. Restart your development server:
   ```bash
   npm run dev
   ```
3. Open your browser to [http://localhost:5173](http://localhost:5173)
4. Navigate to the Login page
5. Try to sign up with a test email and password
6. If everything is configured correctly, you should be able to create an account!

## 🔒 Security Notes

### API Key Security
- The Firebase API Key in your `.env` file is **safe to expose** in client-side code
- It's not a secret - it's used to identify your Firebase project
- Firebase security is enforced through **Security Rules** and **App Check**, not the API key

### Protecting Your Data
After testing in development, update your security rules:

#### Firestore Rules (Production)
Replace test mode rules with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /photos/{photoId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

#### Storage Rules (Production)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🆘 Troubleshooting

### "Firebase not configured" Error
- Double-check that all values in `.env` are correct
- Make sure there are no extra spaces or quotes around the values
- Restart your development server after changing `.env`

### "Permission Denied" Error
- Check that you're signed in (authentication works)
- Verify your Firestore/Storage rules allow the operation
- Check browser console for detailed error messages

### Can't Find Your Project
- Make sure you're signed in with the correct Google account
- The project owner may need to invite you as a collaborator
- Go to Project Settings → Users and permissions to check access

### Can't Find "Your apps" Section
- Make sure you're in Project Settings (gear icon → Project settings)
- Scroll down on the General tab
- The section is below the "Your project" information

## 📞 Need Help?
If you're stuck, check:
1. [Firebase Documentation](https://firebase.google.com/docs)
2. [Firebase Console](https://console.firebase.google.com/)
3. The project's `FIREBASE_SETUP.md` for usage examples

## ✅ Quick Checklist
- [ ] Access Firebase Console
- [ ] Select jubilant-happiness-11477832 project
- [ ] Get API Key and App ID from Project Settings
- [ ] Update .env file with actual values
- [ ] Enable Authentication (Email/Password)
- [ ] Create Firestore Database (test mode, us-central1)
- [ ] Enable Storage (test mode, us-central1)
- [ ] Restart dev server
- [ ] Test login/signup functionality
- [ ] Update security rules before production deployment
