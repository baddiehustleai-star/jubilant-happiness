import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProductsDashboard from './pages/ProductsDashboard.jsx';
import ProductEditor from './pages/ProductEditor.jsx';
import PublicProduct from './pages/PublicProduct.jsx';
import Upgrades from './pages/Upgrades.jsx';
import Listings from './pages/Listings.jsx';
import ListingAudit from './pages/ListingAudit.jsx';
import FirebaseTest from './pages/FirebaseTest.jsx';
import Orders from './pages/Orders.jsx';
import Success from './pages/Success.jsx';
import Cancel from './pages/Cancel.jsx';
import './index.css';
import './styles/branding.css';
import './styles/mobile.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-gradient">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading Photo2Profit...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-gradient">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading Photo2Profit...</p>
        </div>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
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
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Payment Result Pages */}
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />

          {/* Public Product Page (no auth required) */}
          <Route path="/p/:id" element={<PublicProduct />} />

          {/* Firebase Test Route (public for testing) */}
          <Route path="/firebase-test" element={<FirebaseTest />} />

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
            path="/products"
            element={
              <ProtectedRoute>
                <ProductsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upgrades"
            element={
              <ProtectedRoute>
                <Upgrades />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listings"
            element={
              <ProtectedRoute>
                <Listings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listings/:id/audit"
            element={
              <ProtectedRoute>
                <ListingAudit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'demo-client-id'}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
