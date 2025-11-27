/**
 * Authentication Context and Hooks
 *
 * Provides authentication state management and utilities throughout the app
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase.js';
import { analytics } from '../lib/monitoring.js';

const AuthContext = createContext({});

// Google Auth provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create or update user profile in Firestore
  const createUserProfile = async (user, additionalData = {}) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = new Date();

      try {
        await setDoc(userRef, {
          displayName,
          email,
          photoURL,
          createdAt,
          subscription: {
            plan: 'free',
            status: 'active',
            updatedAt: createdAt,
          },
          usage: {
            imagesProcessed: 0,
            backgroundsRemoved: 0,
            listingsCreated: 0,
            monthlyReset: new Date(createdAt.getFullYear(), createdAt.getMonth() + 1, 1),
          },
          preferences: {
            theme: 'rose-gold',
            emailNotifications: true,
            marketingEmails: false,
          },
          ...additionalData,
        });

        analytics.track('user_created', {
          userId: user.uid,
          email: user.email,
          provider: user.providerData[0]?.providerId || 'unknown',
        });
      } catch (error) {
        console.error('Error creating user profile:', error);
        setError(error.message);
      }
    }

    return userRef;
  };

  // Fetch user profile data
  const fetchUserProfile = async (user) => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserProfile({ id: userSnap.id, ...userSnap.data() });
      } else {
        // Create profile if it doesn't exist
        await createUserProfile(user);
        await fetchUserProfile(user); // Fetch the newly created profile
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(error.message);
    }
  };

  // Auth methods
  const signInWithEmail = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);

      analytics.track('user_sign_in', {
        userId: result.user.uid,
        method: 'email',
      });

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signUpWithEmail = async (email, password, displayName) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Update display name
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }

      // Create user profile
      await createUserProfile(result.user, { displayName });

      analytics.track('user_sign_up', {
        userId: result.user.uid,
        method: 'email',
      });

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);

      // Create user profile if needed
      await createUserProfile(result.user);

      analytics.track('user_sign_in', {
        userId: result.user.uid,
        method: 'google',
      });

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);

      if (user) {
        analytics.track('user_sign_out', {
          userId: user.uid,
        });
      }

      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);

      analytics.track('password_reset_requested', {
        email: email,
      });
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    userProfile,
    loading,
    error,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    logout,
    resetPassword,
    createUserProfile,
    fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
