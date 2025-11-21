import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Loading from './components/Layout/Loading';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Gallery from './pages/Gallery';
import Pricing from './pages/Pricing';
import Account from './pages/Account';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <Loading />;

  return currentUser ? children : <Navigate to="/" />;
};

// Public Route (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <Loading />;

  return !currentUser ? children : <Navigate to="/dashboard" />;
};

function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blush via-white to-rose-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            }
          />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gallery"
            element={
              <ProtectedRoute>
                <Gallery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#FFF7F4',
            color: '#8B1538',
            border: '1px solid #F4A4BA',
          },
          success: {
            iconTheme: {
              primary: '#D4AF37',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#DC2626',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
