// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { db } from '../firebase.js';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';

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

  // Fetch user's premium status from Firestore
  async function fetchUserData(email) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        return {
          premium: userData.premium || false,
          premiumActivatedAt: userData.premiumActivatedAt,
          lastPurchase: userData.lastPurchase,
        };
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    return { premium: false };
  }

  // Set up real-time listener for premium status
  function setupPremiumListener(email) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));

      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          setUser((prev) => ({
            ...prev,
            premium: userData.premium || false,
            premiumActivatedAt: userData.premiumActivatedAt,
            lastPurchase: userData.lastPurchase,
          }));
          console.log('⭐ Premium status updated:', userData.premium);
        }
      });
    } catch (error) {
      console.error('Error setting up premium listener:', error);
      return () => {}; // Return empty cleanup function
    }
  }

  useEffect(() => {
    async function checkToken() {
      const token = localStorage.getItem('token');
      if (!token) {
        await tryRefresh();
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const exp = decoded.exp * 1000;
        const timeLeft = exp - Date.now();

        if (timeLeft < 5 * 60 * 1000) {
          // Less than 5 minutes left, refresh
          await tryRefresh();
        } else {
          // Fetch premium status from Firestore
          const userData = await fetchUserData(decoded.email);
          setUser({ ...decoded, ...userData });
        }
      } catch (error) {
        console.error('Invalid token:', error);
        await tryRefresh();
      }

      setLoading(false);
    }

    async function tryRefresh() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/refresh`,
          {
            method: 'POST',
            credentials: 'include', // Send the httpOnly cookie
          }
        );

        if (res.ok) {
          const { token } = await res.json();
          localStorage.setItem('token', token);
          const decoded = jwtDecode(token);

          // Fetch premium status from Firestore
          const userData = await fetchUserData(decoded.email);
          setUser({ ...decoded, ...userData });
        } else {
          // Refresh failed, clear everything
          logout();
        }
      } catch (error) {
        console.error('Refresh failed:', error);
        logout();
      }
    }

    checkToken();

    // Set up interval to check token every 5 minutes
    const interval = setInterval(checkToken, 5 * 60 * 1000);

    // Set up real-time premium status listener
    let unsubscribe = () => {};
    if (user?.email) {
      unsubscribe = setupPremiumListener(user.email);
    }

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [user?.email]);

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  }

  // Sign up with email (simple JWT login)
  const signup = async (email, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      credentials: 'include',
    });
    const { token } = await res.json();
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);

    // Fetch premium status from Firestore
    const userData = await fetchUserData(decoded.email);
    setUser({ ...decoded, ...userData });

    return { user: { ...decoded, ...userData } };
  };

  // Sign in with email (simple JWT login)
  const signin = async (email, password) => {
    return signup(email, password); // Same implementation
  };

  // Sign in with Google (redirect to OAuth)
  const signInWithGoogle = async () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/auth/google`;
  };

  const value = {
    user,
    loading,
    signup,
    signin,
    signInWithGoogle,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
