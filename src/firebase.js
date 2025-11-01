// Firebase configuration
// This file sets up Firebase for the Photo2Profit application
// Environment variables should be set in .env file

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Check if Firebase is configured
export const isFirebaseConfigured = () => {
  return Object.values(firebaseConfig).every((value) => value !== '');
};

// Initialize Firebase (placeholder - actual implementation would use Firebase SDK)
// To use Firebase, install: npm install firebase
// Then import { initializeApp } from 'firebase/app'
// const app = initializeApp(firebaseConfig);

export default firebaseConfig;
