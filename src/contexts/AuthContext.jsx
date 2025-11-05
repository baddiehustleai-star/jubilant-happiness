// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if we're in demo mode
  const isDemoMode = import.meta.env.VITE_FIREBASE_API_KEY?.includes('Demo');

  useEffect(() => {
    if (isDemoMode) {
      console.log('🎭 Demo Mode - Auth will simulate user sessions');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        console.log('🔥 Auth state changed:', user ? 'Signed in' : 'Signed out');
        setUser(user);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('🔥 Auth error:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [isDemoMode]);

  // Demo mode functions
  const demoSignup = async (email, _password) => {
    console.log('🎭 Demo signup for:', email);
    const demoUser = {
      uid: 'demo-user-' + Date.now(),
      email,
      displayName: email.split('@')[0],
      photoURL: null,
    };
    setUser(demoUser);
    localStorage.setItem('demoUser', JSON.stringify(demoUser));
    return { user: demoUser };
  };

  const demoSignin = async (email, _password) => {
    console.log('🎭 Demo signin for:', email);
    const demoUser = {
      uid: 'demo-user-' + Date.now(),
      email,
      displayName: email.split('@')[0],
      photoURL: null,
    };
    setUser(demoUser);
    localStorage.setItem('demoUser', JSON.stringify(demoUser));
    return { user: demoUser };
  };

  const demoSignInWithGoogle = async () => {
    console.log('🎭 Demo Google signin');
    const demoUser = {
      uid: 'demo-google-user',
      email: 'demo@gmail.com',
      displayName: 'Demo User',
      photoURL: 'https://via.placeholder.com/150',
    };
    setUser(demoUser);
    localStorage.setItem('demoUser', JSON.stringify(demoUser));
    return { user: demoUser };
  };

  const demoLogout = async () => {
    console.log('🎭 Demo logout');
    setUser(null);
    localStorage.removeItem('demoUser');
  };

  // Real Firebase functions
  const signup = async (email, password) => {
    if (isDemoMode) return demoSignup(email, password);

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signin = async (email, password) => {
    if (isDemoMode) return demoSignin(email, password);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    if (isDemoMode) return demoSignInWithGoogle();

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    if (isDemoMode) return demoLogout();

    try {
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Initialize demo user if exists
  useEffect(() => {
    if (isDemoMode && !user) {
      const savedDemoUser = localStorage.getItem('demoUser');
      if (savedDemoUser) {
        setUser(JSON.parse(savedDemoUser));
      }
    }
  }, [isDemoMode, user]);

  const value = {
    user,
    loading,
    error,
    signup,
    signin,
    signInWithGoogle,
    logout,
    isDemoMode,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
