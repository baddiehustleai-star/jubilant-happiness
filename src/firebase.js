// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ✅ Securely load Firebase credentials from .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if we're in demo mode
const isDemoMode =
  firebaseConfig.apiKey?.includes('Demo') || firebaseConfig.appId?.includes('demo');

console.log('🔥 Firebase Configuration Status:', {
  projectId: firebaseConfig.projectId,
  isDemoMode,
  hasApiKey: !!firebaseConfig.apiKey,
  hasAppId: !!firebaseConfig.appId,
});

if (isDemoMode) {
  console.log('⚠️ Running in DEMO MODE - Replace with real Firebase credentials');
  console.log(
    '📝 Get credentials from: https://console.firebase.google.com/project/' +
      firebaseConfig.projectId
  );
}

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ✅ Demo mode emulator setup (optional)
if (isDemoMode && window.location.hostname === 'localhost') {
  console.log('🔧 Demo mode detected - you can enable emulators if needed');
  // Uncomment these lines if you want to use Firebase emulators in demo mode:
  // connectAuthEmulator(auth, "http://localhost:9099");
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectStorageEmulator(storage, 'localhost', 9199);
}

// ✅ Optional default export for convenience
export default app;
