// src/utils/firebaseTest.js
/**
 * Firebase Connection Test for Photo2Profit
 * Run this to verify your Firebase setup is working correctly
 */

import { auth, db, storage } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Test Firebase Authentication
export const testAuth = async () => {
  console.log('🔥 Testing Firebase Authentication...');
  
  try {
    // Test email/password auth
    const testEmail = `test-${Date.now()}@photo2profit.com`;
    const testPassword = 'testpassword123';
    
    console.log('📧 Creating test user...');
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('✅ User created:', userCredential.user.uid);
    
    console.log('🔐 Signing out...');
    await signOut(auth);
    console.log('✅ Signed out successfully');
    
    console.log('🔑 Signing back in...');
    const signInResult = await signInWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('✅ Signed in:', signInResult.user.uid);
    
    return { success: true, userId: signInResult.user.uid };
  } catch (error) {
    console.error('❌ Auth test failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Test Firestore Database
export const testFirestore = async (userId) => {
  console.log('🔥 Testing Firestore Database...');
  
  try {
    const testData = {
      name: 'Test User',
      email: auth.currentUser?.email,
      createdAt: new Date(),
      testField: 'Firebase is working!'
    };
    
    console.log('📝 Writing test document...');
    await setDoc(doc(db, 'users', userId), testData);
    console.log('✅ Document written successfully');
    
    console.log('📖 Reading test document...');
    const docSnap = await getDoc(doc(db, 'users', userId));
    
    if (docSnap.exists()) {
      console.log('✅ Document read successfully:', docSnap.data());
      return { success: true, data: docSnap.data() };
    } else {
      console.log('❌ Document not found');
      return { success: false, error: 'Document not found' };
    }
  } catch (error) {
    console.error('❌ Firestore test failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Test Firebase Storage
export const testStorage = async (userId) => {
  console.log('🔥 Testing Firebase Storage...');
  
  try {
    // Create a test file (1x1 pixel image)
    const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    const response = await fetch(testImageData);
    const blob = await response.blob();
    
    console.log('📁 Uploading test file...');
    const storageRef = ref(storage, `test/${userId}/test-image.png`);
    const snapshot = await uploadBytes(storageRef, blob);
    console.log('✅ File uploaded successfully');
    
    console.log('🔗 Getting download URL...');
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('✅ Download URL obtained:', downloadURL);
    
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error('❌ Storage test failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Run all tests
export const runAllFirebaseTests = async () => {
  console.log('🚀 Starting Firebase Connection Tests...\n');
  
  const results = {
    auth: null,
    firestore: null,
    storage: null,
    overall: false
  };
  
  try {
    // Test Authentication
    results.auth = await testAuth();
    if (!results.auth.success) {
      throw new Error('Authentication test failed');
    }
    
    // Test Firestore
    results.firestore = await testFirestore(results.auth.userId);
    if (!results.firestore.success) {
      console.log('⚠️ Firestore test failed, but continuing...');
    }
    
    // Test Storage
    results.storage = await testStorage(results.auth.userId);
    if (!results.storage.success) {
      console.log('⚠️ Storage test failed, but continuing...');
    }
    
    // Clean up - sign out
    await signOut(auth);
    console.log('🧹 Cleaned up test user');
    
    results.overall = results.auth.success;
    
    console.log('\n🎉 Firebase Tests Complete!');
    console.log('Results:', {
      '🔐 Authentication': results.auth.success ? '✅ PASS' : '❌ FAIL',
      '📄 Firestore': results.firestore.success ? '✅ PASS' : '❌ FAIL',
      '📁 Storage': results.storage.success ? '✅ PASS' : '❌ FAIL'
    });
    
  } catch (error) {
    console.error('❌ Overall test failed:', error.message);
    results.overall = false;
  }
  
  return results;
};

// Quick connection test (just checks if Firebase is configured)
export const quickConnectionTest = () => {
  console.log('⚡ Quick Firebase Configuration Check...');
  
  const checks = {
    auth: !!auth,
    db: !!db,
    storage: !!storage,
    config: !!(auth.app.options.apiKey && auth.app.options.projectId)
  };
  
  console.log('Configuration Status:', {
    '🔐 Auth Service': checks.auth ? '✅' : '❌',
    '📄 Firestore': checks.db ? '✅' : '❌',
    '📁 Storage': checks.storage ? '✅' : '❌',
    '⚙️ Config': checks.config ? '✅' : '❌'
  });
  
  if (checks.auth && checks.db && checks.storage && checks.config) {
    console.log('🎉 Firebase is properly configured!');
    return true;
  } else {
    console.log('❌ Firebase configuration incomplete. Check your .env file.');
    return false;
  }
};

// Export for use in components
export default {
  testAuth,
  testFirestore,
  testStorage,
  runAllFirebaseTests,
  quickConnectionTest
};