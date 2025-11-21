/**
 * Firebase Configuration and Initialization
 *
 * This module initializes Firebase services used throughout the application
 * including Authentication, Firestore, and Storage.
 */

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate required configuration
const requiredKeys = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];
const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  console.warn('Missing Firebase configuration keys:', missingKeys);
  console.warn(
    'Please check your environment variables. Firebase features may not work correctly.'
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics only in production
let analytics = null;
if (import.meta.env.PROD && firebaseConfig.appId) {
  try {
    analytics = getAnalytics(app);
  } catch {
    console.warn('Firebase Analytics initialization failed');
  }
}
export { analytics };

// Development emulator setup
if (import.meta.env.DEV) {
  try {
    // Connect to Auth emulator
    if (!auth._delegate._config.emulator) {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    }

    // Connect to Firestore emulator
    if (!db._delegate._databaseId.projectId.includes('demo-')) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }

    // Connect to Storage emulator
    if (!storage._delegate._bucket.includes('demo-')) {
      connectStorageEmulator(storage, 'localhost', 9199);
    }

    console.log('🔥 Firebase emulators connected for development');
  } catch {
    console.log('Firebase emulators not available, using production services');
  }
}

export default app;
